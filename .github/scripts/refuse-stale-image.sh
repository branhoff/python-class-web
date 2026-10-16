#!/usr/bin/env bash
# A saved plan carries the Cloud Run image that was live when it was planned, and
# applying it writes that image back. If a deploy has landed since, the apply
# would put an older build live. Refuse, so a fresh plan is made from the current
# state. Plans that do not update the service write no image and always pass.
# Needs PROJECT, REGION and SERVICE, and a tfplan in infra/.
set -euo pipefail

plan_json=$(cd infra && tofu show -json tfplan)
updates=$(jq -r '[.resource_changes[] | select(.address == "google_cloud_run_v2_service.app" and (.change.actions | index("update")))] | length' <<<"$plan_json")

if [ "$updates" = "0" ]; then
  echo "The plan does not update the Cloud Run service, so it writes no image."
  exit 0
fi

planned=$(jq -r '[.resource_changes[] | select(.address == "google_cloud_run_v2_service.app")] | first | .change.after.template[0].containers[0].image // empty' <<<"$plan_json")
if [ -z "$planned" ]; then
  echo "::error::The plan updates the Cloud Run service but the image could not be read from it."
  exit 1
fi

live=$(gcloud run services describe "$SERVICE" --region "$REGION" --project "$PROJECT" \
  --format='value(spec.template.spec.containers[0].image)')

if [ "$planned" != "$live" ]; then
  echo "::error::Not applying: this plan would write image $planned, but $live is live. A deploy landed after the plan was made. Run the infra workflow again for a fresh plan."
  exit 1
fi
echo "The plan keeps the live image: $live"
