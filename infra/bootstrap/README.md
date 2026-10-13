# Bootstrap (run once, by hand)

Creates what the live [`../`](../) root and the GitHub Actions pipeline depend on:
the remote-state bucket, Artifact Registry (with image cleanup), the CI deployer
service account, Workload Identity Federation scoped to this repo, and a monthly
billing budget. It uses **local state** and **your own** credentials because it
must exist before any remote backend or CI identity does.

> **Shortcut:** `make gcp-setup ARGS="--project ID --billing-account ACCT"` runs
> steps 2-4 below (add `--dry-run` first to see every command; `--help` for
> options). The manual steps are kept here so you can see what it does.

## 1. Prerequisites

```sh
brew install opentofu
brew install --cask gcloud-cli
gcloud auth login
gcloud billing accounts list     # note the ACCOUNT_ID
```

`make doctor` reports whether `tofu` and `gcloud` are installed.

## 2. Manual pre-steps (need billing/org admin)

```sh
gcloud projects create PROJECT_ID
gcloud billing projects link PROJECT_ID --billing-account=XXXXXX-XXXXXX-XXXXXX
gcloud auth application-default login
gcloud services enable serviceusage.googleapis.com cloudresourcemanager.googleapis.com \
  --project PROJECT_ID
```

## 3. Apply

```sh
cd infra/bootstrap
cp terraform.tfvars.example terraform.tfvars   # edit the values
tofu init
tofu apply
tofu output
```

`state_bucket_name` must be globally unique. Keep `terraform.tfstate` (it is
git-ignored) somewhere safe.

## 4. Configure GitHub

Repo **variables** (Settings > Secrets and variables > Actions > Variables):

| variable          | from                            |
| ----------------- | ------------------------------- |
| `GCP_PROJECT_ID`  | your project id                 |
| `GCP_REGION`      | the region (default `us-west1`) |
| `TF_STATE_BUCKET` | output `state_bucket`           |
| `AR_REPO`         | output `artifact_registry`      |
| `DEPLOY_SA_EMAIL` | output `deployer_sa_email`      |
| `WIF_PROVIDER`    | output `wif_provider`           |

There are no repo **secrets** yet: the app has none.

Also create a **`production`** environment (Settings > Environments) to gate
`tofu apply`; a required reviewer needs a paid plan on private repos.

In branch protection for `main`, require the checks **`CI / verify`**,
**`CI / mutation`** and **`CI / integration`**, and code-owner review.

## Provider lock file

`.terraform.lock.hcl` is committed so CI and laptops use the same provider
version. If you change providers, refresh it for both platforms:

```sh
tofu providers lock -platform=linux_amd64 -platform=darwin_arm64
```
