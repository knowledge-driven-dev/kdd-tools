---
description: Sincroniza un archivo Storybook (.stories.tsx) con su especificación de UI, preservando customizaciones.
---

# Sincronizar Storybook con Spec

Sincroniza un archivo Storybook (.stories.tsx) con su especificación de UI.

A diferencia de `/kdd:generate-story`, este comando:
- Actualiza stories existentes en lugar de crearlos desde cero
- Preserva customizaciones manuales (sección `@custom`)
- Actualiza solo la sección generada (`@generated`)

## Entrada

Ruta a la especificación (o "auto" para detectar specs modificadas):
<spec_path>
$ARGUMENTS
</spec_path>

## Instrucciones

### Modo automático (sin argumentos o "auto")

Si no se proporciona ruta, detecta automáticamente las specs UI modificadas:

1. Ejecuta: `git diff --cached --name-only | grep "specs/04-interaction/views/UI-.*\.md"`
2. Para cada spec encontrada, ejecuta el proceso de sincronización

### Modo específico (con ruta)

1. **Lee la especificación** proporcionada
2. **Busca el story existente** en la ubicación esperada:
   - `apps/web/components/features/{feature}/{nombre}.stories.tsx`
3. **Compara y actualiza**:

#### Si el story NO existe:
- Genera uno nuevo (igual que `/kdd:generate-story`)

#### Si el story EXISTE:
- Lee el story actual
- Identifica las secciones:
  - `// @generated` - Se regenera completamente desde la spec
  - `// @custom` - Se preserva intacto
- Actualiza solo la sección generada

## Estructura del Story con zonas

```tsx
// ============================================
// @generated from specs/04-interaction/views/UI-PersonaForm.md
// Last sync: 2024-01-15T10:30:00Z
// DO NOT EDIT this section - Se regenera automáticamente
// ============================================

import type { Meta, StoryObj } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

// Props extraídas de la spec
interface PersonaFormProps {
  // ...
}

// Navigation links desde spec.Interacciones
const navigationLinks = {
  onSaveSuccess: linkTo('Views/ConfigurarPersonas', 'ConPersonas'),
  onCancel: linkTo('Views/ConfigurarPersonas', 'Default'),
}

// Wireframe component
function PersonaFormWireframe(props: PersonaFormProps) {
  // Implementación basada en spec.Estructura
}

const meta: Meta<typeof PersonaFormWireframe> = {
  title: 'Features/Reto/PersonaForm',  // desde spec.storybook.category
  component: PersonaFormWireframe,
  // ...
}

export default meta
type Story = StoryObj<typeof PersonaFormWireframe>

// Stories generados desde spec.Estados
export const Default: Story = { /* ... */ }
export const Loading: Story = { /* ... */ }
export const ConContenidoGenerado: Story = { /* ... */ }

// ============================================
// @custom - Extensiones manuales (NO se sobrescriben)
// ============================================

// Añade aquí stories personalizados, play functions, decorators, etc.
// Esta sección se preserva durante la sincronización

export const MiStoryPersonalizado: Story = {
  // ...
}

// Play functions personalizadas
Default.play = async ({ canvasElement }) => {
  // Tests de interacción
}
```

## Proceso de sincronización

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Leer spec actual                                            │
│     └── Extraer: props, estados, interacciones, estructura      │
│                                                                 │
│  2. Leer story existente (si existe)                            │
│     └── Separar: sección @generated vs @custom                  │
│                                                                 │
│  3. Regenerar sección @generated                                │
│     └── Props, navigationLinks, wireframe, stories básicos      │
│                                                                 │
│  4. Combinar                                                    │
│     └── Nueva sección @generated + sección @custom preservada   │
│                                                                 │
│  5. Escribir archivo actualizado                                │
└─────────────────────────────────────────────────────────────────┘
```

## Salida esperada

1. Story actualizado con:
   - Sección `@generated` sincronizada con la spec
   - Sección `@custom` preservada intacta
   - Timestamp de última sincronización actualizado

2. Mensaje de resumen:
   ```
   ✓ Sincronizado: persona-form.stories.tsx
     - Props: 4 (sin cambios)
     - Estados: 3 → 4 (agregado: ValidacionIncompleta)
     - Navegación: 2 links actualizados
     - Custom: 2 stories preservados
   ```

## Ejemplo de invocación

```bash
# Sincronizar spec específica
/kdd:sync-story specs/04-interaction/views/UI-PersonaForm.md

# Detectar y sincronizar todas las specs UI modificadas
/kdd:sync-story auto

# Equivalente a "auto"
/kdd:sync-story
```

## Notas

- Si no existe sección `@custom`, se crea vacía
- Si el story no tiene formato con secciones, se convierte al nuevo formato
- Los imports se actualizan según componentes usados en el wireframe
- Se mantiene compatibilidad con stories generados por `/kdd:generate-story`
