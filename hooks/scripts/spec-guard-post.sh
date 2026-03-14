#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

if [[ "$FILE_PATH" == *specs/* ]]; then
  cat <<'PROMPT'
If the file just written is in the /specs directory, remind yourself to:
1. Verify all wiki-links [[]] are valid
2. Check frontmatter is complete for the artifact type
3. Ensure layer dependencies are respected (lower layers cannot reference higher layers)
4. Suggest running /kdd:fix-spec if issues are found

Only mention this if relevant to the file written. Be concise.
PROMPT
fi

exit 0
