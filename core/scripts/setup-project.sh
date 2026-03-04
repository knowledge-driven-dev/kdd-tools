#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# KDD Project Setup Script
# Initializes a project with KDD spec directories, templates,
# pre-commit hooks, and package.json scripts.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

# ── Constants ────────────────────────────────────────────────

VERSION="1.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEMPLATES_SRC="$PLUGIN_ROOT/core/validator/templates"
HOOK_SRC="$PLUGIN_ROOT/core/validator/hooks/pre-commit"

# Spec directory structure (KDD v2.0)
SPEC_DIRS=(
  "specs/00-requirements"
  "specs/01-domain/entities"
  "specs/01-domain/events"
  "specs/01-domain/rules"
  "specs/02-behavior/commands"
  "specs/02-behavior/queries"
  "specs/02-behavior/use-cases"
  "specs/02-behavior/processes"
  "specs/02-behavior/policies"
  "specs/03-experience/views"
  "specs/03-experience/components"
  "specs/03-experience/flows"
  "specs/04-verification/criteria"
  "specs/04-verification/examples"
  "specs/05-architecture/decisions"
)

# Template files to copy
TEMPLATE_FILES=(
  "entity.template.md"
  "event.template.md"
  "rule.template.md"
  "value-unit.template.md"
  "command.template.md"
  "query.template.md"
  "process.template.md"
  "use-case.template.md"
  "prd.template.md"
  "nfr.template.md"
  "objective.template.md"
  "release.template.md"
  "adr.template.md"
  "implementation-charter.template.md"
  "ui-view.template.md"
  "ui-component.template.md"
  "requirement.template.md"
  "verification.template.md"
  "_schema.md"
  "_manifest.template.yaml"
)

# ── Colors & formatting ─────────────────────────────────────

if [[ -t 1 ]]; then
  BOLD='\033[1m'
  DIM='\033[2m'
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  BLUE='\033[0;34m'
  CYAN='\033[0;36m'
  RESET='\033[0m'
else
  BOLD='' DIM='' RED='' GREEN='' YELLOW='' BLUE='' CYAN='' RESET=''
fi

# ── Utilities ────────────────────────────────────────────────

log_info()    { echo -e "  ${BLUE}INFO${RESET}  $1"; }
log_success() { echo -e "  ${GREEN}OK${RESET}    $1"; }
log_warn()    { echo -e "  ${YELLOW}WARN${RESET}  $1"; }
log_error()   { echo -e "  ${RED}ERR${RESET}   $1"; }
log_skip()    { echo -e "  ${DIM}SKIP${RESET}  $1"; }
log_dry()     { echo -e "  ${CYAN}DRY${RESET}   $1"; }

check_command() {
  command -v "$1" &>/dev/null
}

# ── Detection ────────────────────────────────────────────────

detect_os() {
  case "$(uname -s)" in
    Darwin*) echo "macOS" ;;
    Linux*)  echo "Linux" ;;
    MINGW*|MSYS*|CYGWIN*) echo "Windows" ;;
    *)       echo "Unknown" ;;
  esac
}

detect_package_manager() {
  if check_command bun; then
    echo "bun"
  elif check_command pnpm; then
    echo "pnpm"
  elif check_command yarn; then
    echo "yarn"
  elif check_command npm; then
    echo "npm"
  else
    echo "none"
  fi
}

detect_runner() {
  local pm="$1"
  case "$pm" in
    bun)  echo "bunx" ;;
    pnpm) echo "pnpx" ;;
    yarn) echo "npx" ;;
    npm)  echo "npx" ;;
    *)    echo "npx" ;;
  esac
}

detect_git_hooks_tool() {
  # Returns: husky | lefthook | simple-git-hooks | none
  if [[ -d "$PROJECT_DIR/.husky" ]]; then
    echo "husky"
  elif [[ -f "$PROJECT_DIR/lefthook.yml" ]] || [[ -f "$PROJECT_DIR/.lefthook.yml" ]]; then
    echo "lefthook"
  elif [[ -f "$PROJECT_DIR/.simple-git-hooks.json" ]] || grep -q '"simple-git-hooks"' "$PROJECT_DIR/package.json" 2>/dev/null; then
    echo "simple-git-hooks"
  else
    echo "none"
  fi
}

is_git_repo() {
  [[ -d "$PROJECT_DIR/.git" ]]
}

# ── Installation functions ───────────────────────────────────

install_spec_directories() {
  echo ""
  echo -e "${BOLD}Spec directory structure${RESET}"
  echo ""

  local created=0
  for dir in "${SPEC_DIRS[@]}"; do
    local full_path="$PROJECT_DIR/$dir"
    if [[ -d "$full_path" ]]; then
      log_skip "$dir (already exists)"
    else
      if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Would create $dir"
      else
        mkdir -p "$full_path"
        log_success "Created $dir"
      fi
      created=$((created + 1))
    fi
  done

  # Add .gitkeep to empty directories
  if [[ "$DRY_RUN" != "true" ]]; then
    for dir in "${SPEC_DIRS[@]}"; do
      local full_path="$PROJECT_DIR/$dir"
      if [[ -d "$full_path" ]] && [[ -z "$(ls -A "$full_path" 2>/dev/null)" ]]; then
        touch "$full_path/.gitkeep"
      fi
    done
  fi

  echo ""
  if [[ $created -eq 0 ]]; then
    log_info "All ${#SPEC_DIRS[@]} directories already exist"
  else
    log_success "Created $created directories (${#SPEC_DIRS[@]} total)"
  fi
}

install_templates() {
  echo ""
  echo -e "${BOLD}Spec templates${RESET}"
  echo ""

  local templates_dest="$PROJECT_DIR/specs/.templates"
  local copied=0
  local skipped=0

  if [[ ! -d "$TEMPLATES_SRC" ]]; then
    log_error "Templates source not found: $TEMPLATES_SRC"
    return 1
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log_dry "Would create $templates_dest/"
  else
    mkdir -p "$templates_dest"
  fi

  for file in "${TEMPLATE_FILES[@]}"; do
    local src="$TEMPLATES_SRC/$file"
    local dest="$templates_dest/$file"

    if [[ ! -f "$src" ]]; then
      log_warn "Source not found: $file"
      continue
    fi

    if [[ -f "$dest" ]]; then
      if diff -q "$src" "$dest" &>/dev/null; then
        log_skip "$file (identical)"
        skipped=$((skipped + 1))
        continue
      else
        if [[ "$DRY_RUN" == "true" ]]; then
          log_dry "Would update $file (changed)"
        else
          cp "$src" "$dest"
          log_success "Updated $file (changed)"
        fi
        copied=$((copied + 1))
      fi
    else
      if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Would copy $file"
      else
        cp "$src" "$dest"
        log_success "Copied $file"
      fi
      copied=$((copied + 1))
    fi
  done

  echo ""
  if [[ $copied -eq 0 ]]; then
    log_info "All ${#TEMPLATE_FILES[@]} templates already up to date"
  else
    log_success "Copied $copied templates ($skipped already up to date)"
  fi
}

install_pre_commit_hook() {
  echo ""
  echo -e "${BOLD}Pre-commit validation hook${RESET}"
  echo ""

  if ! is_git_repo; then
    log_warn "Not a git repository — skipping pre-commit hook"
    return 0
  fi

  local hooks_tool
  hooks_tool=$(detect_git_hooks_tool)
  local hook_dest=""
  local pm
  pm=$(detect_package_manager)
  local runner
  runner=$(detect_runner "$pm")

  case "$hooks_tool" in
    husky)
      hook_dest="$PROJECT_DIR/.husky/pre-commit"
      log_info "Detected Husky — installing to .husky/pre-commit"
      ;;
    lefthook)
      log_info "Detected Lefthook — add kdd validation to lefthook.yml manually:"
      echo ""
      echo "  pre-commit:"
      echo "    commands:"
      echo "      kdd-validate:"
      echo "        glob: 'specs/**/*.md'"
      echo "        run: $runner kdd-spec-validator {staged_files} --level frontmatter"
      echo ""
      log_warn "Lefthook configuration must be done manually"
      return 0
      ;;
    *)
      hook_dest="$PROJECT_DIR/.git/hooks/pre-commit"
      log_info "Using .git/hooks/pre-commit"
      ;;
  esac

  # Check if hook already contains our validation
  if [[ -f "$hook_dest" ]]; then
    if grep -q 'kdd-spec-validator\|validate:specs' "$hook_dest" 2>/dev/null; then
      log_skip "Hook already contains KDD validation"
      return 0
    fi
  fi

  if [[ ! -f "$HOOK_SRC" ]]; then
    log_error "Hook source not found: $HOOK_SRC"
    return 1
  fi

  # Build hook content with correct runner
  local hook_content
  hook_content=$(sed "s|bun run validate:specs|$runner kdd-spec-validator|g" "$HOOK_SRC")

  if [[ "$DRY_RUN" == "true" ]]; then
    if [[ -f "$hook_dest" ]]; then
      log_dry "Would append KDD validation to existing hook: $hook_dest"
    else
      log_dry "Would install pre-commit hook: $hook_dest"
    fi
    return 0
  fi

  if [[ -f "$hook_dest" ]]; then
    # Append to existing hook (remove shebang from our content)
    echo "" >> "$hook_dest"
    echo "# ── KDD Spec Validation ──────────────────────────────" >> "$hook_dest"
    echo "$hook_content" | tail -n +2 >> "$hook_dest"
    log_success "Appended KDD validation to existing hook"
  else
    mkdir -p "$(dirname "$hook_dest")"
    echo "$hook_content" > "$hook_dest"
    chmod +x "$hook_dest"
    log_success "Installed pre-commit hook"
  fi
}

install_package_scripts() {
  echo ""
  echo -e "${BOLD}Package.json scripts${RESET}"
  echo ""

  local pkg_file="$PROJECT_DIR/package.json"
  local pm
  pm=$(detect_package_manager)
  local runner
  runner=$(detect_runner "$pm")
  local validate_cmd="$runner kdd-spec-validator"

  if [[ ! -f "$pkg_file" ]]; then
    if [[ "$DRY_RUN" == "true" ]]; then
      log_dry "Would create minimal package.json with validate:specs script"
      return 0
    fi

    if [[ "$NO_CONFIRM" == "true" ]]; then
      local create_pkg="y"
    else
      echo -n "  No package.json found. Create one? [Y/n] "
      read -r create_pkg
      create_pkg="${create_pkg:-y}"
    fi

    if [[ "$create_pkg" =~ ^[Yy] ]]; then
      # Use node/bun to create valid JSON
      local json_cmd
      if check_command bun; then
        json_cmd="bun"
      elif check_command node; then
        json_cmd="node"
      else
        log_error "Neither bun nor node available to create package.json"
        return 1
      fi

      $json_cmd -e "
        const pkg = {
          private: true,
          scripts: {
            'validate:specs': '$validate_cmd'
          }
        };
        require('fs').writeFileSync('$pkg_file', JSON.stringify(pkg, null, 2) + '\n');
      "
      log_success "Created package.json with validate:specs script"
      return 0
    else
      log_skip "Skipped package.json creation"
      return 0
    fi
  fi

  # package.json exists — check if script already present
  local has_script
  if check_command bun; then
    has_script=$(bun -e "
      const pkg = JSON.parse(require('fs').readFileSync('$pkg_file', 'utf8'));
      console.log(pkg.scripts?.['validate:specs'] ? 'yes' : 'no');
    ")
  elif check_command node; then
    has_script=$(node -e "
      const pkg = JSON.parse(require('fs').readFileSync('$pkg_file', 'utf8'));
      console.log(pkg.scripts?.['validate:specs'] ? 'yes' : 'no');
    ")
  else
    log_error "Neither bun nor node available to read package.json"
    return 1
  fi

  if [[ "$has_script" == "yes" ]]; then
    log_skip "validate:specs script already exists in package.json"
    return 0
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log_dry "Would add validate:specs script to package.json"
    return 0
  fi

  # Add the script using node/bun for safe JSON manipulation
  local json_runtime
  if check_command bun; then
    json_runtime="bun"
  else
    json_runtime="node"
  fi

  $json_runtime -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$pkg_file', 'utf8'));
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts['validate:specs'] = '$validate_cmd';
    fs.writeFileSync('$pkg_file', JSON.stringify(pkg, null, 2) + '\n');
  "
  log_success "Added validate:specs script to package.json"
}

# ── Interactive menu ─────────────────────────────────────────

show_header() {
  local os pm git_status
  os=$(detect_os)
  pm=$(detect_package_manager)

  if is_git_repo; then
    git_status="git repo"
  else
    git_status="no git"
  fi

  echo ""
  echo -e "${BOLD}╔══════════════════════════════════════╗${RESET}"
  echo -e "${BOLD}║       KDD Project Setup v${VERSION}       ║${RESET}"
  echo -e "${BOLD}╚══════════════════════════════════════╝${RESET}"
  echo ""
  echo -e "  Detected: ${CYAN}$os${RESET} · ${CYAN}$pm${RESET} · ${CYAN}$git_status${RESET}"
  echo -e "  Target:   ${DIM}$PROJECT_DIR${RESET}"
  echo ""
}

show_menu() {
  show_header

  echo "  Select components to install:"
  echo ""
  echo "  1) Spec directory structure     specs/{00..05}/..."
  echo "  2) Spec templates               specs/.templates/*.template.md"
  echo "  3) Pre-commit validation hook   .git/hooks/pre-commit"
  echo "  4) Package.json scripts         validate:specs"
  echo "  5) All of the above"
  echo ""
  echo "  0) Exit"
  echo ""
  echo -n "  Enter choices (comma-separated, e.g. 1,2,3): "
  read -r choices

  if [[ -z "$choices" ]] || [[ "$choices" == "0" ]]; then
    echo ""
    log_info "Nothing to do. Bye!"
    exit 0
  fi

  if [[ "$choices" == "5" ]]; then
    choices="1,2,3,4"
  fi

  echo ""
  echo -e "${BOLD}────────────────────────────────────────${RESET}"

  IFS=',' read -ra selected <<< "$choices"
  for choice in "${selected[@]}"; do
    choice=$(echo "$choice" | tr -d ' ')
    case "$choice" in
      1) install_spec_directories ;;
      2) install_templates ;;
      3) install_pre_commit_hook ;;
      4) install_package_scripts ;;
      *) log_warn "Unknown option: $choice" ;;
    esac
  done

  echo ""
  echo -e "${BOLD}────────────────────────────────────────${RESET}"
  echo ""
  log_success "Setup complete!"
  echo ""
  echo "  Next steps:"
  echo "    /kdd:validate    — Verify the setup"
  echo "    /kdd:feature     — Create your first specification"
  echo ""
}

# ── CLI argument parsing ─────────────────────────────────────

show_help() {
  cat <<'HELP'
KDD Project Setup

Usage:
  setup-project.sh [options]

Options:
  --all                Install all components
  --dirs               Create spec directory structure
  --templates          Copy spec templates to specs/.templates/
  --hook               Install pre-commit validation hook
  --scripts            Add validate:specs script to package.json
  --project-dir DIR    Target directory (default: current directory)
  --no-confirm         Skip confirmation prompts
  --dry-run            Show what would be done without making changes
  --help               Show this help message

Examples:
  # Interactive menu
  setup-project.sh

  # Install everything non-interactively
  setup-project.sh --all --no-confirm

  # Only create directories and templates
  setup-project.sh --dirs --templates

  # Preview changes
  setup-project.sh --all --dry-run
HELP
}

parse_args() {
  # Defaults
  PROJECT_DIR="$(pwd)"
  DRY_RUN="false"
  NO_CONFIRM="false"

  local do_dirs="false"
  local do_templates="false"
  local do_hook="false"
  local do_scripts="false"
  local has_component="false"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --all)
        do_dirs="true"; do_templates="true"; do_hook="true"; do_scripts="true"
        has_component="true"
        shift ;;
      --dirs)
        do_dirs="true"; has_component="true"; shift ;;
      --templates)
        do_templates="true"; has_component="true"; shift ;;
      --hook)
        do_hook="true"; has_component="true"; shift ;;
      --scripts)
        do_scripts="true"; has_component="true"; shift ;;
      --project-dir)
        PROJECT_DIR="$2"; shift 2 ;;
      --no-confirm)
        NO_CONFIRM="true"; shift ;;
      --dry-run)
        DRY_RUN="true"; shift ;;
      --help|-h)
        show_help; exit 0 ;;
      *)
        log_error "Unknown option: $1"
        echo "  Run with --help for usage information"
        exit 1 ;;
    esac
  done

  # Resolve to absolute path
  PROJECT_DIR="$(cd "$PROJECT_DIR" 2>/dev/null && pwd)"

  if [[ "$has_component" == "false" ]]; then
    # No component flags → interactive mode
    show_menu
    exit 0
  fi

  # Non-interactive execution
  if [[ "$DRY_RUN" == "true" ]]; then
    echo ""
    echo -e "  ${CYAN}DRY RUN${RESET} — no changes will be made"
  fi

  show_header

  echo -e "${BOLD}────────────────────────────────────────${RESET}"

  [[ "$do_dirs" == "true" ]]      && install_spec_directories
  [[ "$do_templates" == "true" ]] && install_templates
  [[ "$do_hook" == "true" ]]      && install_pre_commit_hook
  [[ "$do_scripts" == "true" ]]   && install_package_scripts

  echo ""
  echo -e "${BOLD}────────────────────────────────────────${RESET}"
  echo ""
  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "Dry run complete — no changes were made"
  else
    log_success "Setup complete!"
  fi
  echo ""
  echo "  Next steps:"
  echo "    /kdd:validate    — Verify the setup"
  echo "    /kdd:feature     — Create your first specification"
  echo ""
}

# ── Main ─────────────────────────────────────────────────────

main() {
  parse_args "$@"
}

main "$@"
