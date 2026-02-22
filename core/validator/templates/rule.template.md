---
# @type: rule
# @description: Regla de negocio (Business Rule BR-* o Business Policy BP-*)
# @file-pattern: ^(BR|BP)-[A-Z]+-\d{3}\.md$
# @path-pattern: domain/rules/

id: BR-ENTITY-NNN             # @required @pattern: ^(BR|BP)-[A-Z]+-\d{3}$
title: Rule Title             # @required
type: business-rule           # @enum: business-rule|business-policy
entity: EntityName            # @required - Entidad principal afectada
category: validation          # @enum: validation|limit|state|security|business|policy|data
severity: critical            # @enum: critical|high|medium|low
status: draft                 # @enum: draft|review|approved|deprecated @default: draft
owner: "@team"                # @optional
created: "2024-01-01"         # @optional
tags:                         # @type: array
  - rule
---

# BR-ENTITY-NNN: RuleTitle <!-- required pattern: ^(BR|BP)-[A-Z]+-\d{3}: -->

## Declaración <!-- required -->

Clear statement of the business rule in natural language. This should be understandable by non-technical stakeholders.

## Entidades Relacionadas <!-- required -->

- [[Entity1]] - How this entity is affected
- [[Entity2]] - Role in this rule

## Formalización EARS <!-- required -->

```
IF/WHEN/WHILE [condition],
the system SHALL [action]
  AND SHALL [additional action]
  AND SHALL NOT [prohibited action].
```

## Ejemplos <!-- required -->

### Casos Válidos
- ✓ Example of valid scenario
- ✓ Another valid scenario

### Casos Inválidos
- ✗ Example of invalid scenario → expected behavior
- ✗ Another invalid scenario → expected behavior

## Casos de Uso Relacionados <!-- optional -->

- [[UC-NNN-UseCaseName]]
- [[CMD-NNN-CommandName]]

## Implementación <!-- optional -->

```typescript
// Suggested implementation approach
function validateRule(input: Input): void {
  if (!condition) {
    throw new BusinessRuleError('BR-ENTITY-NNN', 'Error message')
  }
}
```

## Notas <!-- optional -->

Additional context, edge cases, or implementation considerations.
