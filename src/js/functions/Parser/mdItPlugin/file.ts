import { FileFolderManager } from "@App/fileSystem/file"
import MarkdownIt from "markdown-it/lib"
export const importRegex = /^@\[(import)\]\(([^)]+)\)$/

const importFilePlugin = function importPlugin(md: MarkdownIt) {
  const pdfStyle = `
border: none;
height: 89svh;
`
  function importInline(state: any, silent: boolean) {
    const max = state.posMax
    const start = state.pos

    // 检查开头是否为 "@["
    if (state.src.charCodeAt(start) !== 0x40 /* @ */) {
      return false
    }
    if (state.src.charCodeAt(start + 1) !== 0x5b /* [ */) {
      return false
    }

    // 找到闭合的 ']' 和 '('
    const endBracket = state.src.indexOf("]", start + 2)
    if (endBracket === -1) {
      return false
    }
    if (state.src.charCodeAt(endBracket + 1) !== 0x28 /* ( */) {
      return false
    }

    const endParen = state.src.indexOf(")", endBracket + 2)
    if (endParen === -1) {
      return false
    }

    // 提取 [import] 和 (path) 内的内容
    const match = importRegex.exec(state.src.slice(start, endParen + 1))
    if (!match) {
      return false
    }

    if (!silent) {
      const token = state.push("import_inline", "", 0)
      const filePath = match[2].trim()
      const extensionMatch = filePath.match(/\.(md|xlsx|csv|pdf)$/)

      if (!extensionMatch) {
        return false
      }

      token.content = filePath
      token.meta = { extension: extensionMatch[1] }
    }

    // 更新解析位置
    state.pos = endParen + 1
    return true
  }

  // 在内联规则中注册插件，确保在其他内联规则之前处理
  md.inline.ruler.before("emphasis", "import_plugin", importInline)

  md.renderer.rules["import_inline"] = function (tokens, idx, options, env) {
    const token = tokens[idx]
    const filePath = token.content
    const extension = token.meta.extension

    // 确保 pdfBase64 是完整的 data URL
    const pdfBase64 = `${env.pdfParsedArr[0]}`
    let returnString
    if (pdfBase64.length > 10) {
      // 正确使用 src 属性嵌入 Base64 PDF
      returnString = `<embed onload="(()=>{Array.from(document.getElementsByClassName('pdf-preview')).forEach(e=>e.style.width=document.getElementById('view-area').clientWidth-20+'px')})()" class="pdf-preview" style="${pdfStyle}" src="${pdfBase64}"></embed>`
    } else {
      returnString = `<div>PDF loading...</div>`
    }

    // <iframe src="${pdfBase64}" width="100%" height="100%"></iframe>

    return returnString
  }
}
// <embed name="357AEDA64D3719C6AC6C259FFC2A222C" style="position:absolute; left: 0; top: 0;" width="100%" height="100%" src="about:blank" type="application/pdf" internalid="357AEDA64D3719C6AC6C259FFC2A222C">
export default importFilePlugin
