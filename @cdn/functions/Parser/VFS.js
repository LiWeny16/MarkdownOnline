import { readMemoryImg } from "@App/memory/memory";
import replaceAsync from "string-replace-async";
/**
 * @description VFS
 */
export default function virtualFileSystem(md) {
    return new Promise(async (resolve) => {
        const reg1 = /\!\[.*?\]\(\/vf\/.*?\)/g; //全部的
        // console.log(md.match(reg1));
        const reg2 = /\d+/g; //匹配数字
        const reg3 = new RegExp(/\[(.*?)\]/);
        const regSrc = new RegExp(/\((.*?)\)/);
        if (md.match(reg1)) {
            // e是匹配到的img 整体
            md = await replaceAsync(md, reg1, async (e) => {
                let title = e.match(reg3) ? e.match(reg3)[1] : "";
                let src = e.match(regSrc) ? e.match(regSrc)[1] : "";
                let imgId = src.match(reg2) ? src.match(reg2)[0] : "1";
                // console.log({ src: src, title: title, imgId: imgId })
                let temp2 = readMemoryImg("uuid", parseInt(imgId)).then((e) => {
                    if (e[0]) {
                        return `![${title}](${e[0].imgBase64})`;
                    }
                    else {
                        return `<div class="ERR">Err_VFS_ID</div>`;
                    }
                });
                return temp2;
            });
        }
        resolve(md);
    });
}
