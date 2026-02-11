---
description: Corrige automáticamente los problemas detectados en una especificación KDD.
---

# Corregir Especificación

Corrige automáticamente los problemas detectados en el archivo `$ARGUMENTS`.

## Instrucciones

1. **Lee** el archivo especificado
2. **Ejecuta** el validador para obtener los problemas:
   ```bash
   bunx kdd-spec-validator $ARGUMENTS -v
   ```
3. **Analiza** los resultados y aplica correcciones automáticas para:

### Correcciones Automáticas

#### Enlaces Rotos
- Si el enlace apunta a una entidad con nombre similar, corregir
- Ejemplo: `[[Sesion]]` → `[[Sesión]]`

#### Menciones Sin Enlazar (info)
- Convertir menciones de entidades conocidas a wiki-links
- Ejemplo: `el Reto` → `el [[Reto]]`
- Solo aplicar con alta confianza (match exacto o plural/singular)

#### Frontmatter Incompleto
- Añadir campos requeridos faltantes con valores por defecto
- Corregir formato de IDs (UC-001, REQ-001, etc.)

### NO Corregir Automáticamente
- Referencias a entidades que no existen (requiere crear el archivo)
- Secciones faltantes (requiere contenido manual)
- Problemas semánticos complejos

## Formato de Salida

1. Muestra resumen de correcciones a aplicar
2. Aplica las correcciones usando la herramienta Edit
3. Muestra diff de cambios realizados
4. Lista problemas que requieren intervención manual

## Ejemplo de Uso

```
/kdd:fix-spec specs/vision/charter.md
```

Resultado esperado:
```
Correcciones aplicadas (5):
  ✓ Línea 15: "Reto" → "[[Reto]]"
  ✓ Línea 23: "sesiones" → "[[Sesión|sesiones]]"
  ...

Requieren intervención manual (2):
  ⚠ Línea 72: [[IdeaScoringService]] - entidad no existe
  ⚠ Falta sección "## Referencias"
```
