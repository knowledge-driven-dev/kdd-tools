# Getting Started

This tutorial walks you through setting up kdd-tools, creating your first KDD specification, and validating it. By the end, you'll have a working KDD workflow with Claude Code.

---

## What You Need

Before starting, verify you have these installed:

| Prerequisite | Verify With | Minimum Version |
|-------------|-------------|-----------------|
| [Claude Code](https://claude.com/claude-code) | `claude --version` | Latest |
| [Bun](https://bun.sh) | `bun --version` | 1.0+ |
| [kdd-specs](https://github.com/knowledge-driven-dev/kdd) | Check it's cloned locally | v2.0 |

### Recommended Directory Layout

```
projects/
├── kdd/                          ← kdd-specs: methodology + templates
├── kdd-tools/                    ← this repo
└── your-project/
    ├── specs/                    ← your KDD specifications
    └── .claude/settings.local.json
```

---

## Install the Plugin

Choose one of these options — pick what fits your workflow.

### Option A: Plugin directory flag (per session, for development)

```bash
cd your-project
claude --plugin-dir ../kdd-tools/platforms/claude-code
```

This loads the plugin for the current session only. Ideal for developing or testing changes to the plugin.

### Option B: Symlink install (recommended for local use)

```bash
ln -s "$(realpath kdd-tools/platforms/claude-code)" ~/.claude/plugins/kdd
```

Creates a persistent symlink so changes in the repo are immediately available. You only need to do this once.

### Option C: Copy install

```bash
cp -r kdd-tools/platforms/claude-code ~/.claude/plugins/kdd
```

### Option D: Marketplace install (when published)

Once the plugin is published to a Claude Code marketplace, from inside Claude Code:

```
/plugin install kdd@<marketplace-name>
```

### Verify Installation

Once inside Claude Code, type `/kdd:` — you should see autocomplete suggestions for all 9 commands:

```
/kdd:feature          /kdd:validate         /kdd:generate-story
/kdd:ui               /kdd:validate-deps    /kdd:sync-story
/kdd:fix-spec         /kdd:list-entities
/kdd:analyze-entities
```

---

## Create Your Specs Directory

KDD v2.0 uses a layered folder structure. Create the full tree:

```bash
mkdir -p specs/{00-requirements,01-domain/{entities,events,rules},02-behavior/{commands,queries,use-cases,processes,policies},03-experience/{views,components,flows},04-verification/{criteria,examples},05-architecture/decisions}
```

Your specs directory should now look like:

```
specs/
├── 00-requirements/
├── 01-domain/
│   ├── entities/
│   ├── events/
│   └── rules/
├── 02-behavior/
│   ├── commands/
│   ├── queries/
│   ├── use-cases/
│   ├── processes/
│   └── policies/
├── 03-experience/
│   ├── views/
│   ├── components/
│   └── flows/
├── 04-verification/
│   ├── criteria/
│   └── examples/
└── 05-architecture/
    └── decisions/
```

---

## Your First Feature

Let's use Feature Discovery to create your first specifications. In Claude Code:

```
/kdd:feature Users should be able to create an account with email and password
```

Claude will:

1. **Read your existing domain** (empty for now — that's fine)
2. **Ask clarifying questions** one phase at a time:
   - What problem does account creation solve?
   - What entities are involved (User, Account)?
   - What rules apply (password strength, email uniqueness)?
   - How does the user interact with this?
   - Walk through a happy-path example
3. **Show a structured summary** of artifacts to create:

```
## Summary: User Account Creation

### Domain Impact (01-domain/)
| Type   | Artifact     | Action |
|--------|-------------|--------|
| Entity | User         | Create |
| Event  | EVT-User-Created | Create |
| Rule   | BR-USER-001  | Create |

### Behavior (02-behavior/)
| Type     | Artifact                  | Action |
|----------|--------------------------|--------|
| Command  | CMD-001-CreateAccount     | Create |
| Use Case | UC-001-CreateAccount      | Create |
```

4. **Ask for confirmation**, then generate the files

After approval, you'll have spec files in the appropriate directories with proper frontmatter, wiki-links, and section structure.

---

## Validate Your Specs

Now check that the generated specs are correct:

```
/kdd:validate
```

The validator runs three levels of checks on every `.md` file in `specs/`:

```
specs/01-domain/entities/User.md
  ✓ All checks passed

specs/02-behavior/use-cases/UC-001-CreateAccount.md
  ⚠ semantics/unlinked: "password" (line 24) — consider documenting as entity

specs/01-domain/rules/BR-USER-001.md
  ✗ frontmatter/missing: Required field "id" is missing

──────────────────────────────────────────────────
5 files, 1 error, 1 warning
```

- `✗` **Errors** must be fixed before the specs are valid
- `⚠` **Warnings** should be reviewed but may be intentional
- `ℹ` **Info** suggestions appear with `--verbose` flag

---

## Fix Issues

For the error above, run the auto-fixer on the specific file:

```
/kdd:fix-spec specs/01-domain/rules/BR-USER-001.md
```

Output:

```
Corrections applied (2):
  ✓ Added frontmatter field "id: BR-001"
  ✓ Line 12: "User" → "[[User]]"

Require manual intervention (0):
  (none)
```

Run validation again to confirm:

```
/kdd:validate
```

```
──────────────────────────────────────────────────
5 files, 0 errors, 1 warning
```

Zero errors — your specs are valid.

---

## What Happened Behind the Scenes

While you were running commands, kdd-tools was also working automatically through skills, rules, and hooks:

| Mechanism | What Happened |
|-----------|--------------|
| **kdd-methodology skill** | Loaded KDD v2.0 reference when you started `/kdd:feature` |
| **spec-writing skill** | Provided frontmatter schemas when generating specs |
| **kdd-writing rule** | Applied writing conventions (capitalization, wiki-links) to every spec |
| **Type-specific rules** | Applied artifact-specific structure (e.g., `kdd-domain-entities.md` for entity files) |
| **PreToolUse:Write hook** | Checked formatting before each spec was written |
| **PostToolUse:Write hook** | Verified wiki-links and frontmatter after each write |

You didn't need to know about these — they just ensured everything was correct. See [Skills, Rules, and Hooks](skills-and-rules.md) for the full reference.

---

## Next Steps

Now that you have a working KDD setup, explore these resources:

| Guide | What You'll Learn |
|-------|------------------|
| [Command Reference](commands.md) | All 9 `/kdd:*` commands with syntax, arguments, and examples |
| [Skills, Rules, and Hooks](skills-and-rules.md) | What activates automatically and when |
| [Validator Guide](validator-guide.md) | Deep dive into the three validation levels |
| [Workflows](workflows.md) | Common patterns: new feature, add UI, validate before PR, iterate |
| [Storybook Workflow](storybook-workflow.md) | Turn UI specs into Storybook wireframes |
| [Validation Tooling](validation-tooling.md) | AI analysis commands and CI/CD integration |
| [Graph RAG](graph-rag.md) | Node types and edges for semantic indexing |

### Common Next Actions

- **Design a UI component**: `/kdd:ui A card showing user profile with avatar`
- **Check layer dependencies**: `/kdd:validate-deps`
- **See all entities**: `/kdd:list-entities`
- **Generate a Storybook wireframe**: `/kdd:generate-story specs/03-experience/components/UI-UserCard.md`
- **Ask Claude to review quality**: "Review the User entity spec for completeness"
- **Find what's missing**: "What artifacts are missing for the account creation feature?"
