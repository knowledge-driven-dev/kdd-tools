---
# @type: event
# @description: Evento de dominio
# @file-pattern: ^EVT-.+\.md$
# @path-pattern: domain/events/
id: EVT-NNN      # @type: string id: event @required
tags:                         # @type: array @contains: event @required
  - event
---

# EVT-NNN: Nombre-Del-Evento <!-- title-is-name pattern: ^EVT-.+ -->

## Descripción <!-- required -->

Descripción clara del evento:
- Qué representa
- Cuándo se emite
- Por qué es importante

## Emisor <!-- optional alias: Source|Producer -->

| Entidad | Acción desencadenante |
|---------|----------------------|
| [[Entidad]] | Acción que dispara el evento |

## Payload <!-- required -->

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `entity_id` | uuid | ID de la entidad afectada |
| `campo1` | string | Descripción del campo |
| `campo2` | number | Descripción del campo |
| `estado_anterior` | string | Estado previo (si aplica) |
| `estado_nuevo` | string | Nuevo estado (si aplica) |
| `timestamp` | datetime | Momento del evento |

## Ejemplo <!-- required -->

<!-- expects: json -->
```json
{
  "event": "EVT-Nombre-Del-Evento",
  "version": "1.0",
  "timestamp": "2024-12-06T16:30:00Z",
  "payload": {
    "entity_id": "550e8400-e29b-41d4-a716-446655440000",
    "campo1": "valor",
    "campo2": 42,
    "estado_anterior": "estado1",
    "estado_nuevo": "estado2"
  }
}
```


## Reglas <!-- optional -->

- Condición bajo la cual se emite
- Condición bajo la cual NO se emite
- Garantías de entrega (at-least-once, exactly-once)

## Eventos Relacionados <!-- optional -->

| Evento | Relación |
|--------|----------|
| [[EVT-Evento-Anterior]] | Evento que puede preceder a este |
| [[EVT-Evento-Siguiente]] | Evento que puede seguir a este |
| [[EVT-Evento-Inverso]] | Evento opuesto/compensatorio |
