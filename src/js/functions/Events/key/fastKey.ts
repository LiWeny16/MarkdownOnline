// import { allInit, enObj, fillInRemeText, kit } from "@Root/js/index.js"
import save from "@App/save"
import replaceSelection from "@App/text/replaceText"
import exeSyncScrollAction from "./actions/syncScroll"
import exeFileManagerAction from "./actions/fileManager"
import exeAskAI from "./actions/askAI"
import exeSpeechPanelAction from "./actions/speechPanel"
// import qiniuFileAPI from "@App/qiniu/index"
// import insertTextAtCursor from "@App/text/insertTextAtCursor"
/**
 * @description 使能快捷键
 */
function enableFastKeyEvent() {
  document.addEventListener(
    "keydown",
    (e) => {
      // 同步滚动
      if (e.ctrlKey && e.key.toLowerCase() == "q") {
        e.stopPropagation() //停止冒泡，向上传递事件
        e.preventDefault()
        exeSyncScrollAction(window.editor, window.monaco)
      }
      // 文件管理器
      if (e.ctrlKey && (e.altKey || e.shiftKey) && e.key.toLowerCase() == "f") {
        e.stopPropagation() //停止冒泡，向上传递事件
        e.preventDefault()
        exeFileManagerAction(window.editor, window.monaco)
      }
      //  保存
      if (e.ctrlKey && e.key.toLowerCase() == "s") {
        e.stopPropagation() //停止冒泡，向上传递事件
        e.preventDefault()
        save()
      }
      if (e.ctrlKey && e.key.toLowerCase() == "j") {
        e.stopPropagation() //停止冒泡，向上传递事件
        e.preventDefault()
        exeAskAI(window.editor, window.monaco)
        // save()
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() == "v") {
        e.stopPropagation() //停止冒泡，向上传递事件
        e.preventDefault()
        exeSpeechPanelAction(window.editor, window.monaco)
      }
    },
    true
  )
}

export default enableFastKeyEvent
