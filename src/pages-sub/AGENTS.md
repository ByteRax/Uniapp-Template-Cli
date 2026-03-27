<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# pages-sub

## Purpose
存放分包页面和分包专用组件，用于降低主包体积并承载登录、404、WebView、样式演示等非首页核心能力。

## Key Files

| File | Description |
|------|-------------|
| `404/index.vue` | 404 页面。 |
| `login/login.vue` | 登录页，承载登录与登录态回跳入口。 |
| `webview/webView.vue` | WebView 容器页面。 |
| `styles/index.vue` | 样式或能力演示页。 |
| `components/BarChart.vue` | 分包内组件，可被主包异步引用。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `404/` | 404 页面目录。 |
| `login/` | 登录相关页面。 |
| `webview/` | WebView 容器页。 |
| `styles/` | 样式或组件能力示例页。 |
| `components/` | 分包专用组件。 |

## For AI Agents

### Working In This Directory
- 非核心页面优先放这里，避免持续膨胀主包。
- 若主包需要使用分包组件，遵循当前异步跨包加载方式，不要直接改回同步引用。
- 登录、404 与 WebView 都会被路由层显式使用，改路径或文件名时要同步检查导航常量与拦截器。

### Testing Requirements
- 改动后运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 至少验证一个涉及该分包的导航场景。
- 若修改跨包组件或预加载相关内容，再检查主包引用和预加载规则是否正常。

### Common Patterns
- 分包页面通过页面配置和 `pages.config.ts` 被纳入构建。
- 主包通过 `?async` 方式异步引用分包组件。
- 首页预加载规则可提前拉取该分包资源。

## Dependencies

### Internal
- 依赖 `pages.config.ts`、`src/router/` 和主包页面的跨包引用。

### External
- `@uni-ku/bundle-optimizer` 之类的分包优化能力。
- UniApp 分包加载机制。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
