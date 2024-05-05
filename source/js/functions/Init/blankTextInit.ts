// import welcomeText from "@Asset/welcome.md?raw"
// import getMdText from "@App/text/getMdText"
import { fillInMemoryText, readMemoryText } from "@App/textMemory/memory"

let welcomeText: string
/**
 * @description 初始化写字板
 */
export default function blankTextInit() {
  return new Promise<void>((resolve) => {
    fetch(
      "https://jsd.onmicrosoft.cn/gh/LiWeny16/MarkdownOnline@main/source/assets/welcome.md"
    )
      .then((response) => response.text())
      .then((md) => {
        welcomeText = md
      })
      .catch((error) => {
        console.error("Error fetching markdown:", error)
      })
    readMemoryText().then((list) => {
      if (list.length && list[0].contentText) {
        window.editor.setValue(list[0].contentText)
        resolve()
      } else {
        window.editor.setValue(welcomeText)
        resolve()
      }
    })
  })
}
