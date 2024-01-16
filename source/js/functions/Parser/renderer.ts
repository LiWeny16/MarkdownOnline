import { marked } from "@cdn-marked"

export const headingRenderer = {
  /**
   * 标题解析为 TOC 集合, 增加锚点跳转
   *
   * @param text  标题内容
   * @param level 标题级别
   */
  heading(text: any, level: number): string {
    const realLevel = level
    return `<h${realLevel} id="${realLevel}-${text}">${text}</h${realLevel}>`
  },
}

// 定义目录结构
export interface Toc {
  name: string
  id: string
  level: number
}

export const initTocs = (id: string): Toc[] => {
  // 获取指定ID，渲染后的html都在该标签内
  let ele = document.getElementById(id)
  if (ele == null || undefined) {
    return []
  }
  let heads = document
    .getElementById(id)!
    .querySelectorAll("h1, h2, h3, h4, h5, h6")
  let tocs: Toc[] = []
  for (let i = 0; i < heads.length; i++) {
    let head = heads[i]
    let level = 1
    let name = (head as HTMLElement).innerText
    let id = head.id
    switch (head.localName) {
      case "h2":
        level = 2
        break
      case "h3":
        level = 3
        break
      case "h4":
        level = 4
        break
    }
    let toc: Toc = {
      name: name,
      id: id,
      level: level,
    }
    tocs.push(toc)
  }
  return tocs
}
