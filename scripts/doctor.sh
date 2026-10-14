#!/usr/bin/env bash
# Checks the tools this project needs and says how to install what is missing.
# Exit status is non-zero only when a REQUIRED tool is missing or too old.
set -uo pipefail

missing=0
have() { command -v "$1" >/dev/null 2>&1; }
ok() { printf '  ok       %s\n' "$1"; }
bad() { printf '  MISSING  %s\n           -> %s\n' "$1" "$2"; missing=1; }
opt() { printf '  optional %s\n           -> %s\n' "$1" "$2"; }

echo "Required:"
if have node && node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=18)?0:1)'; then
  ok "node $(node -v) (>= 22.18)"
else
  bad "node >= 22.18" "https://nodejs.org or: brew install node / nvm install 26"
fi
have npm && ok "npm $(npm -v)" || bad "npm" "ships with node"
have python3 && ok "python3 ($(python3 -V 2>&1 | cut -d" " -f2))" || bad "python3" "needed to check lesson solutions: brew install python"
have make && ok "make" || bad "make" "xcode-select --install (macOS) / apt install build-essential"
have git && ok "git" || bad "git" "https://git-scm.com"
have gitleaks && ok "gitleaks" || bad "gitleaks" "brew install gitleaks (or https://github.com/gitleaks/gitleaks)"
if ! have habit-hooks; then
  bad "habit-hooks" "uv tool install 'habit-hooks[typescript]'  (uv: brew install uv)"
elif habit-hooks 2>&1 | grep -q "is not installed"; then
  bad "habit-hooks typescript plugin" "uv tool install --force 'habit-hooks[typescript]'"
else
  ok "habit-hooks (typescript plugin)"
fi

echo "Firestore emulator (needed for 'make test-integration' only):"
if have docker || have container; then
  ok "container runtime ($(have container && echo 'container' || echo 'docker')) - 'make firestore-emulator' uses it, no Java needed"
elif have java && java -version 2>&1 | head -1 | grep -Eq '"(2[1-9]|[3-9][0-9])\.'; then
  ok "Java 21+ with gcloud emulator ('gcloud components install cloud-firestore-emulator')"
else
  opt "a container runtime or Java 21+" "install Docker Desktop, or Apple 'container', or Java 21+ plus the gcloud emulator component"
fi

echo "Deploying (not needed for local development):"
have tofu && ok "tofu" || opt "tofu" "brew install opentofu"
have gcloud && ok "gcloud" || opt "gcloud" "brew install --cask google-cloud-sdk"

if [ "$missing" -ne 0 ]; then
  echo; echo "Install the MISSING tools above, then re-run: make doctor"
  exit 1
fi
echo; echo "All required tools present."
