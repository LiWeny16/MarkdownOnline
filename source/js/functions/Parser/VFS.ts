import { readMemoryImg } from "@Func/App/textMemory/memory"
import replaceAsync from "string-replace-async"
/**
 * @description VFS
 */
export default function virtualFileSystem(md: any): any {
  return new Promise(async (resolve) => {
    const reg1 = /\!\[我是图片\]\(\/vf\/.*?\)/g //全部的
    const reg2 = /\d+/g
    if (md.match(reg1)) {
      md = await replaceAsync(md, reg1, async (e: string): Promise<string> => {
        let temp = e.match(reg2) ? e.match(reg2)![0] : "1"
        let temp2 = readMemoryImg("uuid", parseInt(temp)).then((e) => {
          if (e[0]) {
            return `![我是图片](${e[0].imgBase64})`
          } else {
            return `<div class="ERR">Err_VFS_ID</div>`
          }
        })
        return temp2
      })
    }
    resolve(md)
  })
}
