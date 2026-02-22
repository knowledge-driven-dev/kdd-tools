#!/usr/bin/env bun
/**
 * Spec Validator - Validador de especificaciones KDD
 *
 * Tres niveles de validación:
 * 1. Frontmatter: Schema Zod según tipo de documento
 * 2. Estructura: Secciones requeridas según plantilla
 * 3. Semántico: Identificación de entidades y corrección de enlaces
 *
 * Uso:
 *   bun run validate:specs           # Validar todos
 *   bun run validate:specs --fix     # Auto-corregir enlaces
 *   bun run validate:specs path/to   # Validar directorio específico
 */

import { parseArgs } from 'util'
import { resolve, relative } from 'path'
import { glob } from 'glob'
import chalk from 'chalk'

import { validateFrontmatter } from './validators/frontmatter'
import { validateStructure } from './validators/structure'
import { validateSemantics } from './validators/semantics'
import { loadSpecFile, type SpecFile, type ValidationResult } from './lib/parser'
import { buildEntityIndex } from './lib/entity-index'
import { formatResults, writeSummary, showEntityIndexStats } from './lib/reporter'

const SPECS_DIR = resolve(process.cwd(), 'specs')

interface Options {
  fix: boolean
  verbose: boolean
  level: 'frontmatter' | 'structure' | 'semantics' | 'all'
  output: 'console' | 'json' | 'github'
}

async function main() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      fix: { type: 'boolean', default: false },
      verbose: { type: 'boolean', short: 'v', default: false },
      level: { type: 'string', short: 'l', default: 'all' },
      output: { type: 'string', short: 'o', default: 'console' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    allowPositionals: true,
  })

  if (values.help) {
    printHelp()
    process.exit(0)
  }

  const options: Options = {
    fix: values.fix ?? false,
    verbose: values.verbose ?? false,
    level: (values.level as Options['level']) ?? 'all',
    output: (values.output as Options['output']) ?? 'console',
  }

  const targetDir = positionals[0] ? resolve(positionals[0]) : SPECS_DIR

  console.log(chalk.blue('\n🔍 Spec Validator - KDD Documentation Linter\n'))
  console.log(chalk.gray(`  Target: ${relative(process.cwd(), targetDir)}`))
  console.log(chalk.gray(`  Level:  ${options.level}`))
  console.log(chalk.gray(`  Fix:    ${options.fix ? 'enabled' : 'disabled'}\n`))

  // 1. Encontrar todos los archivos .md
  const files = await glob('**/*.md', {
    cwd: targetDir,
    ignore: ['**/node_modules/**', '**/.obsidian/**'],
    absolute: true,
  })

  if (files.length === 0) {
    console.log(chalk.yellow('No se encontraron archivos .md'))
    process.exit(0)
  }

  console.log(chalk.gray(`  Found ${files.length} spec files\n`))

  // 2. Construir índice de entidades para validación semántica
  // Siempre usamos SPECS_DIR como base para el índice, independientemente del directorio objetivo
  const entityIndex = await buildEntityIndex(SPECS_DIR)

  // Mostrar estadísticas del índice si es verbose
  if (options.verbose) {
    showEntityIndexStats(entityIndex)
  }

  // 3. Validar cada archivo
  const allResults: Map<string, ValidationResult[]> = new Map()
  let totalErrors = 0
  let totalWarnings = 0

  for (const filePath of files) {
    const relPath = relative(targetDir, filePath)
    const specFile = await loadSpecFile(filePath)

    if (!specFile) {
      allResults.set(relPath, [
        { level: 'error', rule: 'parse', message: 'No se pudo parsear el archivo' },
      ])
      totalErrors++
      continue
    }

    const results: ValidationResult[] = []

    // Nivel 1: Frontmatter
    if (options.level === 'all' || options.level === 'frontmatter') {
      const frontmatterResults = await validateFrontmatter(specFile)
      results.push(...frontmatterResults)
    }

    // Nivel 2: Estructura
    if (options.level === 'all' || options.level === 'structure') {
      const structureResults = await validateStructure(specFile)
      results.push(...structureResults)
    }

    // Nivel 3: Semántico
    if (options.level === 'all' || options.level === 'semantics') {
      const semanticResults = await validateSemantics(specFile, entityIndex, {
        fix: options.fix,
      })
      results.push(...semanticResults)
    }

    if (results.length > 0) {
      allResults.set(relPath, results)
      totalErrors += results.filter((r) => r.level === 'error').length
      totalWarnings += results.filter((r) => r.level === 'warning').length
    }
  }

  // 4. Reportar resultados
  formatResults(allResults, options.output, options.verbose)
  writeSummary(files.length, totalErrors, totalWarnings)

  // 5. Exit code para CI
  process.exit(totalErrors > 0 ? 1 : 0)
}

function printHelp() {
  console.log(`
Spec Validator - Validador de especificaciones KDD

USO:
  bun run validate:specs [opciones] [directorio]

OPCIONES:
  -l, --level <level>   Nivel de validación: frontmatter, structure, semantics, all (default: all)
  -o, --output <format> Formato de salida: console, json, github (default: console)
  --fix                 Auto-corregir enlaces de entidades (solo nivel semántico)
  -v, --verbose         Mostrar detalles de cada archivo
  -h, --help            Mostrar esta ayuda

EJEMPLOS:
  bun run validate:specs                      # Validar todo /specs
  bun run validate:specs specs/02-domain      # Solo domain
  bun run validate:specs --level frontmatter  # Solo frontmatter
  bun run validate:specs --fix                # Auto-corregir enlaces
  bun run validate:specs -o github            # Formato GitHub Actions
`)
}

main().catch((err) => {
  console.error(chalk.red('Error fatal:'), err)
  process.exit(1)
})
