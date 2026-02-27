---
description: Detecta violaciones del principio de dependencias entre capas de KDD en las especificaciones.
---

# Validar Dependencias KDD

Detecta violaciones del principio de dependencias entre capas de KDD en las especificaciones.

## Principio de Dependencias

```
  ┌──────────────────────────────────────────────────────────┐
  │  05-architecture  (ADR, ARCH-CHARTER)  │  ORTOGONAL      │
  └──────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  04-verification  (REQ, VER, *.feature)                  │  ← puede referenciar 03, 02, 01
  ├──────────────────────────────────────────────────────────┤
  │  03-experience    (UI-*, componentes)                    │  ← puede referenciar 02, 01
  ├──────────────────────────────────────────────────────────┤
  │  02-behavior      (CMD, QRY, PROC, BP, XP, UC)          │  ← puede referenciar 01
  ├──────────────────────────────────────────────────────────┤
  │  01-domain        (Entidades, EVT, BR)                   │  ← BASE, no referencia nada
  └──────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  00-requirements  (PRD, OBJ, UV, REL, NFR)  │  INPUT     │
  └──────────────────────────────────────────────────────────┘
```

**Regla de flujo**: `04 → 03 → 02 → 01` (capas superiores pueden referenciar inferiores, NO al revés).
- `00-requirements` es INPUT: alimenta el diseño pero está fuera del flujo de dependencias.
- `05-architecture` es ORTOGONAL: puede ser referenciada desde cualquier capa y puede referenciar cualquier capa.

## Instrucciones

1. **Escanea** los archivos en `specs/` (o el path en `$ARGUMENTS` si se proporciona)

2. **Para cada archivo**, determina su capa según ubicación y prefijo:
   | Capa | Ubicación | Prefijos | Rol |
   |------|-----------|----------|-----|
   | 00-requirements | `00-requirements/` | PRD-, OBJ-, UV-, REL-, NFR- | INPUT |
   | 01-domain | `01-domain/` | Entidades (PascalCase), EVT-, BR- | BASE |
   | 02-behavior | `02-behavior/` | CMD-, QRY-, PROC-, BP-, XP-, UC- | |
   | 03-experience | `03-experience/` | UI-*, componentes | |
   | 04-verification | `04-verification/` | REQ-, VER-, *.feature | |
   | 05-architecture | `05-architecture/` | ADR-, ARCH-CHARTER- | ORTOGONAL |

3. **Detecta violaciones** buscando wiki-links `[[...]]` que referencien capas superiores:

   ### Violaciones por Capa

   | Si estás en... | NO puedes referenciar... | Notas |
   |----------------|--------------------------|-------|
   | 01-domain | CMD-*, QRY-*, PROC-*, BP-*, XP-*, UC-*, UI-*, REQ-*, VER-* | BASE: no referencia nada |
   | 02-behavior | UI-*, REQ-*, VER-* | Solo puede referenciar 01-domain |
   | 03-experience | REQ-*, VER-* | Solo puede referenciar 02, 01 |
   | 00-requirements | (sin restricciones de dependencia) | INPUT: fuera del flujo |
   | 05-architecture | (sin restricciones de dependencia) | ORTOGONAL |

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

### 🔴 specs/01-domain/rules/BR-XXX.md
| Línea | Problema | Referencia | Capa Destino |
|-------|----------|------------|--------------|
| 45 | Link a capa superior | [[CMD-001-...]] | 02-behavior |
| 52 | Sección prohibida | "Casos de Uso Relacionados" | - |

### 🔴 specs/01-domain/rules/BR-YYY.md
| Línea | Problema | Referencia | Capa Destino |
|-------|----------|------------|--------------|
| 33 | UI en EARS | `display message "..."` | 03-experience |

## Anti-patrones Detectados

| Archivo | Línea | Anti-patrón | Sugerencia |
|---------|-------|-------------|------------|
| BR-XXX.md | 33 | Mensaje UI en EARS | Usar `WITH error code "BR-XXX"` |
| BR-YYY.md | 45 | Sección "Casos de Uso" | Eliminar, el CMD debe referenciar la BR |

## Archivos Limpios ✅
- specs/01-domain/entities/Reto.md
- specs/01-domain/rules/BR-RETO-001.md
- specs/02-behavior/commands/CMD-001-CreateChallenge.md
- ...
```

## Ejemplo de Uso

```bash
# Validar todas las specs
/kdd:validate-deps

# Validar solo dominio
/kdd:validate-deps specs/01-domain

# Validar solo behavior
/kdd:validate-deps specs/02-behavior

# Validar archivo específico
/kdd:validate-deps specs/01-domain/rules/BR-RETO-002.md
```

## Correcciones Sugeridas

Para cada violación, sugiere la corrección:

1. **Link a capa superior**: Eliminar el link, invertir la dependencia
2. **Mensaje UI en EARS**: Cambiar a `WITH error code "ID"`
3. **Sección prohibida**: Eliminar la sección completa

Si el usuario lo solicita, aplica las correcciones automáticamente.
