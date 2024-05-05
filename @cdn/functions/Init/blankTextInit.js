// import welcomeText from "@Asset/welcome.md?raw"
// import getMdText from "@App/text/getMdText"
import { readMemoryText } from "@App/textMemory/memory";
let welcomeText;
/**
 * @description 初始化写字板
 */
export default function blankTextInit() {
    return new Promise((resolve) => {
        readMemoryText().then((list) => {
            if (list.length && list[0].contentText) {
                window.editor.setValue(list[0].contentText);
                resolve();
            }
            else {
                fetch("https://jsd.onmicrosoft.cn/gh/LiWeny16/MarkdownOnline@main/source/assets/welcome.md")
                    .then((response) => response.text())
                    .then((md) => {
                    welcomeText = md;
                    window.editor.setValue(welcomeText);
                })
                    .catch((error) => {
                    console.error("Error fetching markdown:", error);
                });
                resolve();
            }
        });
    });
}
