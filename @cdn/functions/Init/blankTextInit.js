import welcomeText from "@Asset/welcome.md?raw";
import welcomeTextEn from "@Asset/welcome-en.md?raw";
// import getMdText from "@App/text/getMdText"
import { readMemoryText } from "@App/memory/memory";
import { getSettings } from "@App/config/change";
// let welcomeText
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
                // 根据语言设置选择对应的欢迎文本
                const currentLanguage = getSettings().basic.language || "zh";
                const selectedWelcomeText = currentLanguage === "en" ? welcomeTextEn : welcomeText;
                // changeStatesMemorable({ memorable: { welcomeAnimationState: true } })
                // fetch(
                //   "https://jsd.onmicrosoft.cn/gh/LiWeny16/MarkdownOnline@main/src/assets/welcome.md"
                // )
                //   .then((response) => response.text())
                //   .then((md) => {
                //     welcomeText = welcomeText
                //     window.editor.setValue(welcomeText)
                //   })
                //   .catch((error) => {
                //     console.error("Error fetching markdown:", error)
                //   })
                window.editor.setValue(selectedWelcomeText);
                resolve();
            }
        });
    });
}
