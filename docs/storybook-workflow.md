# Storybook in KDD: From Specs to Components

> How to materialize UI specifications into visual wireframes before coding.

> **Note**: The `/generate-story` and `/sync-story` commands mentioned in this document are part of kdd-tools. This document describes the methodology behind the specs-to-storybook workflow.

## The Role of Storybook in KDD

In KDD, Storybook serves two functions depending on the project phase:

```
  SPECS (markdown)
       │
       ▼
  WIREFRAMES (in .stories.tsx)    ← Design/validation phase
       │
       ▼
  REAL COMPONENTS (.tsx)          ← Implementation phase
       │
       ▼
  UPDATED STORIES                 ← Living documentation
```

### The Problem This Solves

In traditional development, a designer creates a mockup, a developer interprets it, behavioral context is lost, and iterations happen in code. With specs-to-storybook, the analyst writes a complete spec (structure + behavior), a wireframe is generated in Storybook, stakeholders validate before coding, and the developer implements with a clear reference.

---

## Phase 1: Wireframes as Executable Documentation

A wireframe is a simplified component that lives **inside** the `.stories.tsx` file. Its purpose is to visualize the design, validate the specification with stakeholders, and serve as a reference for the real implementation.

```tsx
// product-form.stories.tsx

/**
 * Wireframe generated from: specs/03-experience/views/UI-ProductForm.md
 * Status: draft (pending real implementation)
 */

function ProductFormWireframe({ onSave, onCancel, isLoading }) {
  return (
    <div className="...">
      {/* Simplified UI */}
    </div>
  )
}

export const Default: Story = { args: { ... } }
export const Loading: Story = { args: { isLoading: true } }
export const WithError: Story = { args: { error: "..." } }
```

| Aspect | Wireframe |
|--------|-----------|
| **Location** | Inside `.stories.tsx` |
| **Purpose** | Validate design, document |
| **Business logic** | Simulated or absent |
| **Used in production** | No |

## Phase 2: Real Components

When the real component is implemented:

1. **Create the component** in a separate `.tsx` file
2. **Update the story** to import the real component
3. **Remove the wireframe** from the `.stories.tsx` file

**Quick verification**: Is the component defined inside `.stories.tsx`? → wireframe. Imported from a separate `.tsx`? → real component.

| Aspect | Real Component |
|--------|----------------|
| **Location** | Own `.tsx` file |
| **Purpose** | Production code |
| **Business logic** | Complete |
| **Used in production** | Yes |

---

## Spec Anatomy for Storybook Generation

### Front-matter

```yaml
---
kind: ui-view
status: draft
---
```

### ASCII Wireframe

Claude translates ASCII art to components:

```ascii
┌──────────────────────────────────────┐
│  [← Back]    Title    [Badge]        │  ← Header
├──────────────────────────────────────┤
│                                      │
│  ┌────────────┐  ┌────────────┐      │  ← Card grid
│  │  Card 1    │  │  Card 2    │      │
│  └────────────┘  └────────────┘      │
│                                      │
│  [Primary Button]  [Secondary Btn.]  │  ← Actions
└──────────────────────────────────────┘
```

Translation rules:
- `┌───┐` → `<Card>` or `<div className="border rounded">`
- `[Text]` → `<Button>`
- `←` → Lucide icon
- Proportions → Tailwind classes

### States (critical for UX)

Document all view states: Loading (skeleton), Empty (CTA), Error (retry), Success (default).

---

## Workflow

### 1. Create the Specification

Use the corresponding template from [kdd-specs](https://github.com/knowledge-driven-dev/kdd-specs) (`ui-view.template.md` or `ui-component.template.md`). Complete the front-matter, layout (ASCII art), states, behavior, and accessibility sections.

### 2. Generate the Wireframe

```
/generate-story specs/03-experience/views/MyNewView.md
```

### 3. Validate in Storybook

Navigate to the generated story and validate that the structure matches the spec, the states are correct, and the responsiveness works.

### 4. Iterate

If something is not right, adjust **the spec** (not the story directly) and regenerate.

### 5. Implement the Real Component

Once validated, mark the spec as `status: approved`, implement the real component, and replace the wireframe with the real import.

---

## Co-location Convention

Related files live together:

```
components/features/order/
├── product-form.tsx           ← Component
├── product-form.stories.tsx   ← Documentation/Stories
├── product-form.test.tsx      ← Tests
└── product-form.types.ts      ← Types (optional)
```

**Why**: discoverability (opening the component shows its docs), maintenance (changes remind you to update stories), and modularity (moving a component moves all its documentation). This is the convention recommended by Storybook.

---

## Sidebar Organization

Stories are organized using the `title` field in the meta:

```tsx
const meta = { title: 'UI/Button', ... }        // Base components
const meta = { title: 'Features/Order/ProductForm', ... }  // Features
const meta = { title: 'Views/Dashboard', ... }   // Full pages
```

---

## Automatic Spec → Story Synchronization

When specs evolve, stories can become outdated. The project supports a synchronization system:

1. Developer edits a UI spec
2. Pre-commit hook detects the change and warns if no stories are staged
3. Developer runs `/sync-story auto` to synchronize

### Story Zones

Generated stories have two zones:

```tsx
// @generated from specs/03-experience/views/UI-*.md
// DO NOT EDIT - Automatically regenerated

// ... code generated from the spec ...

// @custom - Manual extensions (NOT overwritten)

// ... custom code that is preserved ...
```

---

## Real Examples

### ProductCard (Component)

**Spec**: `specs/03-experience/components/ProductCard.md`
- Props documented with types
- ASCII art for each size (sm, md, lg)
- States: default, hover, selected, loading
- Deletion behavior with confirmation

**Stories**: Default, Selected, ReadOnly, Loading, SizeSmall, SizeMedium, SizeLarge, GridOfProducts, InteractiveDemo

### ConfigureOrder (View)

**Spec**: `specs/03-experience/views/ConfigureOrder.md`
- Complete layout with header, main, footer
- Responsive: desktop, tablet, mobile
- States: loading, empty, partial, configured, error

**Stories**: Loading, Empty, Partial, Configured, Error, MobileView, TabletView, InteractiveDemo

---

## Best Practices

**DO**: Write complete specs before generating. Include all UI states. Reference entities for realistic mock data. Use ASCII art for complex layouts. Iterate on the spec, not the story.

**DON'T**: Edit generated stories directly (they will be lost on regeneration). Omit error/loading states. Generate without validating that the spec is complete.

---

## Troubleshooting

### The story does not generate correctly
1. Verify that the spec has valid front-matter
2. Make sure the ASCII art uses standard Unicode characters
3. Check that referenced entities exist

### Storybook does not find the story
1. Verify the file location matches `.storybook/main.ts` patterns
2. Restart Storybook

### The wireframe does not resemble the spec
1. Be more explicit in the ASCII art
2. Add descriptions to each section
3. Specify shadcn/ui components to use

---

## References

- **Templates**: See [kdd-specs](https://github.com/knowledge-driven-dev/kdd-specs) — `ui-view.template.md`, `ui-component.template.md`
- **Commands**: `/generate-story` and `/sync-story` (provided by kdd-tools)
