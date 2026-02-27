/**
 * Definición de estructura esperada (secciones) por tipo de documento
 * Alineado con KDD v2.0 — headings en inglés, secciones actualizadas
 */

import type { DocType } from '../lib/parser'

export interface SectionDefinition {
  /** Nombre de la sección (heading) */
  name: string
  /** Nivel del heading (1, 2, 3...) */
  level: number
  /** Si es obligatoria */
  required: boolean
  /** Patrones alternativos aceptados (regex) */
  alternatives?: RegExp[]
  /** Descripción para mensajes de error */
  description?: string
}

export interface StructureTemplate {
  /** Secciones esperadas */
  sections: SectionDefinition[]
  /** Si debe tener un H1 único */
  requiresH1: boolean
  /** Regex para validar el formato del H1 */
  h1Pattern?: RegExp
}

// =============================================================================
// Template: Use Case (UC-NNN)
// =============================================================================
const useCaseTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^UC-\d{3}:\s*.+/,
  sections: [
    { name: 'Description', level: 2, required: true, alternatives: [/^Descripci[oó]n/i] },
    { name: 'Actors', level: 2, required: true, alternatives: [/^Actor(es|s)?/i] },
    { name: 'Triggers', level: 2, required: false, alternatives: [/^Disparadores/i] },
    { name: 'Preconditions', level: 2, required: true, alternatives: [/^Precondiciones/i] },
    {
      name: 'Main Flow',
      level: 2,
      required: true,
      alternatives: [/^(Flujo Principal|Happy Path|Main Flow)/i],
    },
    {
      name: 'Extensions',
      level: 2,
      required: false,
      alternatives: [/^(Extensiones|Flujos Alternativos|Alternative)/i],
    },
    {
      name: 'Minimal Guarantees',
      level: 2,
      required: false,
      alternatives: [/^Garant[ií]as M[ií]nimas/i],
    },
    { name: 'Postconditions', level: 2, required: true, alternatives: [/^Postcondiciones/i] },
    {
      name: 'Business Rules',
      level: 2,
      required: false,
      alternatives: [/^(Reglas de Negocio|Business Rules)/i],
    },
    {
      name: 'Test Scenarios',
      level: 2,
      required: false,
      alternatives: [/^(Escenarios|Test Cases|Test Scenarios)/i],
    },
  ],
}

// =============================================================================
// Template: Requirement (REQ-NNN)
// =============================================================================
const requirementTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^(Requisitos|Requirements)/i,
  sections: [
    {
      name: 'Summary',
      level: 2,
      required: false,
      alternatives: [/^(Resumen|Summary)/i],
    },
    {
      name: 'REQ-',
      level: 2,
      required: true,
      alternatives: [/^REQ-\d{3}\.\d+/],
      description: 'At least one individual requirement (REQ-NNN.X)',
    },
    {
      name: 'Traceability Matrix',
      level: 2,
      required: false,
      alternatives: [/^(Matriz|Traceability)/i],
    },
  ],
}

// =============================================================================
// Template: Entity
// =============================================================================
const entityTemplate: StructureTemplate = {
  requiresH1: false, // H1 is the entity name
  sections: [
    { name: 'Description', level: 2, required: true, alternatives: [/^Descripci[oó]n/i] },
    { name: 'Attributes', level: 2, required: true, alternatives: [/^Atributos/i] },
    { name: 'Relations', level: 2, required: false, alternatives: [/^Relaciones/i] },
    {
      name: 'Lifecycle',
      level: 2,
      required: false,
      alternatives: [/^(Ciclo de Vida|Lifecycle|State)/i],
    },
    {
      name: 'Invariants',
      level: 2,
      required: false,
      alternatives: [/^(Invariantes|Invariants|Constraints)/i],
    },
  ],
}

// =============================================================================
// Template: Event (EVT-xxx)
// =============================================================================
const eventTemplate: StructureTemplate = {
  requiresH1: false,
  sections: [
    { name: 'Description', level: 2, required: true, alternatives: [/^Descripci[oó]n/i] },
    { name: 'Emitter', level: 2, required: false, alternatives: [/^(Emisor|Source)/i] },
    { name: 'Payload', level: 2, required: true },
    { name: 'Example', level: 2, required: false, alternatives: [/^Ejemplo/i] },
    {
      name: 'Subscribers',
      level: 2,
      required: false,
      alternatives: [/^(Suscriptores|Consumers)/i],
    },
  ],
}

// =============================================================================
// Template: Rule (BR-NNN-Name) / Business Policy / Cross-Policy
// =============================================================================
const ruleTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^(BR|BP|XP)-\d{3}/,
  sections: [
    { name: 'Statement', level: 2, required: true, alternatives: [/^Declaraci[oó]n/i] },
    { name: 'Rationale', level: 2, required: true, alternatives: [/^Justificaci[oó]n/i] },
    { name: 'When Applies', level: 2, required: true, alternatives: [/^Cu[aá]ndo Aplica/i] },
    { name: 'Violation Behavior', level: 2, required: true, alternatives: [/^Comportamiento ante Violaci[oó]n/i] },
    {
      name: 'EARS Formalization',
      level: 2,
      required: false,
      alternatives: [/^(Formalizaci[oó]n|Formalization|EARS)/i],
    },
    { name: 'Examples', level: 2, required: false, alternatives: [/^Ejemplos/i] },
  ],
}

// =============================================================================
// Template: Process (PROC-NNN)
// =============================================================================
const processTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^PROC-\d{3}/,
  sections: [
    { name: 'Description', level: 2, required: false, alternatives: [/^Descripci[oó]n/i] },
    { name: 'Triggers', level: 2, required: false, alternatives: [/^Disparadores/i] },
    {
      name: 'Flow',
      level: 2,
      required: false,
      alternatives: [/^(Diagrama|Flujo)/i],
      description: 'Mermaid block expected',
    },
    { name: 'Steps', level: 2, required: false, alternatives: [/^Pasos/i] },
    { name: 'Compensation', level: 2, required: false, alternatives: [/^Compensaci[oó]n/i] },
  ],
}

// =============================================================================
// Template: Command (CMD-NNN)
// =============================================================================
const commandTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^CMD-\d{3}/,
  sections: [
    { name: 'Purpose', level: 2, required: true, alternatives: [/^Prop[oó]sito/i] },
    { name: 'Input', level: 2, required: true, alternatives: [/^Entrada/i] },
    { name: 'Preconditions', level: 2, required: true, alternatives: [/^Precondiciones/i] },
    { name: 'Postconditions', level: 2, required: true, alternatives: [/^Postcondiciones/i] },
    { name: 'Errors', level: 2, required: true, alternatives: [/^(Errores|Possible Errors)/i] },
    { name: 'Rules Validated', level: 2, required: false, alternatives: [/^Reglas Validadas/i] },
    { name: 'Events Emitted', level: 2, required: false, alternatives: [/^Eventos Emitidos/i] },
  ],
}

// =============================================================================
// Template: Query (QRY-NNN)
// =============================================================================
const queryTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^QRY-\d{3}/,
  sections: [
    { name: 'Purpose', level: 2, required: true, alternatives: [/^Prop[oó]sito/i] },
    { name: 'Input', level: 2, required: true, alternatives: [/^Entrada/i] },
    { name: 'Output', level: 2, required: true, alternatives: [/^Salida/i] },
    { name: 'Authorization', level: 2, required: false, alternatives: [/^Autorizaci[oó]n/i] },
    { name: 'Errors', level: 2, required: false, alternatives: [/^(Errores|Possible Errors)/i] },
  ],
}

// =============================================================================
// Template: PRD
// =============================================================================
const prdTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Problem', level: 2, required: true, alternatives: [/^Problema/i] },
    { name: 'Users', level: 2, required: false, alternatives: [/^(Usuarios|Jobs)/i] },
    { name: 'Scope', level: 2, required: true, alternatives: [/^Alcance/i] },
    { name: 'Acceptance Criteria', level: 2, required: false, alternatives: [/^(Criterios|Acceptance)/i] },
    { name: 'Success Metrics', level: 2, required: false, alternatives: [/^(M[eé]tricas|Metrics|Success)/i] },
  ],
}

// =============================================================================
// Template: NFR
// =============================================================================
const nfrTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Goal', level: 2, required: false, alternatives: [/^(Objetivo|Target)/i] },
    { name: 'Metrics', level: 2, required: false, alternatives: [/^(M[eé]tricas|SLI|SLO)/i] },
    { name: 'Affected Use Cases', level: 2, required: false, alternatives: [/^Casos de Uso Afectados/i] },
    { name: 'Trade-offs', level: 2, required: false, alternatives: [/^(Compromisos|Trade.offs)/i] },
  ],
}

// =============================================================================
// Template: ADR
// =============================================================================
const adrTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Context', level: 2, required: true, alternatives: [/^Contexto/i] },
    { name: 'Decision', level: 2, required: true, alternatives: [/^Decisi[oó]n/i] },
    { name: 'Options Considered', level: 2, required: false, alternatives: [/^(Opciones|Options)/i] },
    {
      name: 'Consequences',
      level: 2,
      required: true,
      alternatives: [/^Consecuencias/i],
    },
  ],
}

// =============================================================================
// Template: Objective (OBJ-NNN)
// =============================================================================
const objectiveTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^OBJ-\d{3}/,
  sections: [
    { name: 'Description', level: 2, required: true, alternatives: [/^Descripci[oó]n/i] },
    { name: 'Key Results', level: 2, required: false, alternatives: [/^Resultados Clave/i] },
    { name: 'Traceability', level: 2, required: false, alternatives: [/^Trazabilidad/i] },
  ],
}

// =============================================================================
// Template: Value Unit (UV-NNN)
// =============================================================================
const valueUnitTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^UV-\d{3}/,
  sections: [
    { name: 'Objective', level: 2, required: true, alternatives: [/^Objetivo/i] },
    { name: 'Scope', level: 2, required: true, alternatives: [/^Alcance/i] },
    { name: 'Inputs', level: 2, required: false, alternatives: [/^Entradas/i] },
    { name: 'Outputs', level: 2, required: false, alternatives: [/^Salidas/i] },
    { name: 'Exit Criteria', level: 2, required: false, alternatives: [/^Criterios de Salida/i] },
    { name: 'Traceability', level: 2, required: false, alternatives: [/^Trazabilidad/i] },
  ],
}

// =============================================================================
// Template: Release (REL-NNN)
// =============================================================================
const releaseTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^REL-\d{3}/,
  sections: [
    { name: 'Objective', level: 2, required: true, alternatives: [/^Objetivo/i] },
    { name: 'Value Units', level: 2, required: true, alternatives: [/^Unidades de Valor/i] },
    { name: 'Dependencies', level: 2, required: false, alternatives: [/^Dependencias/i] },
    { name: 'Risks', level: 2, required: false, alternatives: [/^Riesgos/i] },
    { name: 'Exit Criteria', level: 2, required: false, alternatives: [/^Criterios de Salida/i] },
  ],
}

// =============================================================================
// Template: Implementation Charter
// =============================================================================
const implementationCharterTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Official Stack', level: 2, required: true, alternatives: [/^Stack Oficial/i] },
    { name: 'Repository Topology', level: 2, required: false, alternatives: [/^Topolog[ií]a/i] },
    { name: 'KDD Artifact Mapping', level: 2, required: false, alternatives: [/^Mapeo de Artefactos/i] },
    { name: 'Conventions', level: 2, required: false, alternatives: [/^Convenciones/i] },
    { name: 'Tooling', level: 2, required: false, alternatives: [/^Herramientas/i] },
  ],
}

// =============================================================================
// Template: UI View
// =============================================================================
const uiViewTemplate: StructureTemplate = {
  requiresH1: false,
  sections: [
    { name: 'Purpose', level: 2, required: true, alternatives: [/^(Prop[oó]sito|Description|Descripci[oó]n)/i] },
    { name: 'Navigation', level: 2, required: false, alternatives: [/^(Navegaci[oó]n|Navigation Context)/i] },
    { name: 'Layout', level: 2, required: true },
    { name: 'Components', level: 2, required: true, alternatives: [/^Componentes/i] },
    { name: 'Data', level: 2, required: false, alternatives: [/^(Datos|Data Requirements)/i] },
    { name: 'View States', level: 2, required: true, alternatives: [/^Estados/i] },
    { name: 'Behavior', level: 2, required: false, alternatives: [/^Comportamiento/i] },
  ],
}

// =============================================================================
// Template: UI Component
// =============================================================================
const uiComponentTemplate: StructureTemplate = {
  requiresH1: false,
  sections: [
    { name: 'Description', level: 2, required: true, alternatives: [/^Descripci[oó]n/i] },
    { name: 'Props', level: 2, required: true, alternatives: [/^Propiedades/i] },
    { name: 'Actions', level: 2, required: false, alternatives: [/^(Acciones|Interactions)/i] },
    { name: 'States', level: 2, required: true, alternatives: [/^Estados/i] },
    { name: 'Accessibility', level: 2, required: false, alternatives: [/^Accesibilidad/i] },
  ],
}

// =============================================================================
// Template: Unknown (sin validación de estructura)
// =============================================================================
const unknownTemplate: StructureTemplate = {
  requiresH1: false,
  sections: [],
}

// =============================================================================
// Mapa de templates por tipo
// =============================================================================
export const structureTemplates: Record<DocType, StructureTemplate> = {
  'use-case': useCaseTemplate,
  requirement: requirementTemplate,
  entity: entityTemplate,
  event: eventTemplate,
  rule: ruleTemplate,
  'business-policy': ruleTemplate,
  'cross-policy': ruleTemplate,
  process: processTemplate,
  command: commandTemplate,
  query: queryTemplate,
  prd: prdTemplate,
  nfr: nfrTemplate,
  adr: adrTemplate,
  objective: objectiveTemplate,
  'value-unit': valueUnitTemplate,
  release: releaseTemplate,
  'implementation-charter': implementationCharterTemplate,
  'ui-view': uiViewTemplate,
  'ui-component': uiComponentTemplate,
  unknown: unknownTemplate,
}

/**
 * Obtiene el template de estructura para un tipo de documento
 */
export function getStructureTemplate(docType: DocType): StructureTemplate {
  return structureTemplates[docType] ?? unknownTemplate
}
