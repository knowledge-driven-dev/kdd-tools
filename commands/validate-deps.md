---
description: Detecta violaciones del principio de dependencias entre capas de KDD en las especificaciones.
---

# Validar Dependencias KDD

Detecta violaciones del principio de dependencias entre capas de KDD en las especificaciones.

## Principio de Dependencias

```
┌─────────────────────────────────────────┐
│  05-verification   (REQ, *.feature)     │  ← puede referenciar todo
├─────────────────────────────────────────┤
│  04-interaction    (UC, UI, Flow)       │  ← puede referenciar 03, 02, 01
├─────────────────────────────────────────┤
│  03-capabilities   (CMD, QRY, PROC)     │  ← puede referenciar 02, 01
├─────────────────────────────────────────┤
│  02-domain         (Entity, EVT, BR/BP) │  ← solo puede referenciar 01
├─────────────────────────────────────────┤
│  01-problem        (PRD, ADR)           │  ← no referencia nada
└─────────────────────────────────────────┘
```

**Regla**: Las capas inferiores NO pueden referenciar capas superiores.

## Instrucciones

1. **Escanea** los archivos en `specs/` (o el path en `$ARGUMENTS` si se proporciona)

2. **Para cada archivo**, determina su capa según ubicación y prefijo:
   | Capa | Ubicación | Prefijos |
   |------|-----------|----------|
   | 01-problem | `01-problem/` | PRD, ADR |
   | 02-domain | `02-domain/` | (entidades), EVT, BR, BP |
   | 03-capabilities | `03-capabilities/` | CMD, QRY, PROC |
   | 04-interaction | `04-interaction/` | UC, UI, Flow |
   | 05-verification | `05-verification/` | REQ, *.feature |

3. **Detecta violaciones** buscando wiki-links `[[...]]` que referencien capas superiores:

   ### Violaciones por Capa

   | Si estás en... | NO puedes referenciar... |
   |----------------|--------------------------|
   | 02-domain | CMD-*, QRY-*, PROC-*, UC-*, UI-*, Flow-*, REQ-* |
   | 03-capabilities | UC-*, UI-*, Flow-*, REQ-* |
   | 04-interaction | REQ-* |

4. **Detecta anti-patrones de UI en dominio**:
   - Mensajes literales en EARS: `display message`, `show`, `mostrar mensaje`
   - Textos de UI en reglas: strings entre comillas que parecen mensajes al usuario
   - Pattern: `SHALL display` o `SHALL show` seguido de string

5. **Detecta secciones problemáticas** en archivos de dominio:
   - "Casos de Uso Relacionados" con links a CMD/UC
   - "Vistas Relacionadas" con links a UI
   - Referencias a "pantalla", "botón", "modal" en reglas de negocio

## Formato de Salida

```markdown
## Resumen de Validación KDD

- Archivos analizados: X
- Violaciones encontradas: Y
- Archivos con problemas: Z

## Violaciones de Dependencia

### 🔴 specs/02-domain/rules/BR-XXX.md
| Línea | Problema | Referencia | Capa Destino |
|-------|----------|------------|--------------|
| 45 | Link a capa superior | [[CMD-001-...]] | 03-capabilities |
| 52 | Sección prohibida | "Casos de Uso Relacionados" | - |

### 🔴 specs/02-domain/rules/BR-YYY.md
| Línea | Problema | Referencia | Capa Destino |
|-------|----------|------------|--------------|
| 33 | UI en EARS | `display message "..."` | 04-interaction |

## Anti-patrones Detectados

| Archivo | Línea | Anti-patrón | Sugerencia |
|---------|-------|-------------|------------|
| BR-XXX.md | 33 | Mensaje UI en EARS | Usar `WITH error code "BR-XXX"` |
| BR-YYY.md | 45 | Sección "Casos de Uso" | Eliminar, el CMD debe referenciar la BR |

## Archivos Limpios ✅
- specs/02-domain/entities/Reto.md
- specs/02-domain/rules/BR-RETO-001.md
- ...
```

## Ejemplo de Uso

```bash
# Validar todas las specs
/kdd:validate-deps

# Validar solo dominio
/kdd:validate-deps specs/02-domain

# Validar archivo específico
/kdd:validate-deps specs/02-domain/rules/BR-RETO-002.md
```

## Correcciones Sugeridas

Para cada violación, sugiere la corrección:

1. **Link a capa superior**: Eliminar el link, invertir la dependencia
2. **Mensaje UI en EARS**: Cambiar a `WITH error code "ID"`
3. **Sección prohibida**: Eliminar la sección completa

Si el usuario lo solicita, aplica las correcciones automáticamente.
