<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# .agent

## Purpose
存放与 AI 协作相关的补充文档和历史笔记，用于记录仓库约定、历史分析结论或辅助说明，不直接参与应用运行。

## Key Files

| File | Description |
|------|-------------|
| `README.md` | 说明 `.agent/` 目录的用途和组织方式。 |
| `AINOTE.md` | 历史 AI 工作笔记，包含部分项目说明与经验记录。 |

## Subdirectories

当前未发现需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 把这里视为辅助参考，不要覆盖 `CLAUDE.md`、源码和当前配置所表达的事实。
- 若笔记与当前代码冲突，以现状代码和仓库指令为准。
- 适合记录补充说明，不适合当作唯一事实来源驱动代码修改。

### Testing Requirements
- 文档性改动通常无需运行构建；若根据这里的结论修改代码，应回到对应源码目录执行验证。

### Common Patterns
- 内容偏说明性、历史性，可能存在过时信息。
- 常与其他 AI 协作文档配合使用，用来补足背景而不是定义行为。

## Dependencies

### Internal
- 与 `CLAUDE.md`、`.claude/tasks/` 等协作文档形成互补关系。

### External
- 无运行时依赖。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
