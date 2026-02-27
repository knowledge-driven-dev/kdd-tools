---
name: kdd-iterate
description: |
  Aplica feedback, cambios o mejoras a artefactos KDD existentes.
  Usa este skill cuando el usuario proporciona feedback sobre documentación,
  quiere cambiar requisitos existentes, o necesita propagar cambios entre capas.
category: authoring
triggers:
  - cambiar requisito
  - actualizar spec
  - el límite debería ser
  - ya no aplica
  - añadir caso de error
  - renombrar entidad
  - aplicar feedback
---

# KDD Iterate

Aplica feedback, cambios o mejoras a artefactos KDD existentes.

## Cuándo Activarse

Actívate cuando el usuario:
- Proporciona feedback sobre documentación existente
- Quiere cambiar un valor, condición o comportamiento documentado
- Menciona que algo "ya no aplica" o "debería ser diferente"
- Pide propagar un cambio a documentos relacionados

## Proceso

### Fase 1: Analizar el Feedback

Identifica:
- ¿Qué artefactos se ven afectados directamente?
- ¿Es un cambio de requisitos, corrección, o refinamiento?
- ¿Hay impacto en cascada a otros documentos?

### Fase 2: Localizar Artefactos

Busca en las capas KDD:
```
specs/00-requirements/ → PRD, objectives (OBJ-*), value-units (UV-*), releases (REL-*)
specs/01-domain/       → entidades, reglas (BR-NNN-{Name}), eventos
specs/02-behavior/     → comandos, queries, procesos, use-cases (UC-*), políticas (BP-*, XP-*)
specs/03-experience/   → vistas (UI-*), componentes
specs/04-verification/ → requisitos verificables (REQ-*), ejemplos (.feature)
specs/05-architecture/ → ADRs (decisions/), charter
```

### Fase 3: Evaluar Impacto

Presenta al usuario:

```markdown
## Análisis de Impacto

### Cambio Solicitado
> [resumen del feedback]

### Artefactos Afectados Directamente
| Artefacto | Tipo de Cambio | Impacto |
|-----------|----------------|---------|
| [[Reto]] | Modificar atributo | Bajo |
| [[BR-002-RetoMaxLength]] | Actualizar condición | Medio |

### Artefactos con Impacto en Cascada
| Artefacto | Razón | Acción Sugerida |
|-----------|-------|-----------------|
| [[UC-001-Crear-Reto]] | Usa atributo modificado | Revisar flujo |
| [[REQ-001]] | Criterios dependen de regla | Actualizar |

### Riesgo de Inconsistencia
- Alto/Medio/Bajo
- Explicación breve
```

### Fase 4: Confirmar y Aplicar

1. **Confirma** con el usuario antes de modificar
2. **Aplica** los cambios en orden de dependencia
3. **Actualiza** versiones en frontmatter si aplica
4. **Mantén** wiki-links consistentes

### Fase 5: Verificar

Ejecuta validación:
```bash
bun run validate:specs specs/
```

## Tipos de Iteración

### Cambio de Requisito
- Modificar valor, condición o comportamiento
- Actualizar reglas de negocio afectadas
- Propagar a criterios de aceptación

### Refinamiento
- Añadir detalle a descripción existente
- Completar secciones vacías
- Mejorar ejemplos o escenarios

### Corrección
- Arreglar inconsistencias detectadas
- Resolver contradicciones entre docs
- Alinear con decisiones recientes

### Deprecación
- Marcar artefacto como deprecated
- Documentar razón y alternativa
- Actualizar referencias

## Skills Relacionados

- `kdd-author` - Para crear artefactos nuevos desde cero
- `kdd-trace` - Para ver conexiones antes de cambiar
- `kdd-gaps` - Para detectar qué falta después de iterar
