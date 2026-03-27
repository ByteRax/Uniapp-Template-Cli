<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# env

## Purpose
统一存放项目环境变量文件，供 `getEnv.ts`、`manifest.config.ts`、`vite.config.ts` 和上传脚本读取，替代仓库根目录 `.env` 的常见做法。

## Key Files

| File | Description |
|------|-------------|
| `.env` | 通用默认环境变量。 |
| `.env.development` | 开发环境覆盖变量。 |
| `.env.production` | 生产环境覆盖变量。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 只在这里维护环境变量，不要在仓库根目录新增 `.env`。
- 变量命名保持 `VITE_*` 前缀约定，避免和现有脚本读取逻辑脱节。
- 改动后通常需要重启 dev server 或重新构建，环境变量不会热更新到所有链路。

### Testing Requirements
- 改动变量后按影响范围运行对应的 `pnpm dev:*` 或 `pnpm build:*`。
- 若修改代理、BaseURL 或小程序配置，额外验证 `manifest.config.ts` 生成结果和上传脚本读取行为。

### Common Patterns
- `getEnv.ts` 负责解析运行模式并加载该目录下的变量文件。
- H5 代理相关变量包括 `VITE_APP_PROXY_ENABLE`、`VITE_APP_PROXY_PREFIX`、`VITE_SERVER_BASEURL`。
- 国际化兜底、本地构建行为等也通过这里的变量驱动。

## Dependencies

### Internal
- 被 `getEnv.ts`、`manifest.config.ts`、`vite.config.ts` 和 `scripts/upload-weixin.js` 读取。

### External
- 无直接运行时依赖，主要由 Vite / Node 构建链消费。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
