---
description: Genera un archivo Storybook (.stories.tsx) a partir de una especificación de UI.
---

# Generar Storybook desde Spec

Genera un archivo Storybook (.stories.tsx) a partir de una especificación de UI.

## Entrada

Ruta a la especificación:
<spec_path>
$ARGUMENTS
</spec_path>

## Instrucciones

1. **Lee la especificación** en la ruta proporcionada
   - Identifica el tipo: `ui/component`, `ui/view`, o `ui/flow` (del frontmatter)
   - Extrae: nombre, descripción, estructura, estados, props, comportamiento

2. **Determina la ubicación del story**
   - Componentes: `apps/web/components/features/{nombre}/{nombre}.stories.tsx`
   - Vistas: `apps/web/app/(routes)/{ruta}/_components/{nombre}.stories.tsx`
   - Si no existe el directorio, créalo

3. **Genera el story** siguiendo estas reglas:

### Para `ui/component`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
// Importar componentes de shadcn/ui necesarios
import { Card, Button, Avatar } from '@/components/ui/...'

// Crear componente wireframe que represente la spec
function NombreComponenteWireframe(props: Props) {
  // Implementar estructura visual basada en el ASCII art de la spec
  return (...)
}

const meta: Meta<typeof NombreComponenteWireframe> = {
  title: 'Components/NombreComponente',
  component: NombreComponenteWireframe,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Descripción de la spec'
      }
    }
  }
}
export default meta

type Story = StoryObj<typeof NombreComponenteWireframe>

// Crear un story por cada estado descrito en la spec
export const Default: Story = { args: {...} }
export const Hover: Story = { args: {...} }
export const Disabled: Story = { args: {...} }
```

### Para `ui/view`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
// Importar componentes necesarios

function NombreVistaWireframe() {
  // Implementar layout completo basado en la spec
  // Usar componentes de shadcn/ui para estructura
  // Usar datos mock basados en las entidades referenciadas
  return (...)
}

const meta: Meta<typeof NombreVistaWireframe> = {
  title: 'Views/NombreVista',
  component: NombreVistaWireframe,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  }
}
export default meta

// Stories para cada estado de la vista
export const Loading: Story = {}
export const Empty: Story = {}
export const WithData: Story = {}
export const Error: Story = {}
```

### Para `ui/flow`:
```tsx
// Crear stories que muestren cada paso del flujo
// Usar decorators para simular navegación entre pasos
```

4. **Traduce el ASCII art a JSX**
   - `┌───┐` → `<Card>` o `<div className="border rounded">`
   - `[Botón]` → `<Button>`
   - `👤` → `<Avatar>` o icono de Lucide
   - Secciones con `│` → `<div className="flex">`
   - Usa Tailwind para layout y espaciado

5. **Genera datos mock** basados en las entidades referenciadas en `links.entities`
   - Lee la entidad para conocer sus atributos
   - Crea objetos de ejemplo realistas

6. **Usa componentes de shadcn/ui** listados en la spec o inferidos:
   - Card, Button, Badge, Avatar, Progress, etc.
   - Consulta el MCP de shadcn si necesitas ejemplos

7. **Incluye comentarios** que referencien la spec:
```tsx
/**
 * Wireframe generado desde: specs/04-interaction/components/PersonaCard.md
 * Estado: draft (pendiente de implementación real)
 *
 * TODO: Reemplazar wireframe con implementación real
 */
```

## Salida Esperada

1. Archivo `.stories.tsx` creado en la ubicación correcta
2. Componente wireframe funcional que visualiza la spec
3. Stories para cada estado/variante descrito
4. Datos mock realistas

## Ejemplo de Invocación

```
/kdd:generate-story specs/04-interaction/components/PersonaCard.md
```

## Notas

- El wireframe NO es la implementación final, es una visualización de diseño
- Prioriza que se vea similar al ASCII art de la spec
- Si faltan detalles en la spec, usa valores sensatos por defecto
- No generes lógica de negocio, solo representación visual
