---
name: spec-writing
description: |
  Guidelines for writing KDD specification documents. Use this skill when:
  - Creating new specification files (entities, rules, commands, use cases, etc.)
  - Writing frontmatter for specification files
  - Defining required sections for each artifact type
  - Ensuring specifications are complete and well-structured
---

# Writing KDD Specifications

## Front-Matter by Type

All artifacts share a universal base of 3 attributes: `id`, `kind`, `status`.
No other attributes (`title`, `owner`, `tags`, `version`, `domain`, `billable`, etc.) belong in front-matter.

### Entity
```yaml
---
kind: entity             # @required @enum: entity|role|system|catalog
aliases: []              # Alternative names for search/indexing
# --- catalog-only fields ---
# source: internal       # @enum: internal|external|standard
# scope: global          # @enum: global|tenant
# change-frequency: rare # @enum: static|rare|periodic
---
```
> Entity uses filename as identity (PascalCase.md). No `id` field.

### Event (EVT)
```yaml
---
kind: event              # @required
---
```
> Event uses title as identity (EVT-Entity-Action). No `id` field.

### Business Rule (BR) / Business Policy (BP) / Cross-Policy (XP)
```yaml
---
id: BR-NNN-{Name}       # @required @pattern: ^(BR|BP|XP)-\d{3}$
kind: business-rule      # @required @enum: business-rule|business-policy|cross-policy
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Command (CMD)
```yaml
---
id: CMD-NNN              # @required @pattern: ^CMD-\d{3}$
kind: command            # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Query (QRY)
```yaml
---
id: QRY-NNN              # @required @pattern: ^QRY-\d{3}$
kind: query              # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Use Case (UC)
```yaml
---
id: UC-NNN               # @required @pattern: ^UC-\d{3}$
kind: use-case           # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Process (PROC)
```yaml
---
id: PROC-NNN             # @required @pattern: ^PROC-\d{3}$
kind: process            # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### UI View / UI Component
```yaml
---
kind: ui-view            # @required (or ui-component)
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### PRD
```yaml
---
id: PRD-Name             # @required @pattern: ^PRD-.+
kind: prd                # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### NFR
```yaml
---
id: NFR-Name             # @required @pattern: ^NFR-.+
kind: nfr                # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Requirement (REQ)
```yaml
---
id: REQ-NNN              # @required @pattern: ^REQ-\d{3}$
kind: requirement        # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
source: UC-NNN           # @pattern: ^UC-\d{3}$
---
```

### ADR
```yaml
---
id: ADR-NNNN             # @required @pattern: ^ADR-\d{4}$
kind: adr                # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
supersedes: []
superseded_by:
---
```

### Implementation Charter
```yaml
---
id: ARCH-CHARTER-XXXX    # @required
kind: implementation-charter
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
supersedes: []
---
```

### Objective (OBJ)
```yaml
---
id: OBJ-NNN              # @required @pattern: ^OBJ-\d{3}$
kind: objective          # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Value Unit (UV)
```yaml
---
id: UV-NNN               # @required @pattern: ^UV-\d{3}$
kind: value-unit         # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

### Release (REL)
```yaml
---
id: REL-NNN              # @required @pattern: ^REL-\d{3}$
kind: release            # @required
status: draft            # @required @enum: draft|review|approved|deprecated|superseded
---
```

## Required Sections by Type

### Entity
- `## Description` (required)
- `## Attributes` (required)
- `## States` (optional, if has lifecycle)
- `## Lifecycle` (optional, mermaid stateDiagram)
- `## Invariants` (optional)

### Command
- `## Purpose` (required)
- `## Input` (required, table)
- `## Preconditions` (required)
- `## Postconditions` (required)
- `## Rules Validated` (optional)
- `## Events` (optional)
- `## Possible Errors` (required, table)

### Query
- `## Purpose` (required)
- `## Input` (required, table)
- `## Output` (required, table — not TypeScript interface)
- `## Authorization` (required)
- `## Possible Errors` (required, table)

### Use Case
- `## Description` (required)
- `## Actors` (required)
- `## Preconditions` (required)
- `## Main Flow (Happy Path)` (required)
- `## Extensions / Alternative Flows` (optional)
- `## Postconditions` (required, with On Success / On Failure sub-sections)
- `## Business Rules` (optional)

### Business Rule (BR) / Business Policy (BP) / Cross-Policy (XP)
- `## Statement` (required)
- `## Rationale` (required)
- `## When Applies` (required)
- `## Violation Behavior` (required)
- `## Parameters` (BP only, optional)
- `## Formalization` (optional, EARS pattern)
- `## EARS Formalization` (XP only)
- `## Standard Behavior` (XP only)
- `## Examples` (required)

### UI View
- `## Purpose` (required)
- `## Navigation` (required)
- `## Layout` (required, ASCII wireframe)
- `## Components` (required)
- `## Data` (required)
- `## View States` (required)
- `## Behavior` (required)

### UI Component
- `## Purpose` (required)
- `## Data` (required)
- `## Structure` (required, ASCII wireframe)
- `## Actions` (required)
- `## Functional States` (required)

### Requirement (REQ)
- `## Summary` (optional)
- `## REQ-NNN.N: Name` (required, EARS + Gherkin)
- `## Traceability Matrix` (optional)

### NFR
- `## Goal` (required)
- `## Metrics` (required)
- `## Affected Use Cases` (optional)
- `## Trade-offs` (optional)

### ADR
- `## Context` (required)
- `## Decision` (required)
- `## Options Considered` (optional)
- `## Consequences` (required)

### Process
- `## Description` (required)
- `## Trigger` (required)
- `## Steps` (required)
- `## Compensation` (required)
- `## Outcome` (required)

## Writing Style

### Language Policy
- Section headings: **English** (`## Description`, `## Main Flow`)
- IDs and prefixes: **English** (`CMD-009`, `BR-001-MinOrderAmount`)
- Narrative content: **Any language** (users write spec content in their language)

### Capitalization
- Domain entities are ALWAYS capitalized in prose: `The Customer places an Order`
- First mention should be a wiki-link: `The [[Customer]] places an [[Order]]`

### Links
- Use wiki-links for all cross-references: `[[EntityName]]`
- Use display aliases for plurals: `[[Product|Products]]`
- Link to specific artifacts: `[[CMD-001-PlaceOrder]]`

### Tables
Use markdown tables for structured data:
```markdown
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
```

### Technology-Agnostic Principle
Layers 01-04 are technology-agnostic. No TypeScript interfaces, no framework references. Implementation details belong in `05-architecture/charter.md`.

### ASCII Wireframes
For UI specs, use ASCII art:
```
┌────────────────────────────┐
│  Header                    │
├────────────────────────────┤
│  Content Area              │
│  [Button]                  │
└────────────────────────────┘
```
