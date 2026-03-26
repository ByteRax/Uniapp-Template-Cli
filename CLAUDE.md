# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 协作约定

- 默认使用简体中文回复。
- 回复用户时称呼用户为“爸爸”。
- 开始任何工作前，先查看 `.claude/tasks/context_session_{x}.md` 获取当前会话上下文；如果不存在则创建。
- 完成工作后，更新对应的 `.claude/tasks/context_session_{x}.md`，记录已完成内容和关键结论。

## 环境与命令

- Node.js `>= 22`
- pnpm `>= 10.12.4`
- 环境变量统一放在 `env/`，不是项目根目录。

### 常用命令

```bash
pnpm install
pnpm dev:h5
pnpm dev:mp-weixin
pnpm dev:app
pnpm build:h5
pnpm build:mp-weixin
pnpm type-check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm uvm
```

### 关于测试

- 当前仓库没有 `pnpm test` 脚本，也没有单文件/单测运行脚本。
- 目前可用的质量检查主要是 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。

### Git 钩子

- `pre-commit` 运行 `npx lint-staged`
- `commit-msg` 运行 `npx --no -- commitlint --edit "$1"`

## 架构总览

### 应用启动链路

- `src/main.ts` 是应用入口：创建 `App.vue` 后依次执行 `setupStore()`、`setupRoute()`、`setupHttp()`。
- `src/stores/index.ts` 创建 Pinia，并通过 `setActivePinia(store)` 在 `app.use(store)` 前提前激活，避免 App 端白屏问题。
- Pinia 持久化使用 `pinia-plugin-persistedstate`，底层存储直接映射到 `uni.getStorageSync` / `uni.setStorageSync`。

### 配置驱动的 UniApp 架构

- `pages.config.ts` 是页面配置源：定义全局导航样式、`easycom` 映射、分包预加载规则。
- `manifest.config.ts` 是应用配置源：读取 `package.json` 和 `env/` 中的环境变量，生成多端 manifest 配置。
- `getEnv.ts` 通过命令行参数推导运行模式，并从 `env/` 目录加载环境变量。
- `vite.config.ts` 是整个工程的编排中心，负责：
  - `envDir: './env'`
  - Uni 页面/manifest 插件
  - Wot Design Uni 组件自动解析
  - Vue / Pinia / uni-app / 项目内模块自动导入
  - UnoCSS
  - 分包优化与异步跨包能力
  - H5 代理、构建压缩、图片优化、chunk 拆分、版本注入
- 以下文件是生成产物，不要手动修改：
  - `src/pages.json`
  - `src/manifest.json`
  - `src/types/auto-import.d.ts`
  - `src/types/components.d.ts`
  - `src/types/uni-pages.d.ts`
  - `src/types/async-import.d.ts`
  - `src/types/async-component.d.ts`

### 页面与路由

- 主包页面位于 `src/pages/`，分包页面位于 `src/pages-sub/`。
- `vite.config.ts` 通过 `subPackages: ['src/pages-sub']` 声明分包。
- 路由运行时的真实来源是生成后的 `src/pages.json`；`src/router/index.ts` 会读取其中的 `pages` / `subPackages` 并提供页面查询工具。
- `src/router/interceptor.ts` 是路由守卫核心：
  - 解析跳转 URL
  - 校验目标页面是否存在
  - 读取页面元数据中的 `needLogin`
  - 基于 `useToken()` 判断登录态并按需跳转登录页
- `src/router/router.ts` 封装了 `uni.navigateTo` / `uni.redirectTo`：
  - 阻止 300ms 内重复跳转到同一路由
  - 通过全局锁避免并发导航
  - 提供 `home()`、`login()`、`notFound()` 等快捷入口

### 请求层与 API 层

- `src/http/index.ts` 提供 `Request` 类，对 `uni.request` 做统一封装。
- `src/http/interceptor.ts` 处理请求/响应拦截：
  - 自动注入 Bearer Token
  - 相同请求去重并取消前一个请求
  - 用请求计数控制全局 loading
  - `401` 时执行登出并跳转登录页
  - `meta.originalData` 为 `true` 时直接返回原始响应数据
  - `meta.toast` 为 `true` 时自动弹出错误提示
- API 方法放在 `src/api/`，接口类型放在 `src/api/types/`。

### 状态管理

- Store 位于 `src/stores/`，并通过自动导入直接在业务代码中使用。
- `src/stores/useToken.ts` 是登录态源头：
  - 持久化 token 信息
  - 维护 token 过期时间
  - 封装登录、微信登录、登出和有效 token 获取逻辑
  - 登录成功后会拉取用户信息
- `src/stores/theme.ts` 维护系统主题与主题变量，且已启用持久化。
- 该项目中部分“composables”实际上是 Pinia store 或依赖 auto-import 的全局能力，改动前先确认职责，不要只按文件夹名判断。

### UI、样式与自动导入

- UnoCSS 配置在 `uno.config.ts`，暗色主题映射在 `uno-color-mapping.ts`。
- `pages.config.ts` 中配置了：
  - `wd-*` → Wot Design Uni 组件
  - `z-paging*` → z-paging 组件
- `vite.config.ts` 中的 `AutoImport` 自动导入以下内容：
  - Vue API
  - Pinia API
  - uni-app API
  - `wot-design-uni` 的常用 hooks
  - `src/composables/**`
  - `src/stores/**`
  - `src/utils/**`
  - `src/hooks/**`
  - `src/router/**`
- 路径别名：`@`、`@img`、`@components`、`@layout`、`@utils`。

### 多端开发注意点

- H5 代理由 `VITE_APP_PROXY_ENABLE`、`VITE_APP_PROXY_PREFIX`、`VITE_SERVER_BASEURL` 控制。
- README 中仍有旧写法，如 `pnpm dev`、`pnpm dev:mp`、`pnpm build:mp`；实际以 `package.json` 中脚本为准，优先使用本文件列出的命令。
- App 相关开发/构建命令会生成 `dist/dev/app` 或 `dist/build/app`，后续需要配合 HBuilderX 进行运行或云打包。
