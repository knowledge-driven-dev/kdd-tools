---
# @file-pattern: ^REQ-\d{3}-.+\.md$
# @path-pattern: 04-verification/requirements/

id: REQ-NNN                   # @required @pattern: ^REQ-\d{3}$
kind: requirement              # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
source: UC-NNN                # @pattern: ^UC-\d{3}$
---

# EARS Requirements: Title <!-- required pattern: ^(EARS Requirements|Requisitos EARS): -->

Requirements derived from [[UC-NNN-Name]].

## Summary <!-- optional -->

| ID | EARS Pattern | Summary |
|----|-------------|---------|
| REQ-NNN.1 | Event-Driven | Brief description |
| REQ-NNN.2 | Unwanted (If) | Brief description |
| REQ-NNN.3 | State-Driven | Brief description |

---

## REQ-NNN.1: Requirement Name <!-- required-pattern: ^REQ-\d{3}\.\d+: -->

**Pattern**: Event-Driven | Unwanted (If/While) | State-Driven (While) | Optional (Where) | Ubiquitous

```
WHEN <trigger event>,
the system SHALL <required action>
  AND SHALL <additional action>
  AND SHALL NOT <prohibited action>.
```

**Traceability**: UC-NNN, step X

**Acceptance Criterion**:
<!-- expects: gherkin -->
```gherkin
Given <precondition>
When <action>
Then <expected result>
  And <additional expectation>
```

---

## REQ-NNN.2: Another Requirement <!-- pattern: ^REQ-\d{3}\.\d+: -->

**Pattern**: Unwanted Behavior (If)

```
IF <unwanted condition>,
the system SHALL <defensive action>
  AND SHALL NOT <prohibited action>.
```

**Traceability**: UC-NNN, extension Xa

**Acceptance Criterion**:
```gherkin
Given <context>
When <unwanted condition occurs>
Then <system response>
```

---

## Traceability Matrix <!-- optional -->

| Requirement | UC Step | Business Rule | Test Case |
|-------------|---------|---------------|-----------|
| REQ-NNN.1 | 1-5 | - | VER-NNN.1 |
| REQ-NNN.2 | Ext Xa | BR-001-Name | VER-NNN.2 |
