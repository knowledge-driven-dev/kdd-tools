---
# @type: use-case
# @description: Caso de uso siguiendo formato Cockburn-lite
# @file-pattern: ^UC-\d{3}-.+\.md$
# @path-pattern: behavior/use-cases/

id: UC-NNN                    # @required @pattern: ^UC-\d{3}$
version: 1                    # @type: number @default: 1
status: draft                 # @enum: draft|proposed|approved|deprecated @default: draft
actor: Actor Principal        # @required @description: Actor principal del caso de uso
domain: six-hats              # @optional
tags:                         # @type: array @contains: use-case
  - use-case
---

# UC-NNN: Título del Caso de Uso <!-- required pattern: ^UC-\d{3}:\s+.+ -->

## Descripción <!-- required -->

Descripción clara del caso de uso. Explica el objetivo principal y el valor que aporta.

## Actores <!-- required alias: Actor|Actors -->

- **Actor Principal**: [[Actor]] - Rol y motivación
- **Actor Secundario**: Sistema/Otro actor (opcional)

## Disparadores <!-- optional alias: Trigger|Triggers -->

- Acción o evento que inicia el caso de uso
- Puede haber múltiples disparadores

## Precondiciones <!-- required alias: Preconditions -->

1. Condición que debe cumplirse antes de iniciar
2. Estado inicial del sistema

## Flujo Principal (Happy Path) <!-- required alias: Flujo Principal|Happy Path|Main Flow -->

1. El Actor realiza la primera acción
2. El Sistema responde
3. El Actor continúa...
4. El Sistema **valida** los datos
5. El Sistema **persiste** los cambios
6. El Sistema **emite** evento [[EVT-Algo-Ocurrió]]
7. El Sistema muestra confirmación al Actor

## Extensiones / Flujos Alternativos <!-- optional alias: Extensiones|Extensions|Alternative Flows -->

### Na. Descripción de la extensión

1. Condición que dispara la extensión
2. Pasos alternativos
3. Retorno al flujo principal o fin

### Nb. Otra extensión

1. ...

## Garantías Mínimas <!-- optional alias: Minimal Guarantees -->

- Garantía que se cumple incluso si el caso de uso falla
- El sistema no queda en estado inconsistente

## Postcondiciones <!-- required alias: Postconditions -->

### En caso de éxito (Garantías de Éxito)

- Estado final del sistema tras éxito
- Entidades creadas/modificadas
- Eventos emitidos

**Detalle de entidades afectadas:**

- Existe una [[Entidad]] con:
  - `atributo`: valor esperado
  - `estado`: nuevo estado

### En caso de fallo

- Estado si el caso de uso falla
- Rollback aplicado
- Logging realizado

## Reglas de Negocio Aplicables <!-- optional alias: Business Rules -->

| Regla | Descripción |
|-------|-------------|
| [[BR-XXX-001]] | Descripción breve |
| [[BR-XXX-002]] | Descripción breve |

## Requisitos No Funcionales <!-- optional alias: NFRs -->

- **Rendimiento**: Tiempo máximo de respuesta
- **Disponibilidad**: Comportamiento offline si aplica
- **Accesibilidad**: Requisitos de accesibilidad

## Escenarios de Prueba <!-- optional alias: Test Cases|Test Scenarios -->

| ID | Escenario | Resultado Esperado |
|----|-----------|-------------------|
| TC-NNN.1 | Descripción del escenario | Resultado esperado |
| TC-NNN.2 | Otro escenario | Resultado esperado |

## Eventos Producidos <!-- optional alias: Events -->

| Evento | Descripción |
|--------|-------------|
| [[EVT-Algo-Ocurrió]] | Cuándo se emite |

## Requisitos Relacionados <!-- optional alias: Related Requirements -->

- [[REQ-NNN.1]] - Descripción
- [[REQ-NNN.2]] - Descripción

## Notas de Implementación <!-- optional -->

- Consideraciones técnicas
- Dependencias
- Sugerencias de implementación
