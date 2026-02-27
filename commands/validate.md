---
description: Valida que las especificaciones KDD cumplan con las plantillas y convenciones definidas.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
argument-hint: "[path] [--level frontmatter|structure|semantics|all] [--fix] [--verbose]"
---

# Validar Especificaciones KDD

Ejecuta el validador de especificaciones KDD que verifica frontmatter, estructura y semántica de los documentos en `/specs`.

## Niveles de Validación

| Nivel | Qué valida |
|-------|------------|
| `frontmatter` | Campos YAML requeridos, formatos de ID, valores permitidos |
| `structure` | Secciones requeridas según plantilla del tipo de documento |
| `semantics` | Wiki-links rotos, menciones sin enlazar, consistencia |
| `all` | Los tres niveles (default) |

## Instrucciones

1. **Ejecuta el validador**:
   ```bash
   bunx kdd-spec-validator [ARGUMENTS]
   ```

   Donde `[ARGUMENTS]` puede incluir:
   - Path a validar (default: `./specs`)
   - `--level <nivel>`: frontmatter, structure, semantics, all
   - `--fix`: Auto-corregir enlaces de entidades
   - `--verbose` o `-v`: Mostrar detalles y sugerencias
   - `--output <formato>`: console, json, github

3. **Interpreta resultados**:
   - ✗ Error: Debe corregirse
   - ⚠ Warning: Revisar, puede ser intencional
   - ℹ Info: Sugerencia de mejora

4. **Si hay errores**, muestra un resumen con:
   - Total de archivos analizados
   - Errores por tipo (frontmatter, structure, semantics)
   - Archivos con más problemas
   - Sugerencias de corrección

## Ejemplos de Uso

```bash
# Validar todas las specs
/kdd:validate

# Solo validar frontmatter (rápido)
/kdd:validate --level frontmatter

# Validar y auto-corregir enlaces
/kdd:validate --fix

# Validar directorio específico
/kdd:validate specs/01-domain

# Modo verbose
/kdd:validate -v

# Exportar a JSON
/kdd:validate --output json > report.json
```

## Tipos de Documento Soportados

| Tipo | Capa | Identificación | Ejemplo |
|------|------|----------------|---------|
| PRD | 00-requirements | Prefijo `PRD-` o nombre `PRD.md` | `PRD.md` |
| Objective | 00-requirements | Prefijo `OBJ-` | `OBJ-001-IncreaseRetention.md` |
| Value Unit | 00-requirements | Prefijo `UV-` | `UV-001-SessionCompleted.md` |
| Release | 00-requirements | Prefijo `REL-` | `REL-001-MVP.md` |
| NFR | 00-requirements | Prefijo `NFR-` | `NFR-001-Performance.md` |
| Entity | 01-domain | Path `/entities/`, tag `entity` | `Reto.md` |
| Event | 01-domain | Prefijo `EVT-`, path `/events/` | `EVT-Reto-Creado.md` |
| Business Rule | 01-domain | Prefijo `BR-`, path `/rules/` | `BR-RETO-001.md` |
| Command | 02-behavior | Prefijo `CMD-`, path `/commands/` | `CMD-001-CreateChallenge.md` |
| Query | 02-behavior | Prefijo `QRY-`, path `/queries/` | `QRY-001-GetChallenge.md` |
| Process | 02-behavior | Prefijo `PROC-`, path `/processes/` | `PROC-001-StartSession.md` |
| Business Policy | 02-behavior | Prefijo `BP-`, path `/policies/` | `BP-001-Scoring.md` |
| Cross Policy | 02-behavior | Prefijo `XP-`, path `/policies/` | `XP-001-RateLimit.md` |
| Use Case | 02-behavior | Prefijo `UC-`, path `/use-cases/` | `UC-001-Crear-Reto.md` |
| UI View | 03-experience | Prefijo `UI-`, path `/views/` | `UI-RetoCard.md` |
| UI Component | 03-experience | Path `/components/` | `RetoCardComponent.md` |
| Requirement | 04-verification | Prefijo `REQ-`, path `/requirements/` | `REQ-001-Crear-Reto.md` |
| Verification | 04-verification | Prefijo `VER-`, path `/examples/` | `VER-001-Crear-Reto.feature` |
| ADR | 05-architecture | Prefijo `ADR-`, path `/decisions/` | `ADR-0001-Stack.md` |
| Impl. Charter | 05-architecture | Prefijo `ARCH-CHARTER-` | `ARCH-CHARTER-001-MVP.md` |

## Errores Comunes

### "Campo requerido faltante"
El frontmatter no tiene un campo obligatorio para ese tipo de documento.
→ Revisa la plantilla en `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/`

### "Falta sección requerida"
El documento no tiene una sección H2 que la plantilla marca como obligatoria.
→ Añade `## Nombre de Sección` con contenido

### "Wiki-link roto"
El enlace `[[Algo]]` no corresponde a ningún archivo en `/specs`.
→ Crea el archivo o corrige el nombre del enlace

### "Mención sin enlazar"
Se detectó una entidad conocida mencionada sin wiki-link.
→ Usa `--fix` para auto-corregir o añade `[[Entidad]]` manualmente
