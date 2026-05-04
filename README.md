<div align="center">

# 🚀 Markdown Online Editor

**Monaco 内核 · 实时预览 · LaTeX & Mermaid · AI 写作 · 开源免费**

[![Version](https://img.shields.io/badge/version-v3.0.0-blue.svg)](https://github.com/LiWeny16/MarkdownOnline)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE-MIT)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-Latest-0066cc.svg)](https://microsoft.github.io/monaco-editor/)

[🌐 在线体验](https://md.bigonion.cn) · [📖 English](./README-EN.md) · [🐛 问题反馈](https://github.com/LiWeny16/MarkdownOnline/issues)

</div>

---

## 🤔 为什么选择 MarkdownOL？

Markdown 写作工具很多，但总有一处让你妥协——**VSCode 预览要手动打开**，**Typora 已收费（$14.99）**，**HackMD 离线不可用**，**Obsidian 配置繁琐**。

MarkdownOL 把 **VSCode 的编辑体验** 和 **专业写作工具的功能** 放进一个浏览器标签页：

| 你想要的 | MarkdownOL | VSCode | Typora | HackMD |
|---------|:---------:|:------:|:------:|:------:|
| VSCode 级别编辑体验 | ✅ Monaco 内核 | ✅ | ❌ | ❌ |
| 默认实时预览 | ✅ 自动双栏 | ❌ 手动 Ctrl+K V | ✅ WYSIWYG | ✅ |
| LaTeX 数学公式 | ✅ KaTeX 极速 | ⚠️ 需插件 | ✅ | ✅ |
| Mermaid 图表 | ✅ 多种 | ⚠️ 需插件 | ✅ | ⚠️ |
| AI 写作助手 | ✅ 内置 | ⚠️ Copilot 收费 | ❌ | ❌ |
| 图片拖放/粘贴 | ✅ 自动管理 | ⚠️ 需配置路径 | ✅ | ❌ |
| 完全离线可用 | ✅ PWA | ✅ | ✅ | ❌ |
| 🆓 完全免费 | ✅ MIT 开源 | ✅ | ❌ $14.99 | ✅ |

> **一句话**：保留 VSCode 的编辑手感 + Typora 级别写作体验 + 浏览器即开即用 + 完全开源免费。

---

## ✨ 核心特性

### 🎨 编辑体验

- **Monaco 编辑器内核** — 驱动 VS Code 的工业级编辑器组件，全球 **2,000 万开发者** 的选择。完整保留语法高亮、IntelliSense 智能补全、多光标编辑、代码折叠
- **双栏实时预览** — 左写右看，同步滚动，所见即所得。默认自动激活，无需每次手动打开
- **100+ 语言代码高亮** — 基于 highlight.js，覆盖 JavaScript、TypeScript、Python、Rust、Go、Java、C++ 等主流语言
- **明暗主题切换** — 自动跟随系统偏好，支持手动切换

### 🧮 内容创作

- **LaTeX 数学公式** — 基于 **KaTeX** 渲染引擎（Khan Academy 开发，比 MathJax 快 **10 倍**），支持行内公式、块级公式、矩阵、积分等完整数学环境
- **Mermaid 图表** — 支持流程图、时序图、甘特图、类图、状态图、ER 图、饼图、思维导图、时间线等多种图表类型。GitHub/GitLab 原生语法，学会即用
- **Emoji 表情** — 遵循 GitHub 规范，`:smile:` 即时渲染
- **增强表格** — 多行表格、列合并（multimd-table）

### ⚡ 效率工具

- **AI 写作助手** — 内置 AI 辅助，智能续写和内容优化
- **图片管理器** — 拖放/粘贴截图自动插入，路径自动管理，无需手动配置。对 Hugo、Hexo、Jekyll、Zenn 等 SSG 开箱即用
- **文件管理系统** — 多文件、文件夹层级、LocalStorage 持久化存储
- **一键导出** — PDF 打印（保留格式和图表）、图片 PNG（html2canvas 渲染）、Markdown 源文件
- **TOC 自动生成** — 基于标题层级的目录导航
- **PWA 离线支持** — 首次访问后离线可用，移动端可添加到主屏幕

---

## 🚀 快速开始

```bash
pnpm install      # 推荐 pnpm，或 npm / yarn
npm run dev        # 启动 → http://localhost:5173
npm run build      # 生产构建
```

### 部署

| 平台 | 说明 |
|------|------|
| **Vercel**（推荐） | Fork → 导入 → 一键部署，自动 CDN + HTTPS |
| **Netlify** | 连接仓库，Build: `npm run build`，Publish: `docs` |
| **Cloudflare Pages** | 连接仓库，框架预设: `Vite` |
| **自部署** | 构建后托管 `docs/` 目录到 Nginx/Apache |

---

## 📚 技术栈

| 技术 | 角色 | 亮点 |
|------|------|------|
| **React 18** | UI 框架 | Concurrent 渲染 |
| **TypeScript** | 类型系统 | 静态类型安全 |
| **Vite** | 构建工具 | esbuild + Rollup，启动提速 10x+ |
| **Monaco Editor** | 编辑器内核 | VS Code 同款，Microsoft 开源 |
| **MobX** | 状态管理 | 响应式 TFRP |
| **Material-UI** | UI 组件 | Material Design 规范 |
| **markdown-it** | Markdown 解析 | 插件化架构，GitHub 7k+ ⭐ |
| **KaTeX** | 公式渲染 | 比 MathJax 快 10x，Khan Academy 出品 |
| **Mermaid** | 图表引擎 | GitHub 72k+ ⭐，文本驱动 |
| **Vite PWA** | 离线能力 | Service Worker + 缓存策略 |

---

## 🗺️ 路线图

**已完成** — Monaco 集成 · 文件管理 · LaTeX 渲染 · Mermaid 图表 · AI 助手 · PDF/图片/MD 导出 · 图片管理 · TOC · 多主题 · PWA

**开发中** — WebAssembly 脚本运行 · Jupyter 风格代码单元格

**计划中** — 实时协同编辑（WebSocket/WebRTC） · 云端同步（GitHub Gist / GitLab） · 高级 AI（总结/翻译/语法） · 插件系统

---

## ❓ FAQ

**Q: 和 VS Code 的 Markdown 编辑有什么不同？**

相同的 Monaco 内核，额外提供：默认实时预览、LaTeX/Mermaid、AI 助手、图片管理器、文件管理。**无需安装**。

**Q: 可以替代 Typora 吗？**

多数场景可以。Typora 已转为付费（$14.99），MarkdownOL 提供双栏即时反馈 + Monaco 级别的代码高亮和智能提示。完全开源免费。

**Q: 和 HackMD / StackEdit 有什么不同？**

HackMD 强在实时协同。MarkdownOL 强在编辑器内核（Monaco vs CodeMirror）、内置 AI 助手、图片管理、PWA 离线——这些是其他在线编辑器没有的。

**Q: 支持哪些图表？**

Mermaid 语法原生支持的图表均可渲染：流程图、时序图、甘特图、类图、状态图、ER 图、饼图、思维导图、时间线等。与 GitHub/GitLab/Notion 语法一致。

**Q: 图片怎么插入？怎么导出？**

Ctrl+V 粘贴或拖放自动插入，路径自动管理。导出支持 **PDF 打印**（保留格式）、**图片 PNG**（html2canvas）、**Markdown 源文件**。

**Q: 收费吗？数据安全吗？**

完全免费，MIT 开源。文档数据存储在浏览器 LocalStorage，不上传服务器。AI 功能会调用远程 API。移动端支持 PWA 离线使用。

---

## 🔗 链接

[在线体验](https://md.bigonion.cn) · [GitHub](https://github.com/LiWeny16/MarkdownOnline) · [作者主页](https://bigonion.cn) · [问题反馈](https://github.com/LiWeny16/MarkdownOnline/issues) · 📧 bigonion@bigonion.cn

---

## 📄 协议 · 致谢

本项目基于 [MIT](./LICENSE-MIT) 协议开源。Copyright (c) 2022-present Bigonion。

感谢贡献者：

<a href="https://github.com/LiWeny16/MarkdownOnline/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LiWeny16/MarkdownOnline&max=1000" />
</a>

感谢 [React](https://reactjs.org/) · [Monaco Editor](https://microsoft.github.io/monaco-editor/) · [Vite](https://vitejs.dev/) · [markdown-it](https://github.com/markdown-it/markdown-it) · [KaTeX](https://katex.org/) · [Mermaid](https://mermaid.js.org/) 等优秀开源项目。

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLiWeny16%2FMarkdownOnline.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FLiWeny16%2FMarkdownOnline?ref=badge_large&issueType=license)

---

<div align="center">

**如果对你有帮助，点个 ⭐️ 吧**

Made with ❤️ by [Bigonion](https://github.com/LiWeny16)

</div>
