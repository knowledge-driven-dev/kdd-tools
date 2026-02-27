---
paths:
  - specs/02-behavior/queries/**
  - specs/domains/*/02-behavior/queries/**
---

# Queries CQRS KDD

> Aplica cuando trabajas en `specs/02-behavior/queries/`

## Concepto

Una **Query** es una operación de **solo lectura** (CQRS).
No modifica estado, solo recupera datos.

## Nombrado de Archivo

Patrón: `QRY-NNN-NombreDeLaQuery.md`

Ejemplos:
- `QRY-001-ObtenerReto.md`
- `QRY-002-ListarRetosUsuario.md`
- `QRY-003-BuscarSesiones.md`

## Frontmatter Requerido

```yaml
---
id: QRY-NNN                   # Obligatorio
kind: query                   # Literal
status: draft                 # draft|review|approved|deprecated|superseded
---
```

## Estructura del Documento

### Secciones Obligatorias

```markdown
# QRY-NNN: NombreQuery

## Purpose
Descripción de qué datos recupera y casos de uso principales.

## Input
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| userId | UUID | Yes | Usuario autenticado |
| retoId | UUID | Yes | Reto existente |

## Output
| Field | Type | Description |
|-------|------|-------------|
| id | string | Identificador único |
| titulo | string | Título del recurso |
| status | RetoStatus | Estado actual |

## Authorization
- Usuario debe estar autenticado
- Usuario solo ve sus propios recursos (excepto admin)

## Possible Errors
| Code | Condition | Message |
|------|-----------|---------|
| QRY-001-E01 | No encontrado | "Recurso no encontrado" |
| QRY-001-E02 | Sin acceso | "Acceso denegado" |
```

### Secciones Opcionales

```markdown
## Filters
| Filter | Type | Description |
|--------|------|-------------|
| status | enum | Filtrar por estado |
| dateFrom | date | Fecha inicio |

## Sorting
| Field | Default | Description |
|-------|---------|-------------|
| createdAt | desc | Por fecha creación |

## Pagination
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | number | 1 | - |
| limit | number | 20 | 100 |

## Performance
| Metric | Target |
|--------|--------|
| Response time | < 200ms |

## Caching
| Strategy | TTL | Invalidation |
|----------|-----|--------------|
| Per-user | 5 min | On related command |

## Example Response
## Use Cases That Invoke It
## Implementation Notes
```

## Tipos de Query

| Tipo | Patrón nombre | Retorna |
|------|---------------|---------|
| Get single | `ObtenerX` | Un objeto o error |
| List | `ListarX` | Array paginado |
| Search | `BuscarX` | Array filtrado |
| Count | `ContarX` | Número |
| Exists | `ExisteX` | Boolean |

## Output: Patrones Comunes

### Single Entity

| Field | Type | Description |
|-------|------|-------------|
| id | string | Identificador único |
| titulo | string | Título del reto |
| descripcion | string | Descripción del reto |
| status | RetoStatus | Estado actual |
| createdAt | string | Fecha de creación (ISO-8601) |

### Paginated List

| Field | Type | Description |
|-------|------|-------------|
| data | RetoSummary[] | Lista de resultados |
| pagination.page | number | Página actual |
| pagination.limit | number | Resultados por página |
| pagination.total | number | Total de resultados |
| pagination.totalPages | number | Total de páginas |

## Errores: Convención de Códigos

Patrón: `QRY-NNN-EXX`

Errores comunes:
- `QRY-XXX-E01` → No encontrado
- `QRY-XXX-E02` → Sin autorización
- `QRY-XXX-E03` → Parámetros inválidos

## Ejemplo Completo

```markdown
---
id: QRY-002
kind: query
status: approved
---

# QRY-002: ListarRetosUsuario

## Purpose

Recupera la lista paginada de [[Reto|Retos]] del [[Usuario]] actual,
con filtros opcionales por estado.

## Input

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| userId | UUID | Yes | Usuario autenticado |

## Output

| Field | Type | Description |
|-------|------|-------------|
| data[].id | string | Identificador del reto |
| data[].titulo | string | Título del reto |
| data[].status | RetoStatus | Estado actual |
| data[].personasCount | number | Cantidad de personas |
| data[].sesionesCount | number | Cantidad de sesiones |
| data[].createdAt | string | Fecha de creación (ISO-8601) |
| pagination.page | number | Página actual |
| pagination.limit | number | Resultados por página |
| pagination.total | number | Total de resultados |
| pagination.totalPages | number | Total de páginas |

## Filters

| Filter | Type | Description |
|--------|------|-------------|
| status | enum | `borrador`, `preparado`, `en_analisis`, `terminado` |

## Sorting

| Field | Default | Description |
|-------|---------|-------------|
| createdAt | desc | Más recientes primero |
| titulo | - | Alfabético |

## Pagination

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | number | 1 | - |
| limit | number | 20 | 50 |

## Authorization

- Usuario debe estar autenticado
- Solo retorna Retos donde `usuario_id` = userId

## Possible Errors

| Code | Condition | Message |
|------|-----------|---------|
| QRY-002-E01 | No autenticado | "Debes iniciar sesión" |
| QRY-002-E02 | Filtro inválido | "Estado no válido" |

## Performance

| Metric | Target |
|--------|--------|
| Response time | < 100ms |
| Max results | 50 per page |

## Caching

| Strategy | TTL | Invalidation |
|----------|-----|--------------|
| Per-user | 2 min | CMD-001, CMD-005 |

## Use Cases That Invoke It

- [[UC-005-Ver-Mis-Retos]]
- Dashboard principal
```
