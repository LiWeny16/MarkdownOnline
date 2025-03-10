import { FileFolderManager } from "@App/fileSystem/file"
import { readMemoryImg } from "@App/memory/memory"
import { markdownParser } from "@Func/Init/allInit"
import kit from "@cdn-kit"
import mermaid from "mermaid"
import { importRegex } from "../mdItPlugin/file"

/**
 * @description 预解析，来处理异步信息，因为markdown-it天然不支持异步
 * @returns env
 */
export default async function prepareParser(originalMd: string) {
  /**
   * 处理 PDF 文件的导入并生成 Base64 URL
   * @param {string} filePath - 文件路径
   * @returns {Promise<string>} - Base64 编码的 PDF URL
   */
  async function preparePDF(pdfToken: any) {
    try {
      const filePath = decodeURIComponent(pdfToken.content.slice(2))
      const folderManager = new FileFolderManager()

      // 确保目录句柄存在，然后读取文件内容
      if (folderManager.getTopDirectoryHandle()) {
        const pdfContent = await folderManager.readFileContent(
          folderManager.getTopDirectoryHandle()!,
          filePath,
          true
        )

        // 将 PDF 内容转换为 Base64 URL
        return `${pdfContent}`
      } 
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description 准备图片
   */
  async function prepareImage(imageToken: { attrGet: (arg0: string) => any }) {
    let src = imageToken.attrGet("src")
    if (src.startsWith("/vf/")) {
      let imgId = src.match(/\d+/)[0]
      return await readMemoryImg("uuid", parseInt(imgId)).then((e) => {
        return e[0].imgBase64
      })
    } else if (src.startsWith("./")) {
      const folderManager = new FileFolderManager()

      if (folderManager.getTopDirectoryHandle()) {
        return await folderManager.readFileContent(
          folderManager.getTopDirectoryHandle()!,
          decodeURIComponent(src).slice(2),
          true
        )
      }
    }
  }
  /**
   * @description 渲染mermaid, 等待更新，全量渲染性能消耗巨大
   */
  async function prepareMermaid(mermaidToken: { content: any }) {
    let src = mermaidToken.content
    let parsedSrc
    try {
      await mermaid.parse(src, { suppressErrors: false })
      if (await mermaid.parse(src, { suppressErrors: true })) {
        parsedSrc = await mermaid.render(
          `_mermaidSvg_${kit.getUUID().slice(0, 5)}`,
          src
        )
      }
      return parsedSrc!.svg
    } catch (error) {
      return `<pre class="ERR">${error}</pre>`
    }
  }
  /**
   * @description 预渲染设计思路，首先需要window._prepareData.envCache这个变量，并且是存储在indexedDB中的
   * 其次还需要window._prepareData.srcMap并且每次预渲染都要重建，在每次预渲染中比对srcMap的一致性，如果一致，
   * 那么直接沿用对应的上一次envCache对应的区域，如果不一致，那么更新为新的envCache。
   * python运行的结果则保存在envCache中，按钮逻辑里负责寻找是第几个python块就把他更新到对应位置envCache里就行。
   * 和mermaid不同，只有envCache被外部改变才会改变，也就是说python完全按照envCache当前值来渲染，预渲染并不会改变
   * 结果，因为**只有**按下运行按钮的时候，代码才会运行，与mermaid渲染逻辑略有区别，但总体结构设计基本一致。
   */

  let imageTokens: any = [] //用于保存提前解析出的图片token
  let mermaidTokens: any = []
  let pdfTokens: any = []
  let codeTokens: any = []
  let vfImgSrcArr = []
  let mermaidParsedArr = []
  let pdfParsedArr: any = []
  let md = markdownParser()

  md.renderer.rules.image = function (tokens, idx) {
    if (tokens[idx].attrGet("src")?.startsWith("/vf/")) {
      imageTokens.push(tokens[idx]) //存储图片token以供后续处理
    } else if (tokens[idx].attrGet("src")?.startsWith("./")) {
      imageTokens.push(tokens[idx]) //存储图片token以供后续处理
    }
    return ""
  }
  md.renderer.rules.fence = function (tokens, idx, option, env, slf) {
    const lang = tokens[idx].info
    if (lang === "mermaid") {
      mermaidTokens.push(tokens[idx])
      return ""
    } else if (lang === "py" || lang === "python") {
      codeTokens.push(tokens[idx])
    }
    return ""
  }
  md.renderer.rules["import_inline"] = function (tokens, idx, options, env) {
    if (tokens[idx].meta.extension === "pdf") {
      pdfTokens.push(tokens[idx])
    }
    return ""
  }
  md.render(originalMd, {}) //预先解析一次找出所有图片token
  for (const imageToken of imageTokens) {
    let temp = await prepareImage(imageToken) //异步获取图片链接并替换
    vfImgSrcArr.push(temp)
  }
  for (const mermaidToken of mermaidTokens) {
    let temp = await prepareMermaid(mermaidToken)
    mermaidParsedArr.push(temp)
  }
  for (const pdfToken of pdfTokens) {
    let temp = await preparePDF(pdfToken)
    pdfParsedArr.push(temp)
  }
  let env = {
    vfImgSrcArr: vfImgSrcArr,
    vfImgSeq: 0,
    mermaidParsedArr: mermaidParsedArr,
    mermaidSeq: 0,
    pdfParsedArr: pdfParsedArr,
    pdfSeq: 0,
  }
  return env
}

// function importInline(state:any, silent:any) {
//   const max = state.posMax;
//   const start = state.pos;

//   // 检查开头是否为 "@["
//   if (state.src.charCodeAt(start) !== 0x40 /* @ */) {
//     return false;
//   }
//   if (state.src.charCodeAt(start + 1) !== 0x5b /* [ */) {
//     return false;
//   }

//   // 找到闭合的 ']' 和 '('
//   const endBracket = state.src.indexOf("]", start + 2);
//   if (endBracket === -1) {
//     return false;
//   }
//   if (state.src.charCodeAt(endBracket + 1) !== 0x28 /* ( */) {
//     return false;
//   }

//   const endParen = state.src.indexOf(")", endBracket + 2);
//   if (endParen === -1) {
//     return false;
//   }

//   // 提取 [import] 和 (path) 内的内容
//   const match = importRegex.exec(state.src.slice(start, endParen + 1));
//   if (!match) {
//     return false;
//   }
//   if (!silent) {
//     const token = state.push("import_plugin_pre", "", 0);
//     token.content = match[2].trim(); // 这是文件路径等内容
//     token.meta = { filePath: token.content };

//     const extensionMatch = token.content.match(/\.(md|xlsx|csv|pdf)$/);
//     if (!extensionMatch) {
//       // 不支持的文件扩展名，可以选择忽略或处理为默认情况
//       return false;
//     }
//     const extension = extensionMatch[1];
//   }

//   // 更新解析位置
//   state.pos = endParen + 1;
//   return true;
// }
