import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import { fillInMemoryImgs, } from "@App/memory/memory";
import { getSettings } from "@App/config/change";
import { FileFolderManager, supportedImageExtensions, } from "@App/fileSystem/file";
import { useImage } from "@Mobx/Image";
const basicStyle = getSettings().advanced.imageSettings.basicStyle;
const folderManager = new FileFolderManager();
const imageStore = useImage(); // 获取图片store实例
/**
 * @description handle native event
 */
export function monacoPasteEventNative(editor, monaco) { }
/**
 * @description monaco粘贴事件处理
 * @author bigonion
 * @param editor
 * @param monaco
 */
export function monacoPasteEvent(editor, monaco) {
    editor.getContainerDomNode().addEventListener("paste", async (event) => {
        await handlePasteEvent(event).then(async (base64Arr) => {
            let insertImgText = "";
            // console.log(base64Arr)
            if (base64Arr) {
                if (!folderManager.getTopDirectoryHandle() ||
                    getSettings().advanced.imageSettings.modePrefer === "vf") {
                    let timeStamp = new Date().getTime();
                    // console.log(base64Arr)
                    for (let i = 0; i <= base64Arr.length - 1; i++) {
                        insertImgText += `![${basicStyle}](/vf/${timeStamp + i})`;
                    }
                    fillInMemoryImgs(base64Arr, timeStamp);
                    // 刷新图片列表
                    imageStore.refreshImages();
                }
                else {
                    let path = getSettings().advanced.imageSettings.imgStorePath;
                    path =
                        path.slice(-1) === "/" ? path.slice(0, path.length - 1) : path;
                    for (let i = 0; i <= base64Arr.length - 1; i++) {
                        let maxNumber = await folderManager.writeBase64ImageFile(folderManager.getTopDirectoryHandle(), ".png", base64Arr[i], path);
                        insertImgText += `![${basicStyle}](.${path}/${maxNumber}.png)`;
                    }
                }
                insertTextMonacoAtCursor(insertImgText, true);
            }
        });
    }, true);
}
function handlePasteEvent(e) {
    return new Promise((resolve) => {
        // 获取剪贴板
        let clipboardData = e.clipboardData;
        let items = clipboardData.items;
        const itemsLength = items.length;
        let imageBase64Arr = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.kind == "file") {
                e.preventDefault();
                e.stopPropagation();
                let pasteFile = item.getAsFile();
                let reader = new FileReader();
                reader.onload = function (event) {
                    if (typeof event.target.result === "string") {
                        imageBase64Arr.push(event.target.result);
                    }
                    // console.log(event.target!.result)
                    // Resolve 只会传最后一次结果
                    if (i === itemsLength - 1) {
                        // console.log(imageBase64Arr);
                        resolve(imageBase64Arr);
                    }
                };
                // 将文件读取为BASE64格式字符串
                const fileType = pasteFile.type.split("/")[1];
                if (supportedImageExtensions.includes(fileType)) {
                    reader.readAsDataURL(pasteFile);
                }
            }
        }
    });
}
