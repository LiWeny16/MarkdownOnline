// 帮助目录的内容配置
export interface DirectoryItem {
  id: string;
  labelKey: string; // i18n key for title
  children?: DirectoryItem[];
}

export interface ContentSection {
  title: string;
  content: string[];
}

// 目录结构配置
export const directoryStructure: DirectoryItem[] = [
  {
    id: "0_1",
    labelKey: "directory.preface.title"
  },
  {
    id: "1_x",
    labelKey: "directory.basic.title",
    children: [
      { id: "1_1", labelKey: "directory.basic.paragraph" },
      { id: "1_2", labelKey: "directory.basic.lineBreak" },
      { id: "1_3", labelKey: "directory.basic.bold" },
      { id: "1_4", labelKey: "directory.basic.italic" },
      { id: "1_5", labelKey: "directory.basic.center" },
      { id: "1_6", labelKey: "directory.basic.customText" },
      { id: "1_7", labelKey: "directory.basic.exportPdf" },
    ],
  },
  {
    id: "2_x",
    labelKey: "directory.advanced.title",
    children: [
      { id: "2_1", labelKey: "directory.advanced.speechToText" },
      { id: "2_2", labelKey: "directory.advanced.aiAssistant" },
      { id: "2_3", labelKey: "directory.advanced.autoFormat" },
      { id: "2_4", labelKey: "directory.advanced.fileManager" },
      { id: "2_5", labelKey: "directory.advanced.imageUpload" },
      { id: "2_6", labelKey: "directory.advanced.syncScroll" },
      { id: "2_7", labelKey: "directory.advanced.emojiMarket" },
      { id: "2_8", labelKey: "directory.advanced.collaboration" },
      { id: "2_9", labelKey: "directory.advanced.tableBuilder" },
      { id: "2_10", labelKey: "directory.advanced.mindMap" },
      { id: "2_11", labelKey: "directory.advanced.doubleClick" },
    ],
  },
  {
    id: "3_x",
    labelKey: "directory.smart.title",
    children: [
      { id: "3_1", labelKey: "directory.smart.latex" },
      { id: "3_2", labelKey: "directory.smart.autoComplete" },
      { id: "3_3", labelKey: "directory.smart.settings" },
    ],
  },
];

// 中文内容
export const contentMapZh: { [key: string]: ContentSection } = {
  "0_1": {
    title: "前言",
    content: [
      "你好，朋友，欢迎来到 Markdown 入门指南。本教程将帮助你掌握 Markdown 的基本语法，以及一些进阶的黑科技技巧。",
      "其实要开始写markdown很简单，你可以退出指南，按下`Ctrl+J`一键呼出AI，或者在编辑区右键呼出菜单后，点击AskAI即可开始写作,别忘了写完后`Ctrl+S`保存文本到浏览器缓存。",
      "",
      "如果你喜欢这个编辑器，不妨给个Star呗，[Github](https://github.com/LiWeny16/MarkdownOnline?tab=readme-ov-file)"
    ]
  },
  "1_1": {
    title: "段落和标题",
    content: [
      "Markdown 段落的写法很简单，只需直接输入文本即可。例如：",
      "",
      "```\n这是一个段落。\n```",
      "",
      "段落之间需要空行，否则会被认为是同一段内容。",
      "",
      "标题更简单，对这一行按下`Ctrl+1`即可"
    ]
  },
  "1_2": {
    title: "换行",
    content: [
      "Markdown 默认不会自动换行，如果你想换行，可以使用 `<br>`。",
      "```\n这是第一行。<br>这是第二行。\n```",
    ]
  },
  "1_3": {
    title: "加粗",
    content: [
      "Markdown 可以使用 `**` 或 `__` 来加粗文本。例如：",
      "",
      "```\n**这是加粗的文本**\n```",
      "",
      "效果： **这是加粗的文本**",
    ]
  },
  "1_4": {
    title: "斜体",
    content: [
      "Markdown 使用 `*` 或 `_` 让文本变成斜体。例如：",
      "",
      "```\n*这是斜体文本*\n```",
      "",
      "效果： *这是斜体文本*",
    ]
  },
  "1_5": {
    title: "居中",
    content: [
      "在新的一行，按下`/`斜杠，输入any-center-text回车,即可得到居中文本",
      "同理,居右是这样写",
      "```\n<p style=\"text-align: right\">居右</p>\n```",
      "",
      "或者直接`Ctrl+E`进行居中，`Ctrl+R`进行居右"
    ]
  },
  "1_6": {
    title: "任意字体",
    content: [
      "在新的一行，按下`/`斜杠，输入any-text回车,即可得到你想要它什么样子他就是什么样子的文本了！",
    ]
  },
  "1_7": {
    title: "导出PDF",
    content: [
      "右上角更多按钮里有导出功能，或者直接使用快捷键`Ctrl+P`",
      "",
      "在导出PDF的时候你经常会发现分割页往往不尽人意，所以这里提供`/page-breaker`来分割每个页",
      "或者在需要分割的地方打出`|---|`即可",
    ]
  },
  "2_1": {
    title: "语音转文字",
    content: [
      "免费、不限时长、高准确率的语音转文字，还不快来试试！",
      "",
      "快捷键:`Ctrl+Alt+V`"
    ]
  },
  "2_2": {
    title: "AI智能助手",
    content: [
      "AI 可以帮助你自动生成 Markdown 格式的内容，例如自动排版、语法检查、代码格式化等。",
      "",
      "在任何时候，我都强烈推荐你询问AI具体的markdown语法是什么，这样更加高效",
      "",
      "快捷键：`Ctrl+J`"
    ]
  },
  "2_3": {
    title: "自动排版",
    content: [
      "Markdown 支持自动排版，可以使用工具如 `Prettier` 或 `Markdownlint` 来优化排版，使文档更易读。",
      "",
      "快捷键:`Shift+Alt+F`"
    ]
  },
  "2_4": {
    title: "文件管理器",
    content: [
      "编辑器引用了全新文件接口，可以直接对本地文件夹进行打开和修改，打开文件夹后，粘贴到编辑器的图片将会被自动保存到当前目录的image文件夹下",
      "",
      "快捷键:`Ctrl+Alt+F`(可能和微信冲突，请修改微信的热键)，或在右上角更多里打开"
    ]
  },
  "2_5": {
    title: "图片上传",
    content: [
      "简单易懂，复制图片文件然后粘贴到编辑器即可，若没有打开文件夹图片自动保存到浏览器缓存中",
      "",
      "图片可以批量复制上传，并且支持快捷键`Ctrl+E`调整居中，默认样式解释如下:",
      "",
      "> #w代表大小，#c代表居中(center)，\n#s代表阴影(shadow)，#r代表居右(right)"
    ]
  },
  "2_6": {
    title: "同步滚动",
    content: [
      "随时开启，高度智能的同步滚动算法，比起VScode降维打击的开关功能",
      "",
      "快捷键`Ctrl+Q`"
    ]
  },
  "2_7": {
    title: "表情包超市",
    content: [
      "表情包，任你挑选😍",
      "",
      "编辑区右键菜单，表情包超市"
    ]
  },
  "2_8": {
    title: "协同办公",
    content: [
      "两台设备同一个热点或支持内网共享的WIFI下(手机热点默认都支持)，即可急速分享文本和文件！",
      "",
      "在哪：右上角更多按钮，协同办公"
    ]
  },
  "2_9": {
    title: "表格",
    content: [
      "新的一行按下`/`，输入table即可看到动态表格功能！",
      "",
      "例如：`/table3` 创建3x3表格，`/table3x5` 创建3行5列表格",
      "",
      "支持任意行列数，如 `/table2`、`/table4x6` 等",
      "",
      "旧版本：编辑区按F1，输入table#3#2也依然可用"
    ]
  },
  "2_10": {
    title: "流程图，思维导图...",
    content: [
      "新的一行按下`/`输如mermaid即可看到联想的思维导图、流程图...等等",
    ]
  },
  "2_11": {
    title: "双击定位",
    content: [
      "双击右边渲染后文本，即可定位到左边原文本，太太太方便啦！！",
    ]
  },
  "3_1": {
    title: "LaTex数学公式",
    content: [
      "新起一行打`/latex`后回车，在latex中间按下`\\`即可开始享用智能语法提示！",
      "",
      "快捷键:`Ctrl+M`"
    ]
  },
  "3_2": {
    title: "智能提示",
    content: [
      "估计认真看过教程的你已经发现了，新的一行打一个`/`即可获得大量高频使用的markdown功能，有图片、公式、文本、流程图、列表...",
    ]
  },
  "3_3": {
    title: "设置",
    content: [
      "设置界面提供了双主题、以及一些高频使用的功能，如字体，语言等等",
    ]
  },
};

// 英文内容
export const contentMapEn: { [key: string]: ContentSection } = {
  "0_1": {
    title: "Preface",
    content: [
      "Hello, friend! Welcome to the Markdown Getting Started Guide. This tutorial will help you master the basic syntax of Markdown, as well as some advanced tips and tricks.",
      "Actually, getting started with Markdown is simple. You can exit the guide, press `Ctrl+J` to summon AI, or right-click in the editing area to bring up the menu and click AskAI to start writing. Don't forget to press `Ctrl+S` to save your text to browser cache when you're done.",
      "",
      "If you like this editor, please give it a Star! [Github](https://github.com/LiWeny16/MarkdownOnline?tab=readme-ov-file)"
    ]
  },
  "1_1": {
    title: "Paragraphs and Headers",
    content: [
      "Writing Markdown paragraphs is simple, just type text directly. For example:",
      "",
      "```\nThis is a paragraph.\n```",
      "",
      "Paragraphs need blank lines between them, otherwise they will be considered as the same content.",
      "",
      "Headers are even simpler, just press `Ctrl+1` on the line"
    ]
  },
  "1_2": {
    title: "Line Breaks",
    content: [
      "Markdown doesn't automatically break lines by default. If you want to break lines, you can use `<br>`.",
      "```\nThis is the first line.<br>This is the second line.\n```",
    ]
  },
  "1_3": {
    title: "Bold",
    content: [
      "Markdown can use `**` or `__` to make text bold. For example:",
      "",
      "```\n**This is bold text**\n```",
      "",
      "Effect: **This is bold text**",
    ]
  },
  "1_4": {
    title: "Italic",
    content: [
      "Markdown uses `*` or `_` to make text italic. For example:",
      "",
      "```\n*This is italic text*\n```",
      "",
      "Effect: *This is italic text*",
    ]
  },
  "1_5": {
    title: "Center Alignment",
    content: [
      "On a new line, press `/` slash, type any-center-text and hit Enter to get centered text",
      "Similarly, for right alignment:",
      "```\n<p style=\"text-align: right\">Right aligned</p>\n```",
      "",
      "Or directly use `Ctrl+E` for center, `Ctrl+R` for right alignment"
    ]
  },
  "1_6": {
    title: "Custom Font",
    content: [
      "On a new line, press `/` slash, type any-text and hit Enter to get text that looks exactly how you want it to!",
    ]
  },
  "1_7": {
    title: "Export PDF",
    content: [
      "Export function is available in the More button at the top right, or use the shortcut `Ctrl+P`",
      "",
      "When exporting PDF, you often find page breaks are not ideal, so here's `/page-breaker` to split pages",
      "Or type `|---|` where you need to split",
    ]
  },
  "2_1": {
    title: "Speech to Text",
    content: [
      "Free, unlimited duration, high accuracy speech-to-text. Come and try it!",
      "",
      "Shortcut: `Ctrl+Alt+V`"
    ]
  },
  "2_2": {
    title: "AI Smart Assistant",
    content: [
      "AI can help you automatically generate Markdown formatted content, such as auto-formatting, syntax checking, code formatting, etc.",
      "",
      "At any time, I strongly recommend asking AI about specific markdown syntax, which is more efficient",
      "",
      "Shortcut: `Ctrl+J`"
    ]
  },
  "2_3": {
    title: "Auto Formatting",
    content: [
      "Markdown supports auto-formatting. You can use tools like `Prettier` or `Markdownlint` to optimize formatting and make documents more readable.",
      "",
      "Shortcut: `Shift+Alt+F`"
    ]
  },
  "2_4": {
    title: "File Manager",
    content: [
      "The editor uses a brand new file interface that can directly open and modify local folders. After opening a folder, pasted images will be automatically saved to the image folder in the current directory",
      "",
      "Shortcut: `Ctrl+Alt+F` (may conflict with WeChat, please modify WeChat's hotkeys), or open it in the More menu at the top right"
    ]
  },
  "2_5": {
    title: "Image Upload",
    content: [
      "Simple and intuitive, copy image files and paste them into the editor. If no folder is opened, images are automatically saved to browser cache",
      "",
      "Images can be batch copied and uploaded, with shortcut `Ctrl+E` for center alignment. Default style explanation:",
      "",
      "> #w represents size, #c represents center,\n#s represents shadow, #r represents right alignment"
    ]
  },
  "2_6": {
    title: "Synchronized Scrolling",
    content: [
      "Always available, highly intelligent synchronized scrolling algorithm, a dimensional upgrade over VSCode's simple toggle function",
      "",
      "Shortcut: `Ctrl+Q`"
    ]
  },
  "2_7": {
    title: "Emoji Market",
    content: [
      "Emojis, pick whatever you like😍",
      "",
      "Right-click menu in editing area, Emoji Market"
    ]
  },
  "2_8": {
    title: "Collaboration",
    content: [
      "Two devices on the same hotspot or supported WIFI under the same network (default all phones support hotspots), can share text and files instantly!",
      "",
      "Where: More button at the top right, Collaboration"
    ]
  },
  "2_9": {
    title: "Tables",
    content: [
      "On a new line, press `/` and type table to see dynamic table features!",
      "",
      "Examples: `/table3` creates 3x3 table, `/table3x5` creates 3-row 5-column table",
      "",
      "Supports any row/column size like `/table2`, `/table4x6`, etc.",
      "",
      "Legacy version: Press F1 in editing area, type table#3#2 still works"
    ]
  },
  "2_10": {
    title: "Flowcharts, Mind Maps...",
    content: [
      "On a new line, press `/` and type mermaid to see suggestions for mind maps, flowcharts... and more",
    ]
  },
  "2_11": {
    title: "Double-click Positioning",
    content: [
      "Double-click on the rendered text on the right to locate the original text on the left. So convenient!!!",
    ]
  },
  "3_1": {
    title: "LaTeX Math Formulas",
    content: [
      "Start a new line, type `/latex` and hit Enter. Press `\\` in the latex environment to enjoy smart syntax suggestions!",
      "",
      "Shortcut: `Ctrl+M`"
    ]
  },
  "3_2": {
    title: "Smart Suggestions",
    content: [
      "If you've read the tutorial carefully, you've probably noticed that typing `/` on a new line gives you a lot of frequently used markdown features: images, formulas, text, flowcharts, lists...",
    ]
  },
  "3_3": {
    title: "Settings",
    content: [
      "The settings interface provides dual themes and some frequently used features, such as fonts, languages, etc.",
    ]
  },
};

// 获取当前语言的内容映射
export function getContentMap(language: string): { [key: string]: ContentSection } {
  return language === 'en' ? contentMapEn : contentMapZh;
}

// 渲染内容为markdown字符串
export function renderContent(sections: ContentSection[]): string[] {
  return sections.flatMap(section => [
    `# ${section.title}`,
    ...section.content
  ]);
} 