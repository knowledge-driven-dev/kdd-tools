/**
 * Schemas Zod para validación de frontmatter por tipo de documento
 * Alineado con KDD v2.0 — frontmatter simplificado: id, kind, status
 */

import { z } from 'zod'
import type { DocType } from '../lib/parser'

// Valores comunes v2.0
const statusSchema = z.enum(['draft', 'review', 'approved', 'deprecated', 'superseded']).optional()

// =============================================================================
// Schema: Use Case (UC-NNN)
// =============================================================================
export const useCaseFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^UC-\d{3}/, 'ID must follow format UC-NNN'),
  kind: z.literal('use-case').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Requirement (REQ-NNN)
// =============================================================================
export const requirementFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^REQ-\d{3}/, 'ID must follow format REQ-NNN'),
  kind: z.literal('requirement').optional(),
  status: statusSchema,
  source: z
    .string()
    .regex(/^UC-\d{3}/, 'source must reference a use case UC-NNN')
    .optional(),
})

// =============================================================================
// Schema: Entity (entity | role | system | catalog)
// =============================================================================
export const entityFrontmatterSchema = z.object({
  kind: z.enum(['entity', 'role', 'system', 'catalog']),
  aliases: z.array(z.string()).optional(),
  source: z.string().optional(),
  scope: z.string().optional(),
  'change-frequency': z.string().optional(),
})

// =============================================================================
// Schema: Event (EVT-xxx)
// =============================================================================
export const eventFrontmatterSchema = z.object({
  kind: z.literal('event').optional(),
})

// =============================================================================
// Schema: Rule — Business Rule (BR-NNN-Name)
// =============================================================================
export const ruleFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^BR-\d{3}/, 'ID must follow format BR-NNN'),
  kind: z.enum(['business-rule', 'rule', 'rules']).optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Business Policy (BP-NNN-Name)
// =============================================================================
export const businessPolicyFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^BP-\d{3}/, 'ID must follow format BP-NNN'),
  kind: z.literal('business-policy').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Cross-Policy (XP-NNN-Name)
// =============================================================================
export const crossPolicyFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^XP-\d{3}/, 'ID must follow format XP-NNN'),
  kind: z.literal('cross-policy').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Process (PROC-NNN)
// =============================================================================
export const processFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^PROC-\d{3}/, 'ID must follow format PROC-NNN'),
  kind: z.literal('process').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Command (CMD-NNN)
// =============================================================================
export const commandFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^CMD-\d{3}/, 'ID must follow format CMD-NNN'),
  kind: z.literal('command').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Query (QRY-NNN)
// =============================================================================
export const queryFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^QRY-\d{3}/, 'ID must follow format QRY-NNN'),
  kind: z.literal('query').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: PRD (PRD-*)
// =============================================================================
export const prdFrontmatterSchema = z.object({
  id: z.string().regex(/^PRD-/, 'ID must start with PRD-').optional(),
  kind: z.literal('prd').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: NFR (NFR-*)
// =============================================================================
export const nfrFrontmatterSchema = z.object({
  id: z.string().regex(/^NFR-/, 'ID must start with NFR-').optional(),
  kind: z.literal('nfr').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: ADR (ADR-NNNN)
// =============================================================================
export const adrFrontmatterSchema = z.object({
  id: z.string().regex(/^ADR-\d{4}/, 'ID must follow format ADR-NNNN').optional(),
  kind: z.literal('adr').optional(),
  status: statusSchema,
  supersedes: z.string().optional(),
  superseded_by: z.string().optional(),
})

// =============================================================================
// Schema: Objective (OBJ-NNN)
// =============================================================================
export const objectiveFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^OBJ-\d{3}/, 'ID must follow format OBJ-NNN'),
  kind: z.literal('objective').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Value Unit (UV-NNN)
// =============================================================================
export const valueUnitFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^UV-\d{3}/, 'ID must follow format UV-NNN'),
  kind: z.literal('value-unit').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Release (REL-NNN)
// =============================================================================
export const releaseFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(/^REL-\d{3}/, 'ID must follow format REL-NNN'),
  kind: z.literal('release').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Implementation Charter (ARCH-CHARTER-*)
// =============================================================================
export const implementationCharterFrontmatterSchema = z.object({
  id: z.string().regex(/^ARCH-CHARTER/, 'ID must start with ARCH-CHARTER').optional(),
  kind: z.literal('implementation-charter').optional(),
  status: statusSchema,
  supersedes: z.string().optional(),
})

// =============================================================================
// Schema: UI View
// =============================================================================
export const uiViewFrontmatterSchema = z.object({
  kind: z.literal('ui-view').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: UI Component
// =============================================================================
export const uiComponentFrontmatterSchema = z.object({
  kind: z.literal('ui-component').optional(),
  status: statusSchema,
})

// =============================================================================
// Schema: Unknown (mínimo requerido)
// =============================================================================
export const unknownFrontmatterSchema = z.object({}).passthrough()

// =============================================================================
// Mapa de schemas por tipo
// =============================================================================
export const frontmatterSchemas: Record<DocType, z.ZodSchema> = {
  'use-case': useCaseFrontmatterSchema,
  requirement: requirementFrontmatterSchema,
  entity: entityFrontmatterSchema,
  event: eventFrontmatterSchema,
  rule: ruleFrontmatterSchema,
  'business-policy': businessPolicyFrontmatterSchema,
  'cross-policy': crossPolicyFrontmatterSchema,
  process: processFrontmatterSchema,
  command: commandFrontmatterSchema,
  query: queryFrontmatterSchema,
  prd: prdFrontmatterSchema,
  nfr: nfrFrontmatterSchema,
  adr: adrFrontmatterSchema,
  objective: objectiveFrontmatterSchema,
  'value-unit': valueUnitFrontmatterSchema,
  release: releaseFrontmatterSchema,
  'implementation-charter': implementationCharterFrontmatterSchema,
  'ui-view': uiViewFrontmatterSchema,
  'ui-component': uiComponentFrontmatterSchema,
  unknown: unknownFrontmatterSchema,
}

/**
 * Obtiene el schema de frontmatter para un tipo de documento
 */
export function getFrontmatterSchema(docType: DocType): z.ZodSchema {
  return frontmatterSchemas[docType] ?? unknownFrontmatterSchema
}
