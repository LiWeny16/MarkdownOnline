import {
  openDB,
  getDataByIndex,
  cursorGetDataByIndex,
  addData,
  getDataByKey,
  cursorGetData,
  updateDB
} from "@App/db.js"
import welcomeText from "@Asset/welcome.md?raw"
// import getMdText from "@App/text/getMdText"
import { fillInMemoryText, readMemoryText } from "@App/textMemory/memory"
/**
 * @description 初始化写字板
 */
export default function blankTextInit() {
  return new Promise<void>((resolve) => {
    readMemoryText().then((list) => {
      if (list.length && list[0].contentText) {
        window.editor.setValue( list[0].contentText)
        resolve()
      } else {
        window.editor.setValue(welcomeText)
        resolve()
      }
    })
  })
}
