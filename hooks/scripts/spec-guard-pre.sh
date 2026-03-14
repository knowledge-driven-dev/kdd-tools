#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

if [[ "$FILE_PATH" == *specs/* ]]; then
  cat <<'PROMPT'
Before writing to a spec file, ensure:
1. Domain entities are capitalized in prose
2. First mentions use wiki-links [[Entity]]
3. Frontmatter matches the artifact type schema
4. Required sections are present

Proceed with the write.
PROMPT
fi

exit 0
