import hljs from "@cdn-hljs"
import { marked } from "@cdn-marked"
// import { marked } from "marked"
import mermaid from "@cdn-mermaid"
import blankTextInit from "./blankTextInit"
import { enObj, mdConverter } from "@Root/js"
import { Notification } from "@arco-design/web-react"
import kit from "@cdn-kit"
import { triggerConverterEvent } from "@Func/Events/convert"

// 创建renderer
// const renderer = new marked.Renderer();

// // // 重写代码块渲染函数
// renderer.code = function (code: any, language: string) {
//   if (language === 'mermaid') {
//     // 如果是mermaid代码块，将代码用<pre><code>标签包裹，并赋予class属性以便后续mermaid初始化
//     return `<pre><code class="mermaid">${code}</code></pre>`;
//   } else {
//     // 其他代码块按照默认渲染
//     return marked.Renderer.prototype.code.apply(this, arguments);
//   }
// };
// const md = marked.setOptions({ renderer });
const renderer = {
  heading(text: string, level: any) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-")

    return `
            <h${level}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`
  },
}
// 渲染markdown文本
// const html = md("\`\`\`mermaid\n nihao\`\`\`");
// console.log(html);
class settingsClass {
  constructor() {}
  markedInit() {
    marked.use({
      // renderer:renderer,
      mangle: false,
      headerIds: false,
      strict: false,
    })
    // marked.use({ renderer })
  }
  mermaidInit() {
    mermaid.initialize({
      securityLevel: "loose",
      startOnLoad: false,
      theme: "base",
    })
    mermaid.mermaidAPI.initialize({ startOnLoad: false })
  }
  hljsInit() {
    hljs.configure({
      ignoreUnescapedHTML: true,
    })
  }
  settingsAllInit() {
    this.markedInit()
    this.mermaidInit()
    this.hljsInit()
  }
  static newSettings() {
    return new this()
  }
}
/**
 * @description 初始化配置和事件初始化
 * @returns {void}
 */
export default function allInit(): void {
  /**@description Settings Init*/
  const settings = new settingsClass()
  settings.settingsAllInit()

  /**@description Input Area Init*/
  blankTextInit().then(() => {
    mdConverter()
    // kit.sleep(300).then(()=>{
    // })
  }) //初始化输入区域
  Notification.success({
    title: "已更新到最新版本",
    content: `当前版本:v1.3.0`,
    position: "bottomRight",
  })
  kit.sleep(250).then(() => {
    Notification.info({
      title: "版本新增特性",
      content: `Vscode编辑器`,
      position: "bottomRight",
    })
  })
  window.theme = "light"
  /***@description All Events */
  // enObj.enMainConverter
  //   ? triggerConverterEvent()
  //   : console.log("converter if off") //按下写字板触发事件
  // enObj.enPdfExport ? exportToPdfEvent() : console.log("pdf export is off") //导出PDF
  // enObj.enDragFile ? dragFileEvent() : console.log("dragFile is off") //开启拖拽事件
  // enObj.enAboutBox ? aboutBox() : console.log("aboutBox is off")
  // enObj.enFastKey ? enableFastKeyEvent() : console.log("fastKey is off") //开启快捷键事件
  // enObj.enPasteEvent ? pasteEvent() : console.log("Paste Event is off") //开启快捷键事件
}
