---
# @type: adr
# @description: Architecture Decision Record
# @file-pattern: ^ADR-\d{4}.*\.md$
# @path-pattern: architecture/adr/

id: ADR-NNNN                  # @required @pattern: ^ADR-\d{4}$
kind: adr                     # @literal: adr
status: proposed              # @enum: draft|proposed|approved|deprecated|superseded @default: proposed
supersedes:                   # @type: array @optional @description: ADRs que este reemplaza
  - ADR-XXXX
superseded_by:                # @optional @description: ADR que reemplaza a este
date: YYYY-MM-DD              # @optional @type: date
deciders:                     # @type: array @optional
  - Nombre 1
  - Nombre 2
---

# ADR-NNNN: Título de la Decisión <!-- required pattern: ^ADR-\d{4}: -->

## Estado <!-- optional -->

Proposed | Accepted | Deprecated | Superseded by [[ADR-XXXX]]

## Contexto <!-- required alias: Context -->

Descripción del contexto y el problema que requiere una decisión:

- Situación actual
- Fuerzas en juego (requisitos, restricciones, concerns)
- Por qué se necesita tomar una decisión ahora

## Decisión <!-- required alias: Decision -->

La decisión tomada:

**Elegimos [opción elegida] porque [razón principal].**

Detalles de la decisión:
- Qué se hará
- Cómo se implementará
- Quién es responsable

## Opciones Consideradas <!-- optional alias: Options|Alternatives -->

### Opción 1: Nombre

- **Pros**: Ventajas
- **Cons**: Desventajas
- **Motivo de descarte**: Por qué no se eligió

### Opción 2: Nombre

- **Pros**: Ventajas
- **Cons**: Desventajas
- **Motivo de descarte**: Por qué no se eligió

### Opción 3: [Elegida]

- **Pros**: Ventajas
- **Cons**: Desventajas aceptadas
- **Motivo de elección**: Por qué se eligió esta

## Consecuencias <!-- required alias: Consequences -->

### Positivas

- Beneficio 1
- Beneficio 2
- Mejora en X

### Negativas

- Trade-off aceptado 1
- Complejidad adicional en Y
- Deuda técnica potencial en Z

### Neutrales

- Cambio que no es ni positivo ni negativo

## Plan de Implementación <!-- optional -->

1. Paso 1
2. Paso 2
3. Paso 3

## Referencias <!-- optional -->

- Link a documentación relevante
- Papers o artículos consultados
- ADRs relacionados: [[ADR-XXXX]]
