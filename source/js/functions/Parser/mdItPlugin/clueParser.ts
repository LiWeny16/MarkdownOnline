import MarkdownIt from "markdown-it/lib"

let cluePlugin = function (md: MarkdownIt) {
  // 编写插件

  function tagReplace(state: { tokens: any; Token: any }) {
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
}
function customAlignPlugin(md: MarkdownIt) {
  // 添加一个新的渲染规则
  md.core.ruler.push("custom_align", function (state) {
    let addClass: string | null = null // 用于跟踪是否需要添加类

    state.tokens.forEach((token, index) => {
      if (token.type === "paragraph_open") {
        // 在段落开始时检查下一个inline token
        let nextToken = state.tokens[index + 1]
        if (nextToken && nextToken.type === "inline") {
          nextToken.children!.forEach((child) => {
            if (child.type === "text") {
              const text = child.content
              const lastTwoChars = text.slice(-2)

              switch (lastTwoChars) {
                case "||":
                  child.content = text.slice(0, -2) // 删除最后两个字符
                  addClass = "C"
                  break
                case ">>":
                  child.content = text.slice(0, -2) // 删除最后两个字符
                  addClass = "R"
                  break
              }
            }
          })
        }
      }

      // 如果需要添加类，更新当前paragraph_open token
      if (addClass && token.type === "paragraph_open") {
        token.attrPush(["class", addClass])
        addClass = null // 重置标志
      }
    })
  })
}
function customAlignPluginHeading(md: MarkdownIt) {
  // 添加一个新的渲染规则
  md.core.ruler.push("custom_align_heading", function (state) {
    let addClass: string | null = null // 用于跟踪是否需要添加类

    state.tokens.forEach((token, index) => {
      if (token.type === "heading_open") {
        // 在段落开始时检查下一个inline token
        let nextToken = state.tokens[index + 1]
        if (nextToken && nextToken.type === "inline") {
          nextToken.children!.forEach((child) => {
            if (child.type === "text") {
              const text = child.content
              const lastTwoChars = text.slice(-2)

              switch (lastTwoChars) {
                case "||":
                  child.content = text.slice(0, -2) // 删除最后两个字符
                  addClass = "C"
                  break
                case ">>":
                  child.content = text.slice(0, -2) // 删除最后两个字符
                  addClass = "R"
                  break
              }
            }
          })
        }
      }

      // 如果需要添加类，更新当前paragraph_open token
      if (addClass && token.type === "heading_open") {
        token.attrPush(["class", addClass])
        addClass = null // 重置标志
      }
    })
  })
}
export { cluePlugin, customAlignPlugin, customAlignPluginHeading }
