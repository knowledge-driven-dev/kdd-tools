---
# @file-pattern: ^(BR|BP|XP)-\d{3}-.+\.md$
# @path-pattern: 01-domain/rules/ (BR), 02-behavior/policies/ (BP, XP)

id: BR-NNN-{Name}             # @required @pattern: ^(BR|BP|XP)-\d{3}$
kind: business-rule           # @required @enum: business-rule|business-policy|cross-policy
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

<!--
  KIND VARIANTS — when to use each prefix:

  BR (Business Rule)    → Structural constraint on a domain entity.
                          Invariant that must always hold. Lives in 01-domain/rules/.
                          Example: "An Order title must be 1-100 characters."

  BP (Business Policy)  → Configurable behavior tied to a specific entity or process.
                          Has parameters that can change. Lives in 02-behavior/policies/.
                          Example: "Session timeout after 30 minutes of inactivity."

  XP (Cross-Policy)     → Cross-cutting behavior that applies transversally to multiple
                          commands/queries. Uses BEFORE/AFTER pattern. Lives in 02-behavior/policies/.
                          Example: "All billable commands must verify credit balance before execution."
-->

# BR-NNN-Name: RuleTitle <!-- required pattern: ^(BR|BP|XP)-\d{3}-[A-Za-z]+: -->

## Statement <!-- required -->

Clear statement of the rule in natural language, understandable by non-technical stakeholders. Affected domain entities should be mentioned with wiki-links: [[Entity1]], [[Entity2]].

## Rationale <!-- required -->

Brief business reason. Explains the risk it prevents or the benefit it protects.

## When Applies <!-- required -->

Indicates at which points in the entity lifecycle the rule is evaluated (create, modify, state change).

## Violation Behavior <!-- required -->

Expected outcome when the rule fails. Example: user-visible error, blocked operation, disallowed state.

## Parameters (BP only) <!-- optional -->

If this is a Business Policy, list configurable parameters and their default values.

## Formalization <!-- optional -->

```
IF/WHEN/WHILE [condition],
the system SHALL [action]
  AND SHALL [additional action]
  AND SHALL NOT [prohibited action].
```

## EARS Formalization (XP only) <!-- optional -->

```
BEFORE executing any command with {attribute}={value},
the system SHALL {verification}
  AND SHALL {action if OK}
  AND SHALL reject with error "{ERROR_CODE}" if {rejection condition}.

AFTER a command completes successfully,
the system SHALL {post-success action}.

AFTER a command fails,
the system SHALL {post-failure action}.
```

## Standard Behavior (XP only) <!-- optional -->

### Verification (BEFORE)
What is verified before executing the command.

### Success (AFTER)
What happens after the command completes successfully.

### Rejection
What happens if verification fails. Include error code and standard message.

### Rollback
What happens if the command fails after passing verification.

## Examples <!-- required -->

### Valid Cases
- Example of valid scenario
- Another valid scenario

### Invalid Cases
- Example of invalid scenario → expected behavior
- Another invalid scenario → expected behavior
