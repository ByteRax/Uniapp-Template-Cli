# UniApp 模板优化：对比结论与执行提示词

分析日期：2026-10-25。

后续执行进度与验证结果见 [template-optimization-results.md](./template-optimization-results.md) 。下表保留执行前的对比快照。

目标仓库：`/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli`。
参考仓库：`/Users/hmey/Workspace/SiliconBased/real-rate-calculator`。

本次只读对比源码与配置，交付提示词；未修改应用代码，未运行测试、构建或页面验收。以下结论是源码证据，不代表运行时验收结果。

## 对比结论

建议回迁经过核验的通用基础能力，优先处理运行正确性，再补测试和工程约束。参考项目是业务应用，不能作为所有实现都正确的标准答案。

| 方向           | 当前模板                                                                                     | 参考项目                                               | 建议                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 导航回调与互斥 | `options` 在内部 `complete` 之后展开，调用方传入 `complete` 会覆盖解锁回调                   | 仅保留同 URL 的短时去重，没有相同的全局锁              | 优先修复模板的回调组合，验证锁在各路径释放；不要直接删锁改变导航语义         |
| 布局重试       | 先执行重试回调，再进入 loading，同步成功或失败状态会被覆盖                                   | 先保存回调并进入 loading，再执行回调；另支持声明式状态 | 优先修复重试顺序；声明式状态按消费者需求评估，兼容现有 expose API            |
| 登录态与 Token | `hasLogin()` 检查到期时间，但 `validToken` 直接返回 token；`tryGetValidToken()` 没有真正刷新 | 请求前使用共享 Promise 协调刷新，有独立刷新协议        | 先统一有效性语义；确认模板已有刷新接口后才接入刷新，不发明后端协议           |
| HTTP 生命周期  | 已有 loading 计数、请求去重、并发登出锁                                                      | 增加异步刷新及相应失败处理，也增加设备、Cookie 等协议  | 核验取消、并发 401、拦截器异常、旧请求完成的清理行为；业务请求头不搬迁       |
| 全局反馈       | Toast 组件初始化时保存页面路径，Store 状态主要依赖组件关闭通知清理                           | Toast 增加计时器替换与关闭清理，组件读取当前页面路径   | 按模板使用的 Wot 版本验证超时、连续提示、跨页与关闭回调；不要混用组件库 API  |
| 测试           | 无 `test` 脚本，主要依赖类型、lint 和格式检查                                                | 有 Vitest、fake timers、定向行为回归                   | 建立最小基础能力测试，优先覆盖本轮修复；不复制金融领域测试集合               |
| 页面生成       | 回调与元数据处理类型较弱，运行路由读取生成的 JSON                                            | 生成类型化路由常量和运行时元数据，并预生成平台页面配置 | 类型化值得借鉴；额外生成文件与预生成机制须有明确消费者或可复现问题           |
| 工程工具       | Oxlint、Oxfmt 与 Vue ESLint；Vite 配置有整文件 `@ts-nocheck`                                 | ESLint、Prettier；独立类型检查配置放宽两项严格选项     | 保留模板现有路线，按实际漏检补强；不要为对齐参考而切换格式化器或放宽类型检查 |
| 主题           | 保留主题变量与系统主题联动；监听注册和移除使用同一回调                                       | Provider 固定 `theme="light"`                          | 保留模板主题能力；历史笔记中的主题监听泄漏结论已经与当前源码不符             |

## 关键源码依据

- 导航：[模板 router.ts](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/router/router.ts:28) 与 [参考 router.ts](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/src/router/router.ts:37) 。
- 布局：[模板 BaseLayout.vue](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/components/layout/BaseLayout.vue:74) 与 [参考 BaseLayout.vue](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/src/components/layout/BaseLayout.vue:119) 。
- Token：[模板 userStore.ts](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/stores/userStore.ts:131) 、[模板请求注入](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/http/interceptor.ts:58) 与 [参考刷新协调](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/src/http/interceptor.ts:80) 。
- HTTP：[模板计数与请求清理](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/http/interceptor.ts:46) 与 [参考登出逻辑](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/src/http/interceptor.ts:63) 。参考登出函数在缺少 refresh token 时直接返回，同样需要核验会话清理边界。
- Toast：[模板页面路径读取](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/components/common/GlobalToast.vue:7) 与 [参考定时器清理](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/src/composables/useGlobalToast.ts:18) 。
- 测试：[模板脚本](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/package.json:66) 、[参考脚本](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/package.json:70) 与 [参考 Vitest 配置](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/vitest.config.ts:18) 。
- 页面生成：[模板 Vite 接入](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/vite.config.ts:53) 与 [参考元数据生成器](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/vite-plugins/vite-config-uni-pages.ts:61) 。
- 类型与格式：[模板工具链](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/package.json:66) 、[模板 Vite 类型跳过](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/vite.config.ts:1) 与 [参考类型检查覆盖配置](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/tsconfig.typecheck.json:1) 。
- 主题：[模板监听清理](/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli/src/composables/useTheme.ts:42) 与 [参考主题 Provider](/Users/hmey/Workspace/SiliconBased/real-rate-calculator/src/App.ku.vue:2) 。

不建议默认迁移：账单与 IRR、业务埋点、手机号绑定守卫、测试登录态入口、AppKey／设备 Cookie、AI／SSE、ECharts 分包、金融主题和业务 API。Wot V2、UniApp、Vue、Node.js 与包管理器升级应作为单独兼容性议题，不能只依据参考项目版本更新。

## 可直接复制的执行提示词

```text
你是一名熟悉 UniApp、Vue 3、TypeScript、Vite 和跨端运行机制的工程师。请参考下列业务项目，优化当前通用模板，完成源码对比、分批实现和验证。

目标仓库：/Users/hmey/Workspace/WebstormProjects/Uniapp-Template-Cli
参考仓库：/Users/hmey/Workspace/SiliconBased/real-rate-calculator

目标：提高模板的运行正确性、基础能力可测试性和工程可维护性。保持通用模板定位，保留现有功能、交互、公开 API 与跨端能力，明确列出修复缺陷带来的预期行为变化。

一、开始前
1．读取两边根 AGENTS.md、CLAUDE.md、目标目录规则和相关架构资料；读取目标仓库的 .claude/tasks/context_session_*.md。历史记录只能用于定位，以当前源码为准。
2．检查两边 Git 状态。参考仓库全程只读；保护目标仓库已有修改和暂存区，不覆盖、不回退，不自动提交、推送或上传。
3．按仓库规则并行委派相互独立的只读探索；主代理负责取舍、修改和最终验证。共享根配置、依赖与 lockfile 统一由主代理修改。
4．先记录目标仓库现有质量检查基线，区分已有失败与本次新增失败。环境文件只核对变量名和用途，不输出真实 token、密钥及生产凭据。

二、对比方式
1．逐项建立「目标文件与行号 → 参考文件与行号 → 行为差异 → 模板适用性 → 最小改法 → 验证方式」证据表。
2．区分已证实缺陷、可借鉴能力、需要业务协议的能力、仍需验证的风险。不要把“参考项目有”当作“模板必须有”。
3．分别检查应用启动、HTTP、鉴权、路由、Store、反馈与布局、主题、配置生成、环境解析、构建、类型检查、lint、格式化和文档。
4．优先复用现有工具与依赖，不增加没有使用方的 services、domain、适配层、生成文件或配置项。

三、按以下优先级推进

第一批：基础运行正确性。
- 核验 src/router/router.ts 中 options 展开覆盖内部 complete 的问题。组合内部与调用方回调，保证导航成功、失败及调用方回调抛错时不会残留锁；保持原有去重语义。
- 核验 BaseLayout.handleRetry 先执行回调后 showLoading 的覆盖问题。覆盖同步成功、同步失败和异步完成；保留现有 expose API。声明式 status 仅在确有消费者需求时引入。
- 核验 Token 到期、validToken、hasLogin、tryGetValidToken 和请求头注入的一致性。基于调用时的时钟判断时效，避免纯时间变化被 computed/getter 缓存。
- 沿 API 定义确认是否已有 refresh token 协议。有协议才实现共享刷新协调；没有协议则完善过期处理，不创建虚构接口、不照搬一小时提前刷新窗口。
- 核验并发 401、登出接口失败或再次 401、迟到响应，以及旧会话响应影响新登录态的边界；区分本地清理与远端登出，避免递归登出和重复跳转。
- 沿完整请求链检查成功、失败、超时、取消、拦截器异常的 loading 增减是否配对；检查旧请求完成是否误删同键新请求，以及去重策略是否影响写请求语义。只修复可证实的问题。

第二批：反馈与基础组件。
- 对比 GlobalToast、GlobalLoading、GlobalMessage 和 Apis 门面，核验连续显示、超时、duration 为 0、跨页、页面卸载、关闭回调与计时器清理。
- 使用目标仓库当前 wot-design-uni 的真实 API，不混入参考项目 @wot-ui/ui 的组件名、参数或回调；本轮默认不做 UI 库迁移。
- 保留模板主题与系统主题联动。当前 useTheme 已使用同一回调注册和移除，不把历史笔记中的监听泄漏当成待修复事实，也不要复制参考项目固定浅色主题的设置。

第三批：工程化与可维护性。
- 为本轮涉及并发、状态、时间和生命周期的缺陷建立最小行为回归测试。优先通过真实模块入口验证，不复制一份实现作为测试对象；不要搬入金融领域测试。
- 评估最小 Vitest 接入与现有 Vite／Node 兼容性，说明新增依赖的必要性；不引入整套参考项目脚本和测试环境。
- 改善页面元数据与生成插件的类型，逐项处理 Vite 的整文件 @ts-nocheck；不要为通过检查而使用 any、全局禁用或放宽现有严格选项。
- 核对 getEnv.ts 与 Vite mode 的一致性，覆盖实际脚本使用的开发、构建及显式 mode 参数形态；仅在可复现配置读取时序或平台残留问题时增加页面预生成步骤。
- 保留 Oxlint、Oxfmt 与 Vue ESLint 的现有路线，核验真实检查范围和生成文件排除。无需为对齐参考而替换格式化器。
- 检查构建压缩、副作用、分包及版本写入逻辑。用构建产物和行为证据决定修改，不把潜在风险写成已经发生的故障。
- 检查依赖引用、插件使用与版本耦合后再决定清理；不凭名称删除依赖，不批量升级 UniApp、Vue、Wot、Vite、Node 或 pnpm。
- 补齐模板 README 的安装、环境、命令、基础能力和验证说明；同步会话记录与规则中已经证实的漂移，不搬入参考项目业务约束。

四、迁移边界
- 不引入账单、IRR、金融计算、业务埋点、手机号绑定、AI 聊天、SSE、ECharts 或特定业务 API。
- 不复制测试登录态入口、AppKey、设备 Cookie 和业务请求头，不引入真实环境配置或凭据。
- 不手改 src/pages.json、src/manifest.json 和自动生成声明；修改配置源或生成器，保持单一事实源。
- 避免整文件搬迁和大范围重构。只有出现明确重复且职责稳定时才抽象；每行修改都要能对应本轮目标。
- 参考项目也需审查：其缺少 refresh token 时的登出提前返回、固定浅色 Provider 和放宽部分 TypeScript 选项均不可直接作为模板标准。

五、验证与执行节奏
1．先给简短对比结论和分批计划，再在同一任务内完成已证实且兼容现有契约的通用修复，无需逐个文件重复确认。需要后端新协议、整套依赖迁移或改变产品语义的项目仅列方案，不擅自实施。
2．每批按「复现或有针对性的行为测试 → 最小修复 → 相关回归 → 类型／lint／格式检查」推进，使用目标仓库实际存在的命令。
3．修改构建或页面生成逻辑时补相关平台构建与产物检查；留意脚本的版本号或配置写入副作用。验证后检查 diff，仅恢复本轮工具产生且无需保留的变动。
4．涉及 H5 渲染与交互，优先使用宿主内置浏览器实际操作；涉及微信端差异，在微信开发者工具中验收。降级通道说明原因，类型检查和构建不能代替页面或设备验收。
5．没有后端、登录态、目标运行时或设备时，明确未验证场景和原因，不虚构通过结果。已有检查失败需保留基线证据，不能直接归咎于本轮。
6．最终审查 diff，清理本轮产生的孤儿代码和临时文件，保留原有无关改动。

六、交付
提供按优先级排序的对比证据表、实际修改及理由、暂缓迁移项与原因、各批验证结果、遗留限制和文档入口。只报告执行过的检查，不虚构性能提升、包体收益或运行时结论。
```
