<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-30 | Updated: 2026-04-30 -->

# business

## Purpose
贴近业务语义的组件，承载特定业务场景下的 UI 交互逻辑。

## Key Files

| File | Description |
|------|-------------|
| `PrivacyPopup.vue` | 微信小程序隐私协议弹窗。 |

## For AI Agents

### Working In This Directory
- 业务组件可以依赖 store 和 composable，但不要反向被 `common/` 或 `layout/` 引用。
- 组件由 easycom 自动注册，通常不需要手动 import。

### Common Patterns
- 组件采用 PascalCase 文件名。
- 业务状态通过 props / emit 与页面层交互，不要直接操作全局状态。

## Dependencies

### Internal
- 可依赖 `src/stores/`、`src/composables/`、`src/utils/`。

### External
- `wot-design-uni` UI 组件。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
