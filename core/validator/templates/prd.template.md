---
# @type: prd
# @description: Product Requirements Document por epic
# @file-pattern: ^PRD-.+\.md$
# @path-pattern: vision/prd/

id: PRD-Nombre                # @optional @pattern: ^PRD-.+
kind: prd                     # @literal: prd
status: proposed              # @enum: draft|proposed|approved|deprecated @default: proposed
owner: equipo                 # @optional @description: Equipo responsable
stakeholders:                 # @type: array @optional
  - stakeholder1
  - stakeholder2
related:                      # @type: array @optional @description: Artefactos relacionados
  - UC-NNN
  - NFR-XXX
success_metrics:              # @type: array @optional
  - "Métrica 1"
release_criteria:             # @type: array @optional
  - "Criterio 1"
---

# PRD: Nombre del Epic <!-- required -->

## Problema / Oportunidad <!-- required alias: Problem|Opportunity -->

Descripción clara del problema que se resuelve o la oportunidad que se aprovecha.

- ¿Qué dolor tiene el usuario?
- ¿Qué oportunidad de negocio existe?
- ¿Por qué es importante ahora?

## Usuarios y Jobs-to-be-done <!-- required alias: Users|Target Users -->

| Persona | Job-to-be-done | Frecuencia |
|---------|----------------|------------|
| Usuario tipo A | Quiere lograr X para obtener Y | Diario |
| Usuario tipo B | Necesita hacer Z porque W | Semanal |

## Alcance / No Alcance <!-- required alias: Scope -->

### Incluido (In Scope)

- Funcionalidad 1
- Funcionalidad 2
- Funcionalidad 3

### Excluido (Out of Scope)

- Lo que NO se incluye en este PRD
- Funcionalidad diferida a futuro
- Integraciones no contempladas

## Requisitos Funcionales Enlazados <!-- optional alias: Functional Requirements -->

### Casos de Uso

- [[UC-NNN-Nombre]] - Descripción breve
- [[UC-MMM-Nombre]] - Descripción breve

### Reglas de Negocio

- [[BR-XXX-NNN]] - Descripción breve
- [[BR-YYY-NNN]] - Descripción breve

## NFRs y Compliance <!-- optional alias: Non-Functional Requirements -->

- [[NFR-Performance]] - P95 < 500ms
- [[NFR-Security]] - Autenticación requerida
- Compliance: GDPR, accesibilidad WCAG 2.1

## Métricas de Éxito y Telemetría <!-- optional alias: Success Metrics -->

| Métrica | Baseline | Target | Cómo se mide |
|---------|----------|--------|--------------|
| Conversión | 10% | 15% | Analytics event X |
| Tiempo en tarea | 5 min | 2 min | Timer en UI |
| NPS del feature | - | > 50 | Encuesta post-uso |

## Dependencias <!-- optional -->

- **APIs**: [[API-XXX]] - Descripción
- **Eventos**: [[EVT-XXX]] - Descripción
- **Equipos**: Equipo Y para integración Z
- **Infraestructura**: Requisitos de infra

## Criterios de Aceptación / Go-Live <!-- required alias: Acceptance Criteria|Release Criteria -->

- [ ] Todos los escenarios [[SCN-XXX]] en verde
- [ ] Cobertura de tests > 80%
- [ ] Performance validada en staging
- [ ] Documentación de usuario actualizada
- [ ] Rollback plan definido

## Riesgos y Mitigaciones <!-- optional -->

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Riesgo 1 | Alta | Alto | Plan de mitigación |
| Riesgo 2 | Media | Medio | Plan alternativo |

## Timeline y Milestones <!-- optional -->

> Nota: No incluir fechas específicas, solo fases/milestones

- **Fase 1**: MVP con funcionalidad core
- **Fase 2**: Mejoras basadas en feedback
- **Fase 3**: Optimizaciones y scale
