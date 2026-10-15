#!/usr/bin/env bash
# Check every lesson solution cell: the cell runs and its tests pass, and the
# tests cover 100% of the solution's lines and branches. Optional args: slugs.
source "$(dirname "$0")/solutions-env.sh"

failed=0
for slug in $SOLUTIONS; do
  dir="$WORK/$slug"
  cd "$dir"
  if ! "$PY" "$ROOT/scripts/audit_solution.py" solution.py "$(cat lesson.txt)" >audit.log 2>&1; then
    echo "FAIL $slug: the solution uses features the course has not taught yet:" >&2
    cat audit.log >&2
    failed=1
    continue
  fi
  if ! "$PY" cell.py | tail -n 3 | grep -qx 'OK'; then
    echo "FAIL $slug: the lesson cell does not end with OK" >&2
    "$PY" cell.py | tail -n 15 >&2
    failed=1
    continue
  fi
  if ! "$PY" -m coverage run --branch --include=solution.py -m pytest -q -p no:cacheprovider test_solution.py >pytest.log 2>&1; then
    echo "FAIL $slug: pytest failed" >&2
    cat pytest.log >&2
    failed=1
    continue
  fi
  if ! "$PY" -m coverage report --show-missing --fail-under=100 >coverage.log 2>&1; then
    echo "FAIL $slug: coverage is below 100%" >&2
    cat coverage.log >&2
    failed=1
    continue
  fi
  echo "ok   $slug (100% line and branch coverage)"
done
exit "$failed"
