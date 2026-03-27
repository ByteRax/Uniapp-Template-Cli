<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# Uniapp-Template-Cli

## Purpose
基于 UniApp + Vue 3 + TypeScript + Vite + UnoCSS 的多端模板工程。仓库以配置驱动方式生成页面与 manifest，入口在 `src/main.ts`，启动时按 `setupStore()`、`setupRoute()`、`setupHttp()` 顺序挂载状态、路由和请求层。

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 项目依赖、脚本、版本号与 lint-staged 配置。 |
| `CLAUDE.md` | 当前仓库的协作约束、命令约定与架构说明。 |
| `vite.config.ts` | 构建编排中心，统一接入 Uni 插件、自动导入、UnoCSS、代理与构建优化。 |
| `pages.config.ts` | 页面配置源，生成运行时使用的 `src/pages.json`。 |
| `manifest.config.ts` | 应用配置源，结合 `env/` 与 `package.json` 生成 `src/manifest.json`。 |
| `getEnv.ts` | 解析命令参数并从 `env/` 目录加载环境变量。 |
| `uno.config.ts` | UnoCSS 规则与预设配置。 |
| `uno-color-mapping.ts` | 暗色主题变量与颜色映射。 |
| `commitlint.config.ts` | Git 提交信息校验配置。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 应用源码、页面、路由、状态、请求层与自动生成配置（见 `src/AGENTS.md`）。 |
| `env/` | 环境变量文件，统一替代根目录 `.env`（见 `env/AGENTS.md`）。 |
| `public/` | H5/PWA 静态资源与图标文件（见 `public/AGENTS.md`）。 |
| `scripts/` | 上传或构建辅助脚本（见 `scripts/AGENTS.md`）。 |
| `vite-plugins/` | 项目自定义 Vite 插件（见 `vite-plugins/AGENTS.md`）。 |
| `.agent/` | AI 协作文档与历史笔记（见 `.agent/AGENTS.md`）。 |
| `.github/` | GitHub/Copilot 侧的协作说明（见 `.github/AGENTS.md`）。 |
| `.husky/` | Git 提交钩子脚本（见 `.husky/AGENTS.md`）。 |

## For AI Agents

### Working In This Directory
- 开始前先读 `CLAUDE.md` 与 `.claude/tasks/context_session_*.md`。
- 优先修改配置源文件，不要手改生成文件：`src/pages.json`、`src/manifest.json`、`src/types/*.d.ts` 中的自动生成产物。
- 环境变量统一放在 `env/`，不要在仓库根目录新增 `.env`。
- 回答与提交说明以简体中文为主，遵守仓库已有命令和目录约定。

### Testing Requirements
- 当前仓库没有 `pnpm test`。
- 代码变更后优先运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 若修改构建或页面生成逻辑，再补充对应端的 `pnpm dev:*` 或 `pnpm build:*` 验证。

### Common Patterns
- 配置驱动：`pages.config.ts` / `manifest.config.ts` → 生成运行时 JSON。
- 启动顺序固定：`src/main.ts` 中先 store、后 route、再 http。
- 自动导入覆盖 Vue / Pinia / uni-app API 以及 `src/{composables,stores,utils,hooks,router}`。
- 多端差异通过 `#ifdef` / `#ifndef` 条件编译处理。

## Dependencies

### Internal
- `src/` 依赖根级配置文件与 `env/` 变量生成运行时行为。
- `scripts/` 与 `vite-plugins/` 会读取 `package.json`、环境变量或构建产物。

### External
- `@dcloudio/*` - UniApp 多端运行时与构建工具链。
- `vue` / `pinia` - 视图层与状态管理。
- `wot-design-uni` / `z-paging` - UI 组件与列表能力。
- `unocss` - 原子化样式系统。
- `vite` / `vue-tsc` / `eslint` / `oxlint` / `oxfmt` - 构建与质量检查工具。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
