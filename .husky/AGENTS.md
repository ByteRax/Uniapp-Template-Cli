<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# .husky

## Purpose
存放 Git 提交阶段执行的 Husky 钩子脚本，负责在提交前运行 lint-staged，以及在提交信息阶段执行 commitlint。

## Key Files

| File | Description |
|------|-------------|
| `pre-commit` | 调用 `npx lint-staged` 执行暂存文件格式化与 lint。 |
| `commit-msg` | 调用 commitlint 校验提交信息格式。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 修改前先核对 `package.json` 中的 `lint-staged` 与 `commitlint` 配置，避免钩子与实际规则脱节。
- 这里的脚本会直接影响提交体验，除非用户要求，不要随意放宽校验或绕过钩子。
- 保持脚本简单明确，优先把复杂规则放回工具配置文件。

### Testing Requirements
- 改动后至少检查脚本命令是否与 `package.json` 中现有脚本和依赖一致。
- 若用户要求，再通过真实 git commit 流程验证；默认不要主动创建提交。

### Common Patterns
- `pre-commit` 处理代码格式和 lint。
- `commit-msg` 处理 Conventional Commits 风格校验。
- Husky 由 `package.json` 的 `prepare` 脚本安装。

## Dependencies

### Internal
- 依赖根目录 `package.json` 的 `lint-staged` 配置和 `commitlint.config.ts`。

### External
- `husky`、`lint-staged`、`@commitlint/cli`、`@commitlint/config-conventional`。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
