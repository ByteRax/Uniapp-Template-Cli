# 模板工程优化设计

## 背景

当前项目是 UniApp + Vue 3 + TypeScript + Vite + UnoCSS 的多端模板工程。参考项目 `real-rate-calculator` 基于同一模板演进，已经沉淀出部分工程化改进。本次优化只参考其非业务、非 UI 的工程做法，目标是提升模板稳定性、可维护性和开发体验。

## 范围

本次包含两类工作：

1. 风险修复：修复当前项目已有明确风险点，包括构建配置、HTTP 并发边界、类型检查配置、依赖版本敏感项和开发命令稳定性。
2. 通用增强：精选迁移参考项目中可复用的基础能力，包括 HTTP 分层、上传请求能力、异步请求拦截器、类型检查专用配置、端口清理脚本和轻量工具函数。

本次不迁移参考项目的页面、账单、计算器、图表、埋点业务事件、登录业务假设或 UI 表现。不引入 `echarts`、`uni-echarts`、analytics 模块或账单相关 API/store。

## 架构设计

### 构建与类型检查

新增 `tsconfig.typecheck.json`，让 `pnpm type-check` 使用更适合 UniApp 与生成类型的检查配置。主 `tsconfig.json` 继续服务 IDE、Vite 和项目基础类型。

调整 `vite.config.ts` 中的模板级风险：

- 使用字符串比较解析 `VITE_APP_PROXY_ENABLE`，避免 `JSON.parse` 在环境变量异常时导致 Vite 启动失败。
- 保持 `treeshake.moduleSideEffects: true`，避免 Wot Design Uni 样式、Pinia 插件等副作用模块被误删。
- 给 dev server 增加 `strictPort: true`，避免 Vite 自动换端口后浏览器访问错误服务。
- 保守处理生产压缩配置，避免多端构建中使用过激的 `unsafe_*` 压缩选项。

### HTTP 基础层

将 `Request` 类从 `src/http/index.ts` 拆到 `src/http/request.ts`。`src/http/index.ts` 只负责导出 `httpInstance` 和执行 `setupHttp()`。这样请求核心、拦截器配置和 Vue 插件安装职责更清晰。

HTTP 外部调用方式保持兼容，调用方仍可继续使用现有 `Apis.http.get/post` 或 `$http`。

新增能力：

- 请求拦截器支持返回 `Promise<RequestOptions>`。
- 新增 `upload()` 和内部 `uploadFile()`，统一走请求拦截器与响应拦截器。
- 上传请求自动移除 JSON `content-type`，由运行时生成 multipart 边界。
- H5 普通请求启用 `withCredentials` 与 `enableCookie`。
- URL 拼接使用安全的代理布尔判断。

### HTTP 拦截器

保留当前项目的 `useToken()` 登录态模型，不切换到参考项目的 `userStore`。只修模板通用边界：

- 401 并发响应只触发一次登出与登录页跳转。
- loading 计数在请求取消、响应异常和拦截器异常时保持平衡。
- `meta.originalData` 继续直接返回原始响应数据。
- `meta.toast` 继续作为默认错误提示开关。
- 请求取消继续返回 `ResponseData(-1, '取消请求')`。

不迁移参考项目的 token refresh 业务流程，因为它依赖真实利率计算器项目的登录接口和 user store 结构，不适合作为模板默认行为。

### 通用工具

新增轻量、无业务依赖的工具：

- `src/utils/env.ts`：导出 `isDev`、`isProd`、`isDebug`。
- `src/utils/to.ts`：将 Promise 转换为 `[error, data]` 元组，便于局部异步错误处理。

`logger.ts` 暂不默认引入。模板已有 lint 和生产压缩策略，日志封装可在后续有明确使用场景时再加入。

### 开发体验

新增 `scripts/force-kill-port.mjs` 与 `port:free` 脚本，读取 `env/` 下当前 mode 的 `VITE_APP_PORT` 并清理占用端口。

H5 开发脚本调整为：

- 先执行端口清理。
- 再执行 `pnpm type-check`。
- 最后启动对应 H5 dev 命令。

小程序和 App dev 命令暂不默认前置 `type-check`，避免调试启动时间明显增加。构建与质量检查仍通过显式 `pnpm type-check`、`pnpm lint`、`pnpm format:check` 保证。

## 数据流

普通请求：

```text
调用方 -> httpInstance.request() -> request interceptor -> uni.request -> response interceptor -> ResponseData<T>
```

上传请求：

```text
调用方 -> httpInstance.upload() -> request interceptor -> uni.uploadFile -> response interceptor -> ResponseData<T>
```

两条链路共享 token 注入、loading、401、取消请求和响应解析逻辑。

## 错误处理

- 请求拦截器抛错时，请求 Promise reject，并确保已经打开的 loading 被关闭。
- 401 使用单例锁保护，只执行一次 `logout + router.login()` 或等价跳转。
- 网络错误统一映射为可读中文提示。
- 业务错误保持 `ResponseData.code/msg` 结构，由 `meta.toast` 和调用方 `isOK()` 控制提示。
- 上传请求失败与普通请求一致返回 `ResponseData<T>`，避免调用方写两套处理逻辑。

## 测试与验证

实施完成后至少运行：

```bash
pnpm type-check
pnpm lint
pnpm format:check
```

若修改 `vite.config.ts` 和 H5 dev 脚本，还需验证：

```bash
pnpm dev:h5
```

验证目标是确认端口清理、类型检查和 Vite 启动链路可用，不做 UI 或具体业务验收。

## 非目标

- 不迁移任何参考项目页面或组件布局。
- 不引入账单、计算器、图表、埋点等业务模块。
- 不重写现有 store 或登录模型。
- 不做大规模目录重排。
- 不手动修改生成产物：`src/pages.json`、`src/manifest.json`、`src/types/*.d.ts`。

## 交付边界

本设计适合拆成一个实施计划执行。实施阶段应优先完成风险修复，再做精选增强。每个增强项都需要保持模板通用性，不能依赖参考项目的业务 API、页面路径或 store 结构。
