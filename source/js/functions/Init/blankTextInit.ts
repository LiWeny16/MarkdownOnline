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
import getMdText from "@App/text/getMdText"
import { fillInMemoryText, readMemoryText } from "@App/textMemory/memory"
import { allInit, kit, mdConverter } from "@Root/js/index.js"
/**
 * @description 初始化写字板
 */
export default function blankTextInit() {
  let editor = document.getElementById("md-area") as HTMLInputElement
  return new Promise<void>((resolve) => {
    readMemoryText((list: Array<any>) => {
      if (list.length && list[0].contentText) {
        // do sth...
        readMemoryText((list: any) => {
          editor.value = list[0].contentText
          resolve()
        })
      } else {
        // init
        editor.value = welcomeText
        resolve()
      }
    })
  })
}
