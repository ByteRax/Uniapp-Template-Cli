<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# composables

## Purpose
存放组合式能力与全局状态封装。该目录既有纯 composable，也有以 `useGlobal*` 命名但实际基于 Pinia 的全局状态模块，是项目的重要约定之一。

## Key Files

| File | Description |
|------|-------------|
| `useGlobalLoading.ts` | 全局 loading 状态封装。 |
| `useGlobalToast.ts` | 全局 toast 状态封装。 |
| `useGlobalMessage.ts` | 全局消息框状态封装。 |
| `useGlobalPage.ts` | 页面级 ref 与状态协作封装。 |
| `useScroll.ts` | 列表滚动/分页相关纯 composable。 |
| `useTheme.ts` | 主题读取与系统主题同步逻辑。 |
| `types/theme.ts` | 主题相关类型定义。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `types/` | composable 使用的局部类型定义。 |

## For AI Agents

### Working In This Directory
- 不要仅凭目录名判断职责；部分文件本质上是单例状态模块，不是普通函数式 composable。
- 新增全局 UI 能力时，通常要同时改这里、对应组件以及 `App.ku.vue`。
- 避免在这里直接操作平台不兼容的 DOM 或浏览器专属 API，除非已做好 H5 限定。

### Testing Requirements
- 改动后运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 若影响全局 UI 状态，手动验证页面切换、状态清理和组件显示是否符合预期。
- 若影响主题或滚动逻辑，补充目标端页面交互验证。

### Common Patterns
- `useGlobal*` 往往代表全局共享状态。
- 纯 composable 倾向于无副作用、返回状态与方法的函数式风格。
- 与 `App.ku.vue` 配合渲染跨页面 loading / toast / message。

## Dependencies

### Internal
- 依赖 `src/stores/`、`src/components/`、`App.ku.vue` 与页面层调用。

### External
- `vue` 组合式 API。
- `pinia`（针对全局状态型 composable）。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
