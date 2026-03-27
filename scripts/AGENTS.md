<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# scripts

## Purpose
存放项目级辅助脚本，当前主要负责微信小程序构建后上传流程。

## Key Files

| File | Description |
|------|-------------|
| `upload-weixin.js` | 读取版本号、环境变量、私钥和命令参数，执行微信小程序上传。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 先确认 `package.json` 脚本名、`env/` 变量名和上传工具调用方式一致，再修改脚本。
- 该脚本会读取私钥与敏感配置，说明时可描述来源，但不要在文档中展开密钥值。
- 修改命令参数时保持现有 `--version`、`--desc`、`--robot` 兼容行为，除非任务明确要求变更。

### Testing Requirements
- 改脚本后至少做静态检查与一次无副作用参数路径验证。
- 若要真实上传，需要用户明确授权并准备小程序私钥、AppID 和网络白名单。

### Common Patterns
- 通过读取 `package.json` 版本和最近 Git 信息构造上传描述。
- 同时消费 `env/.env` 与 `env/.env.production`。
- 依赖微信小程序 CI/上传工具链完成发布。

## Dependencies

### Internal
- 依赖根目录 `package.json`、`env/` 变量文件和构建产物目录。

### External
- `miniprogram-ci` / `uni-mini-ci` 等小程序上传生态工具。
- Node.js 运行时与本地私钥文件。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
