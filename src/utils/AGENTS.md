<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-04-30 -->

# utils

## Purpose
存放项目通用工具函数与轻量封装，包括日期、对象、字符串、平台判断、UI 辅助、HTTP 入口封装和类型工具。这些能力通过自动导入广泛分发到整个应用。

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 暴露最常用的公共导出。 |
| `Apis.ts` | 聚合请求实例与常用 UI 操作入口。 |
| `ui.ts` | toast / loading 等 UI 工具封装。 |
| `to.ts` | Go 风格 `[error, data]` 元组，避免 try-catch 嵌套。 |
| `env.ts` | isDev / isProd / isDebug 环境常量。 |
| `check.ts` | 小程序/App 更新检查，自动识别平台。 |
| `cookie.ts` | H5 Cookie 操作（setCookie、buildUniRequestCookieString）。 |
| `date.ts` | 日期时间格式化能力。 |
| `object.ts` | 对象读取、设置、深拷贝等工具。 |
| `platform.ts` | 多端平台判断能力。 |
| `ref.ts` | 组件 ref 辅助工具。 |
| `script.ts` | H5 动态脚本加载与移除。 |
| `uuid.ts` | UUID 生成。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 优先把新工具放进现有分类文件，只有确实形成新类别时再增文件。
- 这里很多函数会被自动导入全局使用，改签名或重命名前先确认影响范围。
- 避免在工具层引入重业务依赖或组件依赖，保持轻量和可复用。

### Testing Requirements
- 至少运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 若修改 `Apis.ts`、`ui.ts` 或平台判断函数，补充相关页面交互验证。
- 若改 H5 专属能力，确认非 H5 端不会误触发。

### Common Patterns
- 工具函数按主题拆文件，但通过自动导入对业务层保持平滑使用体验。
- `Apis.ts` 作为业务最常触达的工具聚合层。
- 平台相关函数和脚本加载函数会结合条件编译或运行时判断使用。

## Dependencies

### Internal
- 与 `src/http/`、`src/composables/`、`src/stores/` 和业务页面广泛互相调用。

### External
- `dayjs`。
- `vue` 类型与 ref 工具。
- `@dcloudio/uni-app` UI / 平台 API。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
