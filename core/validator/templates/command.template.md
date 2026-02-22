---
# @type: command
# @description: Comando del sistema (CQRS - operación que modifica estado)
# @file-pattern: ^CMD-\d{3}-.+\.md$
# @path-pattern: capabilities/commands/

id: CMD-NNN                   # @required @pattern: ^CMD-\d{3}$
title: Command Name           # @required
type: command                 # @literal: command
status: draft                 # @enum: draft|review|approved|deprecated @default: draft
owner: "@team"                # @optional
created: "2024-01-01"          # @optional
tags:                         # @type: array
  - command
---

# CMD-NNN: CommandName <!-- required pattern: ^CMD-\d{3}: -->

## Purpose <!-- required -->

Brief description of what this command does and why it exists.

## Input <!-- required -->

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| paramName | type | Yes/No | Validation rules |
| userId | UUID | Yes | Must be authenticated user |

## Preconditions <!-- required -->

- User is authenticated
- Required entities exist
- Business rules that must be satisfied before execution

## Postconditions <!-- required -->

- State changes that occur after successful execution
- Entities created/modified/deleted
- Side effects (emails, notifications, etc.)

## Rules Validated <!-- optional -->

- [[BR-XXX-001]] - Rule description
- [[BR-YYY-002]] - Another rule

## Events Generated <!-- optional -->

- `EventName` on success:
  ```yaml
  entityId: UUID
  action: string
  timestamp: ISO-8601
  ```

## Possible Errors <!-- required -->

| Code | Condition | Message |
|------|-----------|---------|
| ERR-001 | Error condition | "User-facing error message" |
| ERR-002 | Another condition | "Another error message" |



```typescript
// File path suggestion
// apps/api/src/application/use-cases/command-name.use-case.ts

export const commandNameSchema = z.object({
  param: z.string(),
})

async function execute(input: CommandInput): Promise<CommandResult> {
  // Validation
  // Business logic
  // Persistence
  // Events
}
```

## State Transitions <!-- optional -->

```
Entity [state_a] → [state_b]
```



## Performance Requirements <!-- optional -->

| Metric | Target |
|--------|--------|
| Latency | < X seconds |
| Timeout | Y seconds |
