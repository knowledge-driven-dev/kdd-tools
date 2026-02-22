# Guía de Plantillas KDD

Este directorio contiene las plantillas canónicas para cada tipo de documento de especificación.

## Estructura de una plantilla

Cada plantilla usa un formato especial que permite al validador extraer:
1. **Schema de frontmatter** - Desde el bloque YAML con anotaciones de tipo
2. **Secciones requeridas** - Desde los headings marcados con `<!-- required -->`
3. **Contenido esperado** - Desde bloques marcados con `<!-- expects: tipo -->`

## Convenciones de anotación

### Frontmatter

```yaml
---
# @type: use-case
# @description: Plantilla para casos de uso
id: UC-NNN           # @required @pattern: ^UC-\d{3}$
version: 1           # @type: number @default: 1
status: draft        # @enum: draft|proposed|approved|deprecated
actor: Actor         # @required
domain: six-hats     # @optional
tags:                # @type: array
  - use-case
---
```

### Secciones

```markdown
## Descripción <!-- required -->

## Flujo Principal <!-- required alias: "Happy Path|Main Flow" -->

## Extensiones <!-- optional -->
```

### Contenido esperado

```markdown
## Ciclo de Vida

<!-- expects: mermaid:stateDiagram-v2 -->

## Ejemplo

<!-- expects: json -->
```

## Archivos de plantilla

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `use-case.template.md` | use-case | Casos de uso (Cockburn-lite) |
| `requirement.template.md` | requirement | Requisitos EARS |
| `entity.template.md` | entity | Entidades del dominio |
| `event.template.md` | event | Eventos de dominio |
| `rule.template.md` | rule | Reglas de negocio |
| `process.template.md` | process | Procesos (BPMN-lite) |
| `command.template.md` | command | Comandos CQRS (modifican estado) |
| `query.template.md` | query | Queries CQRS (solo lectura) |
| `prd.template.md` | prd | Product Requirements Document |
| `story.template.md` | story | Historias de usuario |
| `nfr.template.md` | nfr | Requisitos no funcionales |
| `adr.template.md` | adr | Architecture Decision Records |
| `idea.template.md` | idea | Ideas y propuestas |
