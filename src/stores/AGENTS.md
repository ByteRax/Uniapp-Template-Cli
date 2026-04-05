<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# stores

## Purpose
存放 Pinia store 与 store 初始化逻辑，负责认证状态、用户信息、主题状态以及 Pinia 持久化配置。

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 创建 Pinia、配置持久化插件并提前 `setActivePinia(store)`。 |
| `userStore.ts` | 登录态核心 store，管理 token、过期时间和登录/登出流程。 |
| `user.ts` | 用户信息 store。 |
| `theme.ts` | 主题状态与主题变量 store。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 维持 setup store 写法与当前持久化方案，不要引入额外状态层。
- `setActivePinia(store)` 的提前激活是现有兼容性修复，不要随意移除。
- 登录态、用户信息和主题都可能被自动导入广泛使用，重命名或拆分前先评估引用面。

### Testing Requirements
- 至少运行 `pnpm type-check`、`pnpm lint`、`pnpm format:check`。
- 改登录态或主题后，手动验证 token 持久化、退出登录、用户信息拉取和主题切换。
- 若改持久化配置，再检查 `uni.getStorageSync` / `uni.setStorageSync` 路径是否仍正常。

### Common Patterns
- Pinia 持久化插件直接映射 UniApp storage API。
- 登录成功后通常联动拉取用户信息。
- 主题 store 和主题 composable 共同驱动系统主题同步。

## Dependencies

### Internal
- 被 `src/main.ts` 初始化调用，并与 `src/http/`、`src/router/`、`src/composables/` 深度协作。

### External
- `pinia`。
- `pinia-plugin-persistedstate`。
- `@dcloudio/uni-app` storage API。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
