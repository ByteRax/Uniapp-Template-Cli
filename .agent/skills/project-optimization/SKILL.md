---
name: project-optimization
description: Use in this repository when the user asks to optimize, scan, review, improve, refactor, clean up, or maintain the current project; supports scan, execute, and focus modes, with scan as the default whole-repo maintainability review that does not edit code.
---

# Project Optimization

## Goal

Turn broad "optimize this project" requests into evidence-based, maintainable, verifiable work.

This skill is repo-local to `real-rate-calculator`. All conclusions must come from real project files. If a fact cannot be confirmed, write `未确认`; if it does not apply to this project, write `不适用`.

## Default Mode

Default to:

- Mode: `scan`
- Scope: `whole-repo`
- Priority: `maintainability-first`

In default `scan` mode, do not edit files, format files, run autofix commands, stage changes, commit, or create pull requests.

## Modes

### scan

Use when the user asks to scan, review, inspect, find optimization opportunities, or generally optimize the project without explicitly asking for implementation.

Rules:

- Read the real repository structure and applicable `AGENTS.md` / rule files before judging.
- Prefer `rg` / `rg --files` for scans.
- Focus on evidence, not taste.
- Keep findings actionable and scoped.
- Do not modify code.

Default output:

- Issue or opportunity
- Evidence file or command
- Impact
- Priority
- Recommended handling
- Whether confirmation is needed

### execute

Use only when the user explicitly asks to implement, fix, apply, execute, or start processing a confirmed optimization.

Rules:

- Start from a small, explicit plan.
- Confirm before broad or risky changes.
- Keep edits scoped to the requested optimization.
- Remove dead or obsolete code when refactoring; do not keep compatibility code without a current requirement.
- After modifying `ts`, `vue`, `js`, or `d.ts` files, run at least `pnpm type-check` and `pnpm lint`.
- For doc-only changes, code checks may be skipped, but the final response must state that and why.

### focus

Use when the user names a module, path, business area, or optimization theme.

Examples:

- bill module
- interest-rate calculator
- API contract usage
- duplicate code
- type safety
- AGENTS/rules maintenance

Rules:

- Stay inside the requested scope.
- If a root cause crosses scope boundaries, report it before expanding the work.
- Do not turn a focused request into whole-repo cleanup unless the user asks.

## Priority Modes

### maintainability-first

Default. Prioritize:

1. Duplicate code or duplicate business knowledge
2. Confused ownership or mixed responsibilities
3. Dead code, obsolete code, or invalid compatibility paths
4. Rule documentation drift from real files
5. Over-wide abstractions or repeated flags/modes/switches
6. Names or interfaces that are hard to understand without explanatory comments

### correctness-first

Use only when requested. Prioritize likely bugs, type risks, API contract mismatches, and boundary conditions.

### business-first

Use only when requested. Prioritize bill management, real-rate calculation, login state, analytics, and other core business flows.

## Existing Skill Handoffs

- For `AGENTS.md`, `.codex/rules`, `.claude/rules`, or project agent guidance, use `update-agents-md`.
- For Apifox endpoint contracts, API field confirmation, or interface integration, use `apifox-api-docs`.

Do not copy those specialist workflows into this skill.

## Automations

This skill may be called by Codex Automations for recurring scan-only review.

Recommended automation prompt:

```text
使用 project-optimization skill，以 scan 模式全项目扫描，优先发现可维护性问题，不修改代码；有发现时输出问题清单、证据、优先级和建议处理方式。
```

Automation constraints:

- Do not create an automation by default.
- Prefer `scan` mode for automation.
- Keep automation runs read-only unless the user explicitly asks for execution.
- For Git projects, prefer an isolated worktree so the current workspace is not affected.
- Avoid background full access unless explicitly required.

## Reporting

Respond in Chinese for this project.

For `scan`, lead with the highest-impact findings. If no meaningful issue is found, say that clearly and mention what was checked.

For `execute`, final responses must include:

- What changed
- Why it changed
- Verification performed
- Any unverified parts and reason
