---
paths:
  - specs/_shared/**
  - specs/domains/*/_manifest.yaml
---

# Elementos Compartidos y Multi-Dominio KDD

> Aplica a `specs/_shared/` y manifests de dominio

## Estructura Multi-Dominio

```
specs/
├── _shared/                    # Elementos transversales
│   ├── policies/               # XP-NNN-{Name} Cross-domain policies
│   ├── glossary.md             # Términos globales
│   ├── domain-map.md           # Mapa de dominios
│   └── nfr/                    # NFRs globales
│
└── domains/                    # Bounded contexts
    ├── core/                   # Dominio fundacional
    │   ├── _manifest.yaml      # Metadatos del dominio
    │   ├── 01-domain/
    │   ├── 02-behavior/
    │   └── 03-experience/
    │
    ├── auth/
    ├── billing/
    └── sessions/
```

## Manifest de Dominio (`_manifest.yaml`)

### Ubicación

`specs/domains/{domain-name}/_manifest.yaml`

### Estructura Mínima

```yaml
domain:
  id: sessions                  # Debe coincidir con carpeta
  name: "Sesiones Six Hats"
  description: "Gestión de sesiones de pensamiento"
  status: active                # active|deprecated|experimental|frozen
```

### Estructura Completa

```yaml
domain:
  id: sessions
  name: "Sesiones Six Hats"
  description: |
    Dominio principal. Gestiona el ciclo completo de sesiones
    de pensamiento estructurado con personas sintéticas.
  status: active
  team: "@team-core"
  version: "1.0.0"
  tags: [core-business, six-hats]

dependencies:
  - domain: core
    type: required              # required|optional|event-only
    reason: "Usuarios y Retos son fundacionales"
    imports:
      entities: [Usuario, Reto]
      events: [EVT-Reto-Creado]

  - domain: billing
    type: optional
    reason: "Funciona sin créditos en modo demo"
    imports:
      events: [EVT-Credito-Consumido]

exports:
  entities: [Sesion, Ronda, Idea]
  events: [EVT-Sesion-Iniciada, EVT-Sesion-Completada]
  commands: [CMD-IniciarSesion]
  queries: [QRY-ObtenerSesion]

context-map:
  upstream: [core, billing]
  downstream: [analytics]

boundaries:
  anti-corruption:
    - external: "billing::Credito"
      internal: CreditoDisponible
      notes: "Solo nos interesa el balance"
```

### Campos del Manifest

| Sección | Campo | Requerido | Descripción |
|---------|-------|-----------|-------------|
| `domain` | `id` | Sí | Identificador (kebab-case) |
| `domain` | `name` | Sí | Nombre legible |
| `domain` | `description` | Sí | Propósito y alcance |
| `domain` | `status` | Sí | Estado del dominio |
| `dependencies` | `domain` | - | ID del dominio dependencia |
| `dependencies` | `type` | - | `required`, `optional`, `event-only` |
| `exports` | - | - | Artefactos públicos |

## Wiki-Links Cross-Domain

```markdown
# Mismo dominio (busca local → core)
[[Sesion]]

# Dominio explícito
[[core::Usuario]]
[[billing::Credito]]

# Elemento compartido
[[_shared::XP-002-Audit]]
```

## Políticas Compartidas (`_shared/policies/`)

### Naming

Pattern: `XP-NNN-{Name}.md` (Cross-Policy)

Examples:
- `XP-001-Logging.md`
- `XP-002-Audit.md`
- `XP-003-Security.md`

### Structure

```markdown
---
id: XP-001-Logging
kind: cross-policy
status: approved
---

# XP-001-Logging: Logging Policy

## Statement

Every command and query must log entry and exit with a correlation ID.

## Rationale

Correlation IDs enable end-to-end tracing across services and domains,
which is essential for debugging, auditing, and observability.

## When Applies

Applies to ALL domains, for every command handler and query handler.

## Violation Behavior

WHEN a command or query handler does not include a `correlationId`
in its log output, the Sistema SHALL reject the deployment
AND SHALL report a compliance violation.

## EARS Formalization

WHEN a command or query is executed,
the Sistema SHALL log entry and exit at INFO level
  AND SHALL include `correlationId` in every log entry
  AND SHALL NOT log sensitive data (passwords, tokens).

WHEN a command or query fails,
the Sistema SHALL log at ERROR level
  AND SHALL include `correlationId` and error details.

## Standard Behavior

1. Log level INFO for successful operations
2. Log level ERROR for failures
3. Include `correlationId` in all log entries
4. Never log sensitive data (passwords, tokens)

## Examples

**Correct:**
```json
{ "level": "INFO", "correlationId": "abc-123", "msg": "CMD-CreateSession started" }
```

**Incorrect:**
```json
{ "level": "INFO", "msg": "session started" }
```
(Missing `correlationId`)
```

## Domain Map (`_shared/domain-map.md`)

```markdown
# Mapa de Dominios

## Diagrama

```mermaid
graph TD
    subgraph Foundation
        CORE[core]
    end

    subgraph Business
        AUTH[auth]
        BILLING[billing]
        SESSIONS[sessions]
    end

    AUTH --> CORE
    BILLING --> CORE
    SESSIONS --> CORE
    SESSIONS -.-> BILLING
```

## Matriz de Dependencias

| Dominio | Depende de | Exporta a |
|---------|------------|-----------|
| core | - | auth, billing, sessions |
| auth | core | sessions |
| sessions | core, billing | analytics |
```

## Reglas de Dependencia

| Regla | Descripción |
|-------|-------------|
| Core fundacional | `core` no puede depender de ningún otro dominio |
| Explícitas | Toda dependencia en `_manifest.yaml` |
| Sin ciclos | A → B → A prohibido |
| Anti-corruption | Traducciones para conceptos externos |

## Niveles de Dominio

```
┌─────────────────────────────────────────────┐
│  LEAF (sin dependientes)                    │
│  sessions, analytics                        │
├─────────────────────────────────────────────┤
│  MIDDLE (bidireccional)                     │
│  auth, billing                              │
├─────────────────────────────────────────────┤
│  CORE (fundacional)                         │
│  core                                       │
└─────────────────────────────────────────────┘
```
