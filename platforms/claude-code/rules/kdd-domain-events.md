---
paths:
  - specs/01-domain/events/**
  - specs/domains/*/01-domain/events/**
---

# Eventos de Dominio KDD

> Aplica cuando trabajas en `specs/01-domain/events/`

## Nombrado de Archivo

Patrón: `EVT-Entidad-Accion.md`

Ejemplos:
- `EVT-Reto-Creado.md`
- `EVT-Sesion-Iniciada.md`
- `EVT-Ronda-Completada.md`

## Frontmatter Requerido

```yaml
---
kind: event
---
```

## Estructura del Documento

```markdown
# EVT-Entidad-Accion

## Description <!-- required -->
- Qué representa el evento
- Cuándo se emite
- Por qué es importante

## Emitter <!-- optional -->
| Entity | Triggering action |
|--------|-------------------|
| [[Reto]] | Cuando se crea un nuevo Reto |

## Payload <!-- required -->
| Field | Type | Description |
|-------|------|-------------|
| `entity_id` | uuid | ID de la entidad afectada |
| `previous_state` | string | Estado anterior (si aplica) |
| `new_state` | string | Nuevo estado |
| `timestamp` | datetime | Momento del evento |

## Example <!-- required -->
## Subscribers <!-- optional -->
## Rules <!-- optional -->
## Related Events <!-- optional -->
```

## Payload: Campos Comunes

| Campo | Cuándo incluir |
|-------|----------------|
| `entity_id` | Siempre |
| `timestamp` | Siempre |
| `previous_state` / `new_state` | Cambios de estado |
| `actor_id` | Acciones de usuario |
| `metadata` | Contexto adicional |

## Subscribers

Documentar quién reacciona al evento:

```markdown
## Subscribers

| System/Process | Reaction |
|----------------|----------|
| UI | Actualiza la interfaz |
| Notifications | Envía notificación push |
| Analytics | Registra métrica |
| [[PROC-001]] | Inicia proceso derivado |
```

## Eventos Relacionados

```markdown
## Related Events

| Event | Relationship |
|-------|--------------|
| [[EVT-Reto-Configurado]] | Evento que precede |
| [[EVT-Sesion-Iniciada]] | Evento que puede seguir |
| [[EVT-Reto-Cancelado]] | Evento inverso/compensatorio |
```

## Ejemplo Completo

```markdown
---
kind: event
---

# EVT-Reto-Creado

## Description

Se emite cuando un [[Usuario]] crea un nuevo [[Reto]]. Marca el inicio
del flujo de configuración del Reto.

## Emitter

| Entity | Triggering action |
|--------|-------------------|
| [[Reto]] | Usuario completa formulario de creación |

## Payload

| Field | Type | Description |
|-------|------|-------------|
| `reto_id` | uuid | ID del Reto creado |
| `usuario_id` | uuid | ID del Usuario propietario |
| `titulo` | string | Título del Reto |
| `timestamp` | datetime | Momento de creación |

## Example

```json
{
  "event": "EVT-Reto-Creado",
  "version": "1.0",
  "timestamp": "2024-12-06T16:30:00Z",
  "payload": {
    "reto_id": "550e8400-e29b-41d4-a716-446655440000",
    "usuario_id": "123e4567-e89b-12d3-a456-426614174000",
    "titulo": "Estrategia de lanzamiento Q1"
  }
}
```

## Subscribers

| System/Process | Reaction |
|----------------|----------|
| UI | Redirige a pantalla de configuración |
| Analytics | Registra evento de creación |

## Related Events

| Event | Relationship |
|-------|--------------|
| [[EVT-Reto-Configurado]] | Siguiente evento esperado |
| [[EVT-Reto-Eliminado]] | Evento compensatorio |
```
