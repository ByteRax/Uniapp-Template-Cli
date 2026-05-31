---
name: update-agents-md
description: Use when working in this repository on AGENTS.md, nested AGENTS.md files, .codex/rules, .claude/rules, or project-specific agent guidance; triggers include stale facts, oversized root instructions, rule-index cleanup, and repo-doc maintenance based on real files.
---

# Update AGENTS.md

## Goal

Maintain `AGENTS.md` as a concise, accurate repo entrypoint. Keep durable details in focused rule files, and make every claim traceable to actual repository files.

## Core Rules

- Convert the request into a verifiable doc-maintenance goal before editing.
- Verify before writing. If a fact cannot be confirmed from files, write `未确认`; if it does not apply, write `不适用`.
- State only assumptions that affect the edit path; ask only when ambiguity would change the outcome.
- Keep root `AGENTS.md` short and index-driven. Move detailed guidance into focused rule files.
- Preserve user-authored content unless it conflicts with verified files or the requested cleanup.
- Keep every changed line traceable to the requested maintenance goal.
- Do not invent commands, integrations, project IDs, directory meanings, or tooling standards.

## Workflow

1. Inspect the current state:
  - `git status --short`
  - Read root `AGENTS.md`
  - `rg --files --hidden -g 'AGENTS.md'` 列出所有 AGENTS.md
  - List existing rule files: `.codex/rules/**`、`.claude/rules/**`、`.agents/**`

2. Define the maintenance goal:
  - Name the exact drift or shape problem being solved
  - State assumptions only when they affect the edit path
  - If multiple interpretations would produce different docs, ask before editing
  - Set success criteria as concrete checks, not vague cleanup intent

3. Gather factual context before editing:
  - Read `package.json`、`.nvmrc`、`vite.config.*`、`tsconfig*.json`、lint/format configs
  - Use `rg` to verify business-critical paths, generated files, test scripts, API tooling, and outdated references
  - If a claim cannot be verified from files, write `未确认`; if it does not apply, write `不适用`

4. Decide the AGENTS.md shape:
  - Prefer a lightweight root file with hard constraints, reading order, rule indexes, confirmed facts, and unresolved facts
  - Move detailed coding, frontend, pagination, architecture, workflow, and checklist guidance into focused rule files
  - Do not duplicate long rule content in root `AGENTS.md` unless it is a must-follow constraint

5. Update related rule files first when needed:
  - Fix stale paths or false facts in referenced rule files before pointing root `AGENTS.md` at them
  - Keep rule files scoped by theme

6. Edit surgically:
  - Preserve user-authored content unless it is wrong or superseded by verified files
  - Do not reformat, reorder, or rewrite adjacent content unless the maintenance goal requires it
  - Remove only dead or obsolete guidance made obsolete by the current change; mention unrelated stale content instead of deleting it

7. Validate:
  - `git diff --check`
  - `rg` to search for known stale paths and disputed facts
  - `git status --short` so unrelated changes are not mistaken for your work
  - For document-only changes, code checks may be skipped, but report that `pnpm type-check` / `pnpm lint` were not run and why
  - For code or config changes, run the repo-required validation commands

## Maintenance Gates

Before editing, answer these internally and keep the diff aligned:

- **Assumptions**: what must be true for this update to be correct, and is it verified?
- **Minimality**: can the root rule stay shorter by moving detail into a focused rule file?
- **Scope**: does each changed line trace to the requested AGENTS/rules maintenance goal?
- **Verification**: which command or search proves the stale fact, path, or index problem is gone?

Stop and ask instead of editing when the requested outcome depends on an unknown policy choice, a missing external credential, or two valid but incompatible rule structures.

## Fact-Finding Checklist

Use `rg` and direct file reads to verify:

- Package manager and engines: `package.json`, lockfiles, `.nvmrc`
- Commands: `package.json` scripts and scripts directory
- Env handling: `env/`, `getEnv.ts`, build config
- Generated files: page and manifest output versus source config
- Frameworks and plugins: Vite config, component registration, auto-import
- Route/page facts: `pages.config.ts`, `src/pages.json`, `definePage`
- Business domain paths: actual imports and file locations
- Tests and verification: package scripts, `scripts/verify/**`, CI configs if present
- External tools: only claim a project ID, endpoint, or integration if a real file or live tool/MCP result confirms it

## Drift Checks

Use targeted searches based on the maintenance goal:

- Directory coverage: `rg --files --hidden -g 'AGENTS.md'`
- Rule references: `rg -n '@\.codex/rules|@\.claude/rules|AGENTS.md|CLAUDE.md' AGENTS.md .codex/rules .claude/rules .agents/skills`
- Stale paths: `rg -n 'src/pages/index/domain/loan-calculator|src/hooks|src/layout|tracking' AGENTS.md .codex/rules .claude/rules .agents/skills`
- Tooling drift: `rg -n 'npm |yarn |vitest|jest|项目 ID：未确认|Apifox 项目 ID：未确认' AGENTS.md .codex/rules .claude/rules .agents/skills`

## Repo-Specific Defaults

- Root `AGENTS.md` should stay concise and index-driven
- Detailed rules live under `.codex/rules/`（Claude 通过 `.claude/rules/` 软链接自动加载）
- Apifox MCP config is confirmed when `.codex/config.toml` or `.claude/settings.json` contains apifox config; current project ID `8053624`
- Keep `src/hooks/` and `src/layout/` marked `不适用` unless those directories are actually present
- Do not reintroduce the stale path `src/pages/index/domain/loan-calculator.ts`; the verified path is `src/pages/tool/calculator/domain/loan-calculator.ts`

## Validation Checklist

- `git diff --check`
- `rg -n '<known-stale-path>|<known-stale-claim>' AGENTS.md .codex/rules .claude/rules .agents/skills`
- `git status --short`
- Code checks only if code/config changed
