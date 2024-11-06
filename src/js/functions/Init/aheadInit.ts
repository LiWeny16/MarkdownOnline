import {
  changeSettings,
  getStatesMemorable,
  getTheme,
} from "@App/config/change"
import getLang from "@App/user/langugae"
import kit from "@cdn-kit"

const aheadInit = () => {
  // languageInit()
  kit.addStyle(`
    ::selection {
      border-radius: 5px;
      background-color: ${getTheme() === "light" ? "#add6ff" : "#636363"};
    }
    // .markdown-body {
    // font-family: "Times New Roman", serif; /* 默认字体设为 Times New Roman */
    // }

    // .markdown-body :lang(zh) {
    //     font-family: "SimSun", "宋体", serif; /* 中文字体设为宋体 */
    // }
    `)
}

// const languageInit = () => {
//   if (!getStatesMemorable().memorable.languageChanged) {
//     changeSettings({ basic: { language: getLang() } })
//   }
// }
export { aheadInit }
