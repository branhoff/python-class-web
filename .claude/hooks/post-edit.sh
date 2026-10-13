#!/usr/bin/env bash
# PostToolUse hook: after Claude edits a file, run habit-hooks' structural
# checks over the project. On findings, print them to stderr and exit 2 so the
# output is fed back to Claude to fix before moving on.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}"

output=$(habit-hooks 2>&1)
status=$?
if [ "$status" -ne 0 ]; then
  echo "$output" >&2
  exit 2
fi
