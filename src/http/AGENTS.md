<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# http

## Purpose
封装统一请求入口、请求配置和请求/响应拦截器，向业务层提供一致的 `uni.request` 使用方式，并集中处理 token、loading、重复请求取消与错误提示。

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `Request` 类、`httpInstance` 单例和 `setupHttp(app)` 挂载逻辑。 |
| `interceptor.ts` | 请求/响应拦截器，实现 token 注入、loading 管理、401 处理等。 |
| `types.ts` | 请求配置、响应结构与元数据类型定义。 |
| `tools/queryString.ts` | URL 参数序列化辅助工具。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `tools/` | 请求层内部工具函数。 |

## For AI Agents

### Working In This Directory
- 优先维持“统一入口 + 拦截器处理”的架构，不要把页面级请求分支散落到业务层。
- 变更前确认 `meta.loading`、`meta.toast`、`meta.originalData` 等元数据约定没有被破坏。
- H5 代理、登录态和重复请求取消都在这里集中实现，改动时注意多端行为一致性。

### Testing Requirements
- 至少运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 若修改请求行为，重点验证 token 注入、loading 显示、401 跳转和重复请求取消逻辑。
- 涉及 H5 代理时，再验证代理前缀拼接结果。

### Common Patterns
- `Request.request()` 里合并全局 config 与单次请求 options。
- 拦截器在请求前后统一处理状态，不让页面重复写样板逻辑。
- `setupHttp(app)` 将实例挂到全局属性，供应用层统一消费。

## Dependencies

### Internal
- 依赖 `src/stores/userStore.ts`、UI 状态能力与路由跳转逻辑。
- 被 `src/api/` 或统一请求入口封装调用。

### External
- `@dcloudio/uni-app` 的 `uni.request`。
- `vue` 应用实例类型。 |

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
