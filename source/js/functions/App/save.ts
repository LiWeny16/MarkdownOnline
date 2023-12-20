// import {
//   openDB,
//   getDataByIndex,
//   cursorGetDataByIndex,
//   addData,
//   getDataByKey,
//   cursorGetData,
//   updateDB
// } from "@App/db.js"
import { Message } from "@arco-design/web-react"
import getMdText, { getMdTextFromMonaco } from "@App/text/getMdText"
import {
  fillInMemoryText,
  readMemoryText,
  readMemoryImg,
} from "@App/textMemory/memory"
export default function save(message = true) {
  let text = getMdTextFromMonaco()
  if (message && text != "null") {
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: "保存成功!",
      closable: true,
      duration: 2500,
      position: "top",
    })
    fillInMemoryText(text)
  } else {
    save()
  }
}

export async function isSaved() {
  return await readMemoryText().then((list) => {
    if (list) {
      if (list[0]?.contentText === getMdText()) {
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
