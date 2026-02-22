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

## Writing Style

### Capitalization
- Domain entities are ALWAYS capitalized in prose: `El Usuario crea un Reto`
- First mention should be a wiki-link: `El [[Usuario]] crea un [[Reto]]`

### Links
- Use wiki-links for all cross-references: `[[EntityName]]`
- Use display aliases for plurals: `[[Sesión|sesiones]]`
- Link to specific artifacts: `[[CMD-001-CreateChallenge]]`

### Tables
Use markdown tables for structured data:
```markdown
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID | Sí | Identificador único |
```

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
