# uniapp-template-cli

基于 UniApp + Vue 3 + TypeScript + Vite 5 + UnoCSS 的多端应用模板。项目使用命令行工具链开发 H5、小程序和 App，核心配置由 `pages.config.ts`、`manifest.config.ts`、`vite.config.ts` 与 `env/` 目录共同驱动。

## 主要功能

- UniApp 多端开发：H5、App、微信小程序、支付宝小程序、百度小程序、京东小程序、快手小程序、飞书小程序、QQ 小程序、字节小程序、鸿蒙小程序、小红书小程序、快应用 WebView。
- Vue 3 + TypeScript + Pinia，Pinia 持久化存储使用 `pinia-plugin-persistedstate`。
- Vite 5 构建链，集成 Uni 页面生成、manifest 生成、组件自动导入、自动导入、分包优化、UnoCSS、图片压缩和版本信息注入。
- 页面配置源集中在 `pages.config.ts`，页面自身通过 `definePage()` 写入页面元数据，运行时生成 `src/pages.json`。
- 应用配置源集中在 `manifest.config.ts`，结合 `package.json` 和 `env/` 生成 `src/manifest.json`。
- 请求层封装 `uni.request` / `uni.uploadFile`，包含 token 注入、请求去重、loading、401 登出跳转、错误提示和 H5 代理处理。
- 路由层封装 UniApp 导航，包含路由存在性校验、登录拦截、重复跳转保护和快捷跳转方法。
- 集成 Wot Design Uni、z-paging、UnoCSS 原子化样式与暗色主题变量。

## 技术栈

| 类型      | 技术                                                                    |
| --------- | ----------------------------------------------------------------------- |
| 运行框架  | UniApp、Vue 3                                                           |
| 语言      | TypeScript                                                              |
| 构建      | Vite 5、@dcloudio/uni、@uni-helper 系列插件、@uni-ku/bundle-optimizer   |
| 状态管理  | Pinia、pinia-plugin-persistedstate                                      |
| UI 与样式 | Wot Design Uni、z-paging、UnoCSS、Sass                                  |
| 质量工具  | vue-tsc、ESLint 9 flat config、Prettier、Husky、lint-staged、commitlint |
| 包管理器  | pnpm                                                                    |

## 环境要求

- Node.js `>= 22`，仓库提供 `.nvmrc`，内容为 `v22`。
- pnpm `>= 10.12.4`，当前 `packageManager` 为 `pnpm@10.25.0`。
- 推荐编辑器：WebStorm 或 VS Code，并安装 Vue Official 扩展。
- 小程序开发需要对应平台开发者工具。微信小程序产物位于 `dist/dev/mp-weixin` 或 `dist/build/mp-weixin`。
- App 端需要 HBuilderX 配合运行或云打包。

项目通过 `preinstall` 执行 `only-allow pnpm`，请不要使用 npm、yarn 或 bun 安装依赖。

## 安装依赖

```bash
pnpm install
```

如需更新 UniApp 版本管理工具，可运行：

```bash
pnpm uvm
```

## 本地开发

### H5

```bash
pnpm dev:h5
```

`dev:h5` 会先运行 `port:free` 清理 `env/` 中当前模式的 `VITE_APP_PORT`，再运行 `pnpm type-check`，最后启动 `uni`。如需跳过端口清理，可设置环境变量 `SKIP_KILL_PORT=true`。

其他 H5 开发命令：

```bash
pnpm dev:h5:production
pnpm dev:h5:ssr
```

### 小程序

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

微信小程序启动后，用微信开发者工具导入 `dist/dev/mp-weixin`。其他小程序平台按对应 `dist/dev/<platform>` 目录导入。

### App

```bash
pnpm dev:app
pnpm dev:app:test
pnpm dev:app:prod
pnpm dev:app-android
pnpm dev:app-ios
```

App 端生成目录通常为 `dist/dev/app`，需要在 HBuilderX 中导入后运行到模拟器、真机或基座。

### 自定义平台

`dev:custom` 会执行 `uni -p`，可用 pnpm 的参数透传指定平台：

```bash
pnpm dev:custom -- mp-weixin
```

## 构建

### H5 构建

```bash
pnpm build:h5
pnpm build:h5:ssr
```

H5 构建产物位于 `dist/build/h5`。若部署路径不是站点根路径，请调整 `env/` 中的 `VITE_APP_PUBLIC_BASE`，它会进入 `manifest.config.ts` 的 H5 router base。

### 小程序构建

```bash
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
```

微信小程序构建产物位于 `dist/build/mp-weixin`，之后通过微信开发者工具上传。

### 快应用 WebView 构建

```bash
pnpm build:quickapp-webview
pnpm build:quickapp-webview-huawei
pnpm build:quickapp-webview-union
```

### 自定义构建

`build:custom` 会执行 `uni build -p`：

```bash
pnpm build:custom -- mp-weixin
```

当前 `package.json` 没有定义 `build:app` 脚本。App 发布流程需要结合 HBuilderX，具体云打包流程以实际团队约定为准。

## 测试与检查

当前仓库没有 `pnpm test` 脚本，也没有单元测试目录。代码变更后优先运行：

```bash
pnpm type-check
pnpm lint
pnpm format:check
```

说明：

- `pnpm type-check` 使用 `vue-tsc -p tsconfig.typecheck.json --noEmit`。
- `pnpm lint` 使用 `eslint .`。
- `pnpm format:check` 使用 `prettier --check .`，但 `.prettierignore` 当前会忽略 `*.md`，因此文档变更需要额外做人工校对或执行定向 Prettier 检查。
- 修改页面生成、构建配置或端侧差异逻辑后，应补充对应端的 `pnpm dev:*` 或 `pnpm build:*` 验证。

## 常用脚本

| 脚本                                   | 说明                                          |
| -------------------------------------- | --------------------------------------------- |
| `pnpm install`                         | 安装依赖，仅允许 pnpm。                       |
| `pnpm uvm`                             | 运行 `@dcloudio/uvm`。                        |
| `pnpm port:free -- --mode development` | 按 `env/` 中的 `VITE_APP_PORT` 清理占用端口。 |
| `pnpm dev:h5`                          | 启动 H5 开发服务，包含端口清理和类型检查。    |
| `pnpm dev:mp-weixin`                   | 启动微信小程序开发构建。                      |
| `pnpm dev:app`                         | 启动 App 开发构建。                           |
| `pnpm build:h5`                        | 构建 H5。                                     |
| `pnpm build:mp-weixin`                 | 构建微信小程序。                              |
| `pnpm upload:mp`                       | 构建并上传微信小程序，需本地上传私钥。        |
| `pnpm type-check`                      | TypeScript 类型检查。                         |
| `pnpm lint` / `pnpm lint:fix`          | ESLint 检查或自动修复。                       |
| `pnpm format` / `pnpm format:check`    | Prettier 写入或检查。                         |

`pnpm upload:mp` 会先执行 `pnpm build:mp-weixin:production`，再调用微信小程序上传 API。上传脚本需要微信小程序代码上传私钥，例如根目录本地文件 `private.<appid>.key`，该类密钥不得提交到仓库。

## 环境变量

环境变量统一放在 `env/`，不要在仓库根目录新增 `.env`。当前文件：

- `env/.env.example`：环境变量示例，不包含真实密钥。
- `env/.env`：通用默认变量。
- `env/.env.development`：开发模式覆盖变量。
- `env/.env.production`：生产模式覆盖变量。

当前可确认的变量：

| 变量                    | 来源                 | 用途                                                    |
| ----------------------- | -------------------- | ------------------------------------------------------- |
| `VITE_APP_TITLE`        | `env/.env`           | 应用标题，进入页面全局标题、manifest 名称和 HTML 标题。 |
| `VITE_APP_PORT`         | `env/.env`           | H5 dev server 端口，`port:free` 会读取它。              |
| `VITE_UNI_APPID`        | `env/.env`、模式文件 | UniApp appid，进入 manifest。                           |
| `VITE_WX_APPID`         | `env/.env`、模式文件 | 微信小程序 appid，进入 manifest 和上传脚本。            |
| `VITE_FALLBACK_LOCALE`  | `env/.env`           | manifest locale。                                       |
| `VITE_APP_PUBLIC_BASE`  | `env/.env`           | Vite base 和 H5 router base。                           |
| `VITE_SERVER_BASEURL`   | `env/.env`           | HTTP 请求基准地址。                                     |
| `VITE_APP_KEY`          | `env/.env`           | 可选请求头标识，存在时注入 `AppKey`。                   |
| `VITE_APP_PROXY_ENABLE` | `env/.env`           | H5 本地代理开关。                                       |
| `VITE_APP_PROXY_PREFIX` | `env/.env`           | H5 本地代理前缀。                                       |
| `NODE_ENV`              | 模式文件             | 模式标识。                                              |
| `VITE_USER_NODE_ENV`    | `env/.env`、模式文件 | 构建模式标识，影响 manifest 名称和生产构建判断。        |
| `VITE_DELETE_CONSOLE`   | 模式文件             | 环境配置项，当前构建配置未直接读取。                    |
| `VITE_SHOW_SOURCEMAP`   | 模式文件             | 环境配置项，当前构建配置未直接读取。                    |

新增变量时请同步更新 `env/.env.example`、`src/env.d.ts`、相关文档和实际读取逻辑。

## 项目结构

```text
uniapp-template-cli/
├── env/                    # 环境变量目录
├── public/                 # H5/PWA 静态资源
├── scripts/                # 辅助脚本，如端口清理、微信上传
├── vite-plugins/           # 项目自定义 Vite 插件
├── docs/                   # 工程化说明和历史设计稿
├── src/
│   ├── api/                # API 方法和接口类型
│   ├── components/         # 通用、业务和布局组件
│   ├── composables/        # 组合式能力和全局 UI 状态封装
│   ├── http/               # 请求封装和拦截器
│   ├── pages/              # 主包页面
│   ├── pages-sub/          # 分包页面
│   ├── router/             # 路由工具、导航封装和拦截器
│   ├── services/           # 跨端平台服务封装
│   ├── stores/             # Pinia store
│   ├── styles/             # 全局样式
│   ├── types/              # 类型声明，含自动生成产物
│   ├── utils/              # 通用工具
│   ├── App.vue             # 应用生命周期入口
│   ├── App.ku.vue          # UniKu 根模板
│   ├── main.ts             # 应用入口
│   ├── pages.json          # 自动生成页面配置，不要手改
│   └── manifest.json       # 自动生成 manifest，不要手改
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── pages.config.ts
├── manifest.config.ts
├── uno.config.ts
├── uno-color-mapping.ts
├── eslint.config.mjs
└── tsconfig.json
```

## 开发注意事项

- 优先修改配置源文件，不要手动修改生成产物：`src/pages.json`、`src/manifest.json`、`src/types/auto-import.d.ts`、`src/types/components.d.ts`、`src/types/uni-pages.d.ts`、`src/types/async-import.d.ts`、`src/types/async-component.d.ts`。
- 新增页面时放入 `src/pages/` 或 `src/pages-sub/`，在页面内使用 `definePage()` 配置页面元数据；全局页面样式、easycom 和分包预加载在 `pages.config.ts` 中维护。
- `src/main.ts` 初始化顺序为 `setupStore()`、`setupRoute()`、`setupHttp()`，改动入口时不要打乱该顺序。
- 自动导入覆盖 `src/composables/**`、`src/stores/**`、`src/utils/**`、`src/hooks/**`、`src/router/**`，重命名前先全局检索。
- 多端差异优先使用 UniApp 条件编译，例如 `#ifdef H5`、`#ifndef H5`。
- 生产构建时 `vite-plugins/vite-plugin-auto-version.ts` 可能更新 `package.json` 与 `src/manifest.json` 的版本字段，提交前需要确认这些变更是否符合预期。
- 不要提交密钥、上传私钥、本地环境覆盖、`dist/`、`node_modules/`、`.omc/` 或 IDE 状态。

## Git 约定

Husky 钩子：

- `pre-commit`：运行 `npx lint-staged`。
- `commit-msg`：运行 `npx --no -- commitlint --edit "$1"`。

提交信息格式由 `commitlint.config.ts` 约束：

```text
[TYPE]: subject
```

`TYPE` 允许值：`FEAT`、`FIX`、`DOCS`、`STYLE`、`REFACTOR`、`PERF`、`TEST`、`BUILD`、`CI`、`CHORE`、`REVERT`。

## 部署说明

- H5：运行 `pnpm build:h5`，将 `dist/build/h5` 部署到静态 Web 服务器。非根路径部署时配置 `VITE_APP_PUBLIC_BASE`。
- 微信小程序：运行 `pnpm build:mp-weixin` 或 `pnpm build:mp-weixin:production`，用微信开发者工具导入 `dist/build/mp-weixin` 上传。
- App：当前没有可确认的 `build:app` 脚本，发布需在生成 App 工程后结合 HBuilderX，云打包细节待团队确认。

## 常见问题

### `pnpm dev`、`pnpm dev:mp`、`pnpm build:mp` 不存在

这些是旧文档中的脚本名。请使用 `package.json` 中实际存在的脚本，例如 `pnpm dev:h5`、`pnpm dev:mp-weixin`、`pnpm build:mp-weixin`。

### H5 启动前端口被强制关闭

`dev:h5` 会运行 `scripts/force-kill-port.mjs` 清理 `VITE_APP_PORT` 对应端口。若当前端口上的进程不应被关闭，请改用其他端口或设置 `SKIP_KILL_PORT=true`。

### 微信上传脚本失败

确认根目录本地存在微信上传私钥 `private.<appid>.key` 或 `private.key`，且微信公众平台已配置上传 IP 白名单。上传脚本会自动执行 `pnpm build:mp-weixin:production`。
