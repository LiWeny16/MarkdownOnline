import aboutBox from "./functions/Events/aboutBox"
import dragFileEvent from "./functions/Events/dragFile"
import pasteEvent from "./functions/Events/pasteEvent"
import welcomeText from "../assets/welcome.md?raw"
import { marked } from "https://npm.elemecdn.com/marked/lib/marked.esm.js"
import mermaid from "https://npm.elemecdn.com/mermaid@10/dist/mermaid.esm.min.mjs"
// import "https://cdn.bootcdn.net/ajax/libs/mermaid/10.2.0/mermaid.min.js"
// import mermaid from "https://cdn.bootcdn.net/ajax/libs/mermaid/10.4.0/mermaid.esm.min.mjs"
import kit from "https://npm.elemecdn.com/bigonion-kit@0.11.0/esm/esm-kit.mjs"
// import hljs from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js"
import hljs from "https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js"
import "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.js"
// import {katex} from "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js"
import replaceAsync from "string-replace-async"
import getMdText from "@App/text/getMdText"
import blankTextInit from "@Root/js/functions/Init/blankTextInit"
import { fillInMemoryImg, readMemoryImg } from "@App/textMemory/memory"
import pageBreaker from "@Func/Parser/pageBreaker"
import virtualFileSystem from "@Func/Parser/VFS"
import "../css/index.less"
import { Notification } from "@arco-design/web-react"
// import "https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/default.min.css"
/**
 * @description 拓展使能配置
 * @type {Boolean}
 */
export { kit, marked, hljs }
export const enObj = {
  //基础事件
  enMainConverter: true,
  enAboutBox: true,
  enPdfExport: true,
  //拓展事件
  enFastKey: true, //快捷键
  enScript: true, //允许脚本注入
  enHilightJs: true, //高亮代码
  enClue: true, //clueCSS写法
  enDragFile: true, //拖拽外部markdown
  enPasteEvent: true, //粘贴事件
  enVirtualFileSystem: true,
  enPageBreaker: true
}
window.onload = () => {
  // 等待React 渲染完成
  kit.sleep(300).then(() => {
    allInit()
  })
}
/**
 * @description 初始化配置和事件初始化
 * @returns {void}
 */
export function allInit() {
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
    content: `当前版本:v1.0.1`,
    position: "bottomRight"
  })
  kit.sleep(200).then(() => {
    Notification.info({
      title: "版本新增特性",
      content: `完善图片管理器、修复mermaid闪烁bug`,
      position: "bottomRight"
    })
  })

  /***@description All Events */
  enObj.enMainConverter
    ? triggerConverterEvent()
    : console.log("converter if off") //按下写字板触发事件
  // enObj.enPdfExport ? exportToPdfEvent() : console.log("pdf export is off") //导出PDF
  // enObj.enDragFile ? dragFileEvent() : console.log("dragFile is off") //开启拖拽事件
  // enObj.enAboutBox ? aboutBox() : console.log("aboutBox is off")
  // enObj.enFastKey ? enableFastKeyEvent() : console.log("fastKey is off") //开启快捷键事件
  // enObj.enPasteEvent ? pasteEvent() : console.log("Paste Event is off") //开启快捷键事件
}

/**
 * @description 循环执行触发主解析事件流
 * @param {boolean} save
 */
export async function mdConverter(save = true) {
  //按键触发，主函数
  let view = getMdText()
  enObj.enClue ? (view = await clueParser(view)) : console.log("clue off")

  enObj.enPageBreaker
    ? (view = pageBreaker(view))
    : console.log("page breaker off")
  enObj.enVirtualFileSystem
    ? (view = await virtualFileSystem(view))
    : console.log("VFS off")
  view = await latexParse2(view)
  view = await latexParse(view)
  view = markedParse(view)
  enObj.enScript ? enableScript(view) : console.log("fast scripts off")

  writeHiddenPre(view)
  // save ? restoreText() : 1
  await mermaid.run({
    querySelector: ".mermaid",
    suppressErrors: true
  })
  writePre(readHiddenPre())
  enObj.enHilightJs ? hljs.highlightAll() : console.log("hilight off")
}
/**
 * @description 初始化设置类
 */
class settingsClass {
  constructor() {}
  markedInit() {
    marked.use({
      mangle: false,
      headerIds: false,
      strict: false
    })
  }
  mermaidInit() {
    mermaid.initialize({
      securityLevel: "loose",
      startOnLoad: false,
      theme: "base"
    })
    mermaid.mermaidAPI.initialize({ startOnLoad: false })
  }
  hljsInit() {
    hljs.configure({
      ignoreUnescapedHTML: true
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
 * @description clue CSS HTML
 * @param {string} md
 */
function clueParser(md) {
  return new Promise(async (resolve) => {
    md = md.replace(/\n/g, ">br") //暂时替代换行符号
    const reg1 = /".*?"\..*?\s/g //整个"content".CLASS 结构
    const reg2 = /".*?"/g //匹配 "之间"
    const reg3 = /\..*?\s/g //匹配class 的. 和空格之间 未反转前
    const reg3_reverse = /\s.*?\./g //匹配class 的. 和空格之间 反转
    const reg4 = /(?<=.).*?(?=\s)/g //匹配 . 和 空格之间 不包括. \s
    const reg5 = /(?<=").*(?=")/g //匹配"之间"不包括""
    if (md) {
      md = await replaceAsync(md, reg1, temp)
      async function temp(e, seq) {
        var parsedHTML = "f"
        var content
        var clueClass
        if (e.match(reg2)) {
          content = e.match(reg5)[0]
        }
        if (e.match(reg3)) {
          e = reverseString(e)
          // console.log(e.match(reg4))
          clueClass = e.match(reg3_reverse)[0]
          clueClass = reverseString(clueClass)
          clueClass = clueClass.replace(/(\s)|(\.)/g, "")
          // clueClass = clueClass.match(reg4)[0]
        }
        // console.log(content);
        // console.log(clueClass);
        content = content.replace(/\>br/g, "\n") //解除换行限制
        if (clueClass == "mermaid") {
          // parsedHTML = `<pre class="${clueClass}">${content}</pre>`
          // try {
          //   parsedHTML = `${await mermaidParse2(content, seq)}`
          // } catch (error) {
          //   // parsedHTML = `<div class="RED">${error}</div>`
          //   parsedHTML =
          //     "<div class='RED P5'> MERMAID ERROR! </div>  " +
          //     `<pre><code class="language-js hljs language-javascript"><span class="hljs-number">${error}</span></code></pre>`
          // }
          parsedHTML = `<div class="${clueClass}">${content}</div>`
        } else {
          parsedHTML = `<div class="${clueClass}">${markedParse(content)}</div>`
        }

        return parsedHTML
      }
    }
    md = md.replace(/\>br/g, "\n")
    resolve(md)
  })
}
/**
 * @description asyncParser2
 * @param {string} content
 * @param {string} seq
 * @returns {Promise<string>}
 */
async function mermaidParse2(content, seq) {
  const isValid = await mermaid.parse(content)
  if (isValid) {
    const { svg } = await mermaid.mermaidAPI.render("seq_" + seq, content)
    return svg
  } else {
    return "err"
  }
}
function latexParse2(md, center = true) {
  md = md.replace(/\n/g, "<!br") //暂时替代换行符号
  return new Promise((resolve) => {
    let reg1 = /\$\$.*?\$\$/g //含有$的
    let reg2 = /(?<=(\$\$))(.+?)(?=(\$\$))/g
    if (md) {
      md = md.replace(reg1, (e) => {
        if (e.match(reg2)) {
          e = e.match(reg2)[0]
          e = e.replace(/\<\!br/g, "") //解除换行替代
        } else {
          return ""
        }
        // 官方示例API
        if (e) {
          var html = katex.renderToString(e, {
            throwOnError: false,
            strict: false
          })
          if (center) {
            html = `<center>${html}</center>`
          }
          return html
        } else {
          return ""
        }
      })
      md = md.replace(/\<\!br/g, "\n") //解除换行替代
      resolve(md)
    } else {
      resolve(md)
    }
  })
}
function latexParse(md) {
  return new Promise((resolve) => {
    let reg1 = /\$.*?\$/g //含有$的
    let reg2 = /(?<=\$)(.+?)(?=\$)/g
    let parsedTex = new Array()
    let origin = md
    let latex = md.match(reg1)
    // let latexIndex = getRegIndex(md, reg1)
    let finalResult = ""

    // let result
    if (latex) {
      try {
        latex.forEach((ele, index) => {
          ele = ele.match(reg2)
          if (ele) {
            parsedTex[index] = katex.renderToString(ele[0], {
              throwOnError: false,
              strict: false
            })
          } else {
            parsedTex[index] = "<span style='color:#cc0000;'>ERR_NULL</span>"
            // resolve(origin)
          }
        })
        // 取出来之后
        md = md.replace(reg1, "<!temp?.!>")
        md = md.split("<!temp?.!>")
        parsedTex = [...parsedTex, ""]
        // debugger
        for (let i = 0; i <= md.length - 1; i++) {
          finalResult += md[i] + parsedTex[i]
          // console.log(finalResult);
          if (i == md.length - 1) {
            resolve(finalResult)
          }
        }
      } catch (err) {
        console.log(err)
        return 5
      }
    } else resolve(origin)
  })
}
function markedParse(md) {
  return marked.parse(md)
}
// function getMdText() {
//   return document.getElementById("md-area").value
// }
function writeHiddenPre(text) {
  document.getElementById("view-area-hidden").innerHTML = text
}
function readHiddenPre() {
  return document.getElementById("view-area-hidden").innerHTML
}
function writePre(text) {
  document.getElementById("view-area").innerHTML = text
}

// function getRememberText() {
//   let text = kit.getCookie("contentText").replace(/\<\? br \?\>/g, "\n")
//   text = text.replace(/\<\? semicolon \?\>/g, ";")
//   return text
// }
// function restoreText() {
//   let md = getMdText()
//   md = md.replace(/\n/g, "<? br ?>")
//   md = md.replace(/\;/g, "<? semicolon ?>")
//   kit.setCookie("contentText", md, 30, "/", "md.bigonion.cn")
//   kit.setCookie("contentText", md, 30, "/", "127.0.0.1")
// }
// export function fillInRemeText() {
//   let text = getRememberText()
//   writeMdText(text)
//   return text
// }
function getRegIndex(text, regex) {
  // const text = '$匹配我$ $匹配我$ 不要匹配我 $匹配我$'
  // const regex = /\$(.*?)\$/g
  const result = Array.from(text.matchAll(regex), (match) => match.index)
  return result
}
// print 函数

// 快捷键
// /**
//  * @description 使能快捷键
//  */
// function enableFastKeyEvent() {
//   document.addEventListener("keydown", (e) => {
//     e.stopPropagation()//停止冒泡，向上传递事件
//     // Ctrl + B 黑体
//     let editor = document.getElementById("md-area")
//     if (e.ctrlKey && e.key == "b") {
//       replaceSelection(editor, "**", "**")
//     }
//     if (e.key == "c" && e.altKey) {
//       replaceSelection(editor, "<center>", "</center>")
//     }
//     if(e.ctrlKey && e.key=="s" ){
//       e.preventDefault()
//       console.log(e);
//     }
//   })
// }
/**
 * @description 使能脚本注入
 */
function enableScript(md) {
  md = md ? md.match(/(?<=(\<script\>))(.+?)(?=(\<\/script\>))/g) : ""
  if (md) {
    md.forEach((e) => {
      e = e.match(/alert\(.*?\)/g) ? "" : e
      eval(e)
    })
  }
}

// /**
//  * @description 替换选中文本
//  * @param e HTMLelement
//  * @param leftStr String
//  * @param rightStr String
//  */
// export function replaceSelection(e, leftStr, rightStr) {
//   var start = e.selectionStart
//   var end = e.selectionEnd
//   // console.log(start, end)
//   if (start == end) {
//     return ""
//   } else {
//     let temp =
//       e.value.substr(0, start) +
//       leftStr +
//       e.value.substring(start, end) +
//       rightStr +
//       e.value.substring(end, e.value.length)
//     e.value = temp
//     // console.log(e.value.substring(start, end))
//     // console.log(e.value.substring(start, end).length)
//     // 移动光标
//     e.setSelectionRange(start, end + leftStr.length + rightStr.length)
//   }
// }
// /**
//  * @description 插入文本
//  */
// export function insertTextAtCursor(textElement, textToInsert) {
//   const startPos = textElement.selectionStart
//   const endPos = textElement.selectionEnd

//   textElement.value =
//     textElement.value.substring(0, startPos) +
//     textToInsert +
//     textElement.value.substring(endPos)

//   textElement.selectionStart = startPos + textToInsert.length
//   textElement.selectionEnd = startPos + textToInsert.length

//   textElement.focus()
// }
/**
 * @description 倒序
 * @params string
 * @returns reviser
 */
function reverseString(str) {
  return str.split("").reverse().join("")
}

function triggerConverterEvent() {
  document.getElementById("md-area").addEventListener("keyup", () => {
    mdConverter()
  })
  document.getElementById("md-area").addEventListener("blur", () => {
    mdConverter()
  })
}
// /**
//  * @description 初始化写字板
//  */
// function blankTextInit() {
//   openDB("md_content", 2).then((db) => {
//     let initData = {
//       uuid: new Date().getTime(),
//       contentText: getMdText()
//     }
//     // addData(db, "users", data)
//     // getDataByKey(db, "users", 1691843289748)
//     // updateDB(db, "users", data)
//     cursorGetData(db, "users")
//     getDataByIndex(db, "users", "contentText", "123")
//     // cursorGetDataByIndex(db, "users", "uuid", 2)
//   })
//   if (kit.getCookie("contentText")) {
//     //有cookie
//     fillInRemeText()
//   } else {
//     //否则显示教程
//     writeMdText(welcomeText)
//   }
// }
