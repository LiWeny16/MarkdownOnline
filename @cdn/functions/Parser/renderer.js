"use strict";
// /**
//  * @deprecated now
// */
// import regs from "@App/regs/regs"
// import { readMemoryImg } from "@App/memory/memory"
// import hljs from "@cdn-hljs"
// import { emojify, has } from "@cdn-node-emoji"
// const newTokenizer = {
//   heading(src: any) {
//     // console.log(heading);
//     const match = src.match(/^#{1,6}\s.*/)
//     return false
//   },
//   codespan(src: string) {
//     const match = src.match(/^\&+([^\&\n]+?)\&+/)
//     return false
//   },
// } // if (match) {
// //   return {
// //     type: 'codespan',
// //     raw: match[0],
// //     text: match[1].trim()
// //   };
// // }
// //#region *********************renderer*********************
// // console.log(emojiJson);
// export const newRenderer = {
//   paragraph(text: any) {
//     return `<p class="line-hilight">${text}</p>`
//   },
//   heading(text: string, level: any) {
//     // console.log(text,level);
//     return `
//             <h${level}  class="line-hilight">
//               <a href="#">
//                 <span class="header-link"></span>
//               </a>
//               ${text}
//             </h${level}>`
//   },
//   code(code: string, lang: string, _escaped: boolean) {
//     let finalCodeBlock
//     if (hljs.getLanguage(lang)) {
//       finalCodeBlock = `<pre><code class="language-${lang} ">${code}</code></pre>`
//     } else if (lang == "mermaid") {
//       finalCodeBlock = `<div class="language-mermaid language-plaintext">${code}</div>`
//     } else {
//       finalCodeBlock = `<pre><code class="language-plaintext">${code}</code></pre>`
//     }
//     return finalCodeBlock
//   },
//   /**
//    * 拓展图片
//    *
//    * @param href   图片路径
//    * @param _title null
//    * @param text   图片的名称
//    */
//   image(href: string | null, _title: string | null, text: string): any {
//     const grammar = "#"
//     let randon = Math.random()
//     let width = "auto" // 宽度
//     let style = "" // 样式
//     let position: Position = "L"
//     let tags: string[] = text.split(grammar)
//     if (tags.length > 1) {
//       for (let i = 0; i < tags.length; i++) {
//         let tag = tags[i]
//         if (tag === "s") {
//           style += "box-shadow: rgb(199 199 199) 1vh 2vh 21px"
//         }
//         if (tag === "s1") {
//           style += "box-shadow: rgb(146 146 146) 1vh 2vh 21px;"
//         }
//         if (tag === "s2") {
//           style += "box-shadow: rgb(32 32 32 / 86%) 1vh 2vh 21px"
//         }
//         if (tag === "C" || tag == "c") {
//           position = "C"
//         }
//         if (tag === "R" || tag == "r") {
//           position = "R"
//         }
//         if (tag.startsWith("w")) {
//           width = tags[i].substring(1)
//           if (!width.endsWith("%")) {
//             width += "px"
//           }
//         }
//       }
//     }
//     // return text
//     return `<div class="imgBox-r FLEX ${randon} ${
//       position == "C" ? " JUS-CENTER" : position == "R" ? "JUS-RIGHT" : ""
//     }" ><img class="img_resize_transition" width="${width}" style="${style}" src="${href}" alt="${text}"></div>`
//   },
// }
// export const headingRenderer = {
//   /**
//    * 标题解析为 TOC 集合, 增加锚点跳转
//    *
//    * @param text  标题内容
//    * @param level 标题级别
//    */
//   heading(text: any, level: number): string {
//     const realLevel = level
//     return `<h${realLevel} id="${realLevel}-${text}">${text}</h${realLevel}>`
//   },
// }
// // 定义目录结构
// export interface Toc {
//   name: string
//   id: string
//   level: number
// }
// export const initTocs = (id: string): Toc[] => {
//   // 获取指定ID，渲染后的html都在该标签内
//   let ele = document.getElementById(id)
//   if (ele == null || undefined) {
//     return []
//   }
//   let heads = document
//     .getElementById(id)!
//     .querySelectorAll("h1, h2, h3, h4, h5, h6")
//   let tocs: Toc[] = []
//   for (let i = 0; i < heads.length; i++) {
//     let head = heads[i]
//     let level = 1
//     let name = (head as HTMLElement).innerText
//     let id = head.id
//     switch (head.localName) {
//       case "h2":
//         level = 2
//         break
//       case "h3":
//         level = 3
//         break
//       case "h4":
//         level = 4
//         break
//     }
//     let toc: Toc = {
//       name: name,
//       id: id,
//       level: level,
//     }
//     tocs.push(toc)
//   }
//   return tocs
// }
// //#endregion
// //#region *********************extensions*********************
// export const importUrlExtension = {
//   extensions: [
//     {
//       name: "importUrl",
//       level: "block",
//       start(src: string | string[]) {
//         return src.indexOf("\n:")
//       },
//       tokenizer(src: string) {
//         const rule = /^:(https?:\/\/.+?):/
//         const match = rule.exec(src)
//         if (match) {
//           return {
//             type: "importUrl",
//             raw: match[0],
//             url: match[1],
//             html: "", // will be replaced in walkTokens
//           }
//         }
//       },
//       renderer(token: any) {
//         return `<iframe style="border:none" src="${token.url}" width="100%" height="100%"></iframe>`
//       },
//     },
//   ],
// }
// export const markItExtension = {
//   extensions: [
//     {
//       name: "markIt",
//       level: "inline", // Signal that this extension should be run inline
//       start(src: any) {
//         return src.match(/@@/)?.index
//       },
//       tokenizer(src: string, _tokens: any) {
//         const match = src.match(regs.markHighlight)
//         const text = match ? match[1] : ""
//         if (match) {
//           return {
//             type: "markIt",
//             raw: src,
//             text: text,
//           }
//         }
//       },
//       renderer(token: any) {
//         let renderText = token.raw.replace(
//           regs.markHighlight,
//           `<mark>${token.text}</mark>`
//         )
//         return `${renderText}`
//       },
//     },
//   ],
// }
// /**
//  * @description 注意！在这里如果不加extension进去，表示使用的是内在tokenizer或者renderer，那么就要放在extension里面
//  *  示例：
//  *   marked.use(
//       {
//         extensions: [customExtension],
//       }
//     )
//  * 但如果加入了extension 例如：markItExtension 就可以直接放进去，表示自定义tokenizer或者renderer
//  * 
//  * 
// */
// export const imgExtension = {
//   name: "newRenderer",
//   level: "block", // Signal that this extension should be run inline
//   tokenizer: newTokenizer,
//   renderer: newRenderer,
//   async: true, // needed to tell marked to return a promise
//   async walkTokens(token: ImageToken) {
//     if (token.type === "heading") {
//       // console.log({token:token})
//     }
//     if (token.type === "image") {
//       const href = token.href
//       // const title = token.title
//       if (href?.match(/vf/)) {
//         let imgId = (
//           href.match(/vf\/(\d+)/) ? href.match(/vf\/(\d+)/)![1] : 0
//         ).toString()
//         let imgBase64_: string = await readMemoryImg(
//           "uuid",
//           parseInt(imgId)
//         ).then((e) => {
//           return e[0] ? e[0].imgBase64 : 0
//         })
//         token.href = imgBase64_
//       }
//     } else if (token.type === "code") {
//       // eval
//       // console.log(token)
//     } else if (token.type === "importUrl") {
//       // console.log(token);
//     }
//   },
// }
// /**
//  * @deprecated
//  */
// export const clueExtension = {
//   extensions: [
//     {
//       name: "clue",
//       level: "inline", // Signal that this extension should be run inline
//       start(src: any) {
//         return src.match(/:/)?.index
//       },
//       tokenizer(src: string, _tokens: any) {
//         const match = src.match(regs.emoji)
//         if (match) {
//           return {
//             type: "clue",
//             raw: match[0],
//             text: match[1],
//           }
//         }
//         return false
//       },
//       renderer(token: any) {
//         if (has(token.raw)) {
//           return emojify(token.raw)
//         }
//         return token.raw
//       },
//     },
//   ],
// }
// export const emojiExtension = {
//   extensions: [
//     {
//       name: "emoji",
//       level: "inline", // Signal that this extension should be run inline
//       start(src: any) {
//         return src.match(/:/)?.index
//       },
//       tokenizer(src: string, _tokens: any) {
//         const match = src.match(regs.emoji)
//         if (match) {
//           return {
//             type: "emoji",
//             raw: match[0],
//             text: match[1],
//           }
//         }
//         return false
//       },
//       renderer(token: any) {
//         if (has(token.raw)) {
//           return emojify(token.raw)
//         }
//         return token.raw
//       },
//     },
//   ],
// }
// // #endregion
