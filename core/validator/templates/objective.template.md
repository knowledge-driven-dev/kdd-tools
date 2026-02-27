---
# @file-pattern: ^OBJ-\d{3}-.+\.md$
# @path-pattern: 00-requirements/objectives/

id: OBJ-NNN                   # @required @pattern: ^OBJ-\d{3}$
kind: objective                # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

# OBJ-NNN: Objective Name <!-- required pattern: ^OBJ-\d{3}: -->

## Description <!-- required -->

Clear description of the business objective. What we want to achieve and why it matters.

## Key Results <!-- optional -->

| KR | Target | Measurement |
|----|--------|-------------|
| KR-1 | Metric target | How measured |
| KR-2 | Metric target | How measured |

## Traceability <!-- optional -->

- PRD: [[PRD-Name]]
- Value Units: [[UV-NNN-Name]]
- Use Cases: [[UC-NNN-Name]]
