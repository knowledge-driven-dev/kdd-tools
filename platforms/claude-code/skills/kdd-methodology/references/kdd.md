# KDD Model Reference (Agent Context)

> **Purpose**: Complete reference for subagents working with KDD specifications.
> For human documentation, see `${CLAUDE_PLUGIN_ROOT}/../kdd/docs/introduction.md`.

## Core Principle

**Specification > Code**: Docs are the source of truth; code is derived/regenerable.

---

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

---

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

---

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

---

## Front-Matter by Type

### Entity
```yaml
---
aliases: []          # Optional alternative names
tags: [entity]       # Required: must contain "entity"
---
```

### Command (CMD)
```yaml
---
id: CMD-NNN          # Required, pattern: ^CMD-\d{3}$
title: CommandName   # Required
type: command        # Literal
status: draft        # draft|review|approved|deprecated
tags: [command]
---
```

### Query (QRY)
```yaml
---
id: QRY-NNN          # Required, pattern: ^QRY-\d{3}$
title: QueryName     # Required
type: query          # Literal
status: draft        # draft|review|approved|deprecated
tags: [query]
---
```

### Use Case (UC)
```yaml
---
id: UC-NNN           # Required, pattern: ^UC-\d{3}$
version: 1           # Number, default: 1
status: draft        # draft|proposed|approved|deprecated
actor: ActorName     # Required
tags: [use-case]
---
```

### Business Rule (BR/BP)
```yaml
---
id: BR-ENTITY-NNN    # Required
title: RuleName      # Required
type: business-rule  # Literal
status: draft        # draft|review|approved|deprecated
priority: medium     # low|medium|high|critical
tags: [rule]
---
```

### Event (EVT)
```yaml
---
id: EVT-NNN          # Optional
title: EventName     # Required
type: event          # Literal
status: draft
tags: [event]
---
```

### UI View
```yaml
---
tags: [ui/view]
status: draft
version: "1.0"
links:
  entities: []       # Domain entities used
  use-cases: []      # UCs this view implements
  components: []     # UI components used
storybook:
  category: "Views"
  auto-generate: true
---
```

---

## Naming Conventions

### Domain Entities in Text
- **Always capitalize** domain entities: `El Usuario crea un Reto`
- First mention → wiki-link: `[[Reto]]`
- Plurals with alias: `[[Sesión|Sesiones]]`
- In code → lowercase: `const reto = await createReto()`

### File Names
- Entities: `PascalCase.md` (e.g., `Persona Sintética.md`)
- Everything else: Use prefix pattern (e.g., `CMD-001-CreateChallenge.md`)

---

## Required Sections by Type

### Entity
- `## Descripción` (required)
- `## Atributos` (required)
- `## Ciclo de Vida` (optional, mermaid stateDiagram)
- `## Relaciones` (optional)
- `## Invariantes` (optional)

### Command
- `## Purpose` (required)
- `## Input` (required, table)
- `## Preconditions` (required)
- `## Postconditions` (required)
- `## Possible Errors` (required, table)

### Use Case
- `## Descripción` (required)
- `## Actores` (required)
- `## Precondiciones` (required)
- `## Flujo Principal` (required)
- `## Postcondiciones` (required)

### Business Rule
- `## Declaración` (required)
- `## Fórmula / Lógica` (optional)
- `## Entidades involucradas` (required, links)
- `## Excepciones` (optional)

### UI View
- `## Descripción` (required)
- `## Layout` (required, ASCII wireframe)
- `## Componentes Utilizados` (required)
- `## Estados de la Vista` (required: loading, empty, error, success)
- `## Comportamiento` (required)

---

## Wiki-Link Syntax

```markdown
[[Reto]]                       # Link to entity
[[Sesión|sesiones]]            # Link with display alias
[[BR-RETO-001]]                # Link to rule
[[CMD-001-CreateChallenge]]    # Link to command
[[UC-001-CrearReto]]           # Link to use case
```

---

## Status Lifecycle

```
draft → review → approved → deprecated
```

- `draft`: Work in progress, not source of truth
- `review`: Pending approval
- `approved`: Official source of truth
- `deprecated`: Obsolete, link to replacement

---

## Templates

All templates are in `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/`:

| Template | For |
|----------|-----|
| `entity.template.md` | Domain entities |
| `event.template.md` | Domain events |
| `rule.template.md` | Business rules |
| `command.template.md` | Commands (CQRS write) |
| `query.template.md` | Queries (CQRS read) |
| `process.template.md` | Business processes |
| `use-case.template.md` | Use cases |
| `ui-view.template.md` | UI views/pages |
| `ui-flow.template.md` | UI navigation flows |
| `ui-component.template.md` | Reusable UI components |
| `prd.template.md` | Product Requirements |
| `adr.template.md` | Architecture Decisions |
| `requirement.template.md` | Functional requirements |

---

## Validation

```bash
bun run validate:specs   # Validate all specs
```

Checks: front-matter schema, broken links, required sections.

---

## Key References

- Human docs: `${CLAUDE_PLUGIN_ROOT}/../kdd/docs/introduction.md`
- Writing conventions: `${CLAUDE_PLUGIN_ROOT}/../kdd/docs/writing-conventions.md`
- UI→Storybook flow: `${CLAUDE_PLUGIN_ROOT}/../kdd/docs/specs-to-storybook.md`
- Validation details: `${CLAUDE_PLUGIN_ROOT}/../kdd/docs/validation.md`
