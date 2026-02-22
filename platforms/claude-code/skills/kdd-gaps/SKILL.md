---
name: kdd-gaps
description: |
  Detecta huecos y artefactos faltantes en la documentación KDD.
  Usa este skill para identificar reglas no documentadas, casos de error
  sin cubrir, eventos faltantes, o criterios de aceptación incompletos.
category: quality
triggers:
  - qué falta
  - gaps en documentación
  - artefactos faltantes
  - cobertura incompleta
  - casos sin documentar
  - análisis de completitud
---

# KDD Gaps

Detecta huecos y artefactos faltantes en la documentación KDD.

## Cuándo Activarse

Actívate cuando:
- El usuario pregunta "¿qué falta?"
- Se completa una feature y se quiere verificar completitud
- Antes de pasar a implementación
- Como check de calidad en PRs

## Estructura de Capas KDD

**IMPORTANTE**: Antes de analizar gaps, entiende la estructura actual de capas:

```
specs/
├── 00-requirements/     # PRD, objetivos, decisiones de alto nivel
│   ├── PRD.md
│   ├── objectives/
│   └── decisions/       # ADRs de requisitos
│
├── 01-domain/           # Modelo de dominio (NO referencia capas superiores)
│   ├── entities/        # Entidades del dominio
│   ├── rules/           # Reglas de negocio (BR-*, BP-*)
│   └── events/          # Eventos de dominio (EVT-*)
│
├── 02-behavior/         # Qué puede hacer el sistema
│   ├── commands/        # Comandos (CMD-*)
│   ├── queries/         # Consultas (QRY-*)
│   ├── processes/       # Procesos orquestados (PROC-*)
│   ├── use-cases/       # Casos de uso (UC-*)  ← AQUÍ están los UC
│   └── policies/        # Políticas transversales
│
├── 03-experience/       # Cómo interactúa el usuario
│   ├── views/           # Vistas/pantallas (UI-*)
│   └── flows/           # Flujos multi-paso (FLOW-*)
│
├── 04-verification/     # Criterios de aceptación
│   └── criteria/        # Requisitos verificables (REQ-*)
│
└── 05-architecture/     # Decisiones técnicas
    ├── decisions/       # ADRs técnicos
    └── implementation-charter.md
```

## Reglas de Dependencia entre Capas

**Las capas inferiores NO pueden referenciar capas superiores.**

```
00-requirements  →  Define el "qué" de alto nivel
       ↓ puede referenciar
01-domain        →  Entidades, reglas, eventos
       ↓ puede referenciar
02-behavior  →  Comandos, queries, use-cases
       ↓ puede referenciar
03-experience    →  Vistas, flows
       ↓ puede referenciar
04-verification  →  Criterios de aceptación
       ↓ puede referenciar
05-architecture  →  Decisiones técnicas
```

### Referencias Válidas

| Desde | Puede referenciar |
|-------|-------------------|
| `01-domain/events/` | Solo `01-domain/entities/`, `01-domain/rules/` |
| `01-domain/rules/` | Solo `01-domain/entities/` |
| `02-behavior/commands/` | `01-domain/*`, `02-behavior/processes/` |
| `02-behavior/use-cases/` | `01-domain/*`, `02-behavior/commands,queries/` |
| `03-experience/views/` | `01-domain/entities/`, `02-behavior/use-cases/` |
| `04-verification/criteria/` | Todas las capas superiores |

### NO es un Gap (Falsos Positivos a Evitar)

| Situación | Por qué NO es gap |
|-----------|-------------------|
| Evento sin mención de comando | Correcto: eventos (01) no referencian comandos (02) |
| Entidad sin mención de vista | Correcto: entidades (01) no referencian vistas (03) |
| Regla sin mención de criterio | Correcto: reglas (01) no referencian verificación (04) |
| Use cases en 02-behavior | Correcto: es su ubicación actual |

## Diferencia con kdd-trace

| kdd-trace | kdd-gaps |
|-----------|----------|
| Muestra conexiones existentes | Detecta conexiones faltantes |
| "¿Qué tenemos?" | "¿Qué nos falta?" |
| Descriptivo | Prescriptivo |

## Proceso

### Fase 1: Cargar Estructura Actual

**Antes de analizar**, verifica la estructura real:
```bash
ls specs/*/
```

No asumas estructura - las capas pueden haber cambiado.

### Fase 2: Detectar Huecos por Categoría

#### A. Reglas de Negocio Faltantes

Busca patrones que sugieren reglas no documentadas:
- Límites mencionados sin regla (`máximo 6` → ¿dónde está BR-X?)
- Validaciones en comandos sin regla en `01-domain/rules/`
- Condiciones en casos de uso sin regla explícita

```markdown
### Reglas Potencialmente Faltantes

| Señal Detectada | Ubicación | Regla Sugerida |
|-----------------|-----------|----------------|
| "máximo 6 personas" | CMD-009 | BR-PERSONA-00X: Límite de personas |
| "solo si tiene créditos" | CMD-009 | BR-CREDITO-00X: Validación de créditos |
```

#### B. Casos de Error Sin Documentar

Analiza comandos buscando:
- Precondiciones que pueden fallar sin error code
- Estados inválidos no manejados
- Errores de integración externa (IA, pagos)

```markdown
### Casos de Error Faltantes

| Artefacto | Caso de Error | Impacto |
|-----------|---------------|---------|
| CMD-009 | ¿Qué pasa si el Reto no tiene Personas? | Alto |
| CMD-011 | ¿Qué pasa si la IA no responde? | Alto |
```

#### C. Eventos Sin Definir

Busca en **máquinas de estado de entidades** transiciones sin evento:
- Estado A → Estado B en entidad pero sin EVT-* en `01-domain/events/`

**Nota**: Los eventos se definen en 01-domain y son disparados por comandos en 02-behavior. El comando referencia al evento, no al revés.

```markdown
### Eventos Potencialmente Faltantes

| Transición | Entidad | Evento Sugerido |
|------------|---------|-----------------|
| Sesión: activa → pausada | Sesión.md | EVT-Sesion-Pausada |
| Reto: borrador → publicado | Reto.md | EVT-Reto-Publicado |
```

#### D. Criterios de Aceptación Incompletos

Para cada caso de uso en `02-behavior/use-cases/`, verifica:
- ¿Tiene criterios en `04-verification/criteria/`?
- ¿Los criterios cubren el flujo principal?
- ¿Los criterios cubren flujos alternativos?

```markdown
### Criterios Faltantes

| Caso de Uso | Cobertura | Faltante |
|-------------|-----------|----------|
| UC-001 | 80% | Falta criterio para duplicar reto |
| UC-004 | 60% | Faltan criterios de error de IA |
```

#### E. Vistas/Flows Sin Spec

Busca en casos de uso referencias a UI no documentadas:
- Pantallas mencionadas sin UI-* en `03-experience/views/`
- Flujos multi-paso sin FLOW-* en `03-experience/flows/`

### Fase 3: Priorizar Huecos

```markdown
## Resumen de Gaps

### Críticos (bloquean implementación)
1. ❌ CMD-009 no tiene manejo de error para "sin créditos"
2. ❌ UC-004 no define qué pasa si IA falla

### Importantes (deberían resolverse)
1. ⚠️ 3 eventos de transición sin documentar
2. ⚠️ UC-007 sin criterios de aceptación

### Menores (nice to have)
1. 💡 Algunas entidades sin ejemplos concretos
2. 💡 Reglas sin casos de violación documentados

### Estadísticas
- Total gaps detectados: 12
- Críticos: 2
- Importantes: 5
- Menores: 5
```

### Fase 4: Sugerir Acciones

```markdown
## Acciones Recomendadas

1. **Inmediato**: Crear BR-CREDITO-00X para validación de créditos
2. **Inmediato**: Documentar error handling en CMD-009
3. **Próximo sprint**: Completar criterios de UC-004, UC-007
4. **Backlog**: Añadir ejemplos a entidades
```

## Uso en CI/CD

### GitHub Action para PRs
```yaml
- name: KDD Gaps Check
  run: |
    # Ejecutar análisis de gaps
    # Fallar si hay gaps críticos
```

### Bloquear Merge
- Si hay gaps críticos en artefactos modificados → bloquear
- Si hay gaps importantes → warning en PR

## Skills Relacionados

- `kdd-trace` - Para ver conexiones existentes
- `kdd-author` - Para crear artefactos faltantes
- `kdd-review` - Para validar artefactos creados

## Referencias

- Metodología KDD: `kdd/kdd.md`
- Documentación de capas: `kdd/docs/layers/`
