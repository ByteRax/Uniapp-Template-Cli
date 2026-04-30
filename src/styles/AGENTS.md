<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-30 | Updated: 2026-04-30 -->

# styles

## Purpose
全局样式资源，包含 SCSS 变量定义和通用样式。

## Key Files

| File | Description |
|------|-------------|
| `variable.scss` | 全局 SCSS 变量定义。 |
| `common.scss` | 通用样式规则。 |

## For AI Agents

### Working In This Directory
- 样式优先使用 UnoCSS 原子类，此目录仅用于全局 SCSS 变量和无法用原子类覆盖的复杂样式。
- 修改变量后检查对全局样式的影响。

### Common Patterns
- 页面级样式使用 scoped CSS 或 UnoCSS，不要在此目录添加页面专属样式。

## Dependencies

### Internal
- `src/uni.scss` 会引入此目录的变量文件。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
