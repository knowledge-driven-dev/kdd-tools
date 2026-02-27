---
# @path-pattern: 03-experience/views/

kind: ui-view
status: draft                  # @required @enum: draft|review|approved|deprecated|superseded
---

# {{ViewName}}

## Purpose

<!-- 1-3 lines: what user goal does this view fulfill -->

## Navigation

- **Route**: `/path/to/view`
- **Arrives from**: [[VIEW-Origin]] (action that leads here)
- **Navigates to**: [[VIEW-Destination1]], [[VIEW-Destination2]]

## Layout

<!-- ONE main wireframe. Indicate zones, not pixel-perfect details -->

```
┌──────────────────────────────────────────────────────────┐
│  [← Back]             View Title               [Action]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────┐  ┌───────────────────────┐  │
│  │                         │  │                       │  │
│  │       Main Zone         │  │    Secondary Zone     │  │
│  │        (70%)            │  │        (30%)          │  │
│  │                         │  │                       │  │
│  └─────────────────────────┘  └───────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │                Actions Zone                      │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Responsive <!-- optional -->

- **Desktop**: 2-column layout as above
- **Mobile**: Stacked columns, secondary zone collapsible

## Components

| Zone | Component | Purpose |
|------|-----------|---------|
| Main | [[UI-ComponentA]] | Displays/edits the main content |
| Secondary | [[UI-ComponentB]] | Contextual navigation or auxiliary info |
| Actions | Standard buttons | Save, cancel, etc. |

## Data

<!-- What this view needs to render -->

| Data | Source | Notes |
|------|--------|-------|
| mainEntity | `GET /api/resource/:id` | Initial load |
| relatedList | Included in entity | — |
| localState | React state | For in-progress editing |

## View States

Describe key view states in text. One main wireframe in Layout is sufficient; avoid repeating wireframes for each state.

- **Loading**: Skeleton placeholders in main and secondary zones
- **Empty**: Centered message with suggested action (only if the view can have no data)
- **Error**: Error message with retry option

## Behavior

### On load

1. Show skeleton
2. Fetch data
3. If error → error state with retry
4. If OK → render view

### Main Actions

| Action | Result | Feedback |
|--------|--------|----------|
| Save | Persists changes via [[CMD-X]] | Success/error toast |
| Cancel | Discards changes, confirms if editing | — |
| [Other action] | Description | Feedback |

### Validations

<!-- Only if there are forms -->

| Field | Rule | Message |
|-------|------|---------|
| field1 | required | "This field is required" |
| field2 | max 100 chars | "Maximum 100 characters" |
