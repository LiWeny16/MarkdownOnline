import { Message } from "@arco-design/web-react"
import { getMdTextFromMonaco } from "@App/text/getMdText"
import {
  fillInMemoryText,
  readMemoryText,
  readMemoryImg,
} from "@App/textMemory/memory"
import { FileManager } from "./fileSystem/file"
import { getSettings } from "./config/change"
import alertUseArco from "./message/alert"
export default async function save(editor = null, message = true) {
  let text = getMdTextFromMonaco()
  let infoMsg = ""
  if (message && text != "null") {
    try {
      fillInMemoryText(text)
      if (getSettings().basic.fileEditLocal) {
        const fileManager = new FileManager(window._fileHandle)
        if (await fileManager.saveFileSilently(text)) {
          infoMsg = "成功保存到本地！🎉"
        } else {
          infoMsg = "成功保存到浏览器！🎉(未打开本地文件)"
        }
      } else {
        infoMsg = "成功保存到浏览器！🎉"
      }
      alertUseArco(infoMsg)
    } catch (error) {
      alertUseArco("你竟敢拒绝我。", 2500, { kind: "error" })
    }
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
