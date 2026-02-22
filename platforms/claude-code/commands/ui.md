---
description: Genera una especificación de UI (component/view/flow) conectada al dominio existente.
---

# Generar Especificación UI

Genera una especificación de UI (component/view/flow) conectada al dominio existente.

## Contexto

<descripcion>
$ARGUMENTS
</descripcion>

## Instrucciones

### Primer paso: Lee la referencia KDD

Lee el archivo `${CLAUDE_PLUGIN_ROOT}/../kdd/kdd.md` para entender la estructura de especificaciones.

### Si no hay descripción (sin $ARGUMENTS):

Explica brevemente el propósito y pregunta:

> ¿Qué elemento de UI quieres diseñar?
>
> Ejemplos:
> - "Una card para mostrar el estado de una Sesión"
> - "La vista de configuración de Personas Sintéticas"
> - "El flujo completo de creación de un Reto"
> - "Un badge que muestre el color del sombrero actual"

### Si hay descripción:

#### 1. Analiza el contexto del dominio

Lee la documentación relevante para entender las entidades y casos de uso involucrados:

- **Entidades**: `specs/01-domain/entities/` → identifica qué entidades se muestran o modifican
- **Casos de uso**: `specs/02-behavior/use-cases/` → encuentra los UC relacionados
- **Vistas existentes**: `specs/03-experience/views/` → evita duplicados, identifica reutilización
- **Reglas de negocio**: `specs/01-domain/rules/` → restricciones que afectan la UI

#### 2. Determina el tipo de artefacto

Clasifica según las señales en la descripción:

| Señales | Tipo | Template | Ubicación |
|---------|------|----------|-----------|
| "card", "botón", "badge", "input", "item", "chip" | `ui-component` | `ui-component.template.md` | `specs/03-experience/components/` |
| "página", "vista", "pantalla", "dashboard", "listado" | `ui-view` | `ui-view.template.md` | `specs/03-experience/views/` |
| "flujo", "wizard", "pasos", "proceso", "onboarding" | `ui-flow` | `ui-flow.template.md` | `specs/03-experience/flows/` |

Si no está claro, pregunta al usuario cuál prefiere.

#### 3. Haz preguntas de refinamiento (conversacional, no todas a la vez)

**Para cualquier tipo:**
- ¿Qué entidades del dominio muestra o modifica?
- ¿Hay algún diseño de referencia o debe inferirse de la descripción?

**Para components:**
- ¿Qué props necesita recibir?
- ¿Qué estados visuales tiene? (hover, disabled, loading, error)
- ¿Emite eventos? (onClick, onChange, etc.)
- ¿Tiene variantes de tamaño o estilo?

**Para views:**
- ¿Cuál es la ruta de navegación? (`/retos/:id/configurar`)
- ¿Qué acciones puede ejecutar el usuario en esta vista?
- ¿Qué estados tiene la vista? (loading, empty, error, success)
- ¿Es responsive? ¿Cómo cambia en mobile?

**Para flows:**
- ¿Cuántos pasos tiene el flujo?
- ¿El usuario puede volver atrás?
- ¿Qué pasa si cancela a mitad del flujo?
- ¿Hay puntos de decisión (bifurcaciones)?

#### 4. Genera la especificación

Cuando tengas suficiente información:

1. **Lee la plantilla correspondiente** de `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/ui-{tipo}.template.md`

2. **Rellena el frontmatter** con los links correctos:
   ```yaml
   ---
   tags:
     - ui/{tipo}
   status: draft
   version: "1.0"
   links:
     entities:
       - "[[Sesión]]"
       - "[[Persona Sintética]]"
     use-cases:
       - "[[UC-003-Iniciar-Sesion]]"
     components: []  # Para views/flows
   storybook:
     category: "{Components|Views|Flows}"
     auto-generate: true
   ---
   ```

3. **Genera wireframes ASCII** que representen:
   - La estructura general del componente/vista
   - Los diferentes estados (loading, empty, error, success)
   - La versión responsive si aplica

4. **Usa wiki-links** para conectar con el dominio:
   - Primera mención de entidad: `[[Reto]]`
   - Plurales con alias: `[[Sesión|sesiones]]`
   - Casos de uso: `[[UC-001-Crear-Reto]]`

5. **Propón componentes shadcn/ui** apropiados:
   - Card, Button, Badge, Avatar, Progress, Input, Select, etc.
   - Lista las dependencias en la sección correspondiente

6. **Define el comportamiento** con tablas claras:
   - Interacciones (acción → resultado → feedback)
   - Validaciones (campo → regla → mensaje error)
   - Eventos emitidos (evento → payload → cuándo)

#### 5. Nombrado del archivo

Sigue las convenciones:
- **Components**: `UI-{NombreEnPascalCase}.md` → `UI-PersonaCard.md`
- **Views**: `UI-{NombreDescriptivo}.md` → `UI-ConfigureChallenge.md`
- **Flows**: `FLOW-{NombreDelProceso}.md` → `FLOW-CrearReto.md`

#### 6. Confirma antes de crear

Muestra un resumen al usuario:

```markdown
## Resumen de la especificación

- **Tipo**: {component|view|flow}
- **Nombre**: UI-{Nombre}
- **Ubicación**: specs/03-experience/{tipo}s/UI-{Nombre}.md
- **Entidades**: [[A]], [[B]]
- **Casos de uso**: [[UC-XXX]]
- **Estados**: loading, empty, default, error

¿Procedo a crear el archivo?
```

Con aprobación, crea el archivo en la ubicación correspondiente.

## Ejemplos de uso

```bash
# Component
/kdd:ui Card para mostrar una Persona Sintética con su sombrero y personalidad

# View
/kdd:ui Vista de dashboard que muestre los Retos del usuario con su estado

# Flow
/kdd:ui Flujo de onboarding para nuevos usuarios que explique los Seis Sombreros

# Sin argumentos (modo guiado)
/kdd:ui
```

## Referencias

- Templates: `${CLAUDE_PLUGIN_ROOT}/../kdd/templates/ui-*.template.md`
- Vistas existentes: `specs/03-experience/views/`
- Entidades: `specs/01-domain/entities/`
- Casos de uso: `specs/02-behavior/use-cases/`
