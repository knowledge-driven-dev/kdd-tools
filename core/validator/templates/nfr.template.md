---
# @file-pattern: ^NFR-.+\.md$
# @path-pattern: 00-requirements/

id: NFR-Name                  # @required @pattern: ^NFR-.+
kind: nfr                     # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

# NFR: Requirement Name <!-- required -->

## Goal <!-- required -->

Clear description of the quality goal:
- What is to be achieved
- Why it is important
- Impact if not met

## Metrics <!-- required -->

| Metric | Target |
|--------|--------|
| P95 latency | < 500ms |
| Error rate | < 0.1% |
| Uptime | 99.9% |

## Affected Use Cases <!-- optional -->

- [[UC-NNN-Name]] - How it affects
- [[UC-MMM-Name]] - How it affects

## Trade-offs <!-- optional -->

Accepted trade-offs:
- Trade-off 1: Description
- Trade-off 2: Description
