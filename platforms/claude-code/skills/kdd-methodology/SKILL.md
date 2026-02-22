---
name: kdd-methodology
description: |
  KDD (Knowledge-Driven Development) methodology reference. Use this skill when:
  - Creating or modifying specification files in /specs
  - Working with domain entities, events, rules, commands, queries, use cases, or UI specs
  - Needing to understand KDD folder structure and conventions
  - Writing wiki-links [[]] to connect specifications
  - Validating layer dependencies in specifications
---

# KDD Methodology Reference

## Core Principle

**Specification > Code**: Documentation is the source of truth; code is derived/regenerable.

## Folder Structure (`/specs`)

```
/specs
├── 00-inbox/              # Unprocessed ideas
├── 01-problem/            # WHY - Business context
│   ├── PRD.md
│   └── decisions/         # ADR-NNN-*.md
├── 02-domain/             # WHAT EXISTS - Domain model
│   ├── entities/          # Entity.md (PascalCase)
│   ├── events/            # EVT-*.md
│   └── rules/             # BR-*-NNN.md, BP-*-NNN.md
├── 03-capabilities/       # WHAT IT CAN DO - Operations
│   ├── commands/          # CMD-NNN-*.md
│   ├── queries/           # QRY-NNN-*.md
│   └── processes/         # PROC-NNN-*.md
├── 04-interaction/        # HOW USERS USE IT
│   ├── use-cases/         # UC-NNN-*.md
│   ├── flows/             # Flow-*.md
│   └── views/             # UI-*.md
└── 05-verification/       # HOW WE TEST IT
    ├── criteria/          # REQ-NNN-*.md
    ├── examples/          # *.feature (BDD)
    └── contracts/         # API specs
```

## Layer Dependencies

```
┌─────────────────────────────────────────┐
│  05-verification   (tests, criteria)    │
│      ↓ references                       │
├─────────────────────────────────────────┤
│  04-interaction    (use-cases, UI)      │
│      ↓ references                       │
├─────────────────────────────────────────┤
│  03-capabilities   (commands, queries)  │
│      ↓ references                       │
├─────────────────────────────────────────┤
│  02-domain         (entities, rules)    │
│      ↓ references                       │
├─────────────────────────────────────────┤
│  01-problem        (PRD, decisions)     │
│      ✗ references nothing               │
└─────────────────────────────────────────┘
```

**Rule**: Higher layers CAN reference lower layers. Lower layers CANNOT reference higher layers.

## Artifact Types & IDs

| Type | Prefix | Pattern | Location |
|------|--------|---------|----------|
| Entity | - | `PascalCase.md` | `02-domain/entities/` |
| Event | EVT | `EVT-{Entity}-{Action}.md` | `02-domain/events/` |
| Business Rule | BR | `BR-{ENTITY}-NNN.md` | `02-domain/rules/` |
| Business Policy | BP | `BP-{TOPIC}-NNN.md` | `02-domain/rules/` |
| Command | CMD | `CMD-NNN-{Name}.md` | `03-capabilities/commands/` |
| Query | QRY | `QRY-NNN-{Name}.md` | `03-capabilities/queries/` |
| Process | PROC | `PROC-NNN-{Name}.md` | `03-capabilities/processes/` |
| Use Case | UC | `UC-NNN-{Name}.md` | `04-interaction/use-cases/` |
| UI View | UI | `UI-{Name}.md` | `04-interaction/views/` |
| Requirement | REQ | `REQ-NNN-{Name}.md` | `05-verification/criteria/` |
| ADR | ADR | `ADR-NNNN-{Title}.md` | `01-problem/decisions/` |

## Wiki-Link Syntax

```markdown
[[Reto]]                       # Link to entity
[[Sesión|sesiones]]            # Link with display alias
[[BR-RETO-001]]                # Link to rule
[[CMD-001-CreateChallenge]]    # Link to command
[[UC-001-CrearReto]]           # Link to use case
```

## Naming Conventions

### Domain Entities in Text
- **Always capitalize** domain entities: `El Usuario crea un Reto`
- First mention → wiki-link: `[[Reto]]`
- Plurals with alias: `[[Sesión|Sesiones]]`
- In code → lowercase: `const reto = await createReto()`

### File Names
- Entities: `PascalCase.md` (e.g., `Persona Sintética.md`)
- Everything else: Use prefix pattern (e.g., `CMD-001-CreateChallenge.md`)

## Status Lifecycle

```
draft → review → approved → deprecated
```

- `draft`: Work in progress, not source of truth
- `review`: Pending approval
- `approved`: Official source of truth
- `deprecated`: Obsolete, link to replacement

## Templates Location

All templates are in `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/`

## Detailed Reference

For complete front-matter schemas, required sections by type, and naming conventions, see:
`./references/kdd.md`

## Human Documentation

For human-readable documentation, see `${CLAUDE_PLUGIN_ROOT}/../kdd/docs/`
