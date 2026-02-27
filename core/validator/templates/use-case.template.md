---
# @file-pattern: ^UC-\d{3}-.+\.md$
# @path-pattern: 02-behavior/use-cases/

id: UC-NNN                    # @required @pattern: ^UC-\d{3}$
kind: use-case                # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

# UC-NNN: Use Case Title <!-- required pattern: ^UC-\d{3}:\s+.+ -->

## Description <!-- required -->

Clear description of the use case. Explain the main objective and the value it provides.

## Actors <!-- required -->

- **Primary Actor**: [[Actor]] - Role and motivation
- **Secondary Actor**: System/Other actor (optional)

## Preconditions <!-- required -->

1. Condition that must be met before starting
2. Initial state of the system

Triggers:
- Action or event that initiates the use case

## Main Flow (Happy Path) <!-- required -->

1. The Actor performs the first action
2. The System responds
3. The Actor continues...
4. The System **validates** the data
5. The System **persists** the changes
6. The System **emits** event [[EVT-Something-Happened]]
7. The System shows confirmation to the Actor

## Extensions / Alternative Flows <!-- optional -->

### Na. Extension description

1. Condition that triggers the extension
2. Alternative steps
3. Return to main flow or end

### Nb. Another extension

1. ...

## Postconditions <!-- required -->

### On Success

- Final state of the system after success
- Entities created/modified
- Events emitted

**Affected entities detail:**

- There exists an [[Entity]] with:
  - `attribute`: expected value
  - `status`: new status

### On Failure

- State if the use case fails
- Rollback applied
- Logging performed

## Business Rules <!-- optional -->

| Rule | Description |
|------|-------------|
| [[BR-001-RuleName]] | Brief description |
| [[BR-002-RuleName]] | Brief description |
