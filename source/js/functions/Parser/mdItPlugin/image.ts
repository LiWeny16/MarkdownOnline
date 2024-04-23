import MarkdownIt from "markdown-it/lib"
import { RenderRule } from "markdown-it/lib/renderer"

let imagePlugin = function (md: MarkdownIt) {
  const oldRender = md.renderer.rules.image!
  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const grammar = "#"
    // let line
    // if (tokens[idx].map && tokens[idx].level === 0) {
    //   line = tokens[idx].map![0]
    //   // tokens[idx].attrJoin("class", "line")
    //   tokens[idx].attrSet("data-line", String(line))
    // }
    let src = token.attrs![token.attrIndex("src")][1]
    let alt = token.content
    // console.log(alt.split("#"));

    if (token && token.attrGet("src")?.startsWith("/vf/")) {
      if (env.vfImgSrcArr) {
        // token.attrSet("src", env.vfImgSrcArr[env.vfImgSeq++])
        src = env.vfImgSrcArr[env.vfImgSeq++]
      }
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
