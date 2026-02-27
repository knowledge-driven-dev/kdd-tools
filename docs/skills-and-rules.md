# Skills, Rules, and Hooks

kdd-tools extends Claude Code with three types of automatic context: **skills** (activated by conversation intent), **rules** (activated by file patterns), and **hooks** (callbacks on tool events). Together they ensure Claude has the right KDD knowledge at the right time — without you invoking any command.

---

## How They Work in Claude Code

| Mechanism | Trigger | What It Provides | Analogy |
|-----------|---------|------------------|---------|
| **Skill** | Claude detects intent (keywords, context) | A full prompt with methodology, process, or reference material | An expert joining the conversation |
| **Rule** | You open or edit a file matching a glob pattern | Scoped writing guidelines for that artifact type | A style guide for the file you're editing |
| **Hook** | A tool event fires (e.g., Write) | A pre/post check or reminder | A linter that runs on save |

### Skills

Skills are defined in `platforms/claude-code/skills/*/SKILL.md`. When Claude detects that your conversation matches a skill's activation triggers, it loads the skill's full prompt as context. You don't invoke skills directly — they activate automatically.

### Rules

Rules are defined in `platforms/claude-code/rules/*.md`. Each rule has a `globs` frontmatter field specifying which file paths trigger it. When you open or edit a matching file, Claude loads the rule to guide its writing.

### Hooks

Hooks are defined in `platforms/claude-code/hooks/hooks.json`. They run shell commands or prompt injections before or after specific Claude Code tool events.

---

## Skills Reference

| Skill | Activation Triggers | What It Does | Category |
|-------|-------------------|-------------|----------|
| **kdd-methodology** | Working in `/specs`, creating or modifying specs, understanding KDD structure | Provides comprehensive KDD v2.0 reference: folder structure, artifact types, layer dependencies, naming conventions, wiki-link syntax | Reference |
| **spec-writing** | Creating new spec files, writing frontmatter, defining sections | Provides frontmatter schemas for all artifact types and documents required sections with examples | Authoring |
| **kdd-author** | "create spec", "document feature", "new functionality", "I want the system to...", "I have an idea" | Conversational assistant that transforms vague ideas into structured KDD artifacts through a 5-phase guided dialogue (capture, classify, refine, validate, generate) | Authoring |
| **kdd-review** | "review spec", "is this well written", "validate documentation", "quality review", "prepare for implementation" | Reviews KDD documents across five dimensions: semantic quality, completeness, coherence, clarity, and actionability. Produces a report with critical/important findings and suggestions | Quality |
| **kdd-gaps** | "what's missing", "documentation gaps", "missing artifacts", "incomplete coverage", "undocumented cases" | Detects missing artifacts by analyzing layer dependencies. Identifies missing business rules, error cases, events, acceptance criteria, and UI specs with prioritization (critical/important/minor) | Quality |
| **kdd-trace** | "traceability", "requirements matrix", "how are they connected", "requirement coverage", "spec audit" | Builds and visualizes a traceability matrix between KDD layers (04→03→02→01). Shows coverage analysis, orphaned artifacts, and can generate Mermaid diagrams | Quality |
| **kdd-iterate** | "change requirement", "update spec", "the limit should be", "no longer applies", "add error case", "rename entity", "apply feedback" | Applies changes to existing KDD artifacts. Analyzes impact, identifies cascade effects, evaluates inconsistency risks, and propagates modifications across related documents | Authoring |
| **kdd-fix** | "fix spec", "fix document", "validation errors", "broken links", "incomplete frontmatter", "normalize format" | Automatically corrects technical problems: broken wiki-links, missing frontmatter fields, naming convention violations, unlinked entity mentions. Reports issues needing manual intervention separately | Quality |

### Skills vs Commands

Skills and commands serve different purposes:

| Aspect | Skills | Commands |
|--------|--------|----------|
| **Invocation** | Automatic — Claude activates them based on conversation context | Manual — you type `/kdd:command` |
| **Scope** | Broad context (methodology knowledge, writing guidelines) | Specific action (validate files, generate story) |
| **Output** | Influences Claude's behavior and responses | Produces a concrete artifact or report |
| **Example** | `kdd-author` activates when you say "I want to add a feature" | `/kdd:feature` explicitly starts the discovery process |

In practice, skills often activate *during* command execution. For example, running `/kdd:feature` will trigger the `kdd-methodology` and `spec-writing` skills to provide Claude with the right context.

---

## Rules Reference

Rules provide artifact-specific writing guidelines. They activate when you edit files matching their glob patterns.

| Rule File | Glob Pattern | KDD Layer | What It Provides |
|-----------|-------------|-----------|-----------------|
| `kdd-writing.md` | `specs/**/*.md` | Cross-cutting | Language policy (English headings), capitalization rules, wiki-link conventions, EARS keywords, fluid documentation philosophy |
| `kdd-domain-entities.md` | `specs/01-domain/entities/**` | 01-domain | Entity types (entity, role, system, catalog), required frontmatter, sections (description, attributes, states, lifecycle, invariants) |
| `kdd-domain-events.md` | `specs/01-domain/events/**` | 01-domain | Event naming (EVT-Entity-Action), required frontmatter, sections (description, emitter, payload, subscribers) |
| `kdd-domain-rules.md` | `specs/01-domain/rules/**`, `specs/02-behavior/policies/**` | 01-domain, 02-behavior | Three rule types (BR, BP, XP), required sections (statement, rationale, when applies, violation behavior, examples), EARS formalization |
| `kdd-behavior-commands.md` | `specs/02-behavior/commands/**` | 02-behavior | Command naming (CMD-NNN), required sections (purpose, input table, preconditions, postconditions, errors with ERxx codes) |
| `kdd-behavior-queries.md` | `specs/02-behavior/queries/**` | 02-behavior | Query naming (QRY-NNN), required sections (purpose, input, output table, authorization, errors) |
| `kdd-behavior-usecases.md` | `specs/02-behavior/use-cases/**` | 02-behavior | Use case naming (UC-NNN), required sections (description, actors, preconditions, main flow, postconditions), optional extensions |
| `kdd-experience-views.md` | `specs/03-experience/**/VIEW-*.md` | 03-experience | View naming (VIEW-Name), required sections (purpose, navigation, layout with ASCII wireframe, components, view states, behavior) |
| `kdd-experience-flows.md` | `specs/03-experience/**/FLOW-*.md` | 03-experience | Flow naming (FLOW-Name), required sections (description, actor, flow diagram in Mermaid, steps, decision points, terminal states) |
| `kdd-experience-components.md` | `specs/03-experience/**/UI-*.md`, `**/COMP-*.md`, `**/MODAL-*.md` | 03-experience | Component naming (UI/COMP/MODAL-Name), required sections (description, props table, ASCII wireframe, states, interactions) |
| `kdd-shared-policies.md` | `specs/_shared/**`, `specs/domains/*/_manifest.yaml` | Cross-cutting | Multi-domain structure, shared policies, domain manifests, cross-domain wiki-link syntax, cross-policy naming (XP-NNN) |

### How Rules Compose

When you edit a file, multiple rules can activate simultaneously:

- **`kdd-writing.md`** always activates for any file under `specs/` (general writing conventions)
- **One type-specific rule** activates based on the file's location (e.g., `kdd-domain-entities.md` for entity files)
- **`kdd-shared-policies.md`** activates additionally for shared or cross-domain files

This layering means Claude always knows both the general KDD conventions *and* the specific requirements for the artifact type you're editing.

---

## Hooks

kdd-tools defines two hooks that run when Claude writes to spec files:

### PreToolUse: Write

**Condition**: File path contains `specs/`

**What it does**: Before writing a spec file, reminds Claude to:
1. Capitalize domain entities in prose
2. Use wiki-links `[[Entity]]` on first mention
3. Match frontmatter to the artifact type schema
4. Include required sections

### PostToolUse: Write

**Condition**: File path contains `specs/`

**What it does**: After writing a spec file, reminds Claude to:
1. Verify all wiki-links `[[]]` are valid
2. Check frontmatter is complete
3. Ensure layer dependencies are respected (lower layers cannot reference higher layers)
4. Suggest running `/kdd:fix-spec` if issues are found

### How Hooks Differ from Rules

| Aspect | Hooks | Rules |
|--------|-------|-------|
| **When** | Before/after a tool action (Write) | When a file is opened/edited |
| **Scope** | All specs (broad path match) | Specific artifact types (precise glob) |
| **Purpose** | Quick checklist reminder | Deep writing guidelines |
| **Format** | Short prompt injection | Full markdown document |

---

## See Also

- [Command Reference](commands.md) — all `/kdd:*` commands
- [Workflows](workflows.md) — how skills, rules, and commands compose
- [Getting Started](getting-started.md) — first-time setup
