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
import getMdText from "@App/text/getMdText"
import {
  fillInMemoryText,
  readMemoryText,
  readMemoryImg
} from "@App/textMemory/memory"
export default (message = true) => {
  if (message) {
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: "保存成功!",
      closable: true,
      duration: 2500,
      position: "top"
    })
  }
  fillInMemoryText(getMdText()!)
  // readMemoryImg("users_img",1694491426117)
  // readMemoryText((list: any) => {
  //   console.log(list)
  // })
  // console.log(readMemoryText());
}

export async function isSaved() {
  return await readMemoryText().then((list) => {
    if (list) {
      if (list[0].contentText === getMdText()) {
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
