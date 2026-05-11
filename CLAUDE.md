# CLAUDE.md

本文件说明 Claude / Claude Code 在本仓库中的工作方式。事实来源以当前代码、`package.json`、根目录文档和任务涉及目录的 `AGENTS.md` 为准。

## 基本协作方式

- 默认使用简体中文回复，保持专业、简洁、可执行。
- 先理解需求和现有实现，再修改文件。
- 优先做小范围编辑，保留已有结构和风格。
- 不要凭空添加依赖、脚本、测试框架、部署平台或功能说明。
- 不要手动修改生成产物、构建产物、IDE 状态或历史 AI 笔记。
- 交付前说明修改内容、检查结果和仍需人工确认的事项。

## 推荐上下文读取顺序

1. `AGENTS.md`：通用 AI 代理操作手册。
2. `README.md`：面向开发者的真实使用说明。
3. `package.json`：脚本、依赖、包管理器、lint-staged 的事实来源。
4. 任务涉及目录下的 `AGENTS.md`，例如 `src/AGENTS.md`、`src/http/AGENTS.md`、`src/router/AGENTS.md`。
5. 相关配置源：`vite.config.ts`、`pages.config.ts`、`manifest.config.ts`、`getEnv.ts`、`uno.config.ts`、`eslint.config.mjs`。
6. 相关源码文件。
7. 生成文件只读参考，不作为修改入口。

不要把 `.omc/`、`dist/`、`node_modules/`、`.agent/` 历史笔记或旧文档内容当作当前行为。

## 默认任务流程

1. 明确用户目标和影响范围。
2. 用 `rg` / `rg --files` 查找相关文件和引用。
3. 阅读现有实现和相邻约定；如果目录下有 `AGENTS.md`，先读该目录说明。
4. 制定简短修改计划，优先选择最小可行改动。
5. 修改源文件，不直接改生成文件。
6. 运行与改动匹配的检查。
7. 查看 diff，确认没有无关格式化、密钥、构建产物或误改版本号。
8. 用简短中文总结：改了什么、验证了什么、哪些事项待确认。

## 项目事实速查

- Node.js：`>= 22`，`.nvmrc` 为 `v22`。
- 包管理器：pnpm，当前 `packageManager` 为 `pnpm@10.25.0`。
- 当前没有 `pnpm test`。
- 当前没有 CI workflow。
- 当前没有 `build:app`、`dev`、`dev:mp`、`build:mp` 脚本。
- 环境变量统一放在 `env/`，不要在根目录新增 `.env`。
- `pnpm upload:mp` 会先执行 `pnpm build:mp-weixin:production`，再调用微信小程序上传 API。

## 常用命令

安装：

```bash
pnpm install
pnpm uvm
```

H5 开发：

```bash
pnpm dev:h5
pnpm dev:h5:production
pnpm dev:h5:ssr
```

小程序开发：

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

App 开发：

```bash
pnpm dev:app
pnpm dev:app:test
pnpm dev:app:prod
pnpm dev:app-android
pnpm dev:app-ios
```

构建：

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

质量检查：

```bash
pnpm type-check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

`dev:custom` 和 `build:custom` 通过参数透传指定平台，例如：

```bash
pnpm dev:custom -- mp-weixin
pnpm build:custom -- mp-weixin
```

## 架构要点

### 启动链路

- `src/main.ts` 创建 `App.vue`，按 `setupStore()`、`setupRoute()`、`setupHttp()` 顺序挂载能力。
- `src/main.ts` 配置 `uni.$zp.config`，作为 `z-paging` 全局默认分页、空态和安全区设置。
- `src/stores/index.ts` 在 `app.use(store)` 前调用 `setActivePinia(store)`，避免 App 端白屏。

### 配置驱动

- `pages.config.ts` 维护全局页面样式、easycom 和分包预加载。
- 页面元数据当前通过页面内 `definePage()` 配置，不是 `<route lang="json">`。
- `manifest.config.ts` 读取 `package.json` 和 `env/`，生成多端 manifest。
- `vite.config.ts` 负责 Uni 插件、manifest、pages、组件自动导入、AutoImport、UnoCSS、分包优化、H5 代理、构建压缩、图片压缩、版本注入和开发者工具打开逻辑。

### 路由与请求

- 主包页面在 `src/pages/`，分包页面在 `src/pages-sub/`。
- `src/router/interceptor.ts` 处理路由存在性校验、登录拦截和登录后跳转。
- `src/router/router.ts` 封装 `uni.navigateTo` / `uni.redirectTo` 等导航能力，并处理重复跳转和快捷入口。
- `src/http/request.ts` 封装 `uni.request` / `uni.uploadFile`，H5 下会根据 `VITE_APP_PROXY_ENABLE` 和 `VITE_APP_PROXY_PREFIX` 处理代理前缀。
- `src/http/interceptor.ts` 处理 token、AppKey、设备 Cookie/header、请求去重、loading、401 登出跳转和业务错误提示。

### 状态、UI 与样式

- Pinia store 位于 `src/stores/`，持久化底层映射到 `uni.getStorageSync` / `uni.setStorageSync`。
- `src/stores/userStore.ts` 是 token 与登录态源头，`src/stores/modules/user/useUserStore.ts` 保存用户信息。
- UnoCSS 配置在 `uno.config.ts`，暗色颜色映射在 `uno-color-mapping.ts`。
- Wot Design Uni 通过 `pages.config.ts` 的 easycom 和 `wot-ui-resolver.ts` 自动解析。
- 自动导入覆盖 Vue、Pinia、uni-app、Wot hooks、`src/composables/**`、`src/stores/**`、`src/utils/**`、`src/hooks/**`、`src/router/**`。

## 代码风格要求

- Vue SFC 使用 `<script setup>`，块顺序为 `script`、`template`、`style`。
- TypeScript 严格模式开启，`verbatimModuleSyntax` 开启，类型导入使用 `import type`。
- Prettier 配置：2 空格、单引号、无分号、无尾随逗号、LF。
- ESLint 使用 `eslint.config.mjs` 的 flat config，基础来自 `@uni-helper/eslint-config`，并追加 `@unocss/eslint-plugin`。
- 组件模板名使用 PascalCase，Vue 自定义事件使用 camelCase。
- 多端差异优先使用 UniApp 条件编译，避免在公共路径中直接访问单端全局对象。

## 测试与验证策略

- 代码改动默认运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 修改页面、路由、manifest、Vite 插件、条件编译或构建脚本后，补充对应平台的 `pnpm dev:*` 或 `pnpm build:*`。
- 修改请求层时验证 token 注入、重复请求取消、loading、401、H5 代理和上传请求。
- 修改 store 时验证持久化、登录态、登出和 App 端初始化行为。
- 文档-only 变更至少核对命令、路径、脚本名称和生成文件规则；由于 `.prettierignore` 忽略 `*.md`，需要定向检查 Markdown 或人工复核。

## 谨慎处理的文件和行为

不要手动修改：

- `src/pages.json`
- `src/manifest.json`
- `src/types/auto-import.d.ts`
- `src/types/components.d.ts`
- `src/types/uni-pages.d.ts`
- `src/types/async-import.d.ts`
- `src/types/async-component.d.ts`

谨慎处理：

- `package.json` / `pnpm-lock.yaml`：只有脚本、版本或依赖确需变更时才改。
- `env/`：不要提交真实密钥或本地覆盖。
- `vite-plugins/vite-plugin-auto-version.ts`：生产构建可能写入 `package.json` 和 `src/manifest.json`。
- `scripts/upload-weixin.js`：依赖微信上传私钥和 `pnpm build:mp-weixin:production`。
- `.prettierignore`：当前忽略 Markdown、public、.github、锁文件等。

## Claude 不应做的事情

- 不要使用不存在的命令，例如 `pnpm dev`、`pnpm dev:mp`、`pnpm build:mp`、`pnpm build:app`。
- 不要为了让文档“完整”而编造测试框架、CI、Docker、Makefile、部署平台或环境变量。
- 不要直接编辑生成文件来修复页面或 manifest 问题。
- 不要跳过与改动相关的检查后声称已验证。
- 不要随意重写无关文件、批量格式化全仓或改锁文件。
- 不要提交微信上传私钥、token、生产接口凭证或本地环境覆盖。
- 不要把旧 README、历史 specs 或 AI 笔记中的内容当作当前事实。

## 提交前检查

1. `git diff` 检查改动范围。
2. 确认没有生成文件、构建产物、密钥或无关格式化。
3. 根据改动运行检查，默认：

```bash
pnpm type-check
pnpm lint
pnpm format:check
```

4. 涉及端侧构建时，运行对应 `pnpm dev:*` 或 `pnpm build:*`。
5. 如需要提交，提交信息格式为：

```text
[TYPE]: subject
```

`TYPE` 允许值见 `commitlint.config.ts`。
