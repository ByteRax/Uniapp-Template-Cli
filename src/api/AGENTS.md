<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-30 | Updated: 2026-04-30 -->

# api

## Purpose
API 方法定义与接口类型声明。按业务模块组织请求函数，类型放在 `types/` 子目录。

## Key Files

| File | Description |
|------|-------------|
| `login.ts` | 登录相关 API。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `types/` | 接口请求/响应的 TypeScript 类型声明。 |

## For AI Agents

### Working In This Directory
- API 方法应调用自动导入的 `httpInstance` 发起请求，不要自行创建新的 request 实例。
- 接口类型统一放在 `types/` 子目录，按模块命名。
- API 函数只负责调用 HTTP 层，不要在此处添加业务逻辑。

### Common Patterns
- 使用 `httpInstance.get<T>()` / `httpInstance.post<T>()` 发起带类型约束的请求。
- 通过 `meta` 控制单次请求行为（`loading`、`toast`、`originalData`）。

## Dependencies

### Internal
- 依赖 `src/http/` 提供的 `httpInstance` 单例。
- 类型定义引用 `src/http/types.ts` 中的基础类型。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
