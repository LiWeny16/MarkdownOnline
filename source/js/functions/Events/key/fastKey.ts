// import { allInit, enObj, fillInRemeText, kit } from "@Root/js/index.js"
import save from "@App/save"
import replaceSelection from "@App/text/replaceText"
import sound from "@App/sound/sound"
// import qiniuFileAPI from "@App/qiniu/index"
// import insertTextAtCursor from "@App/text/insertTextAtCursor"
/**
 * @description 使能快捷键
 */
function enableFastKeyEvent() {
  let recState = false
  let _rec: any
  document.addEventListener("keydown", (e) => {
    e.stopPropagation() //停止冒泡，向上传递事件
    // let editor = document.getElementById("md-area")
    
    // TAB
    if (e.key == "Tab") {
      e.preventDefault()
      // insertTextAtCursor(editor,"    ")
    }
    // if (e.ctrlKey && e.key == "v") {
    //   e.stopPropagation()
    //   e.preventDefault()
    //   console.log(e);
    // }
    // Ctrl + B 黑体
    if (e.ctrlKey && e.key == "b") {
      // replaceSelection(editor, "**", "**")
    }
    // Alt + C 中心
    if (e.key == "c" && e.altKey) {
      // replaceSelection(editor, "<center>", "</center>")
    }
    //  Ctrl+ S 保存
    if (e.ctrlKey && e.key == "s") {
      e.preventDefault()
      save()
    }
    // Ctrl + Alt + I
    if (e.key == "i" && e.altKey && e.ctrlKey) {
      if (recState) {
        _rec?.stop()
      } else {
        _rec = sound("zh-CN", true)
      }
      recState = !recState

      // console.log(rec.recognition);
    }
    if (e.key == "o" && e.altKey && e.ctrlKey) {
      // let rec = sound("zh-CN")
      // qiniuFileAPI()
      // console.log(rec.recognition)
    }
  })
}

export default enableFastKeyEvent
