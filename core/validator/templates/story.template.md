---
# @type: story
# @description: Historia de usuario
# @file-pattern: ^(US|STORY)-\d+.*\.md$
# @path-pattern: behavior/stories/

id: STORY-NNN                 # @optional @pattern: ^(US|STORY)-\d+
kind: story                   # @literal: story
status: proposed              # @enum: draft|proposed|approved|deprecated @default: proposed
related:                      # @type: array @optional @description: Casos de uso relacionados
  - UC-NNN
---

# Historia de Usuario <!-- title-is-name -->

**Como** [tipo de usuario]
**quiero** [acción/funcionalidad]
**para** [beneficio/valor].

## Contexto <!-- optional -->

Información adicional que ayuda a entender la historia:
- Situación actual del usuario
- Por qué es importante
- Restricciones conocidas

## Criterios de Aceptación <!-- required alias: Acceptance Criteria -->

<!-- expects: gherkin -->
```gherkin
Scenario: Descripción del escenario principal
  Given [contexto inicial]
  When [acción del usuario]
  Then [resultado esperado]
    And [resultado adicional]

Scenario: Escenario alternativo
  Given [otro contexto]
  When [otra acción]
  Then [otro resultado]

Scenario: Caso de error
  Given [contexto]
  When [acción que causa error]
  Then [manejo del error]
```

## Casos de Uso Relacionados <!-- optional -->

- [[UC-NNN-Nombre]] - Este caso de uso detalla el flujo completo

## Notas <!-- optional -->

- Consideraciones técnicas
- Dependencias
- Preguntas pendientes

## Diseño <!-- optional -->

Link a mockups o wireframes si existen.
