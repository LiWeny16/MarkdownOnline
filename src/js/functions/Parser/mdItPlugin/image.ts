import MarkdownIt from "markdown-it/lib"

let imagePlugin = function (md: MarkdownIt) {
  const oldRender = md.renderer.rules.image!
  // 添加 Markdown 渲染前的预处理
  md.core.ruler.before("normalize", "replace_spaces_in_image_src", (state) => {
    // 遍历所有 token 并替换图片路径中的空格
    state.src = state.src.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (match, alt, src) => {
        // 替换路径中的空格为 %20
        const encodedSrc = src.replace(/ /g, "%20")
        return `![${alt}](${encodedSrc})`
      }
    )
  })
  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const grammar = "#"
    let src = token.attrs![token.attrIndex("src")][1]
    let alt = token.content

    if (token && token.attrGet("src")?.startsWith("/vf/")) {
      if (env.vfImgSrcArr) {
        // token.attrSet("src", env.vfImgSrcArr[env.vfImgSeq++])
        src = env.vfImgSrcArr[env.vfImgSeq++]
      }
    } else if (token && token.attrGet("src")?.startsWith("./")) {
      src = env.vfImgSrcArr[env.vfImgSeq++]
    }
    let width = "auto" // 宽度
    let style = "" // 样式
    let position: Position = "L"
    let tags: string[] = alt.split(grammar)
    if (tags.length > 1) {
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]
        if (tag === "s") {
          style += "box-shadow: rgb(199 199 199) 1vh 2vh 21px"
        }
        if (tag === "s1") {
          style += "box-shadow: rgb(146 146 146) 1vh 2vh 21px;"
        }
        if (tag === "s2") {
          style += "box-shadow: rgb(32 32 32 / 86%) 1vh 2vh 21px"
        }
        if (tag === "C" || tag == "c") {
          position = "C"
        }
        if (tag === "R" || tag == "r") {
          position = "R"
        }
        if (tag.startsWith("w")) {
          width = tags[i].substring(1)
          if (!width.endsWith("%")) {
            width += "px"
          }
        }
      }
    }

    return `<div class="imgBox-r FLEX  ${
      position == "C" ? " JUS-CENTER" : position == "R" ? "JUS-RIGHT" : ""
    }" ><img class="img_resize_transition" width="${width}" style="${style}" src="${src}" alt="${alt}">
    </div>`
  }
}

export { imagePlugin }
