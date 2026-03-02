# KDD Validation Tooling

> This document covers the kdd-tools CLI and slash commands for validating KDD specifications. For the validation model itself (what gets validated and why), see the [kdd-specs](https://github.com/knowledge-driven-dev/kdd-specs) documentation.

---

## Intelligent Analysis with Claude Code

For deeper analysis requiring semantic understanding, kdd-tools provides slash commands that leverage the Claude Code subscription.

### `/analyze-entities <file>`

Deep AI analysis of a file to detect:

- **Explicit mentions**: Known entities without links
- **Synonyms and variations**: Plurals, equivalent terms
- **Implicit references**: "the customer" → `[[Customer]]`
- **Abbreviations**: UC-001 → `[[UC-001-PlaceOrder]]`
- **Missing entities**: Concepts that should be documented

### `/list-entities`

Generates a complete index of all system entities.

### `/fix-spec <file>`

Automatically fixes detected problems.

**What it fixes:**
- Broken links with similar names
- Unlinked mentions (high confidence)
- Incomplete frontmatter

**What it does NOT fix:**
- Entities that don't exist
- Missing sections
- Problems that require human decision

---

## CI/CD Integration

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Validate only modified files in /specs
CHANGED_SPECS=$(git diff --cached --name-only | grep "^specs/.*\.md$")

if [ -n "$CHANGED_SPECS" ]; then
  echo "Validating modified specifications..."
  npx kdd validate $CHANGED_SPECS

  if [ $? -ne 0 ]; then
    echo "Validation failed. Fix the errors before committing."
    exit 1
  fi
fi
```

### GitHub Actions

```yaml
# .github/workflows/validate-specs.yml
name: Validate Specs

on:
  pull_request:
    paths:
      - 'specs/**/*.md'
      - 'templates/**/*.md'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - run: bun install

      - name: Validate specifications
        run: npx kdd validate -o github
```

---

## Recommended Workflow

### When Creating a New Document

```bash
# 1. Copy template
cp templates/use-case.template.md specs/02-behavior/use-cases/UC-011-New.md

# 2. Edit content
# ... write the use case ...

# 3. Validate
npx kdd validate specs/02-behavior/use-cases/UC-011-New.md -v

# 4. Deep analysis (optional)
/analyze-entities specs/02-behavior/use-cases/UC-011-New.md

# 5. Fix
/fix-spec specs/02-behavior/use-cases/UC-011-New.md
```

### Periodic Validation

```bash
# 1. Full validation
npx kdd validate -v

# 2. Review warnings by type
npx kdd validate --level frontmatter
npx kdd validate --level structure
npx kdd validate --level semantics

# 3. Generate listing for manual review
/list-entities
```

### Before PR

```bash
# Strict validation (must pass with no errors)
npx kdd validate

# If there are important warnings, analyze
/analyze-entities specs/file-with-warnings.md
```

---

## Troubleshooting

### "Could not load KDD templates"
- Verify that the templates directory exists
- Files must end in `.template.md`
- Frontmatter must have `# @file-pattern:` or `# @path-pattern:`

### "Entity not found" but it exists

The validator uses an **entity index** — a static cache (`specs/_index.md` and `specs/_index.json`) that lists all known entities. When an entity is not found:

1. **Regenerate the index**: `npx kdd index` (or the project-specific alias)
2. **Verify the file is in a scanned directory**: entities in `01-domain/`, use-cases/rules/processes in `02-behavior/`
3. **Check the name**: matching is case-insensitive, but the file must have a `.md` extension and not start with `_`
4. **Add aliases** if the entity is referred to by other names:
   ```yaml
   ---
   aliases:
     - Alternative term
     - Other name
   ---
   ```

The index should be regenerated whenever entities are created, renamed, or have their aliases changed. It is recommended to regenerate before running full validation. Consider automating this in a pre-commit hook or CI pipeline.

### Wiki-link not detected
- Correct format: `[[Name]]` or `[[Name|alias]]`
- No spaces after `[[` or before `]]`
- The target must exist as an entity
