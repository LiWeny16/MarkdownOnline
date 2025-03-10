import { getTheme } from "@App/config/change"
import hljs from "@cdn-hljs"
import MarkdownIt from "markdown-it/lib"


let codePlugin = function (md: MarkdownIt) {
  const oldRender = md.renderer.rules.code_block!
  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    // console.log(tokens.length,idx)
    let line
    if (tokens[idx].map && tokens[idx].level === 0) {
      line = tokens[idx].map![0]
      tokens[idx].attrSet("data-line", String(line))
    }
    let language = tokens[idx].info
    let content = tokens[idx].content
    /**
     * @description 这里必须要替换，不然incremental-dom会报错
     */
    content = content.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    if (language === "mermaid") {
      if (env.mermaidParsedArr) {
        return `<div data-line="${line}" class="language-mermaid language-plaintext">
        ${env.mermaidParsedArr[env.mermaidSeq++]}
        </div>`
      }
    } else if (hljs.getLanguage(language)) {
      return `<pre class="language-code" data-line="${line}"><code class="language-${language} ${getTheme() === "light" ? "" : "hljs-dark"}">${content}</code></pre>`
    } else {
      return `<div class="code-container" data-line="${line}">
      <pre><code class="language-plaintext">${content}</code></pre>
    </div>`
    }
    // 使用老的渲染函数来渲染图片
    return oldRender(tokens, idx, options, env, self)
  }
}

export { codePlugin }
// <div id="markdown-it-code-button">${ButtonComponent}</div>
