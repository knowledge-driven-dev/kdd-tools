# kdd-tools

**kdd-tools** provides the skills, commands, agents, validator, and scripts for working with [KDD (Knowledge-Driven Development)](https://github.com/knowledge-driven-dev/kdd) specifications.

It is organized in two parts:
- **`core/`** — Platform-agnostic tools (spec validator, scripts)
- **`platforms/claude-code/`** — Claude Code plugin (skills, commands, agents, rules, hooks)

---

## Repository Structure

```
kdd-tools/
├── core/
│   ├── validator/          # Spec validator (formerly kdd-spec-validator)
│   └── scripts/            # Reusable scripts (sync-specs, etc.)
│
└── platforms/
    └── claude-code/        # Claude Code plugin
        ├── skills/         # Auto-invoked skills (kdd-methodology, spec-writing, kdd-author...)
        ├── commands/       # /kdd:* slash commands
        ├── agents/         # Subagent definitions
        ├── rules/          # Auto-loaded rules for KDD artifact types
        └── hooks/          # Pre/post tool use hooks
```

---

## Prerequisites

- [Claude Code](https://claude.com/claude-code) CLI
- [Bun](https://bun.sh) runtime
- [kdd-specs](https://github.com/knowledge-driven-dev/kdd) cloned as a sibling (for template reference)

### Recommended Directory Layout

```
projects/
├── kdd/                          ← kdd-specs: methodology + templates
├── kdd-tools/                    ← this repo
└── your-project/
    ├── specs/                    ← Your KDD specifications
    └── .claude/settings.local.json
```

---

## Installation (Claude Code)

### Option A: Plugin directory flag (per session, for development)

```bash
# From your project directory
claude --plugin-dir ../kdd-tools/platforms/claude-code
```

This loads the plugin for the current session only. Useful during development.

### Option B: Symlink install (recommended for local use)

```bash
ln -s "$(realpath kdd-tools/platforms/claude-code)" ~/.claude/plugins/kdd
```

This creates a persistent symlink — changes in the repo are reflected immediately.

### Option C: Copy install

```bash
cp -r kdd-tools/platforms/claude-code ~/.claude/plugins/kdd
```

### Option D: Marketplace install (when published)

Once the plugin is published to a marketplace, from inside Claude Code:

```
/plugin install kdd@<marketplace-name>
```

---

## Claude Code Platform

### Commands

All commands are prefixed with `/kdd:` when using the plugin.

| Command | Description |
|---------|-------------|
| `/kdd:feature` | Start Feature Discovery — refine ideas into KDD artifacts |
| `/kdd:ui` | Generate UI specifications (components, views, flows) |
| `/kdd:validate` | Validate specs — frontmatter, structure, and semantic checks |
| `/kdd:validate-deps` | Validate layer dependencies between specifications |
| `/kdd:fix-spec` | Auto-fix common issues in specification files |
| `/kdd:list-entities` | Generate index of all domain entities |
| `/kdd:analyze-entities` | Analyze file for missing wiki-links |
| `/kdd:generate-story` | Generate Storybook from UI specification |
| `/kdd:sync-story` | Sync existing Storybook with updated spec |

### Skills

Auto-invoked when working with specs:

| Skill | Trigger | Description |
|-------|---------|-------------|
| `kdd-methodology` | Working in `/specs` | KDD layer structure, artifact types, IDs |
| `spec-writing` | Creating/editing specs | Frontmatter, section templates by type |
| `kdd-author` | Authoring new specs | Guided spec creation from ideas |
| `kdd-review` | Reviewing specs | Quality, completeness, coherence |
| `kdd-gaps` | Analyzing coverage | Detect missing rules, events, edge cases |
| `kdd-trace` | Traceability | Build traceability matrix between layers |
| `kdd-iterate` | Updating specs | Apply feedback, propagate changes |
| `kdd-fix` | Fixing spec issues | Correct validation errors, broken links |

### Agents

| Agent | Description |
|-------|-------------|
| `kdd-requirement-analyst` | Transforms vague ideas into KDD specs through systematic discovery |
| `requirement-analyst` | (legacy) Earlier version |

### Rules

Auto-loaded rules for each KDD artifact type:

| Rule | Applies when |
|------|-------------|
| `kdd-writing.md` | Working in `/specs` |
| `kdd-domain-entities.md` | Editing entities |
| `kdd-domain-events.md` | Editing events |
| `kdd-domain-rules.md` | Editing business rules |
| `kdd-behavior-commands.md` | Editing commands |
| `kdd-behavior-queries.md` | Editing queries |
| `kdd-behavior-usecases.md` | Editing use cases |
| `kdd-experience-views.md` | Editing UI views |
| `kdd-experience-flows.md` | Editing UI flows |
| `kdd-experience-components.md` | Editing UI components |
| `kdd-shared-policies.md` | Editing policies (BP, XP) |

### Hooks

| Event | Behavior |
|-------|----------|
| `PostToolUse:Write` | Reminds to validate wiki-links and frontmatter after writing to /specs |
| `PreToolUse:Write` | Ensures proper formatting before writing spec files |

---

## Core Tools

### Spec Validator (`core/validator/`)

```bash
# Validate all specs
bun run core/validator/src/index.ts ./specs

# Or via CLI (when installed globally)
bunx kdd-validate ./specs

# Generate spec index
bunx kdd-generate-index ./specs
```

### Scripts (`core/scripts/`)

- `sync-specs.ts` — Sync specs to an external knowledge base (e.g., kdd-engine)

---

## Quick Start

### 1. Start a new feature

```
/kdd:feature I want users to be able to pause a session and resume it later
```

### 2. Generate a UI specification

```
/kdd:ui A card component showing a Persona with their hat color
```

### 3. Validate your specs

```
/kdd:validate
```

### 4. Fix common issues

```
/kdd:fix-spec specs/02-behavior/use-cases/UC-001-Crear-Reto.md
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting Started](docs/getting-started.md) | First-time setup, first spec, first validation |
| [Command Reference](docs/commands.md) | All 9 `/kdd:*` commands with syntax, arguments, and examples |
| [Skills, Rules, and Hooks](docs/skills-and-rules.md) | What activates automatically and when |
| [Validator Guide](docs/validator-guide.md) | Deep dive into the three validation levels |
| [Workflows](docs/workflows.md) | Common patterns: new feature, add UI, validate before PR, iterate |
| [Storybook Workflow](docs/storybook-workflow.md) | Turn UI specs into Storybook wireframes |
| [Validation Tooling](docs/validation-tooling.md) | AI analysis commands and CI/CD integration |
| [Graph RAG](docs/graph-rag.md) | Node types and edges for semantic indexing |

---

## Related

- **[kdd-specs](https://github.com/knowledge-driven-dev/kdd)** — Canonical layer structure, templates, and methodology reference
- **[kdd-engine](https://github.com/knowledge-driven-dev/kdd-engine)** — Semantic indexing and RAG retrieval of specifications

## License

MIT
