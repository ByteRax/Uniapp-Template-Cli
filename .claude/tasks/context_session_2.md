# Session 2 - 项目优化分析报告

## 会话概述

对 UniApp 项目进行全面优化分析，通过 Architect、Code-reviewer 三个维度并行检查，生成优化报告。用户选择仅生成报告，不做代码修改。

## 发现的问题汇总

### 高优先级（影响运行时正确性或构建安全）

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| H1 | useTheme 主题监听器泄漏 | src/composables/useTheme.ts | offThemeChange 传入新匿名函数，监听器无法移除，每次挂载/卸载泄漏 |
| H2 | HTTP 拦截器 401 并发竞态 | src/http/interceptor.ts | 并发 401 下 loading 计数失衡，重复触发 logout |
| H3 | treeshake.moduleSideEffects: false 过于激进 | vite.config.ts:303 | 可能导致 Wot 组件样式丢失、pinia 持久化插件失效 |
| H4 | dayjs 误放在 devDependencies | package.json:123 | 严格模式下构建可能失败 |
| H5 | JSON.parse 无保护 | vite.config.ts:226 | 环境变量缺失时 Vite 启动崩溃 |

### 中优先级（冗余依赖、配置噪音、代码质量）

| # | 问题 | 位置 |
|---|------|------|
| M1 | 6 个冗余依赖：vue-i18n、sass-loader、unocss-applet、vite-plugin-vue-devtools、uni-mini-ci、@vue/runtime-core | package.json |
| M2 | workspaces 声明但 packages/ 不存在 | package.json:9-11 |
| M3 | AutoImport dirs 中 src/utils/** 重复声明 | vite.config.ts:115-117 |
| M4 | @ts-nocheck 全局禁用类型检查 | vite.config.ts:2 |
| M5 | tsconfig 中 strict 隐含的 8 个冗余选项 | tsconfig.json:36-57 |
| M6 | 应用项目不需要 declaration/declarationMap | tsconfig.json:50-51 |
| M7 | 暗色主题双轨制（Wot CSS 变量 vs UnoCSS color-mapping） | 全局架构 |
| M8 | useToken.ts 中 tryGetValidToken 逻辑死代码 | src/stores/useToken.ts |
| M9 | 三个 Global 组件大量重复代码 | src/components/common/ |
| M10 | 主题色三处定义不一致（#0099ff / #4D7FFF / #0957DE） | variable.scss / theme.ts / uno.config.ts |
| M11 | esbuild.drop 与 terser 重复配置 | vite.config.ts:244 |
| M12 | vue 版本使用 caret 范围，UniApp 对此敏感 | package.json |

### 低优先级（代码整洁、死代码清理）

| # | 问题 | 位置 |
|---|------|------|
| L1 | 未使用的 UnoCSS shortcuts（f-b/f-c/f-s/f-e） | uno.config.ts:43-48 |
| L2 | 未使用的 $primary-color 变量 | variable.scss:2 |
| L3 | 未使用的 p-safe/pt-safe/pb-safe 规则 | uno.config.ts:57-64 |
| L4 | 未接入的 themeColorOptions | composables/types/theme.ts:39-46 |
| L5 | BaseLayout 硬编码颜色无暗色变体 | BaseLayout.vue:95-104 |
| L6 | Android targetSdkVersion: 30 过低 | manifest.config.ts:56 |
| L7 | Android 权限声明过于宽泛 | manifest.config.ts:58-74 |
| L8 | terser unsafe_* 选项在多端场景有风险 | vite.config.ts:260-264 |

## 关键结论

- 核心风险点：H1（监听器泄漏）、H2（401 竞态）、H3（tree-shake 过激）需优先修复
- 暗色主题双轨制是最具架构影响的中间层问题，建议统一为 Wot CSS 变量方案
- 冗余依赖清理可减少 node_modules 约 50MB+
- 主题色三处不一致（#0099ff / #4D7FFF / #0957DE）需统一为单一来源

## 状态

- 用户选择"仅生成报告"，未做任何代码修改
- 报告已生成，待用户决定后续执行范围
