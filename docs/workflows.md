# Workflows

This guide shows how kdd-tools commands, skills, and rules compose into end-to-end workflows. Each pattern describes a common scenario with the sequence of tools to use.

---

## Workflow Map

```
                        ┌─────────────────┐
                        │   Idea / Change  │
                        └────────┬────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
          ┌─────────────┐ ┌───────────┐ ┌──────────────┐
          │ /kdd:feature │ │ /kdd:ui   │ │ Edit existing │
          │  (discover)  │ │ (design)  │ │   spec file   │
          └──────┬──────┘ └─────┬─────┘ └──────┬───────┘
                 │              │               │
                 │         ┌────┘          ┌────┘
                 ▼         ▼               ▼
          ┌─────────────────────────────────────┐
          │          Spec files created          │
          └────────────────┬────────────────────┘
                           │
                           ▼
          ┌─────────────────────────────────────┐
          │         /kdd:validate                │
          │   (frontmatter + structure + semantics) │
          └────────────────┬────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Errors?    │
                    └──────┬──────┘
                     yes   │   no
                 ┌─────────┴─────────┐
                 ▼                   ▼
          ┌─────────────┐    ┌──────────────┐
          │ /kdd:fix-spec│    │ /kdd:validate │
          │  (auto-fix)  │    │   -deps       │
          └──────┬──────┘    └──────┬───────┘
                 │                  │
                 └──────┬───────────┘
                        ▼
          ┌─────────────────────────────────────┐
          │    /kdd:list-entities                │
          │    /kdd:analyze-entities             │
          │    (review coverage)                 │
          └────────────────┬────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Commit /   │
                    │   Open PR    │
                    └──────────────┘
```

---

## Pattern 1: New Feature

**Scenario**: You have a vague idea and want to turn it into structured KDD specifications.

### Steps

```
1.  /kdd:feature I want users to be able to pause a session
        ↓  Claude walks you through discovery (5 phases)
        ↓  Produces structured summary
        ↓  Generates spec files with your approval

2.  /kdd:validate
        ↓  Check all generated files pass validation

3.  /kdd:fix-spec specs/01-domain/entities/Session.md
        ↓  Fix any frontmatter or wiki-link issues

4.  /kdd:validate-deps
        ↓  Ensure no layer dependency violations

5.  Review gaps
        ↓  kdd-gaps skill activates: "what's missing in this feature?"
        ↓  kdd-review skill activates: "review this spec for quality"
```

### What Happens Behind the Scenes

| Step | Commands | Skills Activated | Rules Activated |
|------|----------|-----------------|----------------|
| 1 | `/kdd:feature` | kdd-methodology, kdd-author, spec-writing | kdd-writing (when files are created) |
| 2 | `/kdd:validate` | — | — |
| 3 | `/kdd:fix-spec` | kdd-fix | — |
| 4 | `/kdd:validate-deps` | — | — |
| 5 | Conversation | kdd-gaps, kdd-review | Type-specific rules per file |

### Tips

- Don't skip the discovery phase — `/kdd:feature` helps you identify artifacts you might miss
- Run `/kdd:validate` after every batch of changes, not just at the end
- The `kdd-gaps` skill will flag missing events, error cases, and acceptance criteria

---

## Pattern 2: Add UI

**Scenario**: You need to design a UI component, view, or flow and optionally generate a Storybook wireframe.

### Steps

```
1.  /kdd:ui A card showing a Persona with their hat color
        ↓  Claude identifies type (component), asks refinement questions
        ↓  Generates UI spec with ASCII wireframes

2.  /kdd:validate specs/03-experience/components/UI-PersonaCard.md
        ↓  Check the generated spec

3.  /kdd:generate-story specs/03-experience/components/UI-PersonaCard.md
        ↓  Creates .stories.tsx with wireframe component
        ↓  One story per state (Default, Hover, Disabled, Loading)

4.  Review in Storybook
        ↓  bun run storybook
        ↓  Iterate on the spec if the wireframe needs changes

5.  /kdd:sync-story specs/03-experience/components/UI-PersonaCard.md
        ↓  After spec changes, syncs the story preserving custom code
```

### What Happens Behind the Scenes

| Step | Commands | Skills Activated | Rules Activated |
|------|----------|-----------------|----------------|
| 1 | `/kdd:ui` | kdd-methodology, spec-writing | kdd-experience-components or kdd-experience-views |
| 2 | `/kdd:validate` | — | — |
| 3 | `/kdd:generate-story` | — | — |
| 5 | `/kdd:sync-story` | — | — |

### Tips

- Use keywords in your description to guide type detection: "card" → component, "page" → view, "wizard" → flow
- The ASCII wireframes in your spec drive the Storybook generation — invest in making them clear
- After generating, add custom play functions in the `@custom` zone of the story file
- See [Storybook Workflow](storybook-workflow.md) for the full spec-to-implementation methodology

---

## Pattern 3: Validate Before PR

**Scenario**: You've been writing specs and want to ensure everything is correct before opening a pull request.

### Steps

```
1.  /kdd:validate
        ↓  Full validation (all three levels)
        ↓  Fix any errors

2.  /kdd:validate-deps
        ↓  Check for layer dependency violations
        ↓  Fix any upward references

3.  /kdd:list-entities
        ↓  Generate entity index
        ↓  Review undocumented entities

4.  /kdd:analyze-entities specs/02-behavior/use-cases/UC-005-NewFeature.md
        ↓  Find missing wiki-links in key files

5.  /kdd:validate --output json > report.json
        ↓  Optional: generate a report to attach to the PR
```

### Checklist

- [ ] `validate` returns 0 errors
- [ ] `validate-deps` finds 0 violations
- [ ] No undocumented entities referenced by wiki-links
- [ ] Key files have all entity mentions properly linked

### Tips

- Run `--level frontmatter` first for a quick check, then the full validation
- The `--output github` format produces annotations that show directly in GitHub PR diffs
- Set up a pre-commit hook or GitHub Action to automate this — see [Validation Tooling: CI/CD](validation-tooling.md#cicd-integration)

---

## Pattern 4: Iterate on Existing Specs

**Scenario**: You need to update existing specs — change a business rule, rename an entity, add error cases.

### Steps

```
1.  Describe the change to Claude
        ↓  "The session limit should be 10 instead of 5"
        ↓  kdd-iterate skill activates automatically
        ↓  Claude analyzes impact and identifies cascade effects

2.  Apply changes
        ↓  Claude updates affected specs across layers
        ↓  Hooks fire on each write (pre: formatting, post: link verification)

3.  /kdd:validate
        ↓  Verify all changes are consistent

4.  /kdd:fix-spec specs/01-domain/rules/BR-SESSION-002.md
        ↓  Fix any broken links from renamed entities

5.  /kdd:validate-deps
        ↓  Ensure changes didn't introduce layer violations
```

### What Happens Behind the Scenes

| Step | Commands | Skills Activated | Rules Activated |
|------|----------|-----------------|----------------|
| 1 | Conversation | kdd-iterate | — |
| 2 | (Claude uses Edit/Write) | spec-writing | Type-specific rules per file |
| 3 | `/kdd:validate` | — | — |
| 4 | `/kdd:fix-spec` | kdd-fix | — |

### Tips

- The `kdd-iterate` skill maps cascade effects: changing an entity might require updating events, rules, commands, use cases, and UI specs
- Always validate after iteration — propagation can miss edge cases
- For renaming an entity, Claude will update wiki-links across all files automatically

---

## Which Tool When?

| I want to... | Use |
|--------------|-----|
| Explore a new feature idea | `/kdd:feature` |
| Design a UI element | `/kdd:ui` |
| Check if my specs are valid | `/kdd:validate` |
| Check layer dependency rules | `/kdd:validate-deps` |
| Auto-fix common issues | `/kdd:fix-spec <file>` |
| See all entities in my system | `/kdd:list-entities` |
| Find missing wiki-links in a file | `/kdd:analyze-entities <file>` |
| Generate a Storybook wireframe | `/kdd:generate-story <spec>` |
| Update Storybook after spec changes | `/kdd:sync-story [spec]` |
| Update specs after a requirement change | Describe the change (kdd-iterate skill) |
| Review spec quality | Ask Claude to review (kdd-review skill) |
| Find missing artifacts | Ask "what's missing?" (kdd-gaps skill) |
| Trace requirements across layers | Ask for traceability (kdd-trace skill) |
| Understand KDD structure | Ask about KDD (kdd-methodology skill) |

---

## See Also

- [Command Reference](commands.md) — syntax and arguments for all commands
- [Skills, Rules, and Hooks](skills-and-rules.md) — what activates automatically
- [Validator Guide](validator-guide.md) — deep dive into validation levels
- [Storybook Workflow](storybook-workflow.md) — spec-to-implementation for UI
- [Getting Started](getting-started.md) — first-time setup tutorial
