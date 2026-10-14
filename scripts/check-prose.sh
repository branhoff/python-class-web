#!/usr/bin/env bash
# Enforce the writing-style rule from CLAUDE.md: no AI-tell punctuation in
# authored prose or source. Scans for em dashes, en dashes, and curly quotes.
# ASCII-only on purpose so this script does not match itself.
set -euo pipefail

# U+2014 em dash, U+2013 en dash, U+2018/2019 curly single, U+201C/201D curly double
bad=$'\xe2\x80\x94|\xe2\x80\x93|\xe2\x80\x98|\xe2\x80\x99|\xe2\x80\x9c|\xe2\x80\x9d'

hits="$(LC_ALL=C grep -rnoE "$bad" \
  --include='*.md' --include='*.ts' --include='*.js' --include='*.mjs' --include='*.py' \
  content src test scripts docs/LESSON_FORMAT.md 2>/dev/null \
  | grep -vE 'src/client/fonts/' || true)"

if [ -n "$hits" ]; then
  echo "AI-tell punctuation found. Use plain ASCII (see CLAUDE.md writing style):" >&2
  echo "$hits" >&2
  exit 1
fi
echo "prose style clean: no em/en dashes or curly quotes."
