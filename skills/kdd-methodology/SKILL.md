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
├── _kdd.yaml              # Meta: KDD version (currently "2.0")
├── 00-requirements/       # INPUT - Business context (feeds design)
│   ├── PRD.md
│   ├── objectives/        # OBJ-NNN-*.md
│   ├── value-units/       # UV-NNN-*.md
│   └── releases/          # REL-NNN-*.md
├── 01-domain/             # BASE - Domain model (foundation)
│   ├── entities/          # Entity.md (PascalCase)
│   ├── events/            # EVT-Entity-Action.md
│   └── rules/             # BR-NNN-*.md (Business Rules)
├── 02-behavior/           # ORCHESTRATION - How the system behaves
│   ├── commands/          # CMD-NNN-*.md
│   ├── queries/           # QRY-NNN-*.md
│   ├── processes/         # PROC-NNN-*.md
│   ├── policies/          # BP-NNN-*.md, XP-NNN-*.md
│   └── use-cases/         # UC-NNN-*.md
├── 03-experience/         # PRESENTATION - How users see it
│   ├── views/             # UI-*.md
│   └── components/        # Reusable UI components
├── 04-verification/       # VALIDATION - How we test it
│   ├── criteria/          # REQ-NNN-*.md
│   └── examples/          # *.feature (BDD)
└── 05-architecture/       # TECHNICAL - How we build it (orthogonal)
    ├── decisions/         # ADR-NNNN-*.md
    └── charter.md         # Implementation Charter
```

## Layer Dependencies

```
┌───────────────────────────────────────────────────────────────┐
│  00-requirements   (PRD, objectives, value-units, releases)   │
│  INPUT: Feeds design. Not part of the layer dependency flow.  │
└───────────────────────────────────────────────────────────────┘
                              ↓ feeds
┌───────────────────────────────────────────────────────────────┐
│  04-verification   (tests, criteria)                          │
│      ↓ references                                             │
├───────────────────────────────────────────────────────────────┤
│  03-experience     (views, components)                        │
│      ↓ references                                             │
├───────────────────────────────────────────────────────────────┤
│  02-behavior       (UC, CMD, QRY, XP, processes)              │
│      ↓ references                                             │
├───────────────────────────────────────────────────────────────┤
│  01-domain         (entities, events, rules)   ← BASE         │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  05-architecture   (ADR, Implementation Charter)              │
│  ORTHOGONAL: Does not participate in the 01→04 chain.         │
└───────────────────────────────────────────────────────────────┘
```

**Rule**: Higher layers (04→03→02→01) CAN reference lower layers. Lower layers SHOULD NOT reference higher layers.

> **00-requirements** is outside the dependency flow — it feeds design and can mention domain concepts.
> **05-architecture** is orthogonal — records HOW we build, not WHAT we build.

## Artifact Types & IDs

| Type | Prefix | Pattern | Location |
|------|--------|---------|----------|
| Objective | OBJ | `OBJ-NNN-{Name}.md` | `00-requirements/objectives/` |
| Value Unit | UV | `UV-NNN-{Name}.md` | `00-requirements/value-units/` |
| Release | REL | `REL-NNN-{Name}.md` | `00-requirements/releases/` |
| Entity | - | `PascalCase.md` | `01-domain/entities/` |
| Event | EVT | `EVT-{Entity}-{Action}.md` | `01-domain/events/` |
| Business Rule | BR | `BR-NNN-{Name}.md` | `01-domain/rules/` |
| Business Policy | BP | `BP-NNN-{Name}.md` | `02-behavior/policies/` |
| Cross-Policy | XP | `XP-NNN-{Name}.md` | `02-behavior/policies/` |
| Command | CMD | `CMD-NNN-{Name}.md` | `02-behavior/commands/` |
| Query | QRY | `QRY-NNN-{Name}.md` | `02-behavior/queries/` |
| Process | PROC | `PROC-NNN-{Name}.md` | `02-behavior/processes/` |
| Use Case | UC | `UC-NNN-{Name}.md` | `02-behavior/use-cases/` |
| UI View | UI | `UI-{Name}.md` | `03-experience/views/` |
| UI Component | - | `{ComponentName}.md` | `03-experience/components/` |
| Requirement | REQ | `REQ-NNN-{Name}.md` | `04-verification/criteria/` |
| NFR | NFR | `NFR-{Name}.md` | `00-requirements/` |
| ADR | ADR | `ADR-NNNN-{Title}.md` | `05-architecture/decisions/` |
| Impl Charter | - | `charter.md` | `05-architecture/` |

## Wiki-Link Syntax

```markdown
[[Order]]                      # Link to entity
[[Product|products]]           # Link with display alias
[[BR-001-MinOrderAmount]]      # Link to rule
[[CMD-001-PlaceOrder]]         # Link to command
[[UC-001-PlaceOrder]]          # Link to use case
[[XP-001-BillingValidation]]   # Link to cross-policy
```

## Naming Conventions

### Domain Entities in Text
- **Always capitalize** domain entities: `The Customer places an Order`
- First mention → wiki-link: `[[Order]]`
- Plurals with alias: `[[Product|Products]]`
- In code → lowercase: `const order = await placeOrder()`

### File Names
- Entities: `PascalCase.md` (e.g., `Order.md`, `CartItem.md`)
- Everything else: Use prefix pattern (e.g., `CMD-001-PlaceOrder.md`)

## Status Lifecycle

```
draft → review → approved → deprecated
                         ↘ superseded
```

- `draft`: Work in progress, not source of truth
- `review`: Pending approval
- `approved`: Official source of truth
- `deprecated`: Obsolete, link to replacement
- `superseded`: Replaced by another version (ADRs, Charters)

## Language Policy

- Section headings: English (`## Description`, `## Main Flow`)
- IDs and prefixes: English (`CMD-009`, `BR-001-MinOrderAmount`)
- Narrative content: Any language (users write specs in their language)

## Templates

All templates are available in the `templates/` directory of the kdd-tools core.

| Template | For |
|----------|-----|
| `entity.template.md` | Domain entities, roles, systems, catalogs |
| `event.template.md` | Domain events |
| `rule.template.md` | Business rules (BR), policies (BP), cross-policies (XP) |
| `command.template.md` | Commands (CQRS write) |
| `query.template.md` | Queries (CQRS read) |
| `process.template.md` | Business processes |
| `use-case.template.md` | Use cases |
| `ui-view.template.md` | UI views/pages |
| `ui-component.template.md` | Reusable UI components |
| `prd.template.md` | Product Requirements Document |
| `nfr.template.md` | Non-functional requirements |
| `adr.template.md` | Architecture Decision Records |
| `requirement.template.md` | Functional requirements (EARS) |
| `value-unit.template.md` | Value Units |
| `release.template.md` | Release plans |
| `implementation-charter.template.md` | Tech stack and implementation guidelines |
| `objective.template.md` | Business objectives |

## Detailed Reference

For complete front-matter schemas, required sections by type, and naming conventions, see:
`./references/kdd.md`
