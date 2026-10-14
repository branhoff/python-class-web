#!/usr/bin/env bash
# Fetch the pinned Pyodide "core" runtime, verify its checksum, and extract it to
# vendor/pyodide so the app can self-host in-browser Python (DEPLOY.md: no
# third-party host in the runtime path; AGENTS.md rule 7: pinned + verified).
set -euo pipefail

VERSION="314.0.7"
# sha256 of pyodide-core-${VERSION}.tar.bz2 from the GitHub release. Pinned so a
# tampered or truncated download fails loudly instead of shipping silently.
EXPECTED_SHA256="2abdcc2e35208af406e07724cffa85bc582ced97e9028383ecf5462541393f95"

dest="${1:-vendor/pyodide}"
url="https://github.com/pyodide/pyodide/releases/download/${VERSION}/pyodide-core-${VERSION}.tar.bz2"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
archive="$tmp/pyodide-core.tar.bz2"

echo "Fetching Pyodide ${VERSION} ..."
curl -fsSL -o "$archive" "$url"

if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "$archive" | cut -d' ' -f1)"
else
  actual="$(shasum -a 256 "$archive" | cut -d' ' -f1)"
fi

if [ "$EXPECTED_SHA256" = "PIN_AFTER_FIRST_FETCH" ]; then
  echo "ERROR: EXPECTED_SHA256 is unset. Pin this value in scripts/fetch-pyodide.sh:" >&2
  echo "  $actual" >&2
  exit 1
fi
if [ "$actual" != "$EXPECTED_SHA256" ]; then
  echo "ERROR: checksum mismatch for $url" >&2
  echo "  expected $EXPECTED_SHA256" >&2
  echo "  actual   $actual" >&2
  exit 1
fi

rm -rf "$dest"
mkdir -p "$dest"
tar -xjf "$archive" -C "$tmp"
mv "$tmp/pyodide/"* "$dest/"
echo "Pyodide ${VERSION} ready in ${dest}/"
