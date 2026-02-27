/**
 * Índice de entidades conocidas en el repositorio de specs
 * Usado para validación semántica y auto-enlazado
 */

import { readdir, readFile } from 'fs/promises'
import { join, basename, relative } from 'path'
import matter from 'gray-matter'

export interface EntityEntry {
  /** Nombre canónico de la entidad */
  name: string
  /** ID único de la entidad (ej: BR-001-Name, REQ-001.1) */
  id?: string
  /** Aliases adicionales */
  aliases: string[]
  /** Tipo de entidad (entity, event, rule, use-case, etc.) */
  type: 'entity' | 'event' | 'rule' | 'use-case' | 'requirement' | 'process' | 'other'
  /** Subtipo para reglas/requisitos individuales */
  subtype?: 'individual-rule' | 'individual-requirement'
  /** Path relativo al archivo */
  path: string
  /** Línea donde se define (para sub-entidades) */
  line?: number
  /** Entidad padre (para sub-entidades) */
  parentId?: string
  /** Todas las formas de referirse a esta entidad (name + aliases, lowercase) */
  searchTerms: string[]
}

export interface EntityIndex {
  /** Mapa de término normalizado -> entidad */
  byTerm: Map<string, EntityEntry>
  /** Lista de todas las entidades */
  all: EntityEntry[]
  /** Términos ordenados por longitud (para matching más largo primero) */
  sortedTerms: string[]
}

/**
 * Construye un índice de todas las entidades en el directorio de specs
 */
export async function buildEntityIndex(specsDir: string): Promise<EntityIndex> {
  const index: EntityIndex = {
    byTerm: new Map(),
    all: [],
    sortedTerms: [],
  }

  // Escanear directorios relevantes (KDD v2.0 structure)
  const dirsToScan = [
    // 01-domain: Domain model (BASE)
    { dir: '01-domain/entities', type: 'entity' as const },
    { dir: '01-domain/events', type: 'event' as const },
    { dir: '01-domain/rules', type: 'rule' as const },
    // 02-behavior: Operations and orchestration
    { dir: '02-behavior/commands', type: 'use-case' as const },
    { dir: '02-behavior/queries', type: 'use-case' as const },
    { dir: '02-behavior/processes', type: 'process' as const },
    { dir: '02-behavior/use-cases', type: 'use-case' as const },
    { dir: '02-behavior/policies', type: 'rule' as const },
    // 03-experience: UI and user interaction
    { dir: '03-experience/views', type: 'other' as const },
    { dir: '03-experience/components', type: 'other' as const },
    // 04-verification: Criteria and tests
    { dir: '04-verification/criteria', type: 'requirement' as const },
    { dir: '04-verification/requirements', type: 'requirement' as const },
    { dir: '04-verification/examples', type: 'other' as const },
    // 05-architecture: Decisions (ORTHOGONAL)
    { dir: '05-architecture/decisions', type: 'other' as const },
  ]

  for (const { dir, type } of dirsToScan) {
    const fullDir = join(specsDir, dir)
    try {
      const files = await readdir(fullDir)
      for (const file of files) {
        if (!file.endsWith('.md') || file.startsWith('_')) continue

        const filePath = join(fullDir, file)
        const entry = await parseEntityFile(filePath, type, specsDir)
        if (entry) {
          index.all.push(entry)

          // Indexar por todos los términos de búsqueda
          for (const term of entry.searchTerms) {
            if (!index.byTerm.has(term)) {
              index.byTerm.set(term, entry)
            }
          }

          // Extraer sub-entidades (reglas/requisitos individuales)
          const subEntities = await parseSubEntities(filePath, type, specsDir, entry)
          for (const subEntry of subEntities) {
            index.all.push(subEntry)
            for (const term of subEntry.searchTerms) {
              if (!index.byTerm.has(term)) {
                index.byTerm.set(term, subEntry)
              }
            }
          }
        }
      }
    } catch {
      // Directorio no existe, continuar
    }
  }

  // Ordenar términos por longitud (más largos primero para matching correcto)
  index.sortedTerms = Array.from(index.byTerm.keys()).sort((a, b) => b.length - a.length)

  return index
}

/**
 * Extrae sub-entidades de un archivo (requisitos individuales)
 *
 * Patrones detectados:
 * - Requisitos: ## REQ-NNN.M: Título (dentro de REQ-NNN-*.md)
 */
async function parseSubEntities(
  filePath: string,
  parentType: EntityEntry['type'],
  specsDir: string,
  parent: EntityEntry
): Promise<EntityEntry[]> {
  const subEntities: EntityEntry[] = []

  // Solo procesar archivos de requisitos (las BR viven en archivos individuales)
  if (parentType !== 'requirement') {
    return subEntities
  }

  try {
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')

    const requirementPattern = /^##\s+(REQ-\d{3}\.\d+):\s*(.+)$/

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Intentar match de requisito individual
      const reqMatch = line.match(requirementPattern)
      if (reqMatch) {
        const [, reqId, title] = reqMatch
        const searchTerms = new Set<string>()
        searchTerms.add(normalize(reqId))
        searchTerms.add(normalize(title))

        subEntities.push({
          name: title.trim(),
          id: reqId,
          aliases: [reqId],
          type: 'requirement',
          subtype: 'individual-requirement',
          path: relative(specsDir, filePath),
          line: lineNumber,
          parentId: parent.name,
          searchTerms: Array.from(searchTerms).filter((t) => t.length > 2),
        })
      }
    }
  } catch {
    // Error al leer, retornar vacío
  }

  return subEntities
}

/**
 * Parsea un archivo para extraer información de entidad
 */
async function parseEntityFile(
  filePath: string,
  type: EntityEntry['type'],
  specsDir: string
): Promise<EntityEntry | null> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const { data: frontmatter, content: body } = matter(content)

    // Obtener nombre del archivo (sin extensión)
    const fileName = basename(filePath, '.md')

    // Obtener nombre canónico (del H1 o del nombre de archivo)
    let canonicalName = fileName
    const h1Match = body.match(/^#\s+(.+)$/m)
    if (h1Match) {
      // Limpiar el H1 de prefijos como "UC-001:"
      canonicalName = h1Match[1].replace(/^(UC|REQ|EVT|BR|BP|XP|CMD|QRY|PROC|OBJ|UV|REL|VER|ADR)-\d{3,4}[^:]*:\s*/, '').trim()
    }

    // Obtener aliases del frontmatter
    const aliases: string[] = []
    if (Array.isArray(frontmatter.aliases)) {
      aliases.push(...frontmatter.aliases)
    }

    // Para eventos y reglas, extraer el ID como alias
    if (type === 'event' && fileName.startsWith('EVT-')) {
      aliases.push(fileName)
    }
    if (type === 'rule' && fileName.startsWith('BR-')) {
      aliases.push(fileName)
    }
    if (type === 'use-case' && fileName.startsWith('UC-')) {
      // Extraer UC-XXX del nombre
      const ucMatch = fileName.match(/^(UC-\d{3})/)
      if (ucMatch) aliases.push(ucMatch[1])
    }

    // Construir términos de búsqueda
    const searchTerms = new Set<string>()

    // Añadir nombre canónico y variantes
    searchTerms.add(normalize(canonicalName))
    searchTerms.add(normalize(fileName))

    // Añadir aliases
    for (const alias of aliases) {
      searchTerms.add(normalize(alias))
    }

    // Para entidades plurales, añadir singular/plural
    if (type === 'entity') {
      const singular = canonicalName.replace(/s$/, '')
      const plural = canonicalName.endsWith('s') ? canonicalName : canonicalName + 's'
      searchTerms.add(normalize(singular))
      searchTerms.add(normalize(plural))
    }

    return {
      name: canonicalName,
      aliases,
      type,
      path: relative(specsDir, filePath),
      searchTerms: Array.from(searchTerms).filter((t) => t.length > 2), // Ignorar términos muy cortos
    }
  } catch {
    return null
  }
}

/**
 * Normaliza un string para búsqueda
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .trim()
}

/**
 * Busca una entidad por texto
 */
export function findEntity(index: EntityIndex, text: string): EntityEntry | undefined {
  const normalized = normalize(text)
  return index.byTerm.get(normalized)
}

/**
 * Busca entidades que coincidan parcialmente
 */
export function searchEntities(index: EntityIndex, text: string): EntityEntry[] {
  const normalized = normalize(text)
  const results: EntityEntry[] = []

  for (const entry of index.all) {
    for (const term of entry.searchTerms) {
      if (term.includes(normalized) || normalized.includes(term)) {
        results.push(entry)
        break
      }
    }
  }

  return results
}
