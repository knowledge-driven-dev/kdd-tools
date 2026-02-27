---
# @file-pattern: ^VER-\d{3}-.+\.md$
# @path-pattern: 04-verification/criteria/

id: VER-NNN                   # @required @pattern: ^VER-\d{3}$
kind: verification             # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
source: UC-NNN                # @required @pattern: ^UC-\d{3}$
---

# VER-NNN: Verification of UC Title <!-- required pattern: ^VER-\d{3}:\s+.+ -->

Scenarios that verify [[UC-NNN-Name]].

## Coverage <!-- required -->

| ID | Covers | Type |
|----|--------|------|
| VER-NNN.1 | Main flow | Happy path |
| VER-NNN.2 | Extension A | Alternative |
| VER-NNN.3 | Extension B | Error |
| VER-NNN.4 | Edge case | Boundary |

## VER-NNN.1: Scenario title <!-- required-pattern: ^VER-\d{3}\.\d+: -->

```gherkin
Given <precondition with concrete data>
When <action the actor performs>
Then <observable outcome>
  And <additional outcome>
```

## VER-NNN.2: Scenario title <!-- pattern: ^VER-\d{3}\.\d+: -->

```gherkin
Given <precondition with concrete data>
When <action that triggers alternative path>
Then <expected system response>
```

## VER-NNN.3: Scenario title <!-- pattern: ^VER-\d{3}\.\d+: -->

```gherkin
Given <precondition with concrete data>
When <action that causes error>
Then <error handling behavior>
  And <system state remains consistent>
```
