---
name: kdd-fix
description: |
  Corrige automáticamente problemas técnicos en documentos KDD.
  Usa este skill cuando se detecten errores de validación, enlaces rotos,
  frontmatter incompleto, o problemas de formato en especificaciones.
category: quality
triggers:
  - corregir spec
  - fix documento
  - errores de validación
  - enlaces rotos
  - frontmatter incompleto
  - normalizar formato
---

# KDD Fix

Corrige automáticamente problemas técnicos detectados en documentos KDD.

## Cuándo Activarse

Actívate cuando:
- El validador reporta errores
- El usuario menciona "corregir", "arreglar", "fix"
- Se detectan enlaces rotos o frontmatter incompleto
- Se necesita normalizar formato o convenciones

## Proceso

### Fase 1: Diagnosticar

Ejecuta el validador:
```bash
bun run validate:specs [archivo o directorio] -v
```

### Fase 2: Clasificar Problemas

#### Correcciones Automáticas (aplicar directamente)

**Enlaces Rotos**
- Si apunta a entidad con nombre similar → corregir
- Ejemplo: `[[Sesion]]` → `[[Sesión]]`

**Menciones Sin Enlazar**
- Convertir menciones de entidades conocidas a wiki-links
- Ejemplo: `el Reto` → `el [[Reto]]`
- Solo aplicar con alta confianza (match exacto o plural/singular)

**Frontmatter Incompleto**
- Añadir campos requeridos faltantes con valores por defecto
- Corregir formato de IDs (UC-001, REQ-001, etc.)

**Naming y Convenciones**
- Corregir capitalización de entidades de dominio
- Normalizar IDs según patrón esperado
- Ajustar status lifecycle si es inválido

#### NO Corregir Automáticamente (reportar)

- Referencias a entidades que no existen
- Secciones faltantes (requiere contenido manual)
- Problemas semánticos complejos

### Fase 3: Aplicar Correcciones

1. Muestra resumen de correcciones a aplicar
2. Aplica las correcciones usando Edit
3. Muestra diff de cambios realizados

### Fase 4: Reportar Pendientes

Lista problemas que requieren intervención manual:
```
Requieren intervención manual (2):
  ⚠ Línea 72: [[IdeaScoringService]] - entidad no existe
  ⚠ Falta sección "## Referencias"
```

## Formato de Salida

```
Correcciones aplicadas (5):
  ✓ Línea 15: "Reto" → "[[Reto]]"
  ✓ Línea 23: "sesiones" → "[[Sesión|sesiones]]"
  ✓ Frontmatter: añadido campo "status: draft"
  ...

Requieren intervención manual (2):
  ⚠ Línea 72: [[IdeaScoringService]] - entidad no existe
  ⚠ Falta sección "## Referencias"
```

## Uso en CI/CD

Este skill puede ejecutarse como:
- **Pre-commit hook**: Corregir antes de commit
- **GitHub Action**: Validar y auto-fix en PRs
- **Pipeline check**: Bloquear si hay errores no corregibles

### Ejemplo GitHub Action

```yaml
- name: KDD Fix
  run: |
    bun run validate:specs --fix
    git diff --exit-code || (git add -A && git commit -m "fix: auto-fix KDD specs")
```

## Skills Relacionados

- `kdd-review` - Para revisar calidad semántica
- `kdd-gaps` - Para detectar artefactos faltantes
- `kdd-trace` - Para verificar trazabilidad
