<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# vite-plugins

## Purpose
存放项目自定义 Vite 插件，补充官方与社区插件之外的构建行为，包括版本注入、页面常量生成和开发者工具自动打开。

## Key Files

| File | Description |
|------|-------------|
| `vite-plugin-auto-version.ts` | 构建时更新版本号、Git hash 与构建时间，并注入占位符。 |
| `vite-config-uni-pages.ts` | 基于页面路径生成路由名称或页面常量。 |
| `vite-open-dev-tools.ts` | 在特定平台自动打开小程序开发者工具。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 修改前先确认插件在 `vite.config.ts` 中的接入顺序，因为部分行为依赖执行时机。
- 优先保持插件职责单一，不要把无关构建逻辑继续堆到现有文件里。
- 这类改动通常影响整个工程构建，需特别注意多端兼容与开发/生产模式差异。

### Testing Requirements
- 至少运行 `pnpm type-check` 与对应端的 `pnpm dev:*` / `pnpm build:*` 验证插件行为。
- 若改版本注入或页面生成逻辑，检查产物中的版本字段、页面常量或开发者工具拉起流程。

### Common Patterns
- 插件在 `vite.config.ts` 中按顺序注册。
- `vite-plugin-auto-version.ts` 负责版本号格式 `YYYYMMDDNN` 与构建信息注入。
- `vite-open-dev-tools.ts` 支持通过环境变量跳过自动打开。

## Dependencies

### Internal
- 由根级 `vite.config.ts` 引用。
- 部分插件会读取页面配置、构建模式或 `package.json` 信息。

### External
- `vite` 插件 API。
- Node.js 文件系统与进程环境。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
