---
name: kdd-review
description: |
  Revisa documentos KDD por calidad semántica, completitud y coherencia.
  Usa este skill cuando el usuario quiera validar la calidad de especificaciones,
  detectar problemas de coherencia, o preparar documentación para implementación.
category: quality
triggers:
  - revisar spec
  - revisar documento
  - está bien escrito
  - validar documentación
  - review de calidad
  - preparar para implementación
---

# KDD Review

Revisa un documento KDD por calidad semántica, completitud y coherencia narrativa.

## Cuándo Activarse

Actívate cuando el usuario:
- Pide revisar un documento o conjunto de specs
- Quiere validar si algo está "listo para implementar"
- Menciona "revisar calidad", "está completo", "es coherente"
- Prepara documentación para handoff a desarrollo

## Diferencia con kdd-fix

| kdd-fix | kdd-review |
|---------|------------|
| Problemas técnicos | Problemas semánticos |
| Enlaces rotos, frontmatter | Coherencia, completitud |
| Automático | Requiere juicio |
| Ejecuta validador | Análisis cualitativo |

## Proceso

### Fase 1: Cargar Contexto

1. Lee el documento objetivo
2. Lee documentos relacionados (links en frontmatter)
3. Carga el template correspondiente de `kdd/templates/`

### Fase 2: Evaluar Dimensiones

#### A. Completitud
- ¿Están todas las secciones requeridas por el template?
- ¿Las secciones tienen contenido sustancial o son placeholders?
- ¿Faltan casos de error, edge cases, o escenarios alternativos?

#### B. Coherencia Interna
- ¿La descripción coincide con los detalles?
- ¿Los ejemplos ilustran lo que dice el texto?
- ¿Hay contradicciones dentro del documento?

#### C. Coherencia Externa
- ¿Es consistente con las entidades que referencia?
- ¿Las reglas de negocio citadas aplican correctamente?
- ¿Los estados/transiciones coinciden con el modelo de dominio?

#### D. Claridad
- ¿Un desarrollador nuevo entendería qué implementar?
- ¿Hay ambigüedades que podrían causar malas interpretaciones?
- ¿El lenguaje es preciso o usa términos vagos ("debería", "podría")?

#### E. Accionabilidad
- ¿Se puede implementar/testear con esta información?
- ¿Los criterios de aceptación son verificables?
- ¿Hay suficiente detalle para estimar esfuerzo?

### Fase 3: Generar Reporte

```markdown
## Revisión: [Nombre del Documento]

### Puntuación General
| Dimensión | Score | Notas |
|-----------|-------|-------|
| Completitud | 🟢/🟡/🔴 | ... |
| Coherencia Interna | 🟢/🟡/🔴 | ... |
| Coherencia Externa | 🟢/🟡/🔴 | ... |
| Claridad | 🟢/🟡/🔴 | ... |
| Accionabilidad | 🟢/🟡/🔴 | ... |

### Hallazgos Críticos (bloquean implementación)
1. ...

### Hallazgos Importantes (deberían resolverse)
1. ...

### Sugerencias de Mejora (nice to have)
1. ...

### Preguntas para el Autor
1. ...
```

### Fase 4: Ofrecer Ayuda

Pregunta si el usuario quiere resolver algún hallazgo.

## Checklists por Tipo

### Entidades
- [ ] Descripción clara del concepto
- [ ] Atributos con tipos y restricciones
- [ ] Estados y transiciones (si aplica)
- [ ] Invariantes de dominio
- [ ] Ejemplos concretos

### Reglas de Negocio
- [ ] Condición claramente expresada
- [ ] Consecuencia/acción definida
- [ ] Excepciones documentadas
- [ ] Ejemplos de cumplimiento y violación

### Casos de Uso
- [ ] Actor claramente identificado
- [ ] Precondiciones verificables
- [ ] Flujo principal paso a paso
- [ ] Flujos alternativos cubiertos
- [ ] Postcondiciones medibles

### Criterios de Aceptación
- [ ] Formato Given/When/Then
- [ ] Datos de ejemplo concretos
- [ ] Casos positivos y negativos
- [ ] Independientes y atómicos

## Uso en CI/CD

Este skill puede ejecutarse como GitHub Action para:
- Revisar specs en PRs automáticamente
- Bloquear merge si hay hallazgos críticos
- Generar reportes de calidad de documentación

## Skills Relacionados

- `kdd-fix` - Para corregir problemas técnicos
- `kdd-iterate` - Para aplicar mejoras sugeridas
- `kdd-gaps` - Para detectar documentos faltantes
