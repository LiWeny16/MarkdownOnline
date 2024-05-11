// import { allInit, enObj, fillInRemeText, kit } from "@Root/js/index.js"
import save from "@App/save";
import exeSyncScrollAction from "./actions/syncScroll";
import exeFileManagerAction from "./actions/fileManager";
// import voice from "@App/voice/sound"
// import qiniuFileAPI from "@App/qiniu/index"
// import insertTextAtCursor from "@App/text/insertTextAtCursor"
/**
 * @description 使能快捷键
 */
function enableFastKeyEvent() {
    let recState = false;
    let _rec;
    document.addEventListener("keydown", (e) => {
        // Ctrl + Q
        if (e.ctrlKey && e.key == "q") {
            // replaceSelection(editor, "**", "**")
            e.stopPropagation(); //停止冒泡，向上传递事件
            e.preventDefault();
            exeSyncScrollAction(window.editor, window.monaco);
        }
        if (e.ctrlKey && (e.altKey || e.shiftKey) && e.key == "f") {
            e.stopPropagation(); //停止冒泡，向上传递事件
            e.preventDefault();
            exeFileManagerAction(window.editor, window.monaco);
        }
        // Alt + C 中心
        if (e.key == "c" && e.altKey) {
            // replaceSelection(editor, "<center>", "</center>")
        }
        //  Ctrl+ S 保存
        if (e.ctrlKey && e.key == "s") {
            e.stopPropagation(); //停止冒泡，向上传递事件
            e.preventDefault();
            save();
        }
        // Ctrl + Alt + I
        if (e.key == "i" && e.altKey && e.ctrlKey) {
        }
        if (e.key == "o" && e.altKey && e.ctrlKey) {
        }
    }, true);
}
export default enableFastKeyEvent;
