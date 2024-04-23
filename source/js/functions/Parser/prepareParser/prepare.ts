import { readMemoryImg } from "@App/textMemory/memory"
import { markdownParser } from "@Func/Init/allInit"
import kit from "@cdn-kit"
import mermaid from "mermaid"

/**
 * @description 预解析，来处理异步信息，因为markdown-it天然不支持异步
 * @returns env
 */
export default async function prepareParser(originalMd: string) {
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
  let imageTokens: any = [] //用于保存提前解析出的图片token
  let mermaidTokens: any = []
  let vfImgSrcArr = []
  let mermaidParsedArr = []
  let md = markdownParser()

  md.renderer.rules.image = function (tokens, idx) {
    if (tokens[idx].attrGet("src")?.startsWith("/vf/")) {
      imageTokens.push(tokens[idx]) //存储图片token以供后续处理
    }
    return ""
  }
  md.renderer.rules.fence = function (tokens, idx, option, env, slf) {
    if (tokens[idx].info === "mermaid") {
      mermaidTokens.push(tokens[idx])
      return ""
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
  let env = {
    vfImgSrcArr: vfImgSrcArr,
    vfImgSeq: 0,
    mermaidParsedArr: mermaidParsedArr,
    mermaidSeq: 0,
  }
  return env
}
