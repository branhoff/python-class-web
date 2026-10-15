#!/usr/bin/env bash
# Run first in the apply job, after approval. A saved plan is a snapshot, so
# applying it after a newer run exists would write older settings. If a newer
# run on main has not been cancelled, refuse; that newer run plans from the
# current state and carries the change forward. Run ids only go up, so a higher
# id is a newer run. Pull request runs are on other branches and never match.
set -euo pipefail

newer=$(gh run list --repo "$GITHUB_REPOSITORY" --workflow infra.yml --branch main --limit 30 \
  --json databaseId,event,conclusion \
  -q "[.[] | select(.databaseId > ${GITHUB_RUN_ID} and .event != \"pull_request\" and .conclusion != \"cancelled\")] | map(.databaseId) | max // empty")

if [ -n "$newer" ]; then
  echo "::error::Not applying: infra run $newer on main is newer than this plan. Approve that run instead; it plans from the current state."
  exit 1
fi
echo "No newer infra run on main; applying this plan."
