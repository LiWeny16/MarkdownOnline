import { getMdTextFromMonaco } from "@App/text/getMdText"
import {
  fillInMemoryText,
  readMemoryText,
  readMemoryImg,
} from "@App/memory/memory"
import { FileFolderManager, FileManager } from "./fileSystem/file"
import { getSettings, getStates } from "./config/change"
import alertUseArco from "./message/alert"
import { useTranslation } from "react-i18next"
import i18n from "i18next"
export default async function save(editor = null, message = true) {
  const t = i18n.t

  if (getStates().unmemorable.previewMode) {
    alertUseArco(t("t-preview-mode-error"), 2500, { kind: "error" })
    return
  }
  let text = getMdTextFromMonaco()
  let infoMsg = ""
  if (message && text != "null") {
    try {
      fillInMemoryText(text)
      if (getSettings().basic.fileEditLocal) {
        let fileManager = new FileManager()
        if (await fileManager.saveFileSilently(text)) {
          infoMsg = t("t-save-success-local")
        } else {
          infoMsg = t("t-save-success-browser-no-local")
        }
      } else {
        infoMsg = t("t-save-success-browser")
      }
      alertUseArco(infoMsg)
    } catch (error) {
      alertUseArco(t("t-rejection-error"), 2500, { kind: "error" })
    }
  } else {
    save()
  }
}

export async function isSaved() {
  return await readMemoryText().then((list) => {
    if (list && list.length > 0) {
      if (list[0]?.contentText === getMdTextFromMonaco()) {
        // 已保存
        return true
      } else {
        // 没保存
        return false
      }
    } else {
      // 没有数据，认为未保存
      return false
    }
  })
}
