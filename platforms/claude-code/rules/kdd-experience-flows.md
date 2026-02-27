---
paths:
  - specs/03-experience/**/FLOW-*.md
  - specs/domains/*/03-experience/**/FLOW-*.md
---

# Flujos UI KDD

> Aplica cuando trabajas en `specs/03-experience/**/FLOW-*.md`

## Nombrado de Archivo

Patrón: `FLOW-NombreDelFlujo.md`

Ejemplos:
- `FLOW-Onboarding.md`
- `FLOW-CreateChallenge.md`
- `FLOW-ConfigureSession.md`

## Frontmatter Requerido

```yaml
---
kind: ui-flow
status: draft                 # draft | review | approved | deprecated | superseded
---
```

## Estructura del Documento

### Secciones Obligatorias

```markdown
# Flow: NombreDelFlujo

## Description
Proceso completo que representa. ¿Qué objetivo logra el usuario?

## Primary Actor
- **User**: Tipo de usuario
- **Preconditions**: Estado requerido antes de iniciar

## Flow Diagram
```mermaid
flowchart TD
    A[Inicio] --> B[Paso 1]
    B --> C{Decisión?}
    C -->|Sí| D[Paso 2a]
    C -->|No| E[Paso 2b]
    D --> F[Fin: Éxito]
    E --> F
```

## Flow Steps
### Step 1: NombrePaso
### Step 2: NombrePaso
...

## Terminal States
### Success
### Cancelled
### Error
```

## Flow Steps: Formato

```markdown
### Step 1: Ingresar Datos

| Attribute | Value |
|-----------|-------|
| **View** | [[VIEW-NewChallenge]] |
| **User Action** | Completa formulario con título y descripción |
| **System Response** | Valida datos en tiempo real |
| **Next Step** | Step 2 / Error |

#### Step Wireframe

```ascii
┌──────────────────────────────────────┐
│        Step 1: Datos básicos         │
├──────────────────────────────────────┤
│                                       │
│   Título: [_________________________] │
│   Descripción: [____________________] │
│                                       │
│   [Cancelar]           [Continuar →]  │
└──────────────────────────────────────┘
```
```

## Decision Points

```markdown
## Decision Points

### Decision 1: ¿Tiene personas configuradas?

```ascii
        ┌─────────────────┐
        │  personas > 0?  │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
   [Continuar]       [Configurar]
```

- **If met**: Continúa a Step 3
- **If not met**: Redirige a configuración de personas
```

## Terminal States: Formato

```markdown
## Terminal States

### Success

| Attribute | Value |
|-----------|-------|
| **Condition** | Usuario completó todos los pasos |
| **Final State** | [[Reto]] creado con status `preparado` |
| **Redirect** | [[VIEW-Challenge]] |
| **Feedback** | Toast "Reto creado exitosamente" |

```ascii
┌──────────────────────────────────────┐
│          ✓ Completado                │
├──────────────────────────────────────┤
│                                       │
│   Tu Reto ha sido creado.            │
│                                       │
│          [Ver Reto]                  │
│          [Crear otro]                │
└──────────────────────────────────────┘
```

### Cancelled

| Attribute | Value |
|-----------|-------|
| **Condition** | Usuario cancela en cualquier paso |
| **Final State** | Sin cambios / Borrador guardado |
| **Redirect** | Dashboard |
| **Feedback** | Confirmar si hay cambios sin guardar |

### Error

| Attribute | Value |
|-----------|-------|
| **Condition** | Error del sistema |
| **Behavior** | Mostrar error, ofrecer retry |
| **Feedback** | Toast con mensaje y opción de reintentar |
```

## Persistencia Durante el Flujo

```markdown
## Persistence During Flow

| Strategy | Description |
|----------|-------------|
| **Local State** | React state para navegación entre pasos |
| **LocalStorage** | Guarda borrador cada 30s |
| **Backend** | Guarda como `draft` en BD al avanzar paso |
```

## Domain Events

```markdown
## Domain Events

| Step | Event | Payload |
|------|-------|---------|
| Step 1 complete | `EVT-Reto-Iniciado` | `{ id, userId }` |
| Step 3 complete | `EVT-Reto-Creado` | `{ id, ...data }` |
| Cancelled | `EVT-Flow-Cancelado` | `{ step, userId }` |
```

## Ejemplo Completo (Resumido)

```markdown
---
kind: ui-flow
status: draft
---

# Flow: CreateChallenge

## Description

Flujo completo para crear y configurar un [[Reto]], desde datos básicos
hasta configuración de [[Persona Sintética|Personas Sintéticas]].

## Primary Actor

- **User**: [[Usuario]] autenticado
- **Preconditions**: Usuario tiene créditos disponibles

## Flow Diagram

```mermaid
flowchart TD
    A[Inicio] --> B[Datos básicos]
    B --> C[Configurar personas]
    C --> D{3-6 personas?}
    D -->|Sí| E[Confirmar]
    D -->|No| C
    E --> F[Fin: Reto preparado]
```

## Flow Steps

### Step 1: Datos Básicos
| **View** | [[VIEW-NewChallenge]] |
| **User Action** | Ingresa título y descripción |
| **Next Step** | Step 2 |

### Step 2: Configurar Personas
| **View** | [[VIEW-ConfigureChallenge]] |
| **User Action** | Agrega 3-6 Personas Sintéticas |
| **Next Step** | Step 3 (si válido) |

### Step 3: Confirmar
| **View** | [[VIEW-ConfigureChallenge]] |
| **User Action** | Revisa y confirma |
| **Next Step** | End: Success |

## Terminal States

### Success
- **Final State**: Reto con status `preparado`
- **Redirect**: [[VIEW-Challenge]]
- **Events**: [[EVT-Reto-Creado]], [[EVT-Reto-Preparado]]
```
