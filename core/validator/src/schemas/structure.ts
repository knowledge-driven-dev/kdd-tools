/**
 * Definición de estructura esperada (secciones) por tipo de documento
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
// Template: Use Case (UC-xxx)
// =============================================================================
const useCaseTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^UC-\d{3}:\s*.+/,
  sections: [
    { name: 'Descripción', level: 2, required: true },
    { name: 'Actores', level: 2, required: true, alternatives: [/^Actor(es)?/i] },
    { name: 'Disparadores', level: 2, required: false, alternatives: [/^Trigger(s)?/i] },
    { name: 'Precondiciones', level: 2, required: true, alternatives: [/^Precondition(s)?/i] },
    {
      name: 'Flujo Principal',
      level: 2,
      required: true,
      alternatives: [/^(Flujo Principal|Happy Path|Main Flow)/i],
    },
    {
      name: 'Extensiones',
      level: 2,
      required: false,
      alternatives: [/^(Extensiones|Flujos Alternativos|Extensions|Alternative)/i],
    },
    {
      name: 'Garantías Mínimas',
      level: 2,
      required: false,
      alternatives: [/^(Garantías Mínimas|Minimal Guarantees)/i],
    },
    { name: 'Postcondiciones', level: 2, required: true, alternatives: [/^Postcondition(s)?/i] },
    {
      name: 'Reglas de Negocio',
      level: 2,
      required: false,
      alternatives: [/^(Reglas de Negocio|Business Rules)/i],
    },
    {
      name: 'Escenarios de Prueba',
      level: 2,
      required: false,
      alternatives: [/^(Escenarios|Test Cases|Test Scenarios)/i],
    },
  ],
}

// =============================================================================
// Template: Requirement (REQ-xxx)
// =============================================================================
const requirementTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^(Requisitos|Requirements)/i,
  sections: [
    {
      name: 'Resumen de Requisitos',
      level: 2,
      required: false,
      alternatives: [/^(Resumen|Summary)/i],
    },
    {
      name: 'REQ-',
      level: 2,
      required: true,
      alternatives: [/^REQ-\d{3}\.\d+/],
      description: 'Al menos un requisito individual (REQ-XXX.X)',
    },
    {
      name: 'Matriz de Trazabilidad',
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
  requiresH1: false, // El H1 es el nombre de la entidad
  sections: [
    { name: 'Descripción', level: 2, required: true, alternatives: [/^Description/i] },
    { name: 'Atributos', level: 2, required: true, alternatives: [/^(Atributos|Attributes)/i] },
    { name: 'Relaciones', level: 2, required: false, alternatives: [/^(Relaciones|Relations)/i] },
    {
      name: 'Ciclo de Vida',
      level: 2,
      required: false,
      alternatives: [/^(Ciclo de Vida|Lifecycle|State)/i],
    },
    {
      name: 'Invariantes',
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
    { name: 'Descripción', level: 2, required: true },
    { name: 'Emisor', level: 2, required: false, alternatives: [/^(Emisor|Emitter|Source)/i] },
    { name: 'Payload', level: 2, required: true },
    { name: 'Ejemplo', level: 2, required: false, alternatives: [/^(Ejemplo|Example)/i] },
    {
      name: 'Suscriptores',
      level: 2,
      required: false,
      alternatives: [/^(Suscriptores|Subscribers|Consumers)/i],
    },
  ],
}

// =============================================================================
// Template: Rule (BR-xxx, BP-xxx)
// =============================================================================
const ruleTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^(BR|BP)-[A-Z]+-\d{3}/,
  sections: [
    { name: 'Declaración', level: 2, required: true },
    {
      name: 'Entidades Relacionadas',
      level: 2,
      required: false,
      alternatives: [/^(Entidades|Entities)/i],
    },
    {
      name: 'Formalización',
      level: 2,
      required: false,
      alternatives: [/^(Formalización|Formalization)/i],
    },
    { name: 'Ejemplos', level: 2, required: false, alternatives: [/^(Ejemplos|Examples)/i] },
  ],
}

// =============================================================================
// Template: Process (PRC-xxx)
// =============================================================================
const processTemplate: StructureTemplate = {
  requiresH1: true,
  h1Pattern: /^PRC-\d{3}/,
  sections: [
    { name: 'Descripción', level: 2, required: false },
    {
      name: 'Diagrama',
      level: 2,
      required: false,
      description: 'Se espera un bloque mermaid en el contenido',
    },
    { name: 'Pasos', level: 2, required: false, alternatives: [/^(Pasos|Steps)/i] },
  ],
}

// =============================================================================
// Template: PRD
// =============================================================================
const prdTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Problema', level: 2, required: true, alternatives: [/^(Problema|Problem)/i] },
    { name: 'Usuarios', level: 2, required: false, alternatives: [/^(Usuarios|Users|Jobs)/i] },
    { name: 'Alcance', level: 2, required: true, alternatives: [/^(Alcance|Scope)/i] },
    {
      name: 'Requisitos',
      level: 2,
      required: false,
      alternatives: [/^(Requisitos funcionales|Requirements)/i],
    },
    { name: 'NFRs', level: 2, required: false, alternatives: [/^(NFRs|Non.?Functional)/i] },
    { name: 'Métricas', level: 2, required: false, alternatives: [/^(Métricas|Metrics|Success)/i] },
  ],
}

// =============================================================================
// Template: Story (US-xxx)
// =============================================================================
const storyTemplate: StructureTemplate = {
  requiresH1: false,
  sections: [
    {
      name: 'Criterios de aceptación',
      level: 2,
      required: false,
      alternatives: [/^(Criterios|Acceptance)/i],
    },
  ],
}

// =============================================================================
// Template: NFR
// =============================================================================
const nfrTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Objetivo', level: 2, required: false, alternatives: [/^(Objetivo|Goal|Target)/i] },
    { name: 'SLI', level: 2, required: false },
    { name: 'SLO', level: 2, required: false },
    {
      name: 'Estrategias',
      level: 2,
      required: false,
      alternatives: [/^(Estrategias|Strategies)/i],
    },
  ],
}

// =============================================================================
// Template: ADR
// =============================================================================
const adrTemplate: StructureTemplate = {
  requiresH1: true,
  sections: [
    { name: 'Contexto', level: 2, required: true, alternatives: [/^Context/i] },
    { name: 'Decisión', level: 2, required: true, alternatives: [/^(Decisión|Decision)/i] },
    {
      name: 'Consecuencias',
      level: 2,
      required: true,
      alternatives: [/^(Consecuencias|Consequences)/i],
    },
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
  process: processTemplate,
  prd: prdTemplate,
  story: storyTemplate,
  nfr: nfrTemplate,
  adr: adrTemplate,
  unknown: unknownTemplate,
}

/**
 * Obtiene el template de estructura para un tipo de documento
 */
export function getStructureTemplate(docType: DocType): StructureTemplate {
  return structureTemplates[docType] ?? unknownTemplate
}
