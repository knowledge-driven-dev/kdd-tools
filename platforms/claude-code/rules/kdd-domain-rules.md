---
paths:
  - specs/01-domain/rules/**
  - specs/domains/*/01-domain/rules/**
---

# Reglas de Negocio KDD

> Aplica cuando trabajas en `specs/01-domain/rules/`

## Tipos de Regla

| Tipo | Prefijo | Uso |
|------|---------|-----|
| Business Rule | `BR-` | Regla invariante, no configurable |
| Business Policy | `BP-` | Política configurable con parámetros |

## Nombrado de Archivo

Patrón: `BR-ENTIDAD-NNN.md` o `BP-ENTIDAD-NNN.md`

Ejemplos:
- `BR-RETO-001.md`
- `BR-SESION-003.md`
- `BP-CREDITOS-001.md`

## Frontmatter Requerido

```yaml
---
id: BR-ENTIDAD-NNN            # Obligatorio
kind: business-rule           # business-rule | business-policy
title: Título de la Regla     # Obligatorio
entity: NombreEntidad         # Entidad principal afectada
category: validation          # validation|limit|state|security|business|policy|data
severity: critical            # critical|high|medium|low
status: draft                 # draft|review|approved|deprecated
---
```

## Estructura del Documento

### Secciones Obligatorias

```markdown
# BR-ENTIDAD-NNN: TítuloDeLaRegla

## Statement
Descripción clara en lenguaje natural, comprensible por stakeholders
no técnicos. Mencionar entidades con wiki-links: [[Entidad]].

## Rationale
Razón de negocio. Explica el riesgo que previene o beneficio que protege.

## When Applies
Puntos del ciclo de vida donde se evalúa (crear, modificar, cambio de estado).

## Violation Behavior
Resultado esperado cuando falla: error visible, operación bloqueada, etc.

## Examples

### Valid Cases
- ✓ Ejemplo de escenario válido
- ✓ Otro escenario válido

### Invalid Cases
- ✗ Escenario inválido → comportamiento esperado
- ✗ Otro escenario inválido → comportamiento esperado
```

### Secciones Opcionales

```markdown
## Parameters (solo BP)
Parámetros configurables y valores por defecto.

## Formalization
WHEN/IF [condición],
the system SHALL [acción]
  AND SHALL NOT [prohibición].

## Implementation
## Notes
```

## Categorías

| Categoría | Descripción | Ejemplo |
|-----------|-------------|---------|
| `validation` | Validación de datos | Título requerido |
| `limit` | Límites numéricos | Máximo 6 personas |
| `state` | Transiciones de estado | Solo borrador puede editarse |
| `security` | Seguridad/permisos | Solo propietario puede eliminar |
| `business` | Lógica de negocio | Créditos insuficientes |
| `policy` | Política configurable | Días de retención |
| `data` | Integridad de datos | Referencias válidas |

## Severidad

| Nivel | Cuándo usar |
|-------|-------------|
| `critical` | Violación causa corrupción de datos o seguridad |
| `high` | Violación bloquea funcionalidad core |
| `medium` | Violación afecta experiencia pero hay workaround |
| `low` | Violación es cosmética o menor |

## Ejemplo Completo

```markdown
---
id: BR-RETO-001
kind: business-rule
title: Límite de Personas Sintéticas
entity: Reto
category: limit
severity: high
status: approved
---

# BR-RETO-001: Límite de Personas Sintéticas

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
