// @ts-ignore
import MarkdownItIncrementalDOM from "markdown-it-incremental-dom"
import * as IncrementalDOM from "incremental-dom"
// import markdownIt from "markdown-it"
// import Token from "https://jsd.onmicrosoft.cn/npm/markdown-it@14.0.0/lib/token.mjs";
// import markdownItGithubToc from "markdown-it-github-toc"
import { figure } from "@mdit/plugin-figure"
import mermaid from "mermaid"
// import mermaid from "mermaid"
// import "https://cdn.bootcdn.net/ajax/libs/mermaid/10.2.0/mermaid.min.js"
// import mermaid from "https://cdn.bootcdn.net/ajax/libs/mermaid/10.4.0/mermaid.esm.min.mjs"
// import hljs from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js"
import hljs from "@cdn-hljs"
import "@cdn-katex"
// import {katex} from "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js"
import replaceAsync from "string-replace-async"
import { getMdTextFromMonaco } from "@App/text/getMdText"
// import { fillInMemoryImg, readMemoryImg } from "@App/textMemory/memory"
import pageBreaker from "@Func/Parser/pageBreaker"
import "../css/index.less"

// const span = new Token("span_open","span",1)
// console.log(span);

import { isSyntaxValid } from "@App/script"
import { markdownitLineNumber } from "@Func/Parser/mdItPlugin/lineNumber"
import { myPlugin } from "@Func/Parser/mdItPlugin/alertBlock"
import { markdownParser } from "@Func/Init/allInit"
import virtualFileSystem from "@Func/Parser/VFS"
import { readMemoryImg } from "@App/textMemory/memory"
import markdownIt from "markdown-it"
import prepareParser from "@Func/Parser/prepareParser/prepare"

// @ts-ignore
// window.md = markdownIt()
// window.mermaid = mermaid
/**
 * @description 拓展使能配置
 */
export const enObj = {
  //基础事件
  enMainConverter: true,
  enAboutBox: true,
  enPdfExport: true,
  //拓展事件
  enFastKey: true, //快捷键
  enScript: true, //允许脚本注入
  enHilightJs: true, //高亮代码
  enClue: false, //clueCSS写法
  enDragFile: true, //拖拽外部markdown
  enPasteEvent: true, //粘贴事件
  enVirtualFileSystem: false,
  enPageBreaker: true,
}
// 重写标题的渲染结果
// marked.use({ renderer: headingRenderer })

/**
 * @description 循环执行触发主解析事件流
 * @param {boolean} save
 */
export async function mdConverter(save: boolean = true) {
  let view: any = getMdTextFromMonaco()
  // enObj.enClue ? (view = await clueParser(view)) : 1
  enObj.enPageBreaker ? (view = pageBreaker(view)) : 1
  // enObj.enVirtualFileSystem ? (view = await virtualFileSystem(view)) : 1
  // view = await latexParse2(view)
  // view = await latexParse(view)
  // enObj.enScript ? enableScript(view) : console.log("fast scripts off")

  /**
   * @description 处理需要异步的信息
   * */
  let env = await prepareParser(view)

  IncrementalDOM.patch(
    document.getElementById("view-area") as HTMLElement,
    // @ts-ignore
    markdownParser().renderToIncrementalDOM(view, env)
  )
  enObj.enHilightJs ? hljs.highlightAll() : 1
}

/**
 * @description clue CSS HTML
 * @param {string} md
 */
function clueParser(md: any) {
  return new Promise(async (resolve) => {
    md = md.replace(/\n/g, "?br") //暂时替代换行符号
    // const regForEscape = /```(.*?)```/gs
    const reg1 = /".*?"\..*?\s/g //整个"content".CLASS 结构
    const reg2 = /".*?"/g //匹配 "之间"
    const reg3 = /\..*?\s/g //匹配class 的. 和空格之间 未反转前
    const reg3_reverse = /\s.*?\./g //匹配class 的. 和空格之间 反转
    const reg4 = /(?<=.).*?(?=\s)/g //匹配 . 和 空格之间 不包括. \s
    const reg5 = /(?<=").*(?=")/g //匹配"之间"不包括""
    if (md) {
      // if(md.match(regForEscape)){

      // }
      md = await replaceAsync(md, reg1, temp)
      async function temp(e: any, _seq: any) {
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
        content = content.replace(/\?br/g, "\n") //解除换行限制
        if (clueClass == "mermaid") {
          parsedHTML = `<div class="language-mermaid language-plaintext">${content}</div>`
        } else if (clueClass == "js" && enObj.enScript) {
          // console.log(content)
          if (isSyntaxValid(content)) {
            if (document.getElementById("unsafe_script")) {
              document.getElementById("unsafe_script")!.remove()
            }
            let script = document.createElement("script")
            script.setAttribute("type", "text/javascript")
            script.innerHTML = content
            script.id = "unsafe_script"
            document.documentElement.appendChild(script)
          }

          parsedHTML = ``
        } else {
          parsedHTML = `<div class="FLEX ${clueClass}">${content}</div>`
        }

        return parsedHTML
      }
    }
    md = md.replace(/\?br/g, "\n")
    resolve(md)
  })
}

function latexParse2(md: any, center = true) {
  md = md.replace(/\n/g, "<!br") //暂时替代换行符号
  return new Promise((resolve) => {
    let reg1 = /\$\$.*?\$\$/g //含有$的
    let reg2 = /(?<=(\$\$))(.+?)(?=(\$\$))/g
    if (md) {
      md = md.replace(reg1, (e: any) => {
        if (e.match(reg2)) {
          e = e.match(reg2)[0]
          e = e.replace(/\<\!br/g, "") //解除换行替代
        } else {
          return ""
        }
        // 官方示例API
        if (e) {
          //@ts-ignore
          var html = katex.renderToString(e, {
            throwOnError: false,
            strict: false,
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
function latexParse(md: any) {
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
        latex.forEach((ele: any, index: any) => {
          ele = ele.match(reg2)
          if (ele) {
            //@ts-ignore
            parsedTex[index] = katex.renderToString(ele[0], {
              throwOnError: false,
              strict: false,
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

// function getMdText() {
//   return document.getElementById("md-area").value
// }
function writeHiddenPre(text: any) {
  document.getElementById("view-area-hidden")!.innerHTML = text
}
function readHiddenPre() {
  return document.getElementById("view-area-hidden")!.innerHTML
}
function writePre(text: any) {
  // let iframe = document.getElementById("view-area") as HTMLIFrameElement
  // let doc = iframe.contentWindow?.document
  // doc?.open()
  // doc?.write(text)
  // doc?.close()
  document.getElementById("view-area")!.innerHTML = text
}

/**
 * @description 倒序
 * @params string
 * @returns reviser
 */
function reverseString(str: any) {
  return str.split("").reverse().join("")
}
