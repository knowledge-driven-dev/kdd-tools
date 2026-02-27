---
# @file-pattern: ^QRY-\d{3}-.+\.md$
# @path-pattern: 02-behavior/queries/

id: QRY-NNN                   # @required @pattern: ^QRY-\d{3}$
kind: query                   # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

# QRY-NNN: QueryName <!-- required pattern: ^QRY-\d{3}: -->

## Purpose <!-- required -->

Brief description of what data this query retrieves and its primary use cases.

## Input <!-- required -->

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paramName | type | Yes/No | Validation rules |
| userId | UUID | Yes | Must be authenticated user |

### Filters <!-- optional -->

| Filter | Type | Description |
|--------|------|-------------|
| status | enum | Filter by status |
| dateFrom | date | Start date |
| dateTo | date | End date |

### Sorting <!-- optional -->

| Field | Default | Description |
|-------|---------|-------------|
| createdAt | desc | Sort by creation date |

### Pagination <!-- optional -->

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | number | 1 | - |
| limit | number | 20 | 100 |

## Output <!-- required -->

| Field | Type | Description |
|-------|------|-------------|
| field | type | Field description |
| nested.subfield | type | Nested field description |

## Authorization <!-- required -->

- User must be authenticated
- User can only see own resources (unless admin)
- Specific permission requirements

## Possible Errors <!-- required -->

| Code | Condition | Message |
|------|-----------|---------|
| QRY-001 | Not found | "Resource not found" |
| QRY-002 | Not authorized | "Access denied" |

## Examples <!-- optional -->

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```
