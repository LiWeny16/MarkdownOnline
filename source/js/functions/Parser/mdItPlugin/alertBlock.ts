import MarkdownIt from "markdown-it/lib"
import { RenderRule } from "markdown-it/lib/renderer"

let myPlugin = function (md: MarkdownIt) {
  // 添加myrule规则
  // md.renderer.rules.text = function (tokens, idx, options, env, slf) {
  //   var token = tokens[idx]
  //   // console.log(tokens);
  //   // 这是一个示例，实际情况下一定要根据你的需求处理token
  //   return md.renderer.rules.code_block!(tokens, idx, options, env, slf)
  //   // return slf.renderToken(tokens, idx, options)
  // }

  // 然后需要在解析规则中对应处理 "myrule"
  md.core.ruler.before("inline","myrule", function (state) {
    var tokens = state.tokens
    // console.log(tokens)
    // 遍历所有的token，找出需要使用myrule渲染规则的token
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].content && tokens[i].content.indexOf("MYRULE") !== -1) {
        // tokens[i].type = "myrule" // 设置该token的类型为'myrule'
        // tokens[i].content = "test" // 设置该token的类型为'myrule'
        // tokens[i].tag = "span"
      }
    }
  })

  // var originalRender = md.renderer.rules.heading_open || function(tokens, idx, options, env, self) {
  //     return self.renderToken(tokens, idx, options, env, self);
  // }

  // md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
  //     tokens[idx+1].content = tokens[idx+1].content.toUpperCase();

  //     // 应用原本的规则
  //     return originalRender(tokens, idx, options, env, self);
  // }

  // md.inline.ruler.text
  // let _originText =
  //   md.renderer.rules.text ||
  //   function (tokens, idx, options, env, self) {
  //     return self.renderToken(tokens, idx, options, env, self)
  //   }
  // md.renderer.rules.text = function (tokens, idx, options, env, slf) {
  //   // _originText
  //   // console.log(tokens[idx].content)
  //   // console.log({idx1:idx});
  //   tokens[idx].content = tokens[idx].content.replace(/:\)/g, "😀")
  //   return _originText(tokens, idx, options, env, slf)
  // }
  // 添加自定义规则
  // md.core.ruler.push("my_smiley_rule", function (state) {
    // let tokens = state.tokens
  //   // console.log({tokens2:tokens})
    // for (let i = 0; i < tokens.length; i++) {
    //   if (tokens[i].type !== "inline") {
    //     continue
    //   }
    //   let token = tokens[i]

    //   for (let j = 0; j < token.children.length; j++) {
    //     let child = token.children[j]
    //     if (child.type === "text") {
    //       child.content = child.content.replace(/:\)/g, "😀")
    //     }
    //   }
    // }
  // })
  // console.log(md.renderer.rules["my_smiley_rule"])
  // md.renderer.rules.strong_open = (tokens, idx, options, env, self) => {
  //   return "<b>"
  // }
}

export { myPlugin }
