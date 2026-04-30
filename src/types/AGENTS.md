<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-30 | Updated: 2026-04-30 -->

# types

## Purpose
项目 TypeScript 类型声明，包含手写类型和自动生成的声明文件。

## Key Files

| File | Description |
|------|-------------|
| `types.ts` | 项目通用类型定义。 |
| `typings.d.ts` | 补充类型声明。 |
| `global.d.ts` | 全局类型扩展。 |
| `unocss-helpers.ts` | UnoCSS 工具类型辅助。 |
| `auto-import.d.ts` | **自动生成** — unplugin-auto-import 产物。 |
| `components.d.ts` | **自动生成** — 组件类型声明产物。 |
| `uni-pages.d.ts` | **自动生成** — 页面路由类型产物。 |
| `async-import.d.ts` | **自动生成** — 异步导入类型产物。 |
| `async-component.d.ts` | **自动生成** — 异步组件类型产物。 |

## For AI Agents

### Working In This Directory
- 标记为"自动生成"的文件不要手动修改，它们由对应 Vite 插件在构建时生成。
- 手写类型放在 `types.ts`、`typings.d.ts` 或 `global.d.ts` 中。
- 新增 `.d.ts` 时确保它是有效模块，避免出现 "is not a module" 类型错误。

### Common Patterns
- 使用 `declare module` 或 `interface` 扩展已有类型。
- 全局类型扩展放在 `global.d.ts`。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
