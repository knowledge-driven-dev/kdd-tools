---
description: Inicializa un proyecto KDD con directorios, templates, hooks y scripts de validación.
allowed-tools:
  - Bash
  - Read
  - Write
argument-hint: "[--all | --dirs | --templates | --hook | --scripts] [--no-confirm]"
---

# Inicializar Proyecto KDD

Ejecuta el script de setup que prepara un proyecto con la estructura KDD v2.0 completa.

## Componentes

| # | Componente | Qué instala |
|---|-----------|-------------|
| 1 | Directorios | `specs/{00-requirements,...,05-architecture/decisions}` |
| 2 | Templates | `specs/.templates/*.template.md` (20 archivos de referencia) |
| 3 | Pre-commit hook | Valida specs modificadas antes de cada commit |
| 4 | Package scripts | `validate:specs` en package.json |

## Instrucciones

1. **Ejecuta el script de setup**:
   ```bash
   bash "${CLAUDE_PLUGIN_ROOT}/../../core/scripts/setup-project.sh" --project-dir "$(pwd)" $ARGUMENTS
   ```

2. Si no se pasan argumentos, ejecutar en **modo interactivo** (sin `--no-confirm`):
   ```bash
   bash "${CLAUDE_PLUGIN_ROOT}/../../core/scripts/setup-project.sh" --project-dir "$(pwd)"
   ```

3. Tras completar, resumir lo instalado y sugerir:
   - `/kdd:validate` para verificar el setup
   - `/kdd:feature` para crear la primera especificación

## Ejemplos de Uso

```bash
# Setup completo sin prompts
/kdd:init --all --no-confirm

# Solo crear directorios y templates
/kdd:init --dirs --templates

# Ver qué haría sin hacer cambios
/kdd:init --all --dry-run

# Menú interactivo
/kdd:init
```
