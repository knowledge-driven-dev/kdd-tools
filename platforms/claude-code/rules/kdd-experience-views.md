---
paths:
  - specs/03-experience/**/VIEW-*.md
  - specs/domains/*/03-experience/**/VIEW-*.md
---

# Vistas UI KDD

> Aplica cuando trabajas en `specs/03-experience/**/VIEW-*.md`

## Nombrado de Archivo

Patrón: `VIEW-NombreDeLaVista.md`

Ejemplos:
- `VIEW-Auth.md`
- `VIEW-Challenge.md`
- `VIEW-ConfigureChallenge.md`

## Frontmatter Requerido

```yaml
---
kind: ui-view
status: draft                 # draft | review | approved | deprecated | superseded
---
```

## Estructura del Documento

### Secciones Obligatorias

```markdown
# View: NombreVista

## Purpose
Propósito de la vista. ¿Qué objetivo del usuario cumple?

## Navigation
- **Route**: `/path/to/view`
- **Access from**: De dónde llega el usuario
- **Navigation to**: A dónde puede ir

## Layout

### General Structure
```ascii
┌──────────────────────────────────────┐
│              HEADER                   │
├──────────────────────────────────────┤
│                                       │
│          MAIN CONTENT                 │
│                                       │
└──────────────────────────────────────┘
```

### Responsive
- **Desktop (≥1024px)**: Layout descripción
- **Tablet (768-1023px)**: Layout descripción
- **Mobile (<768px)**: Layout descripción

## Components
| Component | Location | Main props |
|-----------|----------|------------|
| [[UI-Header]] | Top | `title`, `showBack` |

## Data

### Entities
| Entity | Fields used | How to obtain |
|--------|-------------|---------------|
| [[Reto]] | `titulo`, `status` | GET `/api/retos/:id` |

### Local State
| State | Type | Purpose |
|-------|------|---------|
| `isLoading` | boolean | Estado de carga |

## View States
### Loading
### Empty
### Error
### Success / Default

## Behavior

### On Load
1. Mostrar skeleton
2. Fetch data
3. If error → error state
4. If OK → render

### Main Interactions
| User Action | Result | Feedback |
|-------------|--------|----------|
| Click "Save" | Envía datos | Toast success/error |
```

## Wireframes ASCII

### Elementos Comunes

```ascii
# Header con back
┌──────────────────────────────────────┐
│  ← Back    Título                     │
├──────────────────────────────────────┤

# Input field
│   Label: [___________________________] │

# Textarea
│   ┌────────────────────────────────┐  │
│   │                                │  │
│   └────────────────────────────────┘  │

# Buttons
│   [Cancel]            [Primary Action] │

# Card
│   ┌─────────────────────────────────┐ │
│   │  Card content                   │ │
│   └─────────────────────────────────┘ │

# Skeleton loading
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │

# Empty state
│       (empty icon)                    │
│       No hay elementos                │
│       [Crear primero]                 │
```

## View States: Qué Incluir

| Estado | Cuándo | Contenido |
|--------|--------|-----------|
| Loading | Siempre | Skeleton que refleja estructura |
| Empty | Si puede no haber datos | Mensaje + CTA |
| Error | Siempre | Mensaje + Retry |
| Success | Siempre | Wireframe principal |

## Ejemplo Completo (Resumido)

```markdown
---
kind: ui-view
status: draft
---

# View: NewChallenge

## Purpose
Permite al [[Usuario]] crear un nuevo [[Reto]] ingresando título y descripción.

## Navigation
- **Route**: `/retos/nuevo`
- **Access from**: Dashboard, botón "Nuevo Reto"
- **Navigation to**: VIEW-ConfigureChallenge (on success)

## Layout

### General Structure
```ascii
┌──────────────────────────────────────┐
│  ← Mis Retos    Nuevo Reto           │
├──────────────────────────────────────┤
│                                       │
│  Título: [________________________]   │
│                                       │
│  Descripción:                         │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                       │
│  [Cancelar]           [Crear Reto]   │
└──────────────────────────────────────┘
```

## Behavior

### Main Interactions
| User Action | Result | Feedback |
|-------------|--------|----------|
| Click "Crear Reto" | CMD-001 | Redirect o error toast |
| Click "Cancelar" | Volver a dashboard | Confirmar si hay cambios |

## Related Use Cases
- [[UC-001-Crear-Reto]]
```
