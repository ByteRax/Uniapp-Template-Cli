# oh-my-claudecode (OMC) 使用说明

> 版本: v4.9.3 | 许可证: MIT | GitHub: https://github.com/Yeachan-Heo/oh-my-claudecode

## 什么是 oh-my-claudecode

oh-my-claudecode (OMC) 是 Claude Code 的**多智能体编排系统**。核心理念是"零学习曲线"——用户只需用自然语言描述需求，OMC 自动协调 32 个专业智能体完成从需求分析到代码验证的全流程。

简单来说：OMC 让 Claude Code 从"一个人干活"变成"一个团队协作"。

---

## 快速开始

### 安装

在 Claude Code 中执行：

```
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
```

### 初始化

```
/omc-setup
```

### 诊断修复

```
/omc-doctor
```

---

## 核心工作流

OMC 提供 5 种主要执行模式，从简单到复杂层层递进：

### 执行模式的包含关系

```
autopilot (全自主: 需求 -> 设计 -> 编码 -> 测试 -> 审查)
  └── ralph (持久循环: 不完成不停止)
        └── ultrawork (并行引擎: 多智能体同时工作)
```

### 1. autopilot — 全自主执行

**触发**: `/autopilot` 或说 "autopilot"、"build me"、"I want a"、"full auto"

从一句话需求到可运行代码的完整自动化流程：
1. **需求展开** — 将模糊想法转为详细规格
2. **方案规划** — 制定实施计划
3. **并行实施** — 自动分派智能体执行
4. **QA 循环** — 自动测试修复，最多 5 轮
5. **多维审查** — 架构 + 安全 + 代码质量三重验证

**适用场景**: "帮我做一个 XX 功能"、"从零搭建 XX 系统"

**示例**:
```
/autopilot 为这个 UniApp 项目添加用户个人中心页面，包含头像上传、昵称修改和主题色切换功能
```

### 2. ralph — 持久循环模式

**触发**: `/ralph` 或说 "ralph"、"don't stop"、"must complete"

PRD 驱动的持久循环，持续迭代直到所有用户故事验证通过才会停止。内置验证审查员（verifier），每次迭代都会检查完成度。

**适用场景**: 有明确需求文档的功能开发、需要反复验证的任务

**示例**:
```
/ralph 按照 PRD 完成登录模块的全部功能开发
```

### 3. ultrawork — 并行执行引擎

**触发**: `/ultrawork` 或说 "ulw"、"parallel"

最大化并行化，多个智能体同时工作。适合已经拆解好的独立任务。

**适用场景**: 多个独立任务同时执行

**示例**:
```
/ulw 同时修复这三个 bug: 1) 登录页闪退 2) 列表数据重复 3) 暗色模式样式错乱
```

### 4. team — 团队协作编排

**触发**: `/team N:agent-type "task"`

N 个协调智能体在共享任务列表上协作。v4.1.7+ 推荐的标准编排方式。

需要启用实验性功能：`~/.claude/settings.json` 中设置：
```json
{
  "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
}
```

**流水线阶段**:
```
team-plan -> team-prd -> team-exec -> team-verify -> team-fix (循环)
```

**示例**:
```
/team 3:executor "重构 HTTP 请求层，添加重试机制和请求缓存"
```

### 5. ultraqa — QA 循环工作流

**触发**: `/ultraqa`

自动循环：测试 -> 验证 -> 修复 -> 重复，直到质量目标达成或达到最大循环次数。

**适用场景**: 需要反复测试修复的场景

---

## 规划与分析工具

### deep-interview — 深度需求访谈

**触发**: `/deep-interview` 或说 "deep interview"、"interview me"

苏格拉底式问答，通过数学化模糊度门控确保需求清晰。适合需求不明确时先澄清再执行。

### ralplan — 共识规划

**触发**: `/ralplan` 或说 "ralplan"、"consensus plan"

三阶段共识规划：Planner + Architect + Critic 迭代循环，直到三方对方案达成共识。

### plan — 战略规划

**触发**: `/plan` 或说 "plan this"、"let's plan"

交互式战略规划，支持访谈模式和直接模式。

### trace — 因果追踪

**触发**: `/trace`

证据驱动的竞争性假设推理，适合排查复杂 Bug 的根因。

### deep-dive — 深度调查

**触发**: `/deep-dive` 或说 "deep dive"

两阶段流水线：追踪（因果调查）-> 深度访谈（需求结晶）。

---

## 推荐工作流组合

| 场景 | 推荐流程 |
|------|---------|
| **需求不明确** | `deep-interview` → `ralplan` → `autopilot` |
| **明确的功能开发** | `autopilot` 或 `ralph` |
| **多任务并行** | `ultrawork` |
| **团队协作** | `team N:executor "task"` |
| **Bug 修复** | 直接描述或 `debugger` 智能体 |
| **代码审查** | `code-reviewer` + `security-reviewer` |
| **测试验证** | `ultraqa` |

### 三阶段黄金流水线（推荐）

```
/deep-interview "模糊的需求"
  → 苏格拉底问答 → 需求规格（模糊度 ≤ 20%）
  → /ralplan --direct → 共识方案（三方审查通过）
  → /autopilot → 跳过 Phase 0/1，直接执行
```

---

## 专业智能体一览

OMC 提供 19 个专业智能体，按职责分为以下几类：

### 构建/分析通道

| 智能体 | 模型 | 用途 |
|--------|------|------|
| `explore` | haiku | 快速代码库搜索、文件/符号映射 |
| `analyst` | opus | 需求分析、验收标准、发现隐藏约束 |
| `planner` | opus | 战略规划、任务排序、风险评估 |
| `architect` | opus | 系统设计、架构边界、长期权衡（只读） |
| `debugger` | sonnet | 根因分析、回归隔离、构建错误诊断 |
| `executor` | sonnet | 代码实现、重构、功能开发（默认委派目标） |
| `verifier` | sonnet | 验证策略、基于证据的完成检查 |

### 审查通道

| 智能体 | 模型 | 用途 |
|--------|------|------|
| `code-reviewer` | opus | 全面代码审查：逻辑缺陷、可维护性、性能 |
| `security-reviewer` | sonnet | 安全漏洞检测（OWASP Top 10、密钥泄露） |
| `code-simplifier` | opus | 代码简化与精炼，保持功能不变 |
| `critic` | opus | 方案批判性挑战、多视角审查 |

### 领域专家

| 智能体 | 模型 | 用途 |
|--------|------|------|
| `test-engineer` | sonnet | 测试策略、覆盖率、TDD 工作流 |
| `qa-tester` | sonnet | 交互式 CLI 测试（tmux 会话） |
| `designer` | sonnet | UI/UX 设计开发 |
| `writer` | haiku | 技术文档撰写 |
| `scientist` | sonnet | 数据分析和研究 |
| `document-specialist` | sonnet | 外部文档与 SDK 参考资料 |
| `git-master` | sonnet | Git 提交策略、原子提交 |
| `tracer` | sonnet | 证据驱动因果追踪 |

### 模型路由策略

| 复杂度 | 模型 | 适用场景 |
|--------|------|---------|
| 低 | haiku | 快速查找、简单文档 |
| 标准 | sonnet | 代码实现、调试、测试、UI |
| 高 | opus | 架构设计、深度分析、复杂审查 |

---

## 实用工具

### ai-slop-cleaner — AI 代码清理

**触发**: `/ai-slop-cleaner` 或说 "deslop"、"anti-slop"

回归安全的 AI 代码清理，删除优先。清理 AI 生成代码中的冗余注释、过度工程化等。

### ccg — 三模型编排

**触发**: `/ccg`

Claude + Codex + Gemini 三模型并行编排，综合三个 AI 的能力。

### deepinit — 深度初始化

**触发**: `/deepinit`

为代码库生成分层 AGENTS.md 文档体系，帮助 AI 理解项目结构。

### external-context — 外部文档查询

**触发**: `/external-context <topic>`

并行调用文档专家搜索外部 SDK/API 文档。

---

## 管理命令

| 命令 | 用途 |
|------|------|
| `/cancel` 或说 "cancel" | 取消当前活跃的 OMC 模式 |
| `/omc-setup` | 安装/刷新配置 |
| `/omc-doctor` | 诊断安装问题 |
| `/hud` | 配置状态栏显示 |
| `/mcp-setup` | 配置 MCP 服务器 |
| `/skill list` | 列出自定义技能 |
| `/configure-notifications` | 配置通知（Telegram/Discord/Slack） |

---

## 持久化状态

OMC 在项目根目录的 `.omc/` 下维护状态：

```
.omc/
├── state/           # 模式状态文件（autopilot、ralph 等）
├── notepad.md       # 会话持久化笔记
├── project-memory.json  # 跨会话项目知识
├── plans/           # 规划文档
└── logs/            # 审计日志
```

---

## 魔法关键词速查

在对话中直接说出这些关键词即可触发对应功能：

| 关键词 | 触发的功能 |
|--------|-----------|
| `autopilot` | 全自主执行 |
| `ralph` | 持久循环模式 |
| `ulw` | 并行执行引擎 |
| `plan this` | 战略规划 |
| `ralplan` | 共识规划 |
| `deep interview` | 深度需求访谈 |
| `deslop` / `anti-slop` | AI 代码清理 |
| `ccg` | 三模型编排 |
| `cancelomc` | 取消当前模式 |
| `team` | 团队协作 |

---

## 常见问题

**Q: autopilot 和 ralph 有什么区别？**
A: autopilot 是最完整的模式，包含需求分析、规划、实施、测试、审查全流程。ralph 专注于持久循环执行，适合已有明确需求的情况。autopilot 内部会使用 ralph。

**Q: 什么时候用 team 而不是 ultrawork？**
A: team 适合需要多个智能体协同完成的复杂任务（共享任务列表）。ultrawork 适合多个独立任务并行处理。team 是 v4.1.7+ 推荐的标准编排方式。

**Q: 如何取消正在运行的 OMC 模式？**
A: 说 "cancel" 或执行 `/cancel`。

**Q: 如何更新 OMC？**
A: 执行 `/omc-setup` 或通过 plugin marketplace 更新。

**Q: 智能体可以组合使用吗？**
A: 可以。比如 autopilot 会自动按需调用 analyst、architect、executor、verifier 等多个智能体。也可以通过 team 手动指定组合。
