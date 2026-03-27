<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# components

## Purpose
存放自动注册的 Vue 组件，按通用组件、业务组件和布局组件划分。这里的组件既包含全局 UI 容器，也包含页面级布局封装与少量演示组件。

## Key Files

| File | Description |
|------|-------------|
| `DemoBlock.vue` | 演示或文档用途的块级示例组件。 |
| `common/GlobalLoading.vue` | 全局 loading 组件，由全局状态驱动显示。 |
| `common/GlobalToast.vue` | 全局 toast 组件，封装多端提示展示。 |
| `common/GlobalMessage.vue` | 全局消息框组件，承载 alert / confirm / prompt 类交互。 |
| `business/PrivacyPopup.vue` | 微信小程序隐私协议相关弹窗。 |
| `layout/BaseLayout.vue` | 页面基础布局容器，统一处理 loading / empty / error / success 状态。 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `common/` | 跨页面复用的全局基础组件。 |
| `business/` | 贴近业务语义的组件。 |
| `layout/` | 页面布局和容器类组件。 |

## For AI Agents

### Working In This Directory
- 组件由扫描插件自动注册，通常不需要手动 import 或全局注册。
- `common/` 下保持无业务耦合；业务特定能力优先放 `business/`。
- 改动全局 UI 组件时，要同步理解 `App.ku.vue` 与对应 store/composable 的联动。
- 注意多端条件编译，特别是微信和支付宝小程序的差异处理。

### Testing Requirements
- 通用验证：`pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 改动组件后至少在一个目标端运行页面验证渲染与交互。
- 若修改全局提示类组件，重点检查跨页面显示、关闭逻辑和平台兼容。

### Common Patterns
- 组件采用 PascalCase 文件名和组件名。
- 常用全局 UI 由 store 状态驱动，而不是局部直接控制 DOM。
- 布局组件会暴露状态切换方法给页面层使用。
- easycom / 组件扫描负责自动解析 `wd-*` 与本地组件。

## Dependencies

### Internal
- 与 `src/composables/`、`src/stores/`、`App.ku.vue` 和页面目录存在联动。

### External
- `vue` 组件系统。
- `wot-design-uni`、`z-paging` 等 UI 组件库。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
