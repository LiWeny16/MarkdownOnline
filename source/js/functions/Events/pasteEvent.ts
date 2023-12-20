// import { allInit, kit, mdConverter } from "../index.js"

import insertTextAtCursor, {
  insertTextMonacoAtCursor,
} from "@App/text/insertTextAtCursor"
import { fillInMemoryImg, readMemoryImg } from "@App/textMemory/memory"
// import { editor } from "monaco-editor"

export function monacoPasteEvent() {
  // let isPasteForPic = false
  // window.editor.onDidPaste(() => {

  //   // if (isPasteForPic) {
  //   //   window.editor.getModel().undo()
  //   // }
  // })
  document.addEventListener("paste", (event) => {
    if (
      document.activeElement!.className == "inputarea monaco-mouse-cursor-text"
    ) {
      event.preventDefault()
      event.stopPropagation()
      pic2base64(event).then((base64: any) => {
        if (base64) {
          let timeStamp = new Date().getTime()
          let insertImg = `![我是图片](/vf/${timeStamp})`
          fillInMemoryImg(base64, timeStamp)
          insertTextMonacoAtCursor(insertImg)
        }
      })
    }
  })
}

export default function pasteEvent() {
  document.getElementById("md-area")!.addEventListener("paste", (e) => {
    pic2base64(e).then((base64: any) => {
      if (base64) {
        let timeStamp = new Date().getTime()
        let insertImg = `![我是图片](/vf/${timeStamp})`
        fillInMemoryImg(base64, timeStamp)
        insertTextAtCursor(document.getElementById("md-area")!, insertImg)
      }
    })
  })
}

function pic2base64(e: ClipboardEvent) {
  return new Promise((resolve) => {
    e.stopPropagation()
    // e.preventDefault();
    // 阻止粘贴
    // 获取剪贴板信息
    var clipboardData = e.clipboardData || window.clipboardData
    var items = clipboardData.items
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      if (item.kind == "file") {
        var pasteFile = item.getAsFile()
        var reader = new FileReader()
        reader.onload = function (event) {
          // 将结果显示在<textarea>中
          resolve(event.target!.result)
          //  console.log(event.target.result);
        }
        // 将文件读取为BASE64格式字符串
        reader.readAsDataURL(pasteFile)
        break
      } else {
        resolve("")
      }
    }
  })
}
