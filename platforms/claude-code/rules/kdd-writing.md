# Convenciones de Escritura KDD

> Esta rule se aplica siempre que trabajes con especificaciones en `/specs`.

## Language Policy

- **Headings** must be written in **English** (e.g., `## Statement`, `## Rationale`).
- Body text may be in the project's primary language (e.g., Spanish), but section headings follow the KDD v2.0 English template.

## Philosophy: Fluid Documentation

Prioriza **legibilidad humana** sobre estructura pseudo-código:

- **Narrativa sobre tablas**: Descripciones en prosa que fluyan naturalmente
- **Relaciones implícitas**: "Cada Reto pertenece a un [[Usuario]]" (el indexador las infiere)
- **Sin redundancia**: Cada concepto se define en un solo lugar
- **Mínimo necesario**: Solo secciones que aporten valor real

## Capitalización

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Entidades de dominio | Primera mayúscula | El **Usuario** crea un **Reto** |
| Sistemas externos | TODO MAYÚSCULAS | Los datos vienen de **ORACLE** |
| En código | camelCase/snake_case | `const personaSintetica = ...` |

## Wiki-Links

```markdown
[[Entidad]]                    # Link simple
[[Entidad|texto alternativo]]  # Con alias
[[Sesión|sesiones]]            # Plural
```

**Cuándo enlazar:**
- Primera mención en sección: SÍ
- Menciones posteriores: opcional
- En títulos/headers: NO
- En código: NO

## Identificadores

| Type | Pattern | Example |
|------|---------|---------|
| Use Case | `UC-NNN` | UC-001, UC-012 |
| Requirement | `REQ-NNN` / `REQ-NNN.M` | REQ-001, REQ-001.2 |
| Event | `EVT-Entidad-Accion` | EVT-Reto-Creado |
| Business Rule | `BR-NNN-{Name}` | BR-001-RoundLimit |
| Process | `PROC-NNN` | PROC-001 |
| Objective | `OBJ-NNN` | OBJ-001 |
| User Value | `UV-NNN` | UV-001 |
| Relationship | `REL-NNN` | REL-001 |
| Cross-Policy | `XP-NNN-{Name}` | XP-001-Logging |
| Best Practice | `BP-NNN` | BP-001 |
| ADR | `ADR-NNNN` | ADR-0001 |

Identifiers are always UPPERCASE and can be wiki-linked: `[[UC-001-Create-Challenge]]`

## Voz Activa

Preferir voz activa con sujeto claro:

```markdown
# Correcto
El Sistema SHALL rechazar la solicitud.
El Usuario DEBE confirmar la acción.

# Evitar
Se rechaza la solicitud.
La acción debe confirmarse.
```

## Keywords EARS (Requisitos)

Las palabras clave van en **MAYÚSCULAS**:
- `WHEN` - Evento disparador
- `IF` - Condición
- `WHILE` - Estado continuo
- `WHERE` - Característica opcional
- `SHALL` / `SHALL NOT` - Obligación/Prohibición

```markdown
WHEN the Usuario submits the form,
the Sistema SHALL create a new Reto
  AND SHALL emit EVT-Reto-Creado.
```

## Estados de Entidades

Documentar en sección **Estados** separada, no inline en Atributos:

```markdown
## Atributos
| `estado` | enum | Estado del ciclo de vida (ver [[#Estados]]) |

## Estados
| Estado | ID | Descripción |
| **Borrador** | `borrador` | En configuración, no listo |
| **Preparado** | `preparado` | Listo para iniciar |
```

## Frontmatter YAML

Field order (minimal frontmatter only):
```yaml
---
id: UC-001                    # Identifier first
kind: use-case                # Document type
status: draft                 # Lifecycle status
---
```

### Status Lifecycle

`draft` --> `review` --> `approved` --> `deprecated` --> `superseded`

> A `superseded` artifact has been replaced by a newer version. It should include a reference to its successor.

## Bloques de Código

Siempre especificar lenguaje: `typescript`, `gherkin`, `mermaid`
