<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# public

## Purpose
存放会被原样复制到构建产物中的公共静态资源，当前主要是 favicon、PWA 图标和 Safari pinned tab 图标。

## Key Files

| File | Description |
|------|-------------|
| `favicon.ico` | 通用站点图标。 |
| `favicon.svg` | 默认 SVG favicon。 |
| `favicon-dark.svg` | 深色主题 favicon。 |
| `pwa-192x192.png` | PWA 192 尺寸图标。 |
| `pwa-512x512.png` | PWA 512 尺寸图标。 |
| `safari-pinned-tab.svg` | Safari pinned tab 图标。 |

## Subdirectories

该目录当前没有需要单独文档化的子目录。

## For AI Agents

### Working In This Directory
- 仅放公共静态资源，不要把业务源码或需要打包处理的模块放到这里。
- 替换图标时保持文件名稳定，避免额外联动修改 HTML/PWA 配置。
- 二进制资源不适合做大范围自动重写，变更前先确认影响范围。

### Testing Requirements
- 图标变更后至少验证 H5 构建或本地页面显示。
- 若涉及 PWA 资源，额外检查 manifest 或浏览器安装图标是否更新。

### Common Patterns
- 该目录资源会被构建工具按原路径拷贝到输出目录。
- 当前内容以 favicon/PWA 图标为主，没有业务静态子目录。

## Dependencies

### Internal
- 被 H5 页面入口与构建产物引用。

### External
- 浏览器 favicon / PWA 规范消费这些资源。

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
