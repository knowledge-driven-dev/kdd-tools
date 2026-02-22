---
name: kdd-author
description: |
  Asistente conversacional para transformar ideas en artefactos KDD estructurados.
  Guía al usuario paso a paso desde una idea vaga hasta especificaciones listas
  para implementar. Reduce fricción para PMs y no técnicos.
category: authoring
triggers:
  - crear especificación
  - documentar feature
  - nueva funcionalidad
  - idea para
  - quiero que el sistema
  - necesitamos implementar
  - tengo una idea
  - objetivo
  - el usuario debería poder
---

# KDD Author

Transforma ideas en especificaciones KDD mediante diálogo colaborativo estructurado.

## Filosofía

- **Una pregunta a la vez** - No abrumar con múltiples preguntas
- **Opciones múltiples** - Más fáciles de responder que preguntas abiertas
- **YAGNI** - Eliminar features innecesarias agresivamente
- **Validación incremental** - Confirmar antes de avanzar
- **Flexibilidad** - Volver atrás si algo no tiene sentido

## El Proceso

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA         CLASIFICACIÓN      REFINAMIENTO      GENERACIÓN │
│     │                 │                  │                │      │
│     ▼                 ▼                  ▼                ▼      │
│  ┌─────┐          ┌─────┐          ┌─────────┐      ┌─────────┐ │
│  │Idea │    ──►   │Tipo │    ──►   │Preguntas│  ──► │Artefacto│ │
│  │vaga │          │KDD  │          │guiadas  │      │validado │ │
│  └─────┘          └─────┘          └─────────┘      └─────────┘ │
│                                                                  │
│  "quiero que      "Esto suena      1 pregunta       Confirmar   │
│   usuarios         a un OBJ"        por turno       y generar   │
│   exporten PDF"                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Captura de la Idea

### Si el usuario da una descripción clara

Reconoce la idea y pasa a clasificación:

> "Entiendo: quieres que los usuarios puedan exportar su análisis a PDF para compartir con stakeholders externos."

### Si el usuario es vago

Haz UNA pregunta abierta:

> "¿Qué problema quieres resolver o qué quieres que los usuarios puedan hacer?"

### Atajo para usuarios experimentados

Si el usuario especifica el tipo directamente ("quiero crear un OBJ", "necesito documentar un ADR"), salta a la fase de refinamiento del tipo correspondiente.

---

## Fase 2: Clasificación del Tipo de Artefacto

Antes de preguntar más, **clasifica** qué tipo de artefacto KDD corresponde.

### Señales por Tipo

| Señales en la idea | Tipo | Pregunta de confirmación |
|-------------------|------|--------------------------|
| "el usuario quiere...", "necesidad de...", "objetivo de..." | **OBJ** (Objective) | "Esto suena a un **objetivo de usuario**. ¿Correcto?" |
| "decidimos que...", "por qué usamos...", "trade-off entre..." | **ADR** (Decision) | "Esto suena a una **decisión arquitectónica**. ¿Correcto?" |
| "en la versión X incluiremos...", "para el release..." | **REL** (Release) | "Esto suena a un **plan de release**. ¿Correcto?" |
| "cuando el usuario hace X, el sistema hace Y" | **UC** (Use Case) | "Esto suena a un **caso de uso**. ¿Correcto?" |
| "el sistema debe/no puede...", "límite de...", "solo si..." | **BR/BP** (Rule) | "Esto suena a una **regla de negocio**. ¿Correcto?" |
| "pantalla de...", "el usuario ve...", "botón para..." | **UI** (View/Component) | "Esto suena a una **especificación de UI**. ¿Correcto?" |

### Presenta como opción múltiple si no está claro

> "Tu idea podría documentarse como:
>
> 1. **Objetivo (OBJ)** - Lo que el usuario quiere lograr
> 2. **Caso de Uso (UC)** - El flujo paso a paso de cómo lo logra
> 3. **Otro** - Descríbeme más
>
> ¿Cuál encaja mejor?"

---

## Fase 3: Refinamiento por Tipo

Una vez clasificado, haz preguntas específicas **una por turno**.

### Para OBJ (Objective)

```
Pregunta 1: "¿Quién tiene esta necesidad?"
            Opciones: Usuario | Administrador | Sistema | Otro: ___

Pregunta 2: "¿Qué problema específico resuelve?"
            (abierta, pero guiada)

Pregunta 3: "¿Cómo sabrá el usuario que lo logró?"
            (criterios de éxito)
```

**Mínimo viable**: Actor + Objetivo + 1 criterio de éxito

### Para ADR (Decision)

```
Pregunta 1: "¿Qué alternativas consideraste?"
            (al menos 2)

Pregunta 2: "¿Por qué elegiste esta opción?"
            (razones principales)

Pregunta 3: "¿Qué consecuencias tiene esta decisión?"
            (trade-offs)
```

**Mínimo viable**: Contexto + Decisión + 1 consecuencia

### Para UC (Use Case)

```
Pregunta 1: "¿Quién inicia esta acción?"
            Opciones: Usuario | Admin | Sistema (automático) | Otro: ___

Pregunta 2: "Dame el camino feliz en 3-5 pasos"
            (flujo principal)

Pregunta 3: "¿Qué puede salir mal?"
            (excepciones principales)
```

**Mínimo viable**: Actor + Flujo principal (3+ pasos) + 1 excepción

### Para BR/BP (Business Rule)

```
Pregunta 1: "¿A qué entidad aplica esta regla?"
            Opciones: [lista de entidades existentes] | Nueva entidad

Pregunta 2: "¿Cuál es la restricción exacta?"
            Formato: "Un/Una [entidad] debe/no puede [condición]"

Pregunta 3: "¿Qué pasa si se viola?"
            (comportamiento de error)
```

**Mínimo viable**: Entidad + Restricción + Consecuencia de violación

### Para UI (View/Component)

Delegar al comando `/ui` que ya existe, o seguir su flujo:

```
Pregunta 1: "¿Es un componente reutilizable o una pantalla completa?"
            Opciones: Componente | Vista/Pantalla | Flujo multi-paso

Pregunta 2: "¿Qué datos muestra o modifica?"
            (entidades involucradas)

Pregunta 3: "¿Qué acciones puede hacer el usuario aquí?"
            (interacciones principales)
```

---

## Fase 4: Validación Incremental

### Presenta el borrador en secciones

No generes todo de golpe. Presenta en bloques de ~200 palabras:

```markdown
## Borrador: OBJ-013 - Exportar Análisis a PDF

### Sección 1: Contexto
**Actor**: Usuario
**Objetivo**: Como Usuario, quiero exportar mi análisis a PDF...

> ¿Esto captura bien la idea? [Sí / Ajustar / Empezar de nuevo]
```

Tras aprobación, continúa:

```markdown
### Sección 2: Criterios de Éxito
1. Puedo descargar un PDF desde la pantalla de análisis
2. El PDF incluye todas las contribuciones organizadas por sombrero
3. ...

> ¿Estos criterios son correctos? [Sí / Añadir más / Modificar]
```

### Principio YAGNI

En cada sección, pregunta:

> "¿Hay algo aquí que NO necesitamos para la primera versión?"

Elimina agresivamente lo innecesario.

---

## Fase 5: Generación del Artefacto

### Antes de generar

Muestra resumen final:

```markdown
## Resumen Final

- **Tipo**: OBJ (Objective)
- **ID**: OBJ-013 (siguiente disponible)
- **Archivo**: `specs/00-requirements/objectives/OBJ-013-ExportarPDF.md`
- **Enlaces**: [[Análisis]], [[Sesión]]

¿Genero el archivo? [Sí / Revisar de nuevo]
```

### Al generar

1. **Calcula el siguiente ID** disponible automáticamente
2. **Usa la plantilla** de `kdd/templates/{tipo}.template.md`
3. **Añade wiki-links** a entidades mencionadas
4. **Respeta convenciones** de nombrado

### Después de generar

Sugiere siguientes pasos:

> "Creado `OBJ-013-ExportarPDF.md`
>
> Próximos pasos sugeridos:
> - Crear el caso de uso: ¿Quieres que te ayude con el UC?
> - Revisar calidad: Ejecuta `/kdd-review specs/00-requirements/objectives/OBJ-013-ExportarPDF.md`"

---

## Atajos y Variantes

### Modo rápido (usuario experimentado)

Si el usuario dice algo como:
- "Crea un OBJ: exportar a PDF para compartir análisis"
- "ADR: usamos créditos porque..."

Salta directamente a validación, preguntando solo lo que falta:

> "Voy a crear OBJ-013. Solo necesito confirmar:
> - **Actor**: ¿Usuario? [Sí / Otro]
> - **Criterio de éxito**: ¿Cuál sería el principal?"

### Modo batch (múltiples artefactos)

Si la idea requiere varios artefactos:

> "Esta feature necesita:
> 1. OBJ-013: Objetivo del usuario
> 2. UC-020: Caso de uso del flujo
> 3. UI-ExportModal: Componente de exportación
>
> ¿Empezamos por el OBJ y seguimos en orden?"

---

## Anti-patrones (NO hacer)

| No hagas | En su lugar |
|----------|-------------|
| Preguntar 5 cosas a la vez | Una pregunta por mensaje |
| Generar sin confirmar | Validar cada sección |
| Asumir el tipo de artefacto | Confirmar clasificación |
| Inventar criterios | Preguntar al usuario |
| Ignorar entidades existentes | Leer `/specs/01-domain/entities/` primero |

---

## Contexto del Proyecto

Antes de iniciar, lee:
- **Entidades existentes**: `specs/01-domain/entities/`
- **Reglas existentes**: `specs/01-domain/rules/`
- **Templates**: `kdd/templates/`

Esto permite:
- Sugerir entidades relevantes como opciones
- Detectar si ya existe algo similar
- Usar la terminología correcta del dominio

---

## Skills Relacionados

- `kdd-iterate` - Para modificar artefactos existentes
- `kdd-gaps` - Para detectar qué artefactos faltan
- `kdd-review` - Para revisar calidad de lo generado
- `kdd-trace` - Para ver conexiones entre artefactos
- `/ui` - Comando especializado para specs de UI

---

## Ejemplo Completo

```
Usuario: "Quiero que los usuarios puedan pausar una sesión y continuar después"

Claude: "Entiendo: pausar sesiones para continuar más tarde.
         Esto suena a un **objetivo de usuario** (OBJ).
         ¿Es correcto, o prefieres documentarlo como caso de uso (UC)?"

Usuario: "OBJ está bien"

Claude: "¿Quién necesita esta funcionalidad?
         1. Usuario (participante de sesión)
         2. Facilitador (quien crea la sesión)
         3. Ambos"

Usuario: "Usuario"

Claude: "¿Qué problema específico resuelve pausar la sesión?
         Por ejemplo: sesiones largas, interrupciones, continuar otro día..."

Usuario: "A veces hay interrupciones y no quieren perder el progreso"

Claude: "¿Cómo sabrá el usuario que pausar funcionó?
         1. Ve un indicador de 'pausada' en su dashboard
         2. Puede retomar exactamente donde lo dejó
         3. Recibe notificación/email de recordatorio
         4. Otro: ___"

Usuario: "1 y 2"

Claude: "## Borrador: OBJ-025 - Pausar Sesión

         **Actor**: Usuario
         **Objetivo**: Como Usuario, quiero pausar una sesión en progreso,
         para poder continuar más tarde sin perder mi progreso.

         **Criterios de éxito**:
         1. Puedo ver un indicador de 'pausada' en mi dashboard
         2. Al retomar, continúo exactamente donde lo dejé

         > ¿Esto captura bien la idea? [Sí / Ajustar]"

Usuario: "Sí"

Claude: "Creado `specs/00-requirements/objectives/OBJ-025-PausarSesion.md`

         Próximo paso sugerido: ¿Creo el caso de uso UC-025-PausarSesion?"
```
