#!/usr/bin/env bash
# After an infra apply, put the latest main back live. A saved plan carries the
# Cloud Run image from the moment it was planned, so applying it can leave an
# older image running. Only a main whose CI passed is redeployed.
set -euo pipefail

head=$(gh api "repos/${GITHUB_REPOSITORY}/commits/main" -q .sha)
ci=$(gh run list --repo "$GITHUB_REPOSITORY" --workflow ci.yml --commit "$head" --limit 1 \
  --json status,conclusion -q '.[] | "\(.status) \(.conclusion)"')

case "$ci" in
  "completed success")
    gh workflow run deploy.yml --repo "$GITHUB_REPOSITORY" --ref main
    echo "Dispatched a deploy of $head."
    ;;
  "")
    echo "::notice::No CI run found for $head, so not redeploying."
    ;;
  "completed "*)
    echo "::warning::CI did not pass on $head ($ci). Production may be running an older image than main. Fix main, or run the deploy workflow by hand."
    ;;
  *)
    echo "::notice::CI is still running on $head. The deploy that follows it puts it live."
    ;;
esac
