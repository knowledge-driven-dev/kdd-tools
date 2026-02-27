---
# @file-pattern: ^PRD-.+\.md$
# @path-pattern: 00-requirements/

id: PRD-Name                  # @required @pattern: ^PRD-.+
kind: prd                     # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

# PRD: Epic Name <!-- required -->

## Problem / Opportunity <!-- required -->

Clear description of the problem being solved or the opportunity being seized.

- What pain does the user have?
- What business opportunity exists?
- Why is it important now?

## Users and Jobs-to-be-done <!-- required -->

| Persona | Job-to-be-done | Frequency |
|---------|----------------|-----------|
| User type A | Wants to achieve X to obtain Y | Daily |
| User type B | Needs to do Z because W | Weekly |

## Scope <!-- required -->

### In Scope

- Functionality 1
- Functionality 2
- Functionality 3

### Out of Scope

- What is NOT included in this PRD
- Functionality deferred to future
- Integrations not considered

## Acceptance Criteria / Go-Live <!-- required -->

- [ ] All scenarios [[SCN-XXX]] passing
- [ ] Test coverage > 80%
- [ ] Performance validated in staging
- [ ] User documentation updated
- [ ] Rollback plan defined

## Success Metrics <!-- optional -->

| Metric | Baseline | Target | How measured |
|--------|----------|--------|--------------|
| Conversion | 10% | 15% | Analytics event X |
| Time on task | 5 min | 2 min | UI timer |
| Feature NPS | - | > 50 | Post-use survey |
