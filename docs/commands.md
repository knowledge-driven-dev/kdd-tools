# Command Reference

All kdd-tools commands are prefixed with `/kdd:` when used as Claude Code slash commands. Each command is defined in `platforms/claude-code/commands/` and runs inside your Claude Code session.

**Quick overview:**

| Command | Category | Purpose |
|---------|----------|---------|
| [`/kdd:feature`](#kddfeature) | Discovery | Refine an idea into KDD artifacts |
| [`/kdd:ui`](#kddui) | Discovery | Generate a UI specification |
| [`/kdd:validate`](#kddvalidate) | Validation | Run the spec validator |
| [`/kdd:validate-deps`](#kddvalidate-deps) | Validation | Check layer dependency violations |
| [`/kdd:fix-spec`](#kddfix-spec) | Validation | Auto-fix common spec issues |
| [`/kdd:list-entities`](#kddlist-entities) | Validation | Generate entity index |
| [`/kdd:analyze-entities`](#kddanalyze-entities) | Validation | Find missing wiki-links in a file |
| [`/kdd:generate-story`](#kddgenerate-story) | Storybook | Generate Storybook from UI spec |
| [`/kdd:sync-story`](#kddsync-story) | Storybook | Sync Storybook with updated spec |

---

## Discovery & Authoring

These commands help you go from an idea to structured KDD specifications.

---

### `/kdd:feature`

Start a **Feature Discovery** session that refines a vague idea into structured KDD artifacts through guided conversation.

#### Syntax

```
/kdd:feature [idea description]
```

#### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `idea description` | No | Free-text description of the feature you want to explore |

#### How It Works

**With an idea provided**, the command:

1. Reads the KDD reference and your existing domain specs
2. Walks you through 5 refinement phases (one at a time, conversationally):
   - **Phase 1 — Problem Clarification**: What problem does this solve? Who has it?
   - **Phase 2 — Entity Identification**: Which domain entities are involved? New or existing?
   - **Phase 3 — Business Rules**: What constraints apply? What should NOT happen?
   - **Phase 4 — User Interaction**: How does the user trigger this? What do they see?
   - **Phase 5 — Verification**: Walk through a happy-path example and a failure case
3. Produces a **Structured Summary** listing artifacts to create per layer (domain, behavior, experience, verification) with actions (create/modify)
4. Asks for confirmation before generating any files
5. Generates KDD spec files using the appropriate templates

**Without arguments**, explains the process and prompts you for an idea.

#### Examples

```
/kdd:feature Users should be able to pause a session and resume it later
```

```
/kdd:feature We need to limit the number of synthetic personas per session
```

```
/kdd:feature
```
*(starts guided mode — asks what you want to explore)*

#### Output

A structured summary table per KDD layer, followed by generated spec files:

```
## Summary: Pause and Resume Session

### Domain Impact (01-domain/)
| Type     | Artifact     | Action |
|----------|-------------|--------|
| Entity   | [[Session]] | Modify |
| Event    | EVT-Session-Paused | Create |
| Rule     | BR-SESSION-003 | Create |

### Behavior (02-behavior/)
...
```

#### Tips

- Start broad — the command will help you narrow down through questions
- You don't need to know KDD structure; the discovery process guides you
- The command reads your existing specs to avoid duplicates and maintain consistency
- You can stop at the summary and not generate files if you just want to explore

#### See Also

- [Workflows: New Feature Pattern](workflows.md#pattern-1-new-feature)
- [Skills: kdd-author](skills-and-rules.md#skills-reference)

---

### `/kdd:ui`

Generate a **UI specification** (component, view, or flow) connected to your existing domain model.

#### Syntax

```
/kdd:ui [description]
```

#### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `description` | No | What UI element to design — include keywords that signal the type |

#### Type Detection

The command classifies the UI artifact based on keywords in your description:

| Keywords | Type | Output Location |
|----------|------|-----------------|
| card, button, badge, input, item, chip | `ui-component` | `specs/03-experience/components/` |
| page, view, screen, dashboard, list | `ui-view` | `specs/03-experience/views/` |
| flow, wizard, steps, process, onboarding | `ui-flow` | `specs/03-experience/flows/` |

If ambiguous, it asks you to choose.

#### How It Works

1. Reads your domain entities, use cases, existing views, and business rules
2. Determines artifact type from your description
3. Asks refinement questions (conversationally, not all at once):
   - **All types**: Which entities does it show/modify? Any design reference?
   - **Components**: Props, visual states, events emitted, size variants
   - **Views**: Navigation route, user actions, states (loading/empty/error), responsive behavior
   - **Flows**: Number of steps, back navigation, cancellation, decision points
4. Generates the spec with frontmatter, ASCII wireframes, behavior tables, and wiki-links
5. Shows a summary and asks for confirmation before creating the file

#### File Naming

- Components: `UI-PersonaCard.md` (PascalCase)
- Views: `VIEW-ConfigureChallenge.md`
- Flows: `FLOW-CreateChallenge.md`

#### Examples

```
/kdd:ui A card showing a Persona with their hat color and personality
```

```
/kdd:ui Dashboard view showing the user's Challenges with status
```

```
/kdd:ui Onboarding flow explaining the Six Hats to new users
```

```
/kdd:ui
```
*(guided mode — asks what you want to design)*

#### Output

A complete UI spec file with:
- Frontmatter linking to entities and use cases
- ASCII wireframes for each state
- Behavior tables (action → result → feedback)
- Suggested shadcn/ui components

#### Tips

- The command reads your existing entities to populate wireframes with realistic data
- ASCII wireframes serve as executable documentation — they drive Storybook generation
- Use `/kdd:generate-story` after creating a UI spec to visualize it

#### See Also

- [Workflows: Add UI Pattern](workflows.md#pattern-2-add-ui)
- [`/kdd:generate-story`](#kddgenerate-story)
- [Storybook Workflow](storybook-workflow.md)

---

## Validation & Quality

These commands help you check and fix your specifications.

---

### `/kdd:validate`

Run the **KDD spec validator** to check frontmatter, structure, and semantic correctness of your specifications.

#### Syntax

```
/kdd:validate [path] [--level <level>] [--fix] [--verbose] [--output <format>]
```

#### Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `path` | No | `./specs` | Directory or file to validate |
| `--level`, `-l` | No | `all` | Validation level: `frontmatter`, `structure`, `semantics`, or `all` |
| `--fix` | No | `false` | Auto-correct unlinked entity mentions (semantics level) |
| `--verbose`, `-v` | No | `false` | Show details and suggestions for each file |
| `--output`, `-o` | No | `console` | Output format: `console`, `json`, or `github` |

#### Validation Levels

| Level | What It Checks | Speed |
|-------|----------------|-------|
| `frontmatter` | YAML fields: required fields, ID formats, allowed values (Zod schemas) | Fast |
| `structure` | Required sections per artifact type, H1 patterns, empty sections | Fast |
| `semantics` | Broken wiki-links, unlinked entity mentions, cross-references, capitalization | Moderate |
| `all` | All three levels | Moderate |

#### Result Symbols

| Symbol | Meaning |
|--------|---------|
| `✗` (red) | **Error** — must be fixed |
| `⚠` (yellow) | **Warning** — review, may be intentional |
| `ℹ` (blue) | **Info** — suggestion (shown only with `--verbose`) |

#### Examples

```
# Validate all specs at all levels
/kdd:validate

# Quick frontmatter check only
/kdd:validate --level frontmatter

# Validate and auto-fix entity links
/kdd:validate --fix

# Validate a specific directory
/kdd:validate specs/01-domain

# Verbose output
/kdd:validate -v

# JSON output for CI
/kdd:validate --output json
```

#### Output

**Console format** (default):
```
specs/01-domain/entities/Session.md
  ✗ frontmatter/missing: Required field "kind" is missing
  ⚠ semantics/broken-link: [[Sesion]] — did you mean [[Session]]?

specs/02-behavior/use-cases/UC-001-CreateChallenge.md
  ✓ All checks passed

──────────────────────────────────────────────────
12 files, 2 errors, 1 warning
```

**JSON format**: `{ "filename": [{ level, rule, message, line?, suggestion? }] }`

**GitHub format**: `::error file=path,line=1::Message`

#### Tips

- Run `--level frontmatter` first for a quick sanity check when authoring new specs
- Use `--fix` to auto-link known entities, then review the changes
- Pipe `--output json` for programmatic processing
- The validator builds an entity index from all specs before checking — so cross-references are resolved globally

#### See Also

- [Validator Guide](validator-guide.md) — deep dive into each validation level
- [Validation Tooling](validation-tooling.md) — CI/CD integration
- [`/kdd:fix-spec`](#kddfix-spec) — AI-powered fix for individual files

---

### `/kdd:validate-deps`

Detect **layer dependency violations** — specs that reference artifacts from higher KDD layers, breaking the unidirectional flow.

#### Syntax

```
/kdd:validate-deps [path]
```

#### Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `path` | No | `specs/` | Directory or file to check |

#### The Dependency Rule

KDD layers form a strict dependency hierarchy. Higher layers may reference lower layers, but **never the reverse**:

```
04-verification  → can reference 03, 02, 01
03-experience    → can reference 02, 01
02-behavior      → can reference 01
01-domain        → BASE — references nothing
00-requirements  → INPUT — outside the flow
05-architecture  → ORTHOGONAL — can reference/be referenced by any layer
```

#### What It Detects

| Violation Type | Example |
|----------------|---------|
| Upward wiki-link | `01-domain/rules/BR-001.md` linking to `[[CMD-001]]` (02-behavior) |
| UI text in domain | Business rule using `SHALL display "Error message"` |
| Forbidden sections | Entity file with "Related Use Cases" section linking to UC-* |
| UI references in rules | Business rule mentioning "button", "modal", "screen" |

#### Examples

```
# Check all specs
/kdd:validate-deps

# Check only domain layer
/kdd:validate-deps specs/01-domain

# Check a specific file
/kdd:validate-deps specs/01-domain/rules/BR-CHALLENGE-002.md
```

#### Output

A markdown report with:

```
## Dependency Validation Summary

- Files analyzed: 45
- Violations found: 3
- Clean files: 42

## Dependency Violations

### specs/01-domain/rules/BR-SESSION-002.md
| Line | Issue | Reference | Target Layer |
|------|-------|-----------|--------------|
| 45   | Upward link | [[CMD-001-...]] | 02-behavior |

## Anti-Patterns Detected

| File | Line | Anti-Pattern | Suggestion |
|------|------|-------------|------------|
| BR-SESSION-002.md | 33 | UI message in EARS | Use `WITH error code "BR-SESSION-002"` |
```

#### Tips

- Run this before opening a PR to catch accidental upward references
- The most common violation is domain rules referencing commands or use cases — invert the dependency instead
- For UI messages in business rules, use error codes and let the experience layer handle display text

#### See Also

- [Workflows: Validate Before PR](workflows.md#pattern-3-validate-before-pr)
- [Skills: kdd-methodology](skills-and-rules.md#skills-reference) — explains the layer model

---

### `/kdd:fix-spec`

**Auto-fix** common issues in a specification file. Runs the validator, then applies corrections that are safe to automate.

#### Syntax

```
/kdd:fix-spec <file-path>
```

#### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `file-path` | **Yes** | Path to the spec file to fix |

#### What It Fixes Automatically

| Issue | Fix Applied |
|-------|------------|
| Broken entity links | Corrects near-matches: `[[Sesion]]` → `[[Session]]` |
| Unlinked entity mentions | Adds wiki-links: `the Challenge` → `the [[Challenge]]` |
| Missing frontmatter fields | Adds required fields with sensible defaults |
| ID format issues | Corrects ID formatting (UC-001, REQ-001, etc.) |

#### What It Does NOT Fix

These require manual intervention:

- References to entities that don't exist yet (you need to create the file)
- Missing required sections (you need to write the content)
- Complex semantic issues (ambiguous references, wrong layer placement)

#### Examples

```
/kdd:fix-spec specs/02-behavior/use-cases/UC-001-CreateChallenge.md
```

#### Output

```
Corrections applied (5):
  ✓ Line 15: "Challenge" → "[[Challenge]]"
  ✓ Line 23: "sessions" → "[[Session|sessions]]"
  ✓ Line 30: frontmatter "kind" field added
  ...

Require manual intervention (2):
  ⚠ Line 72: [[ScoringService]] — entity does not exist
  ⚠ Missing section "## References"
```

#### Tips

- Run `/kdd:validate` first to see all issues, then `/kdd:fix-spec` on files with fixable problems
- After fixing, run `/kdd:validate` again to confirm everything passes
- The command only applies high-confidence fixes (exact or plural/singular entity matches)

#### See Also

- [`/kdd:validate`](#kddvalidate)
- [Validator Guide](validator-guide.md)
- [Validation Tooling](validation-tooling.md)

---

### `/kdd:list-entities`

Generate a **complete index** of all known entities, events, rules, commands, queries, use cases, and requirements in your specs directory.

#### Syntax

```
/kdd:list-entities
```

#### Arguments

None.

#### What It Scans

| Directory | What It Extracts |
|-----------|-----------------|
| `specs/01-domain/entities/` | Entity name, aliases, status |
| `specs/01-domain/events/` | Event ID, name, emitting entity |
| `specs/01-domain/rules/` | Rule ID (BR-*, BP-*), individual sub-rules |
| `specs/02-behavior/commands/` | Command ID, name, affected entities |
| `specs/02-behavior/queries/` | Query ID, name, affected entities |
| `specs/02-behavior/use-cases/` | Use case ID, name, primary actor |
| `specs/04-verification/criteria/` | Requirement ID, individual sub-requirements |

#### Examples

```
/kdd:list-entities
```

#### Output

A markdown index organized by type:

```markdown
## KDD Entity Index

### Domain Entities (12)
| Entity | Aliases | Status | File |
|--------|---------|--------|------|
| Challenge | Reto | approved | specs/01-domain/entities/Challenge.md |
| Session | Sesion | draft | specs/01-domain/entities/Session.md |
...

### Events (8)
| ID | Name | Emitter | File |
|----|------|---------|------|
| EVT-Challenge-Created | Challenge Created | Challenge | ... |
...

### Statistics
- Total entities by type: ...
- Undocumented entities (referenced but no file): ...
```

#### Tips

- Use this to get a bird's-eye view of your domain model
- The "undocumented entities" section reveals gaps — entities referenced by wiki-links but without their own spec file
- Run before `/kdd:analyze-entities` to ensure the index is current

#### See Also

- [`/kdd:analyze-entities`](#kddanalyze-entities)
- [Workflows: Validate Before PR](workflows.md#pattern-3-validate-before-pr)

---

### `/kdd:analyze-entities`

Analyze a **specific file** for domain entities that should be linked with wiki-links but aren't.

#### Syntax

```
/kdd:analyze-entities <file-path>
```

#### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `file-path` | **Yes** | Path to the spec file to analyze |

#### What It Detects

| Detection Type | Example | Confidence |
|----------------|---------|------------|
| **Explicit mentions** | "Challenge" without `[[]]` | Exact |
| **Plurals/singulars** | "sessions" → `[[Session\|sessions]]` | High |
| **Accent variations** | "Sesion" → `[[Session]]` | High |
| **Implicit references** | "the user" → `[[User]]` | Medium |
| **ID references** | "UC-001" → `[[UC-001-CreateChallenge]]` | Exact |
| **Missing entities** | Concepts mentioned repeatedly but not documented | Low |

#### Examples

```
/kdd:analyze-entities specs/02-behavior/use-cases/UC-001-CreateChallenge.md
```

#### Output

```markdown
### Summary
- Unlinked mentions found: 8
- Most referenced without link: Challenge (4 times)

### Mentions to Link
| Line | Original Text | Suggestion | Type | Confidence |
|------|--------------|------------|------|------------|
| 15   | "the challenge" | [[Challenge]] | implicit | High |
| 23   | "users" | [[User]] | plural | High |
| 45   | "BR-CHALLENGE-001" | [[BR-CHALLENGE-001]] | code | Exact |

### Suggested Missing Entities
- "scoring algorithm" — mentioned 3 times, consider documenting as an entity
```

#### Tips

- Run after writing a new spec to catch unlinked entities before committing
- Combine with `/kdd:fix-spec` to auto-apply the high-confidence suggestions
- The command builds context from all entity, event, rule, command, query, and use case files

#### See Also

- [`/kdd:fix-spec`](#kddfix-spec)
- [`/kdd:list-entities`](#kddlist-entities)
- [Validation Tooling](validation-tooling.md)

---

## Storybook

These commands bridge UI specifications and Storybook, turning ASCII wireframes into visual prototypes.

---

### `/kdd:generate-story`

Generate a **Storybook file** (`.stories.tsx`) from a UI specification, translating ASCII wireframes into functional React wireframe components.

#### Syntax

```
/kdd:generate-story <spec-path>
```

#### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `spec-path` | **Yes** | Path to the UI spec (component, view, or flow) |

#### How It Works

1. Reads the spec and identifies the type (`ui-component`, `ui-view`, or `ui-flow`)
2. Extracts name, description, structure, states, props, and behavior
3. Determines story file location based on type:
   - Components → `apps/web/components/features/{name}/{name}.stories.tsx`
   - Views → `apps/web/app/(routes)/{route}/_components/{name}.stories.tsx`
4. Translates ASCII wireframes to JSX using shadcn/ui components and Tailwind
5. Generates mock data from linked domain entities
6. Creates one story per state/variant described in the spec

#### ASCII to JSX Translation

| ASCII Pattern | JSX Equivalent |
|---------------|---------------|
| `┌───┐` border box | `<Card>` |
| `[Button Label]` | `<Button>` |
| `👤` avatar icon | `<Avatar>` |
| `│ ... │` sections | `<div className="flex">` |

#### Examples

```
/kdd:generate-story specs/03-experience/components/UI-PersonaCard.md
```

#### Output

A `.stories.tsx` file with:
- Wireframe React component matching the spec's ASCII art
- Meta configuration with autodocs
- One story per state (Default, Hover, Disabled, Loading, Error, etc.)
- Realistic mock data derived from linked entities
- Comment referencing the source spec

```tsx
/**
 * Wireframe generated from: specs/03-experience/components/UI-PersonaCard.md
 * Status: draft (pending real implementation)
 *
 * TODO: Replace wireframe with real implementation
 */
```

#### Tips

- The wireframe is a **design visualization**, not the final implementation
- It prioritizes visual similarity to the spec's ASCII art
- Run Storybook after generating to preview: `bun run storybook`
- Use `/kdd:sync-story` to update after spec changes instead of regenerating

#### See Also

- [`/kdd:sync-story`](#kddsync-story)
- [Storybook Workflow](storybook-workflow.md)
- [Workflows: Add UI Pattern](workflows.md#pattern-2-add-ui)

---

### `/kdd:sync-story`

**Synchronize** an existing Storybook file with its updated UI specification, preserving any manual customizations.

#### Syntax

```
/kdd:sync-story [spec-path]
```

#### Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `spec-path` | No | auto-detect | Path to the UI spec, or omit to sync all modified specs |

#### How It Works

**Auto-detect mode** (no arguments or `auto`):
1. Runs `git diff --cached` to find modified UI specs
2. Syncs each one

**Specific file mode**:
1. Reads the spec and locates the existing story file
2. Splits the story into `@generated` and `@custom` sections
3. Regenerates the `@generated` section from the updated spec
4. Preserves the `@custom` section untouched
5. Writes the merged file with an updated sync timestamp

#### Story File Zones

```tsx
// ============================================
// @generated from specs/03-experience/views/UI-PersonaForm.md
// Last sync: 2025-06-15T10:30:00Z
// DO NOT EDIT this section — regenerated automatically
// ============================================

// ... wireframe, meta, auto-generated stories ...

// ============================================
// @custom — Manual extensions (NOT overwritten)
// ============================================

// ... your custom stories, play functions, decorators ...
```

#### Examples

```
# Sync a specific spec
/kdd:sync-story specs/03-experience/views/VIEW-PersonaForm.md

# Auto-detect and sync all modified UI specs
/kdd:sync-story

# Equivalent to auto
/kdd:sync-story auto
```

#### Output

```
✓ Synced: persona-form.stories.tsx
  - Props: 4 (unchanged)
  - States: 3 → 4 (added: IncompleteValidation)
  - Navigation: 2 links updated
  - Custom: 2 stories preserved
```

#### Tips

- If no story exists yet, this command creates one (same as `/kdd:generate-story`)
- If the existing story doesn't have `@generated`/`@custom` zones, it converts to the new format
- Run after editing a UI spec to keep Storybook in sync without losing custom stories

#### See Also

- [`/kdd:generate-story`](#kddgenerate-story)
- [Storybook Workflow](storybook-workflow.md)
