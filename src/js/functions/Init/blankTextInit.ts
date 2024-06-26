import welcomeText from "@Asset/welcome.md?raw"
// import getMdText from "@App/text/getMdText"
import { fillInMemoryText, readMemoryText } from "@App/memory/memory"
// let welcomeText

/**
 * @description 初始化写字板
 */
export default function blankTextInit() {
  return new Promise<void>((resolve) => {
    readMemoryText().then((list) => {
      if (list.length && list[0].contentText) {
        window.editor.setValue(list[0].contentText)
        resolve()
      } else {
        // fetch(
        //   "https://jsd.onmicrosoft.cn/gh/LiWeny16/MarkdownOnline@main/src/assets/welcome.md"
        // )
        //   .then((response) => response.text())
        //   .then((md) => {
        //     welcomeText = welcomeText
        //     window.editor.setValue(welcomeText)
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching markdown:", error)
        //   })
        window.editor.setValue(welcomeText)
        resolve()
      }
    })
  })
}
