import { Message } from "@arco-design/web-react"
import { getMdTextFromMonaco } from "@App/text/getMdText"
import {
  fillInMemoryText,
  readMemoryText,
  readMemoryImg,
} from "@App/textMemory/memory"
import { FileManager } from "./fileSystem/file"
import { getSettings } from "./config/change"
export default async function save(editor = null, message = true) {
  let text = getMdTextFromMonaco()
  let infoMsg = ""
  if (message && text != "null") {
    fillInMemoryText(text)
    if (getSettings().basic.fileEditLocal) {
      const fileManager = new FileManager(window._fileHandle)
      if (await fileManager.saveFileSilently(text)) {
        infoMsg = "成功保存到本地！"
      } else {
        infoMsg = "成功保存到浏览器！(未打开本地文件)"
      }
    } else {
      infoMsg = "成功保存到浏览器！"
    }
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: infoMsg,
      closable: true,
      duration: 2500,
      position: "top",
    })
  } else {
    save()
  }
}

export async function isSaved() {
  return await readMemoryText().then((list) => {
    if (list) {
      if (list[0]?.contentText === getMdTextFromMonaco()) {
        // 已保存
        return true
      } else {
        // 没保存
        return false
      }
    } else {
      return false
    }
  })
}
