import {
  openDB,
  getDataByIndex,
  cursorGetDataByIndex,
  addData,
  getDataByKey,
  cursorGetData,
  updateDB
} from "@App/db.js"
import getMdText from "@App/text/getMdText"

export function fillInMemoryText(md: MD) {
  openDB("md_content", 2).then((db: DB) => {
    let data = {
      uuid: 1,
      contentText: md
    }
    // addData(db, "users", data)
    // getDataByKey(db, "users", 1691843289748)
    updateDB(db, "users_md", data)
    // getDataByIndex(db, "users", "contentText", "123")
    // cursorGetDataByIndex(db, "users", "uuid", 2)
  })
}
export async function readMemoryText(): Promise<any> {
  return new Promise((resolve) => {
    openDB("md_content", 2).then((db: DB) => {
      // addData(db, "users", data)
      // getDataByKey(db, "users", 1691843289748)
      // updateDB(db, "users", data)
      cursorGetData(db, "users_md").then((list:Array<any>)=>{
        resolve(list)
      })
      // getDataByIndex(db, "users", "contentText", "123")
      // cursorGetDataByIndex(db, "users", "uuid", 2)
    })
  })
}
export function fillInMemoryImg(base64: string, timeStamp: number) {
  openDB("md_content", 2).then((db: DB) => {
    let data: ImgData = {
      uuid: timeStamp,
      imgBase64: base64
    }
    updateDB(db, "users_img", data)
  })
}

export async function readMemoryImg(
  indexName: any,
  indexValue: any
): Promise<any> {
  return new Promise((resolve) => {
    openDB("md_content", 2).then((db: DB) => {
      // cursorGetData(db, "users_img", processList)
      cursorGetDataByIndex(db, "users_img", indexName, indexValue).then(
        (list: Array<any>) => {
          resolve(list)
        }
      )
    })
  })
}
