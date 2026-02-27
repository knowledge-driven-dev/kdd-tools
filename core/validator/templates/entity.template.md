---
# @file-pattern: ^[A-Z].+\.md$
# @path-pattern: 01-domain/entities/

kind: entity                  # @required @enum: entity|role|system|catalog
aliases:
  - Alias1
  - Alias2
# --- catalog-only fields (omit for other kinds) ---
# source: internal            # @enum: internal|external|standard
# scope: global               # @enum: global|tenant
# change-frequency: rare      # @enum: static|rare|periodic
---

# Entity Name <!-- title-is-name -->

<!--
  KIND VARIANTS:

  kind: entity  → Standard domain entity (Order, Product, Cart)
  kind: role    → Role/actor that interacts with the system (Customer, Admin)
  kind: system  → External system in UPPERCASE (STRIPE, WAREHOUSE)
  kind: catalog → Reference data / lookup table (CountryCode, DocumentType, GuardType)

  For external systems:
  - File name and title ALWAYS in UPPERCASE: STRIPE.md, WAREHOUSE.md
  - In text, reference the same way: [[STRIPE]], [[WAREHOUSE]]

  For catalogs:
  - Uncomment and fill source, scope, change-frequency in frontmatter
  - Sections States, Transitions and Lifecycle do not apply — omit them
  - Use Attributes to document the fields of each catalog entry
-->

## Description <!-- required -->

Clear description of what this entity represents in the domain. Include:
- Main purpose and role in the system
- Relationships with other entities (mentioned naturally in the text, not in a separate table)
- Distinctive characteristics

Relationships are expressed naturally: "Each X belongs to a [[User]]", "An X contains multiple [[OtherEntity|OtherEntities]]". The indexer will infer them automatically.

### Examples <!-- optional -->

Concrete examples that help understand the entity in a real context.

## Attributes <!-- required -->

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Unique identifier |
| `name` | string | Descriptive name |
| `status` | enum | Lifecycle status (see [[#States]]) |
| `reference_id` | uuid | Related [[OtherEntity]] |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last modification date |

## States <!-- optional, required-if: has lifecycle -->

| State | ID | Description |
|-------|----|-------------|
| **State1** | `state1` | Initial state of the entity |
| **State2** | `state2` | Intermediate state after action X |
| **State3** | `state3` | Final state, immutable |

### Transitions <!-- optional -->

- **State1 → State2**: Condition or event that triggers the transition
- **State2 → State3**: Another transition with its context

## Lifecycle <!-- optional -->

<!-- expects: mermaid:stateDiagram-v2 -->
```mermaid
stateDiagram-v2
    [*] --> state1: create

    state1 --> state1: edit
    state1 --> state2: action [guard]

    state2 --> state3: another action
    state2 --> state1: revert

    state3 --> [*]
```

## Invariants <!-- optional -->

| ID | Constraint |
|----|------------|
| INV-ENTITY-001 | Natural language description of the constraint |
| INV-ENTITY-002 | Another constraint that must always hold |
| INV-ENTITY-003 | Business rule associated with the entity |
