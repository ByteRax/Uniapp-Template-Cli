# Update AGENTS.md Workflow Reference

Use this reference after `update-agents-md/SKILL.md` triggers unless the task is only a tiny typo fix.

## Official Skill Shape

OpenAI Codex skills are directories with a required `SKILL.md`, optional `scripts/`, `references/`, `assets/`, and optional `agents/openai.yaml`. `SKILL.md` requires `name` and `description` frontmatter. Repository skills are discovered under `.agents/skills` from the current working directory up to the repo root.

## Workflow

1. Inspect the current state:
   - Run `git status --short`.
   - Read root `AGENTS.md`.
   - List all `AGENTS.md` files with `rg --files --hidden -g 'AGENTS.md'`.
   - List existing rule files, usually `.codex/rules/**`, `.claude/rules/**`, `.agents/**`.

2. Define the maintenance goal:
  - Name the exact drift or shape problem being solved, for example stale facts, oversized root instructions, missing rule index, or outdated directory coverage.
  - State assumptions only when they affect the edit path.
  - If multiple interpretations would produce different docs, ask before editing.
  - Set success criteria as concrete checks, not vague cleanup intent.

3. Gather factual context before editing:
   - Read `package.json`, `.nvmrc`, lockfile/package manager metadata, `vite.config.*`, `tsconfig*.json`, lint/format configs, env loading code, page/manifest config, and relevant scripts.
   - Use `rg` to verify business-critical paths, generated files, test scripts, API tooling, and outdated references.
   - If a claim cannot be verified from files, write `未确认`; if it does not apply to this repo, write `不适用`.

4. Decide the AGENTS.md shape:
   - Prefer a lightweight root file with hard constraints, reading order, rule indexes, directory-level AGENTS indexes, confirmed facts, and unresolved facts.
   - Move detailed coding, frontend, pagination, architecture, workflow, and checklist guidance into focused rule files.
   - Do not duplicate long rule content in root `AGENTS.md` unless it is a must-follow constraint.

5. Update related rule files first when needed:
   - Fix stale paths or false facts in referenced rule files before pointing root `AGENTS.md` at them.
   - Keep rule files scoped by theme, for example project overview, development basics, architecture, frontend conventions, z-paging, and codegen checklist.

6. Edit surgically:
   - Use `apply_patch`.
   - Preserve user-authored content unless it is wrong or superseded by verified files.
   - Avoid inventing standards, commands, tools, project IDs, framework details, or directory meanings.
   - Do not reformat, reorder, or rewrite adjacent content unless the maintenance goal requires it.
   - Remove only dead or obsolete guidance made obsolete by the current change; mention unrelated stale content instead of deleting it.

7. Validate:
   - Run `git diff --check`.
   - Search for known stale paths and disputed facts with `rg`.
   - Re-check `git status --short` so unrelated user changes are not mistaken for your work.
   - For document-only changes, code checks may be skipped, but report that `pnpm type-check` / `pnpm lint` were not run and why.
   - For code or config changes, run the repo-required validation commands.

## Maintenance Gates

Before editing, answer these internally and keep the diff aligned with them:

- Assumptions: what must be true for this update to be correct, and is it verified?
- Minimality: can the root rule stay shorter by moving detail into a focused rule file?
- Scope: does each changed line trace to the requested AGENTS/rules maintenance goal?
- Verification: which command or search proves the stale fact, path, or index problem is gone?

Stop and ask instead of editing when the requested outcome depends on an unknown policy choice, a missing external credential, or two valid but incompatible rule structures.

## AGENTS.md Optimization Pattern

Use this shape for a mature repository:

```markdown
# AGENTS.md

本项目请遵循以下规范。所有结论必须基于项目真实文件；无法确认的信息必须写“未确认”，当前项目不适用的信息必须写“不适用”。

## 交流与执行

- 默认使用简体中文交流。
- 先读现有实现和作用域内规则，再改代码。
- 只做与任务直接相关的改动。

## 必须遵守

- 包管理、运行时、生成文件、验证命令、关键禁令。

## 读取顺序

1. 根目录 `AGENTS.md`
2. 目标目录最近的 `AGENTS.md`
3. 相关规则文件
4. 真实源码、配置、脚本

## 规则索引

### 项目介绍

@.codex/rules/project-overview.md

...

## 目录级规则

- `src/AGENTS.md`
- `src/http/AGENTS.md`

## 当前已确认事实

- 项目名、关键页面、关键领域逻辑、回归脚本。

## 未确认 / 不适用

- 无法从文件确认的外部系统、旧文档提到但当前未验证的信息。
```

## Fact-Finding Checklist

Use `rg` and direct file reads to verify:

- Package manager and engines: `package.json`, lockfiles, `.nvmrc`.
- Commands: `package.json` scripts and scripts directory.
- Env handling: `env/`, `getEnv.ts`, build config.
- Generated files: page and manifest output versus source config.
- Frameworks and plugins: Vite config, component registration, auto-import.
- Route/page facts: `pages.config.ts`, `src/pages.json`, `definePage`.
- Business domain paths: actual imports and file locations.
- Tests and verification: package scripts, `scripts/verify/**`, CI configs if present.
- External tools: only claim a project ID, endpoint, or integration if a real file or live tool/MCP result confirms it; record lookup failures as current access failures, not as proof that prior confirmed facts are false.

## Drift Checks

Use targeted searches based on the maintenance goal. Common checks in this repo:

- Directory coverage: `rg --files --hidden -g 'AGENTS.md'`
- Rule references: `rg -n '@\\.codex/rules|@\\.claude/rules|AGENTS.md|CLAUDE.md' AGENTS.md .codex/rules .claude/rules .agents/skills`
- Stale paths: `rg -n 'src/pages/index/domain/loan-calculator|src/hooks|src/layout|tracking' AGENTS.md .codex/rules .claude/rules .agents/skills`
- Tooling drift: `rg -n 'oxfmt|npm |yarn |vitest|jest|项目 ID：未确认|Apifox 项目 ID：未确认' AGENTS.md .codex/rules .claude/rules .agents/skills`

Adjust the exact patterns to the facts being edited; do not treat this list as exhaustive.

## Rule File Hygiene

Before making root `AGENTS.md` point to a rule file:

- Search that rule file for stale paths.
- Correct facts that conflict with current source.
- Move detailed procedural content out of root `AGENTS.md` into the appropriate rule file.
- Keep root rules short enough that agents can read them at task start.

## Repo-Specific Defaults

For this repository:

- Root `AGENTS.md` should stay concise and index-driven.
- Detailed rules live under `.codex/rules/`.
- Apifox MCP config is confirmed when `.codex/config.toml` contains `apifox-new-mcp`; current project ID `8053624` is confirmed by the existing AGENTS/rules state and prior MCP lookup. If a live MCP lookup now fails, report the failure as current access/lookup failure instead of silently downgrading the documented project ID to `未确认`.
- Keep `src/hooks/` and `src/layout/` marked `不适用` unless those directories are actually present.
- Do not reintroduce the stale path `src/pages/index/domain/loan-calculator.ts`; the verified path is `src/pages/tool/calculator/domain/loan-calculator.ts`.

## Validation Checklist

- `git diff --check`
- `rg -n '<known-stale-path>|<known-stale-claim>' AGENTS.md .codex/rules .claude/rules .agents/skills`
- `git status --short`
- Code checks only if code/config changed.
