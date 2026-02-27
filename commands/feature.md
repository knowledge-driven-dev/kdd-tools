---
description: Inicia el proceso de Feature Discovery para refinar una idea y generar artefactos KDD.
---

# Feature Discovery

Inicia el proceso de Feature Discovery para refinar una idea y generar artefactos KDD.

## Contexto

<idea>
$ARGUMENTS
</idea>

## Instrucciones

Sigue el proceso de Feature Discovery.

### Primer paso: Lee la referencia KDD

Lee el archivo `${CLAUDE_PLUGIN_ROOT}/../kdd/kdd.md` para entender la estructura de especificaciones.

### Si el usuario proporciona una idea (hay texto en $ARGUMENTS):

1. **Lee la documentación del dominio existente**:
   - Revisa las entidades en `specs/01-domain/entities/` para entender el modelo actual
   - Revisa las reglas en `specs/01-domain/rules/` para conocer restricciones existentes
   - Identifica qué entidades podrían estar involucradas en esta idea

2. **Inicia el refinamiento conversacional** siguiendo estas fases:

   **Fase 1 - Clarificación del Problema**:
   - ¿Qué problema específico resuelve esta idea?
   - ¿Quién tiene este problema? ¿Con qué frecuencia?
   - ¿Qué sucede actualmente cuando ocurre esta situación?

   **Fase 2 - Identificación de Entidades**:
   - ¿Qué entidades del dominio existentes están involucradas?
   - ¿Necesitamos una entidad nueva o modificar alguna existente?
   - ¿Hay cambios de estado que modelar?

   **Fase 3 - Reglas de Negocio**:
   - ¿Hay restricciones que debamos cumplir?
   - ¿Qué NO debería pasar? (casos de error)
   - ¿Hay casos límite que preocupen?

   **Fase 4 - Interacción del Usuario**:
   - ¿Cómo dispara el usuario esta funcionalidad?
   - ¿Qué ve antes/durante/después?
   - ¿Qué feedback necesita recibir?

   **Fase 5 - Verificación**:
   - Dame un ejemplo concreto del escenario "feliz"
   - Dame un ejemplo de un caso que debería fallar
   - ¿Cómo sabemos que funciona correctamente?

3. **Haz las preguntas de forma conversacional**, una fase a la vez, no todas juntas.

4. **Cuando tengas suficiente información**, produce un **Resumen Estructurado** con:

```markdown
## Resumen: [Nombre de la Feature]

### Impacto en el Dominio (01-domain/)
| Tipo | Artefacto | Acción |
|------|-----------|--------|
| Entidad | [[X]] | Crear/Modificar |
| Evento | EVT-X | Crear |
| Regla | BR-X | Crear |

### Comportamiento (02-behavior/)
| Tipo | Artefacto | Acción |
|------|-----------|--------|
| Comando | CMD-X | Crear |
| Caso de Uso | UC-XXX-X | Crear |

### Experiencia (03-experience/)
| Tipo | Artefacto | Acción |
|------|-----------|--------|
| Vista | UI-X | Crear/Modificar |

### Verificación (04-verification/)
| Tipo | Artefacto | Acción |
|------|-----------|--------|
| Criterios | REQ-XXX-X | Crear |

### Escenarios de Ejemplo
(escenarios Gherkin que capturan el comportamiento esperado)
```

5. **Confirma con el usuario** antes de generar artefactos:
   - ¿Este resumen captura tu intención?
   - ¿Los escenarios son correctos?
   - ¿Procedo a crear los artefactos?

6. **Con aprobación**, genera los artefactos KDD:
   - Usa los templates de `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/`
   - Enlaza correctamente con wiki-links `[[]]`
   - Sigue las convenciones de nombrado del proyecto
   - Respeta la capitalización de entidades de dominio

### Si no hay idea proporcionada (sin $ARGUMENTS):

Explica brevemente el proceso y pregunta:

> ¿Cuál es la idea o característica que quieres explorar?
>
> Puedes describirla de forma libre, por ejemplo:
> - "Quiero que los usuarios puedan pausar una sesión y retomarla después"
> - "Necesitamos limitar el número de personas sintéticas por sesión"
> - "Los usuarios piden poder exportar el análisis final a PDF"

## Referencias

- Referencia KDD: `${CLAUDE_PLUGIN_ROOT}/../kdd/kdd.md`
- Templates: `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/`
- Inbox de ideas: `specs/00-inbox/`
- Entidades actuales: `specs/01-domain/entities/`
- Reglas actuales: `specs/01-domain/rules/`

## Ejemplo de Uso

```
/kdd:feature Quiero que el usuario pueda pausar una Sesión a mitad y retomarla después
```

```
/kdd:feature
```
(sin argumentos inicia el flujo guiado)
