// import { useConfig } from "@Root/js/React/Mobx/Config"

import operateLocalStorage from "@App/localStorage/localStorage"
import { useConfig } from "@Func/Init/allInit"
import { IConfig, Settings } from "@Root/js/React/Mobx/Config"

let opLocalStorage = new operateLocalStorage()

//#region *********************Theme*********************

export function changeTheme(mode: string) {
  // console.log(useConfig().getAllConfig())
  if (mode == "light") {
    useConfig().themeState = "light"
    opLocalStorage.setItem("themeState", "light")
  } else {
    useConfig().themeState = "dark"
    opLocalStorage.setItem("themeState", "dark")
  }
}
export function getTheme() {
  return useConfig().themeState
}

//#endregion *********************Theme******************

//#region *********************EmojiPicker*********************

export function changeEmojiPickerState(mode: IConfig["emojiPickerState"]) {
  if (mode == "on") {
    useConfig().emojiPickerState = "on"
    opLocalStorage.setItem("emojiPickerState", "on")
  } else {
    useConfig().emojiPickerState = "off"
    opLocalStorage.setItem("emojiPickerState", "off")
  }
}
export function getEmojiPickerState() {
  return useConfig().emojiPickerState
}

//#endregion *********************EmojiPicker******************

//#region

export function setContextMenuClickPosition(
  pos: IConfig["contextMenuClickPosition"]
) {
  if (pos.posx && pos.posy) {
    useConfig().contextMenuClickPosition = pos
  } else {
    return false
  }
}
export function getContextMenuClickPosition() {
  return useConfig().contextMenuClickPosition
}
//#endregion

//#region
export function changeSettings(settings: Settings) {
  // console.log(useConfig().getAllConfig())
  useConfig().settingsConfig = settings
  opLocalStorage.setItem("settingsConfig", JSON.stringify(settings))
}
export function getSettings() {
  return useConfig().settingsConfig
}
//#endregion
