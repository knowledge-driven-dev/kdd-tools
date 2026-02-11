# KDD Claude Code Plugin

Claude Code plugin for [KDD (Knowledge-Driven Development)](https://github.com/knowledge-driven-dev/kdd) workflows. Provides commands, skills, agents, and hooks for creating and managing KDD specifications.

## Prerequisites

- [Claude Code](https://claude.com/claude-code) CLI
- [Bun](https://bun.sh) runtime (for the spec validator)
- The [kdd](https://github.com/knowledge-driven-dev/kdd) repo cloned as a sibling directory

### Recommended Directory Layout

```
projects/
├── kdd/                  ← Methodology + templates (sibling)
├── kdd-claude-code/      ← This plugin
├── kdd-spec-validator/   ← Optional: for local development
└── your-project/
    └── specs/            ← Your KDD specifications
```

## Installation

```bash
# From your project directory
claude --plugin-dir ../kdd-claude-code
```

Or install globally:

```bash
cp -r kdd-claude-code ~/.claude/plugins/kdd
```

## Commands

All commands are prefixed with `/kdd:` when using the plugin.

| Command | Description |
|---------|-------------|
| `/kdd:feature` | Start Feature Discovery process to refine ideas into KDD artifacts |
| `/kdd:ui` | Generate UI specifications (components, views, flows) |
| `/kdd:validate` | Validate specs - frontmatter, structure, and semantic checks |
| `/kdd:validate-deps` | Validate layer dependencies between specifications |
| `/kdd:fix-spec` | Auto-fix common issues in specification files |
| `/kdd:list-entities` | Generate index of all domain entities |
| `/kdd:analyze-entities` | Analyze file for missing wiki-links |
| `/kdd:generate-story` | Generate Storybook from UI specification |
| `/kdd:sync-story` | Sync existing Storybook with updated spec |

## Agents

| Agent | Description |
|-------|-------------|
| `kdd-requirement-analyst` | Transforms vague ideas into concrete KDD specifications through systematic discovery |

## Skills

| Skill | Description |
|-------|-------------|
| `kdd-methodology` | Auto-invoked when working with /specs - provides KDD conventions |
| `spec-writing` | Auto-invoked when creating specs - provides frontmatter and section templates |

## Hooks

| Event | Behavior |
|-------|----------|
| `PostToolUse:Write` | Reminds to validate wiki-links and frontmatter after writing to /specs |
| `PreToolUse:Write` | Ensures proper formatting before writing spec files |

## Quick Start

### 1. Start a new feature

```bash
/kdd:feature I want users to be able to pause a session and resume it later
```

### 2. Generate a UI specification

```bash
/kdd:ui A card component showing a Persona with their hat color and personality
```

### 3. Validate your specs

```bash
/kdd:validate
```

### 4. Fix common issues

```bash
/kdd:fix-spec specs/04-interaction/use-cases/UC-001-Crear-Reto.md
```

## Validation

The plugin uses [kdd-spec-validator](https://github.com/knowledge-driven-dev/kdd-spec-validator) for spec validation. Install it globally:

```bash
bun install -g kdd-spec-validator
```

Or it will be invoked via `bunx kdd-spec-validator` automatically.

## Related

- **[kdd](https://github.com/knowledge-driven-dev/kdd)** - KDD methodology, templates, and documentation
- **[kdd-spec-validator](https://github.com/knowledge-driven-dev/kdd-spec-validator)** - CLI tool for validating KDD specifications

## License

MIT
