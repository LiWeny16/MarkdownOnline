import {
  changeSettings,
  getStates,
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

    `)
}

// const languageInit = () => {
//   if (!getStatesMemorable().memorable.languageChanged) {
//     changeSettings({ basic: { language: getLang() } })
//   }
// }
export { aheadInit }
