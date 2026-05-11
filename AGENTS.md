<!-- Updated: 2026-05-11 -->

# Uniapp-Template-Cli AI 代理手册

## 项目概览

这是一个基于 UniApp + Vue 3 + TypeScript + Vite 5 + UnoCSS 的多端模板工程。项目通过配置源生成运行时页面配置和 manifest：

- `pages.config.ts` 与页面内 `definePage()` 生成 `src/pages.json`。
- `manifest.config.ts` 结合 `package.json` 和 `env/` 生成 `src/manifest.json`。
- `src/main.ts` 依次执行 `setupStore()`、`setupRoute()`、`setupHttp()`，并配置 `z-paging` 全局默认行为。

包管理器固定为 pnpm，当前 `packageManager` 为 `pnpm@10.25.0`，Node.js 要求 `>= 22`。

## 开始任务前先读

1. 根目录 `CLAUDE.md`：当前仓库的 Claude/Claude Code 工作方式。
2. 根目录 `README.md`：面向开发者的安装、运行、构建和配置说明。
3. `package.json`：脚本、依赖版本、包管理器和 lint-staged 规则的事实来源。
4. 任务涉及目录下的 `AGENTS.md`，例如 `src/AGENTS.md`、`src/http/AGENTS.md`、`src/router/AGENTS.md`。
5. 相关源码或配置文件。写代码前先读现有实现，不要凭记忆改。

不要把 README 旧内容、历史设计稿、`.omc/`、`dist/`、`node_modules/`、IDE 配置或生成文件当作源码事实。

## 仓库结构

| 路径                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `src/`                        | 应用源码、页面、路由、状态、请求层、工具函数和自动生成配置。 |
| `env/`                        | 环境变量文件，统一替代根目录 `.env`。                        |
| `public/`                     | H5/PWA 静态资源与图标。                                      |
| `scripts/`                    | 辅助脚本，包括端口清理和微信小程序上传。                     |
| `vite-plugins/`               | 项目自定义 Vite 插件。                                       |
| `docs/`                       | 工程化说明和历史设计稿。                                     |
| `.github/`                    | GitHub/Copilot 侧协作说明，当前没有 CI workflow。            |
| `.husky/`                     | Git 钩子，提交前运行 lint-staged，提交信息运行 commitlint。  |
| `.rules/`、`.agent/`、`.omc/` | 规则补充或历史 AI 笔记，作为参考，不作为运行时事实。         |

## 关键文件

| 文件                   | 说明                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `package.json`         | 脚本、依赖、版本号、lint-staged、包管理器约束。                                                             |
| `vite.config.ts`       | 构建编排中心：Uni 插件、manifest、pages、组件自动导入、AutoImport、UnoCSS、分包优化、代理、压缩和版本注入。 |
| `pages.config.ts`      | 全局页面样式、easycom、分包预加载。具体页面元数据在页面内 `definePage()`。                                  |
| `manifest.config.ts`   | 多端 manifest 源配置。                                                                                      |
| `getEnv.ts`            | 解析命令参数并从 `env/` 目录加载环境变量。                                                                  |
| `uno.config.ts`        | UnoCSS 规则与预设。                                                                                         |
| `uno-color-mapping.ts` | 暗色主题变量与颜色映射。                                                                                    |
| `eslint.config.mjs`    | ESLint 9 flat config，基于 `@uni-helper/eslint-config` 并追加 UnoCSS 插件。                                 |
| `.prettierrc.cjs`      | Prettier 配置。                                                                                             |
| `commitlint.config.ts` | 提交信息格式约束。                                                                                          |

## 常用命令

### 安装

```bash
pnpm install
pnpm uvm
```

仓库通过 `preinstall` 限制只能使用 pnpm。

### H5 开发

```bash
pnpm dev:h5
pnpm dev:h5:production
pnpm dev:h5:ssr
```

`dev:h5` 会先清理 `VITE_APP_PORT` 对应端口，再执行类型检查。

### 小程序开发

```bash
pnpm dev:mp-weixin
pnpm dev:mp-weixin:production
pnpm dev:mp-alipay
pnpm dev:mp-baidu
pnpm dev:mp-jd
pnpm dev:mp-kuaishou
pnpm dev:mp-lark
pnpm dev:mp-qq
pnpm dev:mp-toutiao
pnpm dev:mp-harmony
pnpm dev:mp-xhs
```

### App 开发

```bash
pnpm dev:app
pnpm dev:app:test
pnpm dev:app:prod
pnpm dev:app-android
pnpm dev:app-ios
```

### 构建

```bash
pnpm build:h5
pnpm build:h5:ssr
pnpm build:mp-weixin
pnpm build:mp-weixin:production
pnpm build:mp-alipay
pnpm build:mp-baidu
pnpm build:mp-jd
pnpm build:mp-kuaishou
pnpm build:mp-lark
pnpm build:mp-qq
pnpm build:mp-toutiao
pnpm build:mp-harmony
pnpm build:mp-xhs
pnpm build:quickapp-webview
pnpm build:quickapp-webview-huawei
pnpm build:quickapp-webview-union
```

当前没有 `pnpm build:app`、`pnpm dev`、`pnpm dev:mp`、`pnpm build:mp` 脚本。

`dev:custom` / `build:custom` 可通过参数透传指定平台：

```bash
pnpm dev:custom -- mp-weixin
pnpm build:custom -- mp-weixin
```

### 检查

```bash
pnpm type-check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

当前没有 `pnpm test`。文档变更注意：`.prettierignore` 会忽略 `*.md`，`pnpm format:check` 不会覆盖根目录 Markdown。

## 环境变量

- 环境变量文件只放在 `env/`。
- 当前有 `env/.env.example`、`env/.env`、`env/.env.development`、`env/.env.production`。
- 不要在仓库根目录新增 `.env`。
- 新增变量时同步更新 `src/env.d.ts`、README 和相关读取逻辑。

已确认变量包括：

- `VITE_APP_TITLE`
- `VITE_APP_PORT`
- `VITE_UNI_APPID`
- `VITE_WX_APPID`
- `VITE_FALLBACK_LOCALE`
- `VITE_APP_PUBLIC_BASE`
- `VITE_SERVER_BASEURL`
- `VITE_APP_KEY`
- `VITE_APP_PROXY_ENABLE`
- `VITE_APP_PROXY_PREFIX`
- `NODE_ENV`
- `VITE_USER_NODE_ENV`
- `VITE_DELETE_CONSOLE`
- `VITE_SHOW_SOURCEMAP`

新增变量时同步更新 `env/.env.example`、`src/env.d.ts`、README 和相关读取逻辑。

## 代码风格

- Vue SFC 使用 `<script setup>`，块顺序必须是 `script`、`template`、`style`。
- TypeScript 严格模式开启，`verbatimModuleSyntax` 开启，类型导入使用 `import type`。
- Prettier：2 空格缩进、单引号、无分号、无尾随逗号、LF。
- ESLint 使用 `eslint.config.mjs`，不要绕过 `vue/block-order`、`vue/component-api-style`、`vue/define-props-declaration` 等结构规则。
- 组件模板名使用 PascalCase。Wot 组件通过 `wd-*` easycom 和 `WotResolver` 自动解析。
- 自动导入覆盖 Vue、Pinia、uni-app、Wot hooks、`src/composables/**`、`src/stores/**`、`src/utils/**`、`src/hooks/**`、`src/router/**`。重命名导出前必须全局检索。
- 路径别名包括 `@`、`@img`、`@components`、`@layout`、`@utils`。
- 多端差异优先使用 `#ifdef` / `#ifndef` 条件编译。

## 测试策略

- 代码改动后优先运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 页面、路由、manifest、Vite 插件或端侧条件编译变更后，补充对应平台的 `pnpm dev:*` 或 `pnpm build:*`。
- 请求层或 store 变更后重点验证 token、loading、401、持久化和 H5/小程序差异。
- 文档-only 变更至少核对命令、路径、生成产物和脚本名称，必要时运行定向 Markdown 格式检查。

## 修改注意事项

- 不要手动修改生成产物：
  - `src/pages.json`
  - `src/manifest.json`
  - `src/types/auto-import.d.ts`
  - `src/types/components.d.ts`
  - `src/types/uni-pages.d.ts`
  - `src/types/async-import.d.ts`
  - `src/types/async-component.d.ts`
- 新增页面时使用 `src/pages/` 或 `src/pages-sub/`，页面元数据写在 `definePage()` 中。
- `src/main.ts` 初始化顺序是 store -> route -> http，不要随意调整。
- `src/stores/index.ts` 会在 `app.use(store)` 前调用 `setActivePinia(store)`，用于避免 App 端白屏问题。
- `src/http/interceptor.ts` 和 `src/router/interceptor.ts` 共同依赖登录态，修改时要检查跨模块行为。
- `vite-plugins/vite-plugin-auto-version.ts` 在生产构建时可能写入 `package.json` 和 `src/manifest.json`，提交前必须确认是否是预期变更。
- `scripts/upload-weixin.js` 上传前会执行 `pnpm build:mp-weixin:production`，处理上传任务时要确认本地微信上传私钥存在。

## 安全注意事项

- 不要提交密钥、token、微信上传私钥、真实生产接口凭证或本地环境覆盖。
- 微信上传私钥如 `private.<appid>.key` / `private.key` 只能本地使用。
- 不要随意改 `pnpm-lock.yaml`。只有依赖变更或安装命令确实导致锁文件更新时才提交。
- 不要提交 `dist/`、`node_modules/`、`.omc/`、`.claude/worktrees/`、IDE 状态或自动生成类型文件。

## 提交前检查清单

1. 确认改动范围只覆盖任务相关文件。
2. 确认没有手改生成文件或提交本地产物。
3. 运行适合本次改动的检查，默认是 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
4. 如修改端侧构建或页面生成，运行对应 `pnpm dev:*` 或 `pnpm build:*`。
5. 检查 `git diff`，确认没有密钥、调试输出、无关格式化或版本号误改。
6. 提交信息使用 `[TYPE]: subject`，`TYPE` 使用 `commitlint.config.ts` 允许值。

## 对 AI 代理的明确约束

- 始终使用简体中文回复。
- 先读文件，再改文件；不要凭猜测填写文档或代码。
- 优先小范围编辑，不要重写无关实现。
- 不要重复读取已经读取过的同一文件，除非文件在当前任务中被修改后需要复核。
- 不要编造不存在的脚本、测试、部署平台或服务。
- 不要用旧 README 中的脚本名覆盖 `package.json` 事实。
- 不要把历史文档中的计划当作当前代码行为。
- 完成前说明运行了哪些检查；未运行时给出具体原因。
