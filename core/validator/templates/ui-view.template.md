---
tags:
  - ui/view
status: draft
version: "1.0"
links:
  entities: []
  use-cases: []
  components: []
storybook:
  category: "Views"
  auto-generate: true
---

# Vista: {{nombre-de-la-vista}}

## Descripción

<!--
Describe el propósito de esta vista/página.
¿Qué objetivo del usuario cumple?
¿En qué contexto se muestra?
-->

## Contexto de Navegación

- **Ruta**: `/ruta/de/la/vista`
- **Acceso desde**: Dónde llega el usuario a esta vista
- **Navegación a**: A dónde puede ir desde aquí

## Layout

<!--
Describe la estructura general de la página.
Usa porcentajes o proporciones para indicar distribución.
-->

### Estructura General

```ascii
┌──────────────────────────────────────────────────────────┐
│                        HEADER                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    CONTENIDO PRINCIPAL                   │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────────┐    │
│  │                     │  │                         │    │
│  │   Sección A (60%)   │  │    Sección B (40%)      │    │
│  │                     │  │                         │    │
│  └─────────────────────┘  └─────────────────────────┘    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                        FOOTER                            │
└──────────────────────────────────────────────────────────┘
```

### Responsive

- **Desktop (≥1024px)**: Layout de 2 columnas
- **Tablet (768-1023px)**: Columnas apiladas
- **Mobile (<768px)**: Single column, navegación inferior

## Componentes Utilizados

<!--
Lista los componentes que componen esta vista.
Usa enlaces a las especificaciones de componentes.
-->

| Componente | Ubicación | Props principales |
|------------|-----------|-------------------|
| [[Header]] | Top | `title`, `showBack` |
| [[ComponenteA]] | Sección A | `data`, `onSave` |
| [[ComponenteB]] | Sección B | `items`, `onSelect` |

## Datos Requeridos

<!--
¿Qué datos necesita esta vista para renderizarse?
Referencia las entidades de dominio.
-->

### Entidades

| Entidad | Campos utilizados | Cómo se obtiene |
|---------|-------------------|-----------------|
| [[Reto]] | `titulo`, `descripcion`, `estado` | GET `/api/retos/:id` |
| [[Persona Sintética]] | `nombre`, `color`, `personalidad` | Incluido en Reto |

### Estado Local

| Estado | Tipo | Propósito |
|--------|------|-----------|
| `isEditing` | `boolean` | Modo edición activo |
| `formData` | `FormValues` | Datos del formulario |

## Estados de la Vista

### Loading
```ascii
┌──────────────────────────────────────┐
│  ← Volver    ████████████            │
├──────────────────────────────────────┤
│                                      │
│      ┌────────────────────┐          │
│      │   ▓▓▓▓▓▓▓▓▓▓▓▓▓   │          │
│      │   ▓▓▓▓▓▓▓▓▓▓▓▓▓   │          │
│      │   ▓▓▓▓▓▓▓▓▓▓▓▓▓   │          │
│      └────────────────────┘          │
│          (Skeleton)                  │
└──────────────────────────────────────┘
```

### Empty
Descripción y wireframe del estado vacío (sin datos).

### Error
Descripción y wireframe del estado de error.

### Success / Default
Estado normal con datos cargados (wireframe principal).

## Wireframe Principal

```ascii
┌──────────────────────────────────────────────────────────┐
│  ← Volver    Título de la Vista           [Estado]       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Sección Principal                                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │   Campo 1: [___________________________]           │  │
│  │                                                    │  │
│  │   Campo 2:                                         │  │
│  │   ┌────────────────────────────────────────────┐   │  │
│  │   │                                            │   │  │
│  │   │   Área de texto                            │   │  │
│  │   │                                            │   │  │
│  │   └────────────────────────────────────────────┘   │  │
│  │                                                    │  │
│  │   [Acción Secundaria]        [Acción Principal]    │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Comportamiento

### Al Cargar
1. Mostrar skeleton mientras carga
2. Obtener datos de la API
3. Si error → mostrar estado de error con retry
4. Si OK → renderizar vista con datos

### Interacciones Principales

| Acción del Usuario | Resultado | Feedback |
|--------------------|-----------|----------|
| Click en "Guardar" | Envía datos al API | Toast de éxito/error |
| Click en "Cancelar" | Descarta cambios | Confirmar si hay cambios |
| Editar campo | Actualiza estado local | Validación inline |

### Validaciones

| Campo | Regla | Mensaje de Error |
|-------|-------|------------------|
| Campo 1 | Requerido, máx 100 chars | "Este campo es requerido" |
| Campo 2 | Requerido | "Debes completar este campo" |

### Auto-guardado
- Debounce de 2 segundos tras último cambio
- Indicador visual de "Guardando..." / "Guardado"

## Accesibilidad

- **Focus inicial**: Primer campo editable
- **Orden de tabulación**: Header → Campos → Botones
- **Anuncios**: Toast con `role="alert"` para feedback
- **Atajos de teclado**:
  - `Ctrl+S`: Guardar
  - `Esc`: Cancelar edición

## Casos de Uso Relacionados

<!--
Lista los casos de uso que esta vista implementa.
-->

- [[UC-001-Crear-Reto]]: Paso inicial del flujo
- [[UC-002-Configurar-Personas-Sinteticas]]: Funcionalidad principal

## Imagen de Referencia

<!--
Si tienes un diseño en Figma o screenshot de referencia.
![[figma-nombre-vista.png]]
-->

## Notas de Implementación

<!--
Consideraciones técnicas para la implementación.
Por ejemplo: "Usar React Hook Form", "Implementar optimistic updates"
-->

## Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | YYYY-MM-DD | Versión inicial |
