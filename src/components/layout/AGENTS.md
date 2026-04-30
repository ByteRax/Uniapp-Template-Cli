<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-30 | Updated: 2026-04-30 -->

# layout

## Purpose
页面布局和容器类组件，提供统一的页面结构壳。

## Key Files

| File | Description |
|------|-------------|
| `BaseLayout.vue` | 页面基础布局容器，统一处理 loading / empty / error / success 状态。 |

## For AI Agents

### Working In This Directory
- `BaseLayout.vue` 是页面最常用的布局壳，新页面优先使用它。
- 布局组件会暴露状态切换方法给页面层使用。
- 不要在布局组件中放业务逻辑。

### Common Patterns
- 页面通过 props 控制布局状态（loading / empty / error / success）。
- 布局组件使用 `<slot>` 承载页面内容。

## Dependencies

### Internal
- 被 `src/pages/` 和 `src/pages-sub/` 中的页面广泛引用。

### External
- `vue` 组件系统。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
