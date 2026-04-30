<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-30 | Updated: 2026-04-30 -->

# common

## Purpose
跨页面复用的全局基础组件，无业务耦合。

## Key Files

| File | Description |
|------|-------------|
| `GlobalLoading.vue` | 全局 loading 组件，由全局状态驱动显示。 |
| `GlobalToast.vue` | 全局 toast 组件，封装多端提示展示。 |
| `GlobalMessage.vue` | 全局消息框组件，承载 alert / confirm / prompt 类交互。 |

## For AI Agents

### Working In This Directory
- 保持无业务耦合 — 不要引入 store 或业务 API。
- 全局 UI 组件由 store 状态驱动，而不是局部直接控制 DOM。
- 改动时要同步理解 `App.ku.vue` 与对应 composable 的联动。

### Common Patterns
- 组件采用 PascalCase 文件名。
- 通过 composable 暴露控制方法（如 `useGlobalToast()`）。

## Dependencies

### Internal
- 与 `src/composables/`、`App.ku.vue` 存在联动。

### External
- `vue` 组件系统。
- `wot-design-uni` 基础 UI 组件。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
