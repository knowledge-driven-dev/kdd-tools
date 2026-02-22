---
# @type: requirement
# @description: Requisitos funcionales en formato EARS
# @file-pattern: ^REQ-\d{3}-.+\.md$
# @path-pattern: behavior/requirements/

id: REQ-NNN                   # @required @pattern: ^REQ-\d{3}$
kind: requirements            # @literal: requirements
status: draft                 # @enum: draft|proposed|approved|deprecated @default: draft
source: UC-NNN                # @optional @pattern: ^UC-\d{3}$ @description: Caso de uso origen
domain: six-hats              # @optional
tags:                         # @type: array
  - ears
---

# Requisitos EARS: Título <!-- required pattern: ^Requisitos EARS: -->

Requisitos derivados del caso de uso [[UC-NNN-Nombre]].

## Resumen de Requisitos <!-- optional -->

| ID | Patrón EARS | Resumen |
|----|-------------|---------|
| REQ-NNN.1 | Event-Driven | Descripción breve |
| REQ-NNN.2 | Unwanted (If) | Descripción breve |
| REQ-NNN.3 | State-Driven | Descripción breve |

---

## REQ-NNN.1: Nombre del Requisito (Patrón) <!-- required-pattern: ^REQ-\d{3}\.\d+: -->

**Patrón**: Event-Driven | Unwanted (If/While) | State-Driven (While) | Optional (Where) | Ubiquitous

```
WHEN <trigger event>,
the system SHALL <required action>
  AND SHALL <additional action>
  AND SHALL NOT <prohibited action>.
```

**Trazabilidad**: UC-NNN, paso X

**Criterio de Aceptación**:
<!-- expects: gherkin -->
```gherkin
Given <precondition>
When <action>
Then <expected result>
  And <additional expectation>
```

---

## REQ-NNN.2: Otro Requisito <!-- pattern: ^REQ-\d{3}\.\d+: -->

**Patrón**: Unwanted Behavior (If)

```
IF <unwanted condition>,
the system SHALL <defensive action>
  AND SHALL NOT <prohibited action>.
```

**Trazabilidad**: UC-NNN, extensión Xa

**Criterio de Aceptación**:
```gherkin
Given <context>
When <unwanted condition occurs>
Then <system response>
```

---

## Matriz de Trazabilidad <!-- optional -->

| Requisito | Paso UC | Regla de Negocio | Test Case |
|-----------|---------|------------------|-----------|
| REQ-NNN.1 | 1-5 | - | TC-NNN.1 |
| REQ-NNN.2 | Ext Xa | BR-XXX-001 | TC-NNN.2 |

## Esquema Zod (Implementación) <!-- optional -->

<!-- expects: typescript -->
```typescript
// packages/shared/validators/xxx.ts
import { z } from 'zod'

export const xxxSchema = z.object({
  campo: z.string().min(1).max(100),
})

export type XxxInput = z.infer<typeof xxxSchema>
```
