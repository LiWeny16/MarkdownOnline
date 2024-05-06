import MarkdownIt from "markdown-it/lib"
// import { escapeHtml } from "markdown-it/lib/common/utils"
// import { RenderRule } from "markdown-it/lib/renderer"
// import { escapeHtml } from "https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/lib/common/utils.mjs/+esm"
let cluePlugin = function (md: MarkdownIt) {
  function tagReplace(state: {
    tokens: any
    Token: any
  }) {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "inline") {
        let children = tokens[i].children
        for (let j = 0; j < children.length; j++) {
          const token = children[j]
          if (token.type === "text" && token.content) {
            const text = token.content
            const match = text.match(/\^(.*?)\^(.*?)\#$/)
            if (match) {
              // 创建新的 token 替换当前的 text token
              const token = new state.Token("html_block", "", 0)
              token.content = `<div class="${match[2]}">${md.render(match[1])}</div>`
              children[j] = token
              // 由于我们已经替换了当前的 token，所以跳过下一个 token 的处理
              j++
            }
          }
        }
      }
    }
  }

  // 在 Markdown-it 解析链中注册这个函数
  md.core.ruler.push("my_rule1", tagReplace)
  md.inline.ruler.before("emphasis", "mark", (state, silent) => {
    // console.log(state, silent)
    return false
  })
  // md.core.ruler.push("pl", (state) => {
  //   // console.log(state)
  //   // let tokens = state.tokens
  //   let tokens = state.tokens
  //   for (let i = 0; i < tokens.length; i++) {
  //     let token = tokens[i]!
  //     if (tokens[i].type !== "inline") {
  //       continue
  //     }

  //     for (let j = 0; j < token.children!.length; j++) {
  //       let child = token.children![j]
  //       if (child.type === "text") {
  //         // console.log(child)
  //         let match = child.content.match(/^\^(.*?)\^\.([a-zA-Z]+)$/)
  //         // if (match) {
  //         //   let content = child.content.match(/^\^(.*?)\^\.([a-zA-Z]+)$/)![1]
  //         //   let tag = child.content.match(/^\^(.*?)\^\.([a-zA-Z]+)$/)![2]
  //         //   child.content = child.content.replace(
  //         //     /^\^(.*?)\^\.([a-zA-Z]+)$/,
  //         //     escapeHtml(`<div class="${tag}">${content}</div>`)
  //         //   )
  //         // }
  //       }
  //     }
  //   }
  // })
}

export { cluePlugin }
