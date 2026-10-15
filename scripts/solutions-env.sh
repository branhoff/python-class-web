# Sourced by check-solutions.sh and mutate-solutions.sh. Builds a throwaway
# virtualenv for the Python tooling (kept out of the Node dependency surface),
# extracts the solution cells, and sets SOLUTIONS (the slugs to process).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$ROOT/build/solutions"
VENV="$ROOT/build/solutions-venv"
PY="$VENV/bin/python"

if [ ! -x "$PY" ] || ! "$PY" -c 'import coverage, cosmic_ray, mutmut, pytest' 2>/dev/null; then
  python3 -m venv "$VENV"
  "$PY" -m pip install --quiet --disable-pip-version-check -r "$ROOT/scripts/solutions-requirements.txt"
fi

(cd "$ROOT" && node scripts/extract-solutions.ts "$WORK" "$@")
if [ "$#" -gt 0 ]; then SOLUTIONS="$*"; else SOLUTIONS="$(cd "$WORK" && ls)"; fi

"$PY" -m unittest discover -s "$ROOT/scripts" -p "audit_solution_test.py" >/dev/null 2>&1 || {
  echo "audit_solution.py self-test failed" >&2
  (cd "$ROOT/scripts" && "$PY" -m unittest audit_solution_test) >&2
  exit 1
}
