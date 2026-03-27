<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# .github

## Purpose
存放面向 GitHub / Copilot 场景的协作说明文档，帮助外部 AI 或提交流程理解仓库约定。

## Key Files

| File | Description |
|------|-------------|
| `copilot-instructions.md` | GitHub Copilot 侧的仓库协作说明。 |
| `git-commit-instructions.md` | 提交信息或提交流程相关说明。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 这些文档可能落后于 `CLAUDE.md` 或当前代码，修改前先核对实际仓库状态。
- 若多份 AI 指令冲突，优先遵循当前会话的系统/仓库约束和最新代码事实。
- 适合更新协作说明，不适合承载运行时代码逻辑。

### Testing Requirements
- 文档改动通常无需构建；若文档引用命令或路径，至少核对其在当前仓库中存在。

### Common Patterns
- 面向外部协作工具的人类/AI 可读说明。
- 可能保留历史命名或旧命令，需要结合 `package.json` 验证。

## Dependencies

### Internal
- 与根目录 `CLAUDE.md`、Git hooks 和提交规范文档相关联。

### External
- GitHub / Copilot 等外部协作平台会消费这些说明。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
