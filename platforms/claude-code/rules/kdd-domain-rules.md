---
paths:
  - specs/01-domain/rules/**
  - specs/domains/*/01-domain/rules/**
  - specs/02-behavior/policies/**
  - specs/domains/*/02-behavior/policies/**
---

# Reglas de Negocio KDD

> Aplica cuando trabajas en `specs/01-domain/rules/` o `specs/02-behavior/policies/`

## Tipos de Regla

| Tipo | Prefijo | Ubicación | Uso |
|------|---------|-----------|-----|
| Business Rule | `BR-` | `01-domain/rules/` | Regla invariante, no configurable |
| Business Policy | `BP-` | `02-behavior/policies/` | Política configurable con parámetros |
| Cross-Policy | `XP-` | `02-behavior/policies/` | Política que abarca múltiples dominios o entidades |

## Nombrado de Archivo

Patrón: `{PREFIX}-NNN-{Name}.md`

Ejemplos:
- `BR-001-PersonaLimit.md`
- `BR-003-SessionReady.md`
- `BP-001-CreditRetention.md`
- `XP-001-CrossDomainAudit.md`

## Frontmatter Requerido

```yaml
---
id: BR-001-PersonaLimit       # Obligatorio, matches filename
kind: business-rule           # business-rule | business-policy | cross-policy
status: draft                 # draft|review|approved|deprecated|superseded
---
```

## Estructura del Documento

### Required Sections

```markdown
# BR-NNN-Name

## Statement
Clear description in natural language, understandable by non-technical
stakeholders. Reference entities with wiki-links: [[Entity]].

## Rationale
Business reason. Explain the risk it prevents or the benefit it protects.

## When Applies
Lifecycle points where the rule is evaluated (create, update, state change).

## Violation Behavior
Expected result on failure: visible error, blocked operation, etc.

## Examples

### Valid Cases
- ✓ Valid scenario example
- ✓ Another valid scenario

### Invalid Cases
- ✗ Invalid scenario → expected behavior
- ✗ Another invalid scenario → expected behavior
```

### Optional Sections

```markdown
## Parameters (BP and XP only)
Configurable parameters and default values.

## Formalization
WHEN/IF [condition],
the system SHALL [action]
  AND SHALL NOT [prohibition].

## Notes
```

## Ejemplo Completo

```markdown
---
id: BR-001-PersonaLimit
kind: business-rule
status: approved
---

# BR-001-PersonaLimit

## Statement

Un [[Reto]] debe tener entre 3 y 6 [[Persona Sintética|Personas Sintéticas]]
para poder iniciar una [[Sesión]].

## Rationale

El [[Método Seis Sombreros]] requiere diversidad de perspectivas para ser
efectivo. Menos de 3 personas no genera suficiente diversidad; más de 6
hace las sesiones inmanejables.

## When Applies

- Al intentar cambiar estado de `borrador` a `preparado`
- Al intentar iniciar una Sesión

## Violation Behavior

El Sistema muestra error: "El Reto debe tener entre 3 y 6 Personas Sintéticas"
y bloquea la operación.

## Formalization

WHEN the Usuario attempts to prepare a Reto,
IF the Reto has fewer than 3 or more than 6 Personas Sintéticas,
the system SHALL reject the operation
  AND SHALL display error message.

## Examples

### Valid Cases
- ✓ Reto con 3 Personas → puede prepararse
- ✓ Reto con 6 Personas → puede prepararse

### Invalid Cases
- ✗ Reto con 2 Personas → error "mínimo 3 personas"
- ✗ Reto con 7 Personas → error "máximo 6 personas"
```
