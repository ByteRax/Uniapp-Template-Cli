<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# src

## Purpose
应用主源码目录，包含入口、根组件、页面、路由、请求层、状态管理、工具函数，以及由配置文件生成的 `pages.json`、`manifest.json` 和类型声明文件。

## Key Files

| File | Description |
|------|-------------|
| `main.ts` | 应用入口，创建 app 并依次执行 `setupStore()`、`setupRoute()`、`setupHttp()`。 |
| `App.vue` | 生命周期入口组件，承载应用级钩子。 |
| `App.ku.vue` | 实际根模板，挂载全局 UI 容器与页面插槽。 |
| `pages.json` | 由 `pages.config.ts` 生成的页面配置，运行时路由数据源。 |
| `manifest.json` | 由 `manifest.config.ts` 生成的应用清单。 |
| `theme.json` | UniApp 主题配置。 |
| `uni.scss` | 全局样式变量与样式入口。 |
| `env.d.ts` | Vite 环境变量类型声明。 |
| `shime-uni.d.ts` | UniApp 运行时相关补充类型。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API 方法与接口类型。 |
| `components/` | 通用组件、业务组件和布局组件（见 `components/AGENTS.md`）。 |
| `composables/` | 组合式能力与部分全局状态封装（见 `composables/AGENTS.md`）。 |
| `http/` | 请求封装与拦截器（见 `http/AGENTS.md`）。 |
| `pages/` | 主包页面（见 `pages/AGENTS.md`）。 |
| `pages-sub/` | 分包页面（见 `pages-sub/AGENTS.md`）。 |
| `router/` | 路由工具、导航封装与拦截器（见 `router/AGENTS.md`）。 |
| `stores/` | Pinia store 与持久化状态（见 `stores/AGENTS.md`）。 |
| `utils/` | 通用工具函数（见 `utils/AGENTS.md`）。 |
| `hooks/` | 通过自动导入暴露的 hooks。 |
| `styles/` | 全局样式资源。 |
| `types/` | 项目类型声明，其中部分文件为自动生成产物。 |
| `static/` | 静态资源目录。 |
| `layout/` | 预留布局目录。 |
| `views/` | 预留页面视图目录。 |

## For AI Agents

### Working In This Directory
- 先改配置源，再依赖生成产物；不要直接编辑 `pages.json`、`manifest.json` 或自动生成的 `src/types/*.d.ts`。
- 新增页面时区分主包 `pages/` 与分包 `pages-sub/`，并保持 `pages.config.ts` / 页面元数据一致。
- 组件、store、utils 很多通过自动导入使用，改名前先确认全局引用面。
- `App.vue` 与 `App.ku.vue` 是双根组件模式，改动根层结构时要同时理解两者职责。

### Testing Requirements
- 通用检查：`pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 改动页面/路由后，至少用一个目标端的 `pnpm dev:*` 验证导航和页面生成。
- 改动请求层或 store 后，重点检查登录态、loading、持久化与多端兼容行为。

### Common Patterns
- 入口初始化固定链路：store → route → http。
- 页面元数据与路由权限由页面配置和 `router/interceptor.ts` 共同驱动。
- Pinia 持久化直接映射到 `uni.getStorageSync` / `uni.setStorageSync`。
- 平台差异通过条件编译块控制，不额外抽象兼容层。

## Dependencies

### Internal
- 依赖根目录 `pages.config.ts`、`manifest.config.ts`、`vite.config.ts` 和 `env/` 中的环境变量。
- 各子目录通过自动导入与路径别名互相引用。

### External
- `vue` - 应用组件与组合式 API。
- `pinia` / `pinia-plugin-persistedstate` - 状态管理与持久化。
- `@dcloudio/uni-app` - 多端运行时 API。
- `wot-design-uni` / `z-paging` - UI 组件能力。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
