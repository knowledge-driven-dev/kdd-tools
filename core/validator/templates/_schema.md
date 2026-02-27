# KDD Template Guide

This directory contains the canonical templates for each type of specification document.

## Template structure

Each template uses a special format that allows the validator to extract:
1. **Frontmatter schema** - From the YAML block with annotations
2. **Required sections** - From headings marked with `<!-- required -->`
3. **Expected content** - From blocks marked with `<!-- expects: type -->`

## Annotation conventions

### Frontmatter

Only 3 annotations are used:

```yaml
---
id: UC-NNN           # @required @pattern: ^UC-\d{3}$
kind: use-case       # @required
status: draft        # @required @enum: draft|review|approved|deprecated|superseded
source: UC-NNN       # @pattern: ^UC-\d{3}$
---
```

- `@required` — field is mandatory
- `@enum: value1|value2` — allowed values
- `@pattern: ^REGEX$` — ID format validation

### Sections

```markdown
## Description <!-- required -->

## Main Flow <!-- required -->

## Extensions <!-- optional -->
```

### Expected content

```markdown
## Lifecycle

<!-- expects: mermaid:stateDiagram-v2 -->

## Example

<!-- expects: json -->
```

## Template files

| File | Type | Description |
|------|------|-------------|
| `entity.template.md` | entity | Domain entities (see variants below) |
| `event.template.md` | event | Domain events |
| `rule.template.md` | rule | Business rules (BR), policies (BP), and cross-policies (XP) |
| `use-case.template.md` | use-case | Use cases (Cockburn-lite) |
| `command.template.md` | command | CQRS commands (state-changing) |
| `query.template.md` | query | CQRS queries (read-only) |
| `process.template.md` | process | Processes (BPMN-lite) |
| `requirement.template.md` | requirement | EARS requirements |
| `prd.template.md` | prd | Product Requirements Document |
| `nfr.template.md` | nfr | Non-functional requirements |
| `adr.template.md` | adr | Architecture Decision Records |
| `value-unit.template.md` | value-unit | Value Units (end-to-end deliverables) |
| `release.template.md` | release | Release plans (group Value Units) |
| `implementation-charter.template.md` | implementation-charter | Tech stack and implementation guidelines |
| `ui-view.template.md` | ui-view | Pages/screens |
| `ui-component.template.md` | ui-component | Reusable UI components |
| `_manifest.template.yaml` | manifest | Domain manifest (multi-domain) |

### entity.template.md variants

The entity template supports multiple `kind` values:

| Kind | Use | Example | Naming convention |
|------|-----|---------|-------------------|
| `entity` | Domain entity with lifecycle | Order, Cart, Product | PascalCase: `Order.md` |
| `role` | Role/actor that interacts with the system | Customer, Admin | PascalCase: `Customer.md` |
| `system` | External system / integration | STRIPE, WAREHOUSE | UPPERCASE: `STRIPE.md` |
