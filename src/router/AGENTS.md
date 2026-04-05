<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# router

## Purpose
封装页面路径工具、导航方法和全局路由拦截器，统一处理页面存在性校验、登录态跳转、防重复导航与 redirect 参数解析。

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 暴露 `setupRoute()`、当前路由解析和页面列表工具。 |
| `interceptor.ts` | 核心路由拦截器，处理登录校验和非法页面跳转。 |
| `router.ts` | 导航方法封装与常量定义。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 优先通过这里的封装导航，不要绕过到裸 `uni.navigateTo` / `uni.redirectTo`。
- 页面存在性和 `needLogin` 校验依赖运行时页面列表，改动时要同时关注页面配置生成逻辑。
- 修改 redirect 或 query 解析逻辑时，确保 H5 和小程序端都能正确 decode。

### Testing Requirements
- 至少运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 手动验证登录页跳转、未登录访问受限页、非法路径跳 404、重复点击导航等场景。
- 若改动页面列表逻辑，再检查主包与分包页面都能被正确识别。

### Common Patterns
- `setupRoute()` 注册全局拦截器。
- `currRoute()` / `parseUrlToObj()` 用于从 `fullPath` 解析 path 与 query。
- `getAllPages(key?)` 同时遍历主包与分包页面元数据。
- 导航封装里有 300ms 同路由去重与全局锁。

## Dependencies

### Internal
- 依赖生成后的 `src/pages.json`、`src/stores/userStore.ts` 与登录页面路径常量。

### External
- `@dcloudio/uni-app` 的页面栈与导航 API。
- `@uni-helper/vite-plugin-uni-pages` 生成的页面元数据类型。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
