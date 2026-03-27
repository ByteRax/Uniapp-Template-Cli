<h1 align="center">
  <a href="https://github.com/tanranran/uniapp-template-cli" target="_blank">自用  uniapp 开发模板</a>
</h1>


由 `uniapp` + `Vue3` + `Ts` + `Vite5` + `UnoCss` 构成，使用了最新的前端技术栈，无需依靠 `HBuilderX`，通过命令行方式运行 `web`、`小程序` 和 `App`（编辑器推荐 `WebStorm`，可选 `VSCode`）。

## 平台兼容性

| H5 | IOS | 安卓 | 微信小程序 | 字节小程序 | 快手小程序 | 支付宝小程序 | 钉钉小程序 | 百度小程序 |
|----|-----|----|-------|-------|-------|--------|-------|-------|
| √  | √   | √  | √     | √     | √     | √      | √     | √     |

## ⚙️ 环境

- node>=22
- pnpm>=10.12.4
- Vue Official>=2.1.10
- TypeScript>=5.9

## &#x1F4C2; 快速开始

执行 `pnpm i` 安装依赖
执行 `pnpm dev` 运行 `H5`
执行 `pnpm dev:mp` 运行 `微信小程序`

## 📦 运行（支持热更新）

- web平台： `pnpm dev:h5`, 然后打开即可。
- weixin平台：`pnpm dev:mp` 然后打开微信开发者工具，导入本地文件夹，选择本项目的`dist/dev/mp-weixin` 文件。
- APP平台：`pnpm dev:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios基座。

## 🔗 发布

- web平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin平台：`pnpm build:mp`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP平台：`pnpm build:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/build/app` 文件夹，选择发行 - APP云打包。

## 技术栈

- [Vue 3](https://v3.cn.vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集，提供类型安全
- [Vite](https://cn.vitejs.dev/) - 新一代前端构建工具，极速的开发体验

### 状态管理

- [Pinia](https://pinia.vuejs.org/) - Vue 的轻量级状态管理库
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) - Pinia 持久化存储插件

### UI 和样式

- [UnoCSS](https://unocss.dev/) - 即时按需的原子 CSS 引擎
- [Wot UI](https://wot-ui.cn/) - 自定义移动端 UI 组件库
- [Sass](https://sass.nodejs.cn/) - CSS 扩展语言

### 开发工具

- [Oxc](https://oxc.rs/) - 通过 `oxfmt` 负责代码格式化，通过 `oxlint` 负责 JavaScript/TypeScript 代码检查
- [ESLint](https://eslint.org/) - JavaScript/TypeScript 代码质量检查工具
- `ESLint` 仍保留用于 Vue 模板和 SFC 结构规则检查
- [Husky](https://typicode.github.io/husky/) +
  [Lint-staged](https://github.com/okonet/lint-staged) - Git 提交钩子
- [Commitizen](https://github.com/commitizen/cz-cli) + [Commitlint](https://commitlint.js.org/) -
  Git 提交规范工具

## 模板目录结构

```
uniapp-template-cli/
├── .vscode/                  # VSCode 配置
│   ├── settings.json         # 编辑器设置
│   └── extensions.json       # 推荐扩展
├── .husky/                     # Git hooks
│   └── pre-commit             # 提交前检查
├── env/                      # 环境变量配置
├── public/                   # 静态资源
├── src/                      # 源代码
│   ├── api/                  # 接口请求
│   ├── components/           # 公共组件
│   │   ├── common/            # 通用基础组件
│   │   │   ├── GlobalLoading.vue  # 全局加载组件
│   │   │   └── ...            # 其他通用组件
│   │   └── business/          # 业务组件
│   │   │   ├── PrivacyPopup.vue  # 隐私协议弹框
│   │   │   └── ...            # 其他业务组件
│   │   └── layout/            # 布局组件
│   │       ├── BaseLayout.vue     # 页面组件
│   ├── composables/          # 组合式函数（Hooks）
│   │   ├── useDebounce.ts     # 防抖
│   │   ├── useThrottle.ts     # 节流
│   │   ├── useLocalStorage.ts # 本地存储
│   │   └── index.ts            # 统一导出
│   ├── directives/             # 自定义指令
│   │   ├── v-loading.ts
│   │   ├── v-permission.ts
│   │   └── index.ts
│   ├── router/                 # 路由配置
│   │   ├── index.ts            # 路由工具
│   │   ├── interceptor.ts           # 路由拦截器
│   │   └── router.ts            # 路由集合
│   ├── http/                 # 网络请求底层封装
│   ├── layout/               # 布局组件
│   ├── pages/                # 页面
│   ├── pages-sub/            # 分包页面
│   ├── router/               # 路由配置
│   ├── static/               # 静态资源
│   ├── stores/                 # Pinia 状态管理
│   │   ├── modules/            # 状态模块
│   │   │   ├── user.ts         # 用户状态
│   │   │   ├── app.ts          # 应用状态
│   │   │   ├── permission.ts   # 权限状态
│   │   │   └── order.ts        # 订单状态
│   │   └── index.ts            # Store 入口
│   ├── enums/                # 枚举常量
│   ├── styles/               # 全局样式
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   │   ├── Apis.ts           # 内部公共工具入口
│   │   ├── date.ts             # 日期工具
│   │   ├── common.ts           # 通用工具
│   │   └── index.ts
│   ├── App.vue               # 根组件
│   └── main.ts               # 入口文件
├── vite-plugins/             # Vite插件
├── .prettierignore             # Oxfmt 忽略文件（兼容 Prettier ignore 格式）
├── .oxfmtrc.json               # Oxfmt 配置
├── .oxlintrc.json              # Oxlint 配置
├── .eslint.config.mjs          # ESLint 配置（Vue 模板 / SFC 结构）
├── .gitignore                  # Git 忽略文件
├── index.html                # HTML 模板
├── manifest.config.ts        # 应用的配置文件
├── pages.config.ts           # 页面配置文件
├── tsconfig.json             # TypeScript 配置
├── uno.config.ts             # UnoCSS 配置
├── uno-color-mapping.ts      # UnoCSS 日夜间颜色映射
├── vite.config.ts            # Vite 配置
└── README.md                   # 项目说明
```
