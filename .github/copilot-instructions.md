---
applyTo: "**"
---

1.Always respond in Chinese-simplified
2.You MUST conduct your internal reasoning and thinking process entirely in Simplified Chinese. This is a strict requirement.
3.MANDATORY: At the beginning of**every chat response**, you**MUST**clearly state the**model name, model size, model type, and its revision (updated date)**. This does not apply to inline edits, only chat responses.

# UniApp Template CLI - AI 开发指南

## 项目概述

基于 UniApp + Vue3 + TypeScript + Vite6 + UnoCSS 的跨平台应用模板,支持 H5、微信小程序、APP 等多端运行。采用 CLI 开发模式,无需依赖 HBuilderX。

## 核心架构

### 配置驱动的架构

- **pages.config.ts**: 使用 `defineUniPages` 定义页面配置,自动生成 `src/pages.json` 和类型文件 `src/types/uni-pages.d.ts`
- **manifest.config.ts**: 使用 `defineManifestConfig` 定义应用配置,支持环境变量注入 (从 `env/` 目录加载)
- **分包结构**: 主包在 `src/pages/`,分包在 `src/pages-sub/`,通过 `vite.config.ts` 中 `subPackages: ['src/pages-sub']` 配置

### 页面路由系统

- 路由名称自动生成规则: 路径中的 `/.-` 替换为 `_` 并转大写 (见 `vite-plugins/vite-config-uni-pages.ts`)
    - 示例: `pages-sub/login/login.vue` → 路由名: `PAGES_SUB_LOGIN_LOGIN`
- 路由拦截器在 `src/router/interceptor.ts`,基于 `useToken` 的登录状态判断
- 路由常量定义在 `src/router/router.ts`,如 `HOME_PAGE`, `LOGIN_PAGE`, `NOT_FOUND_PAGE`

### 网络请求架构

- HTTP 封装在 `src/http/index.ts`,基于类设计模式的 `Request` 类
- 拦截器配置在 `src/http/interceptor.ts`
- API 定义在 `src/api/` 目录,类型定义在 `src/api/types/`
- 全局 loading 通过 `meta: { loading: true }` 配置自动显示

### 全局 UI 组件系统

项目实现了跨页面的全局 UI 组件,基于 Pinia 状态管理:

- **GlobalLoading**: 通过 `useGlobalLoading()` store 管理,在 `App.vue` 中渲染
- **GlobalToast**: 通过 `useGlobalToast()` store 管理
- **GlobalMessage**: 通过 `useGlobalMessage()` store 管理
- 使用方式: `useGlobalLoading().loading('加载中...')` 或通过 `src/utils/ui.ts` 的工具函数

### 自动导入系统

- 组件自动导入: `@uni-helper/vite-plugin-uni-components` 扫描 `src/components` 和 `src/layout`
    - Wot UI 组件通过 `WotResolver` 自动解析
- API 自动导入: `unplugin-auto-import` 自动导入:
    - Vue API (`ref`, `computed`, `onMounted` 等)
    - Pinia API
    - UniApp API
    - `src/composables/**`, `src/stores/**`, `src/utils/**` 下的函数

### UnoCSS 原子化样式

- 配置文件: `uno.config.ts`
- 自定义 shortcuts: `flex-center`, `f-b` (flex-between), `f-c` (flex-center) 等
- 暗色模式支持: `uno-color-mapping.ts` 生成暗色主题规则
- 安全区适配: `p-safe` 规则

## 关键开发工作流

### 开发命令

```bash
pnpm dev:h5              # H5 开发
pnpm dev:mp-weixin       # 微信小程序开发
pnpm dev:app             # APP 开发
pnpm build:mp-weixin     # 微信小程序生产构建
```

### 版本管理

- 自动版本插件 `vite-plugins/vite-plugin-auto-version.ts` 在构建时自动更新版本号
- 版本格式: `package.json` 中的 `version` (如 1.0.2025111805) 和 `versionCode`
- 构建时注入 Git Hash 和构建日期到 `package.json`

### 环境变量

- 所有环境变量文件在 `env/` 目录,而非项目根目录
- `vite.config.ts` 中配置 `envDir: './env'`
- 通过 `loadEnv(mode, path.resolve(process.cwd(), 'env'))` 加载

### 跨包组件引用

- 使用 `@uni-ku/bundle-optimizer` 插件支持分包优化
- 异步组件引用示例: `import BarChart from '@/pages-sub/components/BarChart.vue?async'`
- 类型声明在 `src/types/async-component.d.ts`

## 项目特定约定

### 组件组织

- `src/components/common/`: 通用基础组件 (GlobalLoading, GlobalToast 等)
- `src/components/business/`: 业务组件 (如 PrivacyPopup)
- `src/components/layout/`: 布局组件 (BaseLayout)
- 组件命名: PascalCase,文件名与组件名一致

### Composables 模式

- 文件命名: `use*.ts` (如 `useGlobalLoading.ts`)
- 大多数 composables 实际是 Pinia stores,使用 `defineStore` 定义
- 可直接调用无需初始化,已通过 auto-import 全局可用

### 代码规范

- ESLint 配置在 `eslint.config.mjs`
- 格式化使用 oxfmt (Rust 实现),配置已集成
- 提交前自动检查 (Husky + Lint-staged)

## 技术栈依赖

- **UI 库**: Wot Design Uni (`wot-design-uni`)
- **状态管理**: Pinia + `pinia-plugin-persistedstate` (持久化)
- **分页组件**: z-paging
- **样式**: UnoCSS + Sass
- **Node 版本**: >=22, pnpm >=10.12.4

## AI 协作规范

1. 始终使用简体中文响应
2. 思考过程必须使用简体中文
3. 每次对话回复开头声明模型名称、大小、类型和更新日期 (仅聊天回复,不包括内联编辑)

# 项目概览

这是一个基于 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 的跨平台开发框架。

## 项目特点

- 支持 H5、小程序、APP 多平台开发
- 使用最新的前端技术栈
- 内置约定式路由、layout布局、请求封装等功能
- 无需依赖 HBuilderX，支持命令行开发

## 核心配置文件

- [package.json](mdc:package.json) - 项目依赖和脚本配置
- [vite.config.ts](mdc:vite.config.ts) - Vite 构建配置
- [pages.config.ts](mdc:pages.config.ts) - 页面路由配置
- [manifest.config.ts](mdc:manifest.config.ts) - 应用清单配置
- [uno.config.ts](mdc:uno.config.ts) - UnoCSS 配置

## 主要目录结构

- `src/pages/` - 页面文件
- `src/components/` - 组件文件
- `src/components/layouts` - 布局文件
- `src/api/` - API 接口
- `src/http/` - HTTP 请求封装
- `src/store/` - 状态管理
- `src/pages/` - 页面文件
- `src/utils/` - 工具函数
- `src/styles/` - 全局样式
- `src/App.ku.vue` - 全局根组件（类似 App.vue 里面的 template作用）

## 开发命令

- `pnpm dev:h5` - 开发 H5 版本（自动清理端口 + 类型检查）
- `pnpm dev:mp-weixin` - 开发微信小程序（自动类型检查）
- `pnpm dev:mp-alipay` - 开发支付宝小程序(含钉钉)
- `pnpm dev:app` - 开发 APP 版本
- `pnpm build:h5` - 构建 H5 生产版本
- `pnpm type-check` - 类型检查
- `pnpm lint` - 代码检查
- `pnpm port:free` - 强制清理端口占用

## Vue 组件规范

- 使用 Composition API 和 `<script setup>` 语法
- 组件文件使用 PascalCase 命名
- 页面文件放在 `src/pages/` 目录下
- 全局组件文件放在 `src/components/` 目录下
- 局部组件文件放在页面的 `/components/` 目录下

## TypeScript 规范

- 严格使用 TypeScript，避免使用 `any` 类型
- 为 API 响应数据定义接口类型
- 使用 `interface` 定义对象类型，`type` 定义联合类型
- 导入类型时使用 `import type` 语法

## 状态管理

- 使用 Pinia 进行状态管理
- Store 文件放在 `src/store/` 目录下
- 使用 `defineStore` 定义 store
- 支持持久化存储

## UnoCSS 原子化 CSS

- 项目使用 UnoCSS 作为原子化 CSS 框架
- 配置在 [uno.config.ts]
- 支持预设和自定义规则
- 优先使用原子化类名，减少自定义 CSS

## Vue SFC 组件规范

- `<script setup lang="ts">` 标签必须是第一个子元素
- `<template>` 标签必须是第二个子元素
- `<style scoped>` 标签必须是最后一个子元素（因为推荐使用原子化类名，所以很可能没有）

## 页面开发

- 页面文件放在 [src/pages/]目录下
- 使用约定式路由，文件名即路由路径
- 页面配置在仅需要在 宏`definePage` 中配置标题等内容即可，会自动生成到 `pages.json` 中

## 组件开发

- 全局组件文件放在 `src/components/` 目录下
- 局部组件文件放在页面的 `/components/` 目录下
- 使用 uni-app 内置组件和第三方组件库
- 支持 wot-ui\uview-pro\uv-ui\sard-ui\uview-plus 等多种第三方组件库 和 z-paging 组件
- 自定义组件遵循 uni-app 组件规范

## 平台适配

- 使用条件编译处理平台差异
- 支持 H5、小程序、APP 多平台
- 注意各平台的 API 差异
- 使用 uni.xxx API 替代原生 API

## 示例代码结构

```vue

<script setup lang="ts">
  // #ifdef H5
  import {h5Api} from '@/utils/h5'
  // #endif

  // #ifdef MP-WEIXIN
  import {mpApi} from '@/utils/mp'
  // #endif

  const handleClick = () => {
    // #ifdef H5
    h5Api.showToast('H5 平台')
    // #endif

    // #ifdef MP-WEIXIN
    mpApi.showToast('微信小程序')
    // #endif
  }
</script>

<template>
  <view class="page">
    <!-- uni-app 组件 -->
    <button @click="handleClick">点击</button>

    <!-- 条件渲染 -->
    <!-- #ifdef H5 -->
    <view>H5 特有内容</view>
    <!-- #endif -->
  </view>
</template>
```

## 生命周期

- 使用 uni-app 页面生命周期
- onLoad、onShow、onReady、onHide、onUnload
- 组件生命周期遵循 Vue3 规范
- 注意页面栈和导航管理


# Project general coding standards


## TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
