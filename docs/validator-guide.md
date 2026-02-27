# Validator Guide

The KDD spec validator is a CLI tool that checks your specification files for correctness at three levels: frontmatter (YAML schemas), structure (required sections), and semantics (wiki-links, cross-references, entity mentions). This guide covers the validator in depth — for AI-powered analysis commands and CI/CD integration, see [Validation Tooling](validation-tooling.md).

---

## Overview

The validator lives in `core/validator/` and runs with Bun. It:

1. Scans all `.md` files in a target directory
2. Builds an entity index from your specs (for cross-reference resolution)
3. Runs each file through up to three validation levels
4. Reports results with errors, warnings, and info-level suggestions
5. Exits with code `1` if any errors are found (useful for CI)

---

## CLI Reference

```
bun run core/validator/src/index.ts [directory] [options]
```

Or, if installed globally:

```
bunx kdd-spec-validator [directory] [options]
```

### Options

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--level <level>` | `-l` | `all` | Validation level: `frontmatter`, `structure`, `semantics`, or `all` |
| `--fix` | — | `false` | Auto-correct unlinked entity mentions (semantics level only) |
| `--verbose` | `-v` | `false` | Show info-level results and entity index stats |
| `--output <format>` | `-o` | `console` | Output format: `console`, `json`, or `github` |
| `--help` | `-h` | — | Show help message |

### Positional Argument

| Argument | Default | Description |
|----------|---------|-------------|
| `directory` | `./specs` | Directory to validate (relative to cwd) |

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No errors (warnings and info are OK) |
| `1` | One or more errors found |

---

## Level 1: Frontmatter

**What it checks**: The YAML frontmatter block at the top of each spec file against Zod schemas defined per artifact type.

### How It Works

1. The validator detects the artifact type from the file's path and name prefix (e.g., `UC-` → use case, `specs/01-domain/entities/` → entity)
2. It loads the appropriate Zod schema — first from KDD v2.0 templates (`kdd_templates/`), falling back to built-in schemas
3. It parses the frontmatter and validates each field

### What's Validated

| Check | Severity | Example |
|-------|----------|---------|
| Required field missing | Error | Use case without `id` field |
| Type mismatch | Error | `id` is a number instead of string |
| Invalid format | Error | ID `UC-1` doesn't match pattern `UC-\d{3}` |
| Invalid enum value | Error | `status: active` instead of `draft\|review\|approved\|deprecated\|superseded` |
| Missing `kind` tag | Warning | Entity without `kind: entity` |
| ID doesn't match filename | Warning | File `UC-001-CreateOrder.md` with `id: UC-002` |

### Frontmatter Schemas by Type

Every schema allows an optional `status` field with values: `draft`, `review`, `approved`, `deprecated`, `superseded`.

| Artifact Type | Required Fields | ID Pattern |
|---------------|----------------|------------|
| Use Case | `id` | `UC-\d{3}` |
| Requirement | `id` | `REQ-\d{3}` |
| Entity | `kind` (entity/role/system/catalog) | — |
| Event | — | — |
| Business Rule | `id` | `BR-\d{3}` |
| Business Policy | `id` | `BP-\d{3}` |
| Cross Policy | `id` | `XP-\d{3}` |
| Process | `id` | `PROC-\d{3}` |
| Command | `id` | `CMD-\d{3}` |
| Query | `id` | `QRY-\d{3}` |
| PRD | — | `PRD-*` |
| NFR | — | `NFR-*` |
| Objective | `id` | `OBJ-\d{3}` |
| Value Unit | `id` | `UV-\d{3}` |
| Release | `id` | `REL-\d{3}` |
| ADR | — | `ADR-\d{4}` |
| Implementation Charter | — | `ARCH-CHARTER-*` |
| UI View | — | — |
| UI Component | — | — |

### Example Errors

```
specs/02-behavior/use-cases/UC-001-CreateOrder.md
  ✗ frontmatter/missing: Required field "id" is missing
  ✗ frontmatter/format: Field "id" — invalid format (expected UC-\d{3})
  ⚠ frontmatter/kind: Entity should have "entity" tag
```

### How to Fix

- Add the missing field to your YAML frontmatter
- Match the expected format (e.g., `id: UC-001`, not `id: UC-1` or `id: 1`)
- Run `/kdd:fix-spec <file>` to auto-add missing fields with defaults

---

## Level 2: Structure

**What it checks**: Whether the document contains the required markdown sections (H2 headings) for its artifact type.

### How It Works

1. The validator parses all headings from the markdown
2. It matches section names against the required sections for the artifact type (case-insensitive, accent-insensitive)
3. Section names can match by exact name, regex pattern, or defined aliases
4. It also checks for expected content types within sections (e.g., Mermaid diagrams, Gherkin blocks)

### Required Sections by Type

| Artifact Type | Required Sections | H1 Pattern |
|---------------|-------------------|------------|
| **Use Case** | Description, Actors, Preconditions, Main Flow, Postconditions | `UC-\d{3}: .*` |
| **Requirement** | At least one `REQ-NNN.X` subsection | `Requisitos\|Requirements` |
| **Entity** | Description, Attributes | — |
| **Event** | Description, Payload | — |
| **Business Rule / Policy** | Statement, Rationale, When Applies, Violation Behavior | `(BR\|BP\|XP)-\d{3}` |
| **Command** | Purpose, Input, Preconditions, Postconditions, Errors | `CMD-\d{3}` |
| **Query** | Purpose, Input, Output | `QRY-\d{3}` |
| **PRD** | Problem, Scope | — |
| **ADR** | Context, Decision, Consequences | — |
| **UI View** | Purpose, Layout, Components, View States | — |
| **UI Component** | Description, Props, States | — |

### Additional Checks

| Check | Severity | Description |
|-------|----------|-------------|
| Missing H1 | Error | When the type requires an H1 heading |
| H1 pattern mismatch | Warning | H1 doesn't match expected pattern (e.g., `UC-001: Name`) |
| Multiple H1 | Warning | More than one H1 in a document |
| Empty section | Warning | A section heading with no content below it |
| Missing expected content | Info | Section should contain a specific block type (mermaid, gherkin, etc.) |

### Example Errors

```
specs/02-behavior/commands/CMD-001-CreateOrder.md
  ✗ structure/missing-section: Required section "Errors" is missing
  ⚠ structure/empty-section: Section "Preconditions" is empty
  ℹ structure/expected-content: Section "Flow" — expected mermaid diagram
```

### How to Fix

- Add the missing section as an H2 heading (`## Errors`) with content
- Fill in empty sections — even a short description helps
- Section names are matched flexibly: "Postconditions", "Post-conditions", "Post Conditions" all work

---

## Level 3: Semantics

**What it checks**: Wiki-links, entity references, cross-layer references, and capitalization — anything that requires understanding the full spec corpus.

### How It Works

1. Before validating, the validator builds an **entity index** from all `.md` files under the specs directory
2. The index maps entity names, aliases, IDs, and types
3. Each file is then checked against this index

### Checks Performed

#### Broken Wiki-Links (Warning)

Every `[[Target]]` and `[[Target|alias]]` is resolved against the entity index. If the target doesn't exist, the validator reports a warning and suggests similar entities.

```
⚠ semantics/broken-link: [[Sesion]] — did you mean [[Session]]?
```

#### Unlinked Entity Mentions (Info)

Known entity names mentioned in prose without `[[...]]` wrapping. The validator suggests adding wiki-links.

```
ℹ semantics/unlinked: "Challenge" should be a link to [[Challenge]]
```

- Maximum 20 suggestions per file
- Excludes: code blocks, headings, inline code, existing wiki-links, same-file self-references

#### Cross-Reference Validation (Warning/Info)

| File Type | Check | Severity |
|-----------|-------|----------|
| Use Case | EVT-* mentions must reference existing events | Warning |
| Requirement | UC-* mentions must reference existing use cases | Warning |
| Any | BR/BP/XP-* rule references must exist | Info |
| Any | REQ-NNN.M requirement references must exist | Info |

#### Entity Capitalization (Info)

Domain entities should be capitalized in prose (e.g., "Challenge", not "challenge"). The validator detects lowercase mentions of known entities.

- Maximum 10 results per file
- Excludes: headings, code blocks, wiki-links, inline code

### The `--fix` Flag

When you pass `--fix`, the validator auto-corrects unlinked entity mentions by wrapping them in wiki-links:

```
"the Challenge" → "the [[Challenge]]"
"sessions" → "[[Session|sessions]]"
```

Fixes are applied in reverse order to preserve line positions. Maximum 10 auto-fixes per file.

```
Se corrigieron 3 enlaces automáticamente
```

### Example Errors

```
specs/02-behavior/use-cases/UC-001-CreateOrder.md
  ⚠ semantics/broken-link: [[OrderService]] — entity not found
  ⚠ semantics/cross-ref: EVT-Order-Cancelled — event does not exist
  ℹ semantics/unlinked: "Customer" (line 15) should be [[Customer]]
  ℹ semantics/capitalization: "order" (line 23) should be "Order"
```

### How to Fix

- **Broken links**: Check spelling, or create the missing entity file
- **Cross-reference errors**: Create the missing event/rule/requirement, or fix the ID
- **Unlinked mentions**: Run with `--fix` to auto-link, or add `[[Entity]]` manually
- **Capitalization**: Capitalize the entity name in prose, or use a wiki-link

---

## Reading the Output

### Console Format (Default)

```
specs/01-domain/entities/Session.md
  ✗ frontmatter/missing: Required field "kind" is missing
  ⚠ semantics/broken-link: [[Sesion]] — did you mean [[Session]]?
  ℹ semantics/unlinked: "Challenge" should be [[Challenge]]

specs/02-behavior/use-cases/UC-001-CreateOrder.md
  ✓ All checks passed

──────────────────────────────────────────────────
12 files, 1 error, 1 warning
```

**Symbol legend:**

| Symbol | Color | Meaning | Blocks CI? |
|--------|-------|---------|------------|
| `✗` | Red | Error — must be fixed | Yes |
| `⚠` | Yellow | Warning — review, may be intentional | No |
| `ℹ` | Blue | Info — suggestion (verbose only) | No |
| `✓` | Green | All checks passed | — |

**Verbose mode** (`-v`) additionally shows:
- Info-level results (hidden by default)
- Entity index statistics (total entities, count by type)

### JSON Format

```json
{
  "specs/01-domain/entities/Session.md": [
    {
      "level": "error",
      "rule": "frontmatter/missing",
      "message": "Required field \"kind\" is missing",
      "line": 1,
      "suggestion": "Add kind: entity to frontmatter"
    }
  ]
}
```

### GitHub Format

Produces annotations for GitHub Actions:

```
::error file=specs/01-domain/entities/Session.md,line=1::Required field "kind" is missing
::warning file=specs/01-domain/entities/Session.md,line=15::[[Sesion]] — did you mean [[Session]]?
```

---

## Common Errors and Fixes

### 1. "Required field missing"

**Cause**: The frontmatter doesn't include a field that the artifact type requires.

**Fix**: Add the field. Check the [schema table](#frontmatter-schemas-by-type) for what each type needs.

```yaml
---
id: UC-001          # ← was missing
kind: use-case
status: draft
---
```

### 2. "Required section missing"

**Cause**: The document is missing a heading that the artifact type requires.

**Fix**: Add the section. Check the [required sections table](#required-sections-by-type) for what each type needs.

```markdown
## Errors           ← add the missing section

| Code | Condition | Message |
|------|-----------|---------|
| ER01 | Invalid input | ... |
```

### 3. "Wiki-link broken"

**Cause**: `[[Target]]` doesn't match any entity in the specs directory.

**Fix**: Either correct the name to match an existing entity, or create the entity file. The validator suggests similar names when available.

### 4. "Unlinked entity mention"

**Cause**: A known entity name appears in prose without `[[...]]` wrapping.

**Fix**: Run with `--fix` to auto-link, or manually wrap: `the Challenge` → `the [[Challenge]]`.

### 5. "ID doesn't match filename"

**Cause**: The `id` in frontmatter doesn't match the file's name prefix.

**Fix**: Align the frontmatter `id` with the filename: file `UC-001-CreateOrder.md` should have `id: UC-001`.

### 6. "Entity not found but it exists"

**Cause**: The entity index is stale or the entity file isn't in a scanned directory.

**Fix**: See [Validation Tooling: Troubleshooting](validation-tooling.md#entity-not-found-but-it-exists) for details on regenerating the index and checking aliases.

---

## See Also

- [Validation Tooling](validation-tooling.md) — AI analysis commands and CI/CD integration
- [Command Reference: /kdd:validate](commands.md#kddvalidate) — command syntax and examples
- [Command Reference: /kdd:fix-spec](commands.md#kddfix-spec) — auto-fix command
