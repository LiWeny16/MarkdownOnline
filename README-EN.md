<div align="center">

# 🚀 Markdown Online Editor

**Monaco Kernel · Live Preview · LaTeX & Mermaid · AI Assistant · Free & Open Source**

[![Version](https://img.shields.io/badge/version-v3.0.0-blue.svg)](https://github.com/LiWeny16/MarkdownOnline)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE-MIT)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-Latest-0066cc.svg)](https://microsoft.github.io/monaco-editor/)

[🌐 Live Demo](https://md.bigonion.cn) · [📖 中文文档](./README.md) · [🐛 Report Bug](https://github.com/LiWeny16/MarkdownOnline/issues)

</div>

---

## 🤔 Why MarkdownOL?

There are plenty of Markdown editors — but every option forces a tradeoff. **VSCode preview won't auto-open**. **Typora now costs $14.99**. **HackMD requires internet**. **Obsidian has steep setup**.

MarkdownOL combines the **VSCode editing engine** with **dedicated writing-tool features** in a single browser tab:

| What you want | MarkdownOL | VSCode | Typora | HackMD |
|--------------|:---------:|:------:|:------:|:------:|
| VSCode-level editing | ✅ Monaco kernel | ✅ | ❌ | ❌ |
| Live preview by default | ✅ Auto side-by-side | ❌ Manual Ctrl+K V | ✅ WYSIWYG | ✅ |
| LaTeX math | ✅ KaTeX (fast) | ⚠️ Extension needed | ✅ | ✅ |
| Mermaid diagrams | ✅ Multiple types | ⚠️ Extension needed | ✅ | ⚠️ |
| AI writing assistant | ✅ Built-in | ⚠️ Copilot (paid) | ❌ | ❌ |
| Image drag & drop | ✅ Auto-managed | ⚠️ Config needed | ✅ | ❌ |
| Fully offline | ✅ PWA | ✅ | ✅ | ❌ |
| 🆓 100% free | ✅ MIT Open Source | ✅ | ❌ $14.99 | ✅ |

> **In one sentence**: VSCode editing power + Typora writing experience + zero install + 100% free and open source.

---

## ✨ Features

### 🎨 Editing Experience

- **Monaco Editor Kernel** — The same industrial-grade editor engine powering VS Code, used by **20+ million developers** worldwide. Full syntax highlighting, IntelliSense, multi-cursor editing, and code folding
- **Live Side-by-Side Preview** — Write on the left, rendered preview on the right with synchronized scrolling. Always on by default — no manual shortcut needed
- **100+ Language Highlighting** — Powered by highlight.js, covering JavaScript, TypeScript, Python, Rust, Go, Java, C++, SQL, and more
- **Dark & Light Themes** — Auto-follows system preference (`prefers-color-scheme`), with manual toggle

### 🧮 Content Authoring

- **LaTeX Math** — Rendered with **KaTeX** (developed by Khan Academy, **10x faster** than MathJax). Supports inline formulas, block equations, matrices, integrals, and complete math notation
- **Mermaid Diagrams** — Flowchart, Sequence, Gantt, Class, State, ER, Pie, Mind Map, Timeline, and more — using GitHub/GitLab native syntax
- **GitHub-Flavored Emoji** — `:rocket:` renders as 🚀
- **Enhanced Tables** — Multi-line tables with column spanning (multimd-table)

### ⚡ Productivity

- **AI Writing Assistant** — Built-in AI for smart autocompletion and content refinement
- **Image Manager** — Paste screenshots (Ctrl+V) or drag & drop images directly into the editor. Paths auto-managed — no `markdown.copyFiles.destination` config needed. Works out of the box with Hugo, Hexo, Jekyll, Zenn, and other static site generators
- **File System** — Multi-file, nested folders, LocalStorage persistence
- **One-Click Export** — PDF print (preserved formatting), PNG image (html2canvas), Markdown source
- **Auto TOC** — Table of contents generated from heading hierarchy
- **PWA Offline** — Works without internet after first visit. Add to home screen on mobile for a native app experience

---

## 🚀 Quick Start

```bash
pnpm install      # Recommended, or npm / yarn
npm run dev        # Start → http://localhost:5173
npm run build      # Production build
```

### Deploy

| Platform | How |
|----------|-----|
| **Vercel** (Recommended) | Fork → Import → One-click, auto CDN + HTTPS |
| **Netlify** | Connect repo, Build: `npm run build`, Publish: `docs` |
| **Cloudflare Pages** | Connect repo, framework preset: `Vite` |
| **Self-Hosted** | Build → serve `docs/` with Nginx or Apache |

---

## 📚 Tech Stack

| Technology | Role | Why |
|-----------|------|-----|
| **React 18** | UI Framework | Concurrent rendering |
| **TypeScript** | Type System | Compile-time safety |
| **Vite** | Build Tool | esbuild + Rollup, 10x+ faster dev startup |
| **Monaco Editor** | Editor Engine | Same core as VS Code, open-sourced by Microsoft |
| **MobX** | State Management | Transparent reactive programming (TFRP) |
| **Material-UI** | UI Components | Google Material Design |
| **markdown-it** | Parser | Plugin-based, 7k+ GitHub stars |
| **KaTeX** | Math Rendering | 10x faster than MathJax, built by Khan Academy |
| **Mermaid** | Diagram Engine | Text-driven, 72k+ GitHub stars |
| **Vite PWA** | Offline | Service Worker + cache strategy |

---

## 🗺️ Roadmap

**Done** — Monaco integration · File management · LaTeX (KaTeX) · Mermaid diagrams · AI assistant · PDF/image/MD export · Image manager · Auto TOC · Themes · PWA

**In Progress** — WebAssembly runtime · Jupyter-style code cells

**Planned** — Real-time collaboration (WebSocket/WebRTC) · Cloud sync (GitHub Gist / GitLab) · Advanced AI (summarize / translate / grammar) · Plugin system

---

## ❓ FAQ

**Q: How is this different from VSCode's Markdown editor?**

Same Monaco kernel. Plus: always-on live preview, LaTeX/Mermaid, AI assistant, image manager, file system. **Zero install**.

**Q: Can it replace Typora?**

For most use cases, yes. Typora is now paid ($14.99). MarkdownOL offers comparable split-pane feedback with stronger code highlighting (Monaco) and is free & open source.

**Q: How does it compare to HackMD / StackEdit?**

HackMD's edge is real-time collaboration. MarkdownOL's edge is the editor engine (Monaco vs CodeMirror), built-in AI assistant, image management, and PWA offline — features not found in other online editors.

**Q: What diagrams are supported?**

All Mermaid-native syntax: Flowchart, Sequence, Gantt, Class, State, ER, Pie, Mind Map, Timeline, and more. Same syntax as GitHub/GitLab/Notion.

**Q: How do I insert images? How do I export?**

Paste (Ctrl+V) or drag & drop for images — paths auto-managed. Export to **PDF print** (preserved formatting), **PNG image** (html2canvas), or **Markdown source**.

**Q: Pricing? Data privacy?**

Free, MIT open source. Documents stored in browser LocalStorage — no server upload. AI features call a remote API. PWA-enabled for offline use on desktop and mobile.

---

## 🔗 Links

[Live Demo](https://md.bigonion.cn) · [GitHub](https://github.com/LiWeny16/MarkdownOnline) · [Author](https://bigonion.cn) · [Report Issue](https://github.com/LiWeny16/MarkdownOnline/issues) · 📧 bigonion@bigonion.cn

---

## 📄 License & Acknowledgments

MIT License. Copyright (c) 2022-present Bigonion.

Thanks to all contributors:

<a href="https://github.com/LiWeny16/MarkdownOnline/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LiWeny16/MarkdownOnline&max=1000" />
</a>

Built on the shoulders of [React](https://reactjs.org/) · [Monaco Editor](https://microsoft.github.io/monaco-editor/) · [Vite](https://vitejs.dev/) · [markdown-it](https://github.com/markdown-it/markdown-it) · [KaTeX](https://katex.org/) · [Mermaid](https://mermaid.js.org/).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLiWeny16%2FMarkdownOnline.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FLiWeny16%2FMarkdownOnline?ref=badge_large&issueType=license)

---

<div align="center">

**If this helps you, please give it a ⭐️**

Made with ❤️ by [Bigonion](https://github.com/LiWeny16)

</div>
