---
# @file-pattern: ^CMD-\d{3}-.+\.md$
# @path-pattern: 02-behavior/commands/

id: CMD-NNN                   # @required @pattern: ^CMD-\d{3}$
kind: command                 # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
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

State transitions (if applicable):
- [[Entity]] `state_a` → `state_b`

## Rules Validated <!-- optional -->

- [[BR-001-RuleName]] - Rule description
- [[BR-002-RuleName]] - Another rule

## Events <!-- optional -->

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
