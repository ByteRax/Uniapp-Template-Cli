<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# pages

## Purpose
存放主包页面。这里的页面会直接进入主包体积预算，适合首页和高频入口页面，并通过页面元数据参与路由生成和登录态控制。

## Key Files

| File | Description |
|------|-------------|
| `index/index.vue` | 首页和功能入口页。 |
| `index/paging.vue` | `z-paging` 分页能力演示页。 |
| `index/testA.vue` | 异步分包组件加载示例页。 |
| `index/testB.vue` | 全局 loading 等能力演示页。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `index/` | 当前主包页面集合。 |

## For AI Agents

### Working In This Directory
- 新增页面时优先判断它是否应该放在主包；非核心或低频页面尽量放到 `pages-sub/`。
- 页面元数据应通过页面配置宏维护，不要手改生成后的 `pages.json`。
- 若页面需要登录，确保其元数据和路由拦截器约定一致。

### Testing Requirements
- 修改页面后运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 至少在一个目标端验证页面渲染、路由跳转和页面级状态。
- 若改首页或主包入口，额外验证页面常量、预加载和首页类型配置。

### Common Patterns
- 页面通过元数据声明导航栏标题、首页类型和 `needLogin` 等属性。
- 主包页面通常作为导航入口或高频功能页。
- 路径会被页面生成逻辑转换为运行时路由与常量。

## Dependencies

### Internal
- 与 `pages.config.ts`、`src/router/`、`src/components/`、`src/composables/` 协作。

### External
- `@dcloudio/uni-app` 页面运行时。
- `z-paging` 等页面内组件库。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
