import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import insertTextAtCursor, {
  insertTextMonacoAtCursor,
} from "@App/text/insertTextAtCursor"
import {
  fillInMemoryImg,
  fillInMemoryImgs,
  readMemoryImg,
} from "@App/textMemory/memory"
// import { editor } from "monaco-editor"

/**
 * @description handle native event
 */
export function monacoPasteEventNative(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {}

/**
 * @description monaco粘贴事件处理
 * @author bigonion
 * @param editor
 * @param monaco
 */
export function monacoPasteEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  editor.getContainerDomNode().addEventListener(
    "paste",
    (event) => {
      handlePasteEvent(event).then((base64Arr: any) => {
        if (base64Arr) {
          let insertImgText: string = ""
          let timeStamp = new Date().getTime()
          console.log(base64Arr)
          for (let i = 0; i <= base64Arr.length - 1; i++) {
            console.log(i)
            insertImgText += `![我是图片](/vf/${timeStamp + i})`
          }
          fillInMemoryImgs(base64Arr, timeStamp)
          insertTextMonacoAtCursor(insertImgText, true)
        }
      })
    },
    true
  )
}

/**
 * @deprecated
 */
export default function pasteEvent() {
  document.getElementById("md-area")!.addEventListener("paste", (e) => {
    handlePasteEvent(e).then((base64: any) => {
      if (base64) {
        // console.log(base64)
        let timeStamp = new Date().getTime()
        let insertImg = `![我是图片](/vf/${timeStamp})`
        fillInMemoryImg(base64, timeStamp)
        insertTextAtCursor(document.getElementById("md-area")!, insertImg)
      }
    })
  })
}

function handlePasteEvent(e: ClipboardEvent) {
  return new Promise((resolve) => {
    // 获取剪贴板
    let clipboardData = e.clipboardData || window.clipboardData
    let items = clipboardData.items
    const itemsLength = items.length
    let imageBase64Arr: any = []
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (item.kind == "file") {
        e.preventDefault()
        e.stopPropagation()
        let pasteFile = item.getAsFile()
        let reader = new FileReader()
        reader.onload = function (event) {
          imageBase64Arr.push(event.target!.result)
          // console.log(event.target!.result)
          // Resolve 只会传最后一次结果
          if (i === itemsLength - 1) {
            resolve(imageBase64Arr)
          }
        }
        // 将文件读取为BASE64格式字符串
        const fileType = pasteFile.type.split("/")[1]
        if (
          fileType === "png" ||
          fileType === "jpg" ||
          fileType === "jpeg" ||
          fileType === "webp" ||
          fileType === "svg"
        ) {
          reader.readAsDataURL(pasteFile)
        } 
      } else {
        resolve([])
      }
    }
  })
}
