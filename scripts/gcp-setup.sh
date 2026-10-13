#!/usr/bin/env bash
# One-time GCP setup: create the project, link billing, enable the seed APIs,
# run infra/bootstrap, and set the GitHub repo variables the workflows read.
# Safe to re-run: each step checks current state first. Use --dry-run to see
# every command without running anything.
set -euo pipefail

usage() {
  cat <<USAGE
Usage: scripts/gcp-setup.sh --project ID --billing-account ACCOUNT [options]

Required:
  --project ID             GCP project id (globally unique; created if missing)
  --billing-account ID     Billing account (gcloud billing accounts list)
Options:
  --region R               Region (default us-west1)
  --github-repo OWNER/NAME Repo allowed to deploy (default: current gh repo, else branhoff/python-class-web)
  --state-bucket NAME      State bucket (default <project>-tfstate)
  --organization ID        Create the project under this organization
  --folder ID              Create the project under this folder
  --yes                    Do not prompt before creating billable resources
  --dry-run                Print every command; run nothing
USAGE
}

PROJECT_ID="" BILLING="" REGION="us-west1" REPO="" BUCKET="" PARENT=() YES=0 DRY_RUN=0
while [ $# -gt 0 ]; do
  case "$1" in
    --project) PROJECT_ID="${2:?}"; shift 2 ;;
    --billing-account) BILLING="${2:?}"; shift 2 ;;
    --region) REGION="${2:?}"; shift 2 ;;
    --github-repo) REPO="${2:?}"; shift 2 ;;
    --state-bucket) BUCKET="${2:?}"; shift 2 ;;
    --organization) PARENT=(--organization="${2:?}"); shift 2 ;;
    --folder) PARENT=(--folder="${2:?}"); shift 2 ;;
    --yes) YES=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h | --help) usage; exit 0 ;;
    *) echo "unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done
[ -n "$PROJECT_ID" ] && [ -n "$BILLING" ] || { usage >&2; exit 2; }
BUCKET="${BUCKET:-${PROJECT_ID}-tfstate}"

step() { printf '\n==> %s\n' "$*"; }
run() {
  printf '    $ %s\n' "$*"
  [ "$DRY_RUN" -eq 1 ] || "$@"
}
need() { command -v "$1" >/dev/null 2>&1 || { echo "missing required tool: $1 (run: make doctor)" >&2; exit 1; }; }

need gcloud
need tofu
if [ -z "$REPO" ] && command -v gh >/dev/null 2>&1; then
  REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
fi
REPO="${REPO:-branhoff/python-class-web}"

cat <<PLAN
Project:         $PROJECT_ID  ${PARENT[*]:-}
Billing account: $BILLING
Region:          $REGION
State bucket:    $BUCKET
GitHub repo:     $REPO
PLAN

if [ "$DRY_RUN" -eq 0 ]; then
  gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q . \
    || { echo "not logged in: run 'gcloud auth login' first" >&2; exit 1; }
  gcloud auth application-default print-access-token >/dev/null 2>&1 \
    || { echo "no application-default credentials: run 'gcloud auth application-default login'" >&2; exit 1; }
  if [ "$YES" -eq 0 ]; then
    read -r -p "Create billable GCP resources with the settings above? [y/N] " answer
    [ "$answer" = "y" ] || [ "$answer" = "Y" ] || { echo "aborted"; exit 1; }
  fi
fi

step "Project"
if [ "$DRY_RUN" -eq 0 ] && gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  echo "    exists: $PROJECT_ID"
else
  run gcloud projects create "$PROJECT_ID" ${PARENT[@]+"${PARENT[@]}"}
fi

step "Billing"
linked=""
[ "$DRY_RUN" -eq 1 ] || linked="$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingAccountName)' 2>/dev/null || true)"
if [ "$linked" = "billingAccounts/$BILLING" ]; then
  echo "    already linked to $BILLING"
else
  run gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING"
fi

step "Seed APIs"
run gcloud services enable serviceusage.googleapis.com cloudresourcemanager.googleapis.com \
  --project "$PROJECT_ID"

step "Bootstrap variables"
TFVARS="infra/bootstrap/terraform.tfvars"
if [ -f "$TFVARS" ]; then
  echo "    keeping existing $TFVARS"
else
  printf '    writing %s\n' "$TFVARS"
  if [ "$DRY_RUN" -eq 0 ]; then
    cat >"$TFVARS" <<TFVARS_EOF
project_id        = "$PROJECT_ID"
region            = "$REGION"
state_bucket_name = "$BUCKET"
billing_account   = "$BILLING"
github_repo       = "$REPO"
TFVARS_EOF
  fi
fi

step "Bootstrap (OpenTofu)"
run tofu -chdir=infra/bootstrap init
if [ "$YES" -eq 1 ]; then
  run tofu -chdir=infra/bootstrap apply -auto-approve
else
  run tofu -chdir=infra/bootstrap apply
fi

step "GitHub repo variables"
declare -a VARS=(
  "GCP_PROJECT_ID=$PROJECT_ID"
  "GCP_REGION=$REGION"
)
out() { tofu -chdir=infra/bootstrap output -raw "$1"; }
if [ "$DRY_RUN" -eq 0 ]; then
  VARS+=("TF_STATE_BUCKET=$(out state_bucket)" "AR_REPO=$(out artifact_registry)" \
    "DEPLOY_SA_EMAIL=$(out deployer_sa_email)" "WIF_PROVIDER=$(out wif_provider)")
else
  VARS+=("TF_STATE_BUCKET=<output state_bucket>" "AR_REPO=<output artifact_registry>" \
    "DEPLOY_SA_EMAIL=<output deployer_sa_email>" "WIF_PROVIDER=<output wif_provider>")
fi

if [ "$DRY_RUN" -eq 0 ] && { ! command -v gh >/dev/null 2>&1 || ! gh repo view "$REPO" >/dev/null 2>&1; }; then
  echo "    gh unavailable or repo '$REPO' not found; set these yourself (Settings > Variables):"
  printf '      %s\n' "${VARS[@]}"
else
  for kv in "${VARS[@]}"; do
    run gh variable set "${kv%%=*}" --repo "$REPO" --body "${kv#*=}"
  done
fi

cat <<NEXT

Done. Still manual (GitHub settings):
  - create a 'production' environment (gates tofu apply)
  - branch protection on main: require CI / verify, CI / mutation, CI / integration
Then open a PR touching infra/ to see the plan, and merge to apply and deploy.
NEXT
