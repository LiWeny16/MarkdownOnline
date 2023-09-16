// import { allInit, enObj, fillInRemeText, kit } from "@Root/js/index.js"
import save from "@App/save"
import replaceSelection from "@App/text/replaceText"
/**
 * @description 使能快捷键
 */
function enableFastKeyEvent() {
  document.addEventListener("keydown", (e) => {
    e.stopPropagation() //停止冒泡，向上传递事件
    // Ctrl + B 黑体
    let editor = document.getElementById("md-area")
    if (e.ctrlKey && e.key == "b") {
      replaceSelection(editor, "**", "**")
    }
    // Alt + C 中心
    if (e.key == "c" && e.altKey) {
      replaceSelection(editor, "<center>", "</center>")
    }
    if (e.ctrlKey && e.key == "s") {
      e.preventDefault()
      save()
    }
  })
}

export default enableFastKeyEvent
