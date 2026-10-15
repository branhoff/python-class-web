#!/usr/bin/env bash
# Mutation-test every lesson solution cell: a tool injects bugs into the solution
# and the cell's tests must catch every one. Optional args: slugs.
#   mutmut      for solutions made of functions and classes
#   cosmic-ray  for plain scripts (mutmut only mutates code inside functions)
source "$(dirname "$0")/solutions-env.sh"

failed=0
for slug in $SOLUTIONS; do
  cd "$WORK/$slug"
  engine="$(cat engine.txt)"
  if [ "$engine" = "mutmut" ]; then
    "$PY" -m mutmut run >mutation.log 2>&1 || true
    # A mutant that makes the code loop forever is caught: the test run hangs and
    # mutmut times it out. Any other leftover status (survived, no tests, ...) fails.
    survivors="$("$PY" -m mutmut results 2>/dev/null | grep -v ': timeout$' || true)"
  else
    bin="$VENV/bin"
    export PATH="$bin:$PATH"
    rm -f session.sqlite
    "$bin/cosmic-ray" init cr.toml session.sqlite >mutation.log 2>&1
    "$bin/cr-filter-pragma" session.sqlite >>mutation.log 2>&1
    "$bin/cosmic-ray" baseline cr.toml >>mutation.log 2>&1 || { echo "FAIL $slug: tests fail before mutation" >&2; failed=1; continue; }
    "$bin/cosmic-ray" exec cr.toml session.sqlite >>mutation.log 2>&1
    survivors="$("$bin/cr-report" session.sqlite --surviving-only 2>/dev/null | grep -B1 -A6 'core/' || true)"
  fi
  if [ -n "$survivors" ]; then
    echo "FAIL $slug: mutants survived (the tests missed these bugs):" >&2
    echo "$survivors" >&2
    failed=1
  else
    echo "ok   $slug (every mutant killed)"
  fi
done
exit "$failed"
