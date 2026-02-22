/**
 * Parser de archivos de especificación
 * Extrae frontmatter YAML y estructura del markdown
 */

import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root, Heading, Content } from 'mdast'

export interface SpecFile {
  /** Ruta absoluta del archivo */
  path: string
  /** Frontmatter parseado */
  frontmatter: Record<string, unknown>
  /** Contenido markdown sin frontmatter */
  content: string
  /** AST del markdown */
  ast: Root
  /** Headings extraídos con sus niveles */
  headings: { level: number; text: string; line: number }[]
  /** Tipo de documento inferido */
  docType: DocType
  /** Wiki-links encontrados [[...]] */
  wikiLinks: { target: string; line: number; start: number; end: number }[]
}

export type DocType =
  | 'use-case'
  | 'requirement'
  | 'entity'
  | 'event'
  | 'rule'
  | 'process'
  | 'command'
  | 'query'
  | 'prd'
  | 'story'
  | 'nfr'
  | 'adr'
  | 'unknown'

export interface ValidationResult {
  level: 'error' | 'warning' | 'info'
  rule: string
  message: string
  line?: number
  column?: number
  suggestion?: string
}

/**
 * Carga y parsea un archivo de especificación
 */
export async function loadSpecFile(filePath: string): Promise<SpecFile | null> {
  try {
    const raw = await readFile(filePath, 'utf-8')

    // Parsear frontmatter
    const { data: frontmatter, content } = matter(raw)

    // Parsear markdown a AST
    const ast = unified().use(remarkParse).parse(content) as Root

    // Extraer headings
    const headings = extractHeadings(ast, content)

    // Extraer wiki-links
    const wikiLinks = extractWikiLinks(content)

    // Inferir tipo de documento
    const docType = inferDocType(filePath, frontmatter)

    return {
      path: filePath,
      frontmatter,
      content,
      ast,
      headings,
      docType,
      wikiLinks,
    }
  } catch (error) {
    console.error(`Error parseando ${filePath}:`, error)
    return null
  }
}

/**
 * Extrae headings del AST con su número de línea
 */
function extractHeadings(
  ast: Root,
  content: string
): { level: number; text: string; line: number }[] {
  const headings: { level: number; text: string; line: number }[] = []
  const lines = content.split('\n')

  function visit(node: Content) {
    if (node.type === 'heading') {
      const heading = node as Heading
      const text = heading.children
        .map((child) => {
          if (child.type === 'text') return child.value
          if (child.type === 'inlineCode') return child.value
          return ''
        })
        .join('')

      headings.push({
        level: heading.depth,
        text,
        line: node.position?.start.line ?? 0,
      })
    }

    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child as Content)
      }
    }
  }

  for (const child of ast.children) {
    visit(child)
  }

  return headings
}

/**
 * Extrae wiki-links [[target]] del contenido
 */
function extractWikiLinks(
  content: string
): { target: string; line: number; start: number; end: number }[] {
  const links: { target: string; line: number; start: number; end: number }[] = []
  const lines = content.split('\n')

  // Regex para wiki-links: [[target]] o [[target|display]]
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g

  lines.forEach((line, lineIndex) => {
    let match
    while ((match = wikiLinkRegex.exec(line)) !== null) {
      links.push({
        target: match[1].trim(),
        line: lineIndex + 1, // 1-indexed para el frontmatter offset
        start: match.index,
        end: match.index + match[0].length,
      })
    }
  })

  return links
}

/**
 * Infiere el tipo de documento basado en path y frontmatter
 */
function inferDocType(filePath: string, frontmatter: Record<string, unknown>): DocType {
  const fileName = filePath.split('/').pop() ?? ''
  const kind = frontmatter.kind as string | undefined
  const tags = (frontmatter.tags as string[]) ?? []
  const id = frontmatter.id as string | undefined

  // Excluir archivos de índice generados automáticamente
  if (fileName.startsWith('_')) return 'unknown'

  // Por type explícito (nuevo formato CQRS)
  const type = frontmatter.type as string | undefined
  if (type === 'command') return 'command'
  if (type === 'query') return 'query'

  // Por kind explícito
  if (kind) {
    switch (kind) {
      case 'use_case':
        return 'use-case'
      case 'requirements':
        return 'requirement'
      case 'rule':
      case 'rules':
        return 'rule'
      case 'process':
        return 'process'
      case 'command':
        return 'command'
      case 'query':
        return 'query'
      case 'prd':
        return 'prd'
      case 'story':
        return 'story'
      case 'nfr':
        return 'nfr'
      case 'adr':
        return 'adr'
    }
  }

  // Por tags
  if (tags.includes('entity')) return 'entity'
  if (tags.includes('event')) return 'event'
  if (tags.includes('use-case')) return 'use-case'
  if (tags.includes('ears')) return 'requirement'
  if (tags.includes('rules')) return 'rule'
  if (tags.includes('command')) return 'command'
  if (tags.includes('query')) return 'query'

  // Por prefijo de archivo
  if (fileName.startsWith('UC-')) return 'use-case'
  if (fileName.startsWith('REQ-')) return 'requirement'
  if (fileName.startsWith('EVT-')) return 'event'
  if (fileName.startsWith('BR-') || fileName.startsWith('BP-')) return 'rule'
  if (fileName.startsWith('PRC-') || fileName.startsWith('PROC-')) return 'process'
  if (fileName.startsWith('CMD-')) return 'command'
  if (fileName.startsWith('QRY-')) return 'query'
  if (fileName.startsWith('PRD-')) return 'prd'
  if (fileName.startsWith('US-') || fileName.startsWith('STORY-')) return 'story'
  if (fileName.startsWith('NFR-')) return 'nfr'
  if (fileName.startsWith('ADR-')) return 'adr'

  // Por id en frontmatter
  if (id) {
    if (id.startsWith('UC-')) return 'use-case'
    if (id.startsWith('REQ-')) return 'requirement'
    if (id.startsWith('EVT-')) return 'event'
    if (id.startsWith('BR-') || id.startsWith('BP-')) return 'rule'
    if (id.startsWith('PRC-') || id.startsWith('PROC-')) return 'process'
    if (id.startsWith('CMD-')) return 'command'
    if (id.startsWith('QRY-')) return 'query'
  }

  // Por path
  if (filePath.includes('/use-cases/')) return 'use-case'
  if (filePath.includes('/requirements/')) return 'requirement'
  if (filePath.includes('/entities/')) return 'entity'
  if (filePath.includes('/events/')) return 'event'
  if (filePath.includes('/rules/')) return 'rule'
  if (filePath.includes('/processes/')) return 'process'
  if (filePath.includes('/commands/')) return 'command'
  if (filePath.includes('/queries/')) return 'query'

  return 'unknown'
}
