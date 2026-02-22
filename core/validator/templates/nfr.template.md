---
# @type: nfr
# @description: Requisito no funcional
# @file-pattern: ^NFR-.+\.md$
# @path-pattern: quality/

id: NFR-Nombre                # @optional @pattern: ^NFR-.+
kind: nfr                     # @literal: nfr
status: proposed              # @enum: draft|proposed|approved|deprecated @default: proposed
category: performance         # @optional @enum: performance|availability|security|scalability|usability|maintainability
---

# NFR: Nombre del Requisito <!-- required -->

## Categoría <!-- optional -->

Performance | Availability | Security | Scalability | Usability | Maintainability | Observability

## Objetivo <!-- required alias: Goal|Target -->

Descripción clara del objetivo de calidad:
- Qué se quiere lograr
- Por qué es importante
- Impacto si no se cumple

## SLI (Service Level Indicator) <!-- optional -->

Métrica específica que se mide:

```
nombre_metrica{labels}
```

Ejemplos:
- `http_request_duration_seconds{route="/api/endpoint", quantile="0.95"}`
- `error_rate{service="api"}`
- `availability_percentage{service="web"}`

## SLO (Service Level Objective) <!-- optional -->

Objetivo concreto:

| Métrica | Objetivo | Ventana |
|---------|----------|---------|
| P95 latencia | < 500ms | 30 días |
| Error rate | < 0.1% | 7 días |
| Uptime | 99.9% | Mensual |

## Estrategias <!-- optional alias: Strategies|Implementation -->

Cómo se logrará el objetivo:

- **Caching**: Estrategia de caché
- **CDN**: Uso de CDN para assets
- **Database**: Índices, queries optimizadas
- **Architecture**: Patrones arquitectónicos
- **Monitoring**: Alertas y dashboards

## Medición <!-- optional alias: Measurement -->

Cómo se mide y monitorea:

- **Herramienta**: Prometheus, Datadog, etc.
- **Dashboard**: Link al dashboard
- **Alertas**: Condiciones de alerta

## Casos de Uso Afectados <!-- optional -->

- [[UC-NNN-Nombre]] - Cómo afecta
- [[UC-MMM-Nombre]] - Cómo afecta

## Trade-offs <!-- optional -->

Compromisos aceptados:
- Trade-off 1: Descripción
- Trade-off 2: Descripción
