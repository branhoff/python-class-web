#!/usr/bin/env bash
# Rewrite package-lock.json `resolved` URLs from Apple-internal registries to
# public npm. The lockfile is regenerated on Apple's network, so its tarball
# URLs point at hosts public GitHub runners can't reach. Both Apple hosts mirror
# npm with the same path layout, so only the host prefix changes; `integrity`
# hashes are content-based and stay valid. Idempotent: a no-op on a public lock.
set -euo pipefail

LOCK="package-lock.json"

sed -i \
  -e 's#https://artifacts\.apple\.com/artifactory/api/npm/npm-apple/#https://registry.npmjs.org/#g' \
  -e 's#https://npm\.apple\.com/#https://registry.npmjs.org/#g' \
  "$LOCK"

if grep -q 'apple\.com' "$LOCK"; then
  echo "ERROR: unexpected apple.com reference remains in $LOCK:" >&2
  grep -nE 'apple\.com' "$LOCK" | head >&2
  exit 1
fi

echo "Repointed $LOCK to https://registry.npmjs.org"
