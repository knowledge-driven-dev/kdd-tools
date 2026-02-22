---
tags:
  - ui/component
status: draft
version: "1.0"
links:
  entities: []
  use-cases: []
  components: []      # Componentes hijos que usa
  parent-views: []    # Vistas donde se usa este componente
storybook:
  category: "Components"
  auto-generate: true
---

# {{nombre-del-componente}}

## Descripción

<!--
Describe qué es este componente y su propósito principal.
Debe ser reutilizable y no contener lógica de negocio específica.
-->

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `prop1` | `string` | sí | - | Descripción de la prop |
| `prop2` | `boolean` | no | `false` | Descripción de la prop |

## Estructura

<!--
Representa la estructura interna del componente en ASCII.
Indica las partes principales y su disposición.
-->

```ascii
┌─────────────────────────────────┐
│  [Icono]  Contenido principal   │
│           Contenido secundario  │
└─────────────────────────────────┘
```

## Estados

### Default
Descripción del estado por defecto.

```ascii
┌─────────────────┐
│  Estado normal  │
└─────────────────┘
```

### Hover
Descripción del estado hover.

### Disabled
Descripción del estado deshabilitado.

### Loading
Descripción del estado de carga (si aplica).

### Error
Descripción del estado de error (si aplica).

## Interacciones

<!--
Documenta cada interacción del usuario con el componente.
Cada interacción describe: trigger, precondiciones, resultado, feedback,
y opcionalmente qué componente abre o a cuál navega.

Campos disponibles:
- **Trigger**: Qué acción del usuario dispara esto
- **Precondición**: Condiciones que deben cumplirse (opcional)
- **Resultado**: Qué ocurre como consecuencia
- **Feedback**: Feedback visual al usuario (spinner, toast, etc.)
- **Emite**: Evento de dominio emitido (opcional)
- **Abre**: Componente/modal que se abre → Story destino (opcional)
- **Navega a**: Vista/página destino → Story destino (opcional)
- **Datos**: Datos pasados al componente destino (opcional)
-->

### Click en botón principal

- **Trigger**: Click en `[Botón]`
- **Precondición**: `condición === true`
- **Resultado**:
  - Ejecuta acción X
  - Actualiza estado Y
- **Feedback**: Spinner mientras procesa
- **Emite**: `EVT-Algo-Ocurrió`
- **Abre**: `[[UI-ModalDestino]]` → `Default`
- **Datos**: `{ id, contexto }`

### Acción exitosa

- **Trigger**: Operación completa con éxito
- **Resultado**:
  - Cierra modal/formulario actual
  - Vuelve a vista anterior
- **Feedback**: Toast "Operación completada"
- **Navega a**: `[[UI-VistaOrigen]]` → `ConDatosActualizados`

### Hover / Focus

- **Trigger**: Mouse over / Tab focus
- **Resultado**: Efecto visual de elevación
- **Feedback**: `shadow-lg`, `border-primary`

<!--
La diferencia entre "Abre" y "Navega a":
- Abre: Modal, drawer, popover (overlay sobre la vista actual)
- Navega a: Cambio de ruta/página (reemplaza la vista actual)
-->

## Accesibilidad

- **Rol ARIA**: `role="button"` (ejemplo)
- **Navegación por teclado**: Tab para navegar, Enter para activar
- **Screen readers**: Asegurar que el label sea descriptivo

## Variantes

### Tamaños
- `sm`: Uso en espacios reducidos
- `md`: Tamaño por defecto
- `lg`: Uso destacado

### Estilos
- `default`: Estilo principal
- `outline`: Solo borde
- `ghost`: Sin fondo

## Dependencias shadcn/ui

<!--
Lista los componentes de shadcn/ui que este componente utiliza o extiende.
-->

- `Button` (si extiende Button)
- `Input` (si extiende Input)

## Ejemplos de Uso

```tsx
// Uso básico
<MiComponente prop1="valor" />

// Con todas las props
<MiComponente
  prop1="valor"
  prop2={true}
  variant="outline"
  size="lg"
/>
```

## Imagen de Referencia

<!--
Si tienes un diseño en Figma o un screenshot de referencia,
colócalo aquí usando la sintaxis de Obsidian:
![[nombre-imagen.png]]
-->

## Notas de Implementación

<!--
Notas técnicas para quien implemente este componente.
Por ejemplo: "Usar Radix UI Tooltip internamente"
-->
