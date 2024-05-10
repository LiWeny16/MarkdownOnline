// import { useConfig } from "@Root/js/React/Mobx/Config"

import OperateLocalStorage from "@App/localStorage/localStorage"
import { useConfig } from "@Func/Init/allInit"
import { IConfig, Settings } from "@Root/js/React/Mobx/Config"
import { toJS } from "mobx"

let opLocalStorage = new OperateLocalStorage()

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
/**
 * @description 更新设置,合并设置，存储到localStorage
 */
export function changeSettings(newSettings: {
  basic?: Partial<Settings["basic"]>
  advanced?: Partial<Settings["advanced"]>
}) {
  const currentSettings = getSettings()
  const updatedSettings = updateSettingsConfig(currentSettings, newSettings)
  useConfig().settingsConfig = updatedSettings
  opLocalStorage.setItem("settingsConfig", JSON.stringify(updatedSettings))
}
/**
 * @description 读取设置
 */
export function getSettings() {
  return toJS(useConfig().settingsConfig)
}
/**
 * @description 合并新设置和旧设置
 */
function updateSettingsConfig(
  currentSettings: Settings,
  newSettings: {
    [key: string]: any // 添加索引签名
    basic?: Partial<Settings["basic"]>
    advanced?: Partial<Settings["advanced"]>
  }
) {
  // 遍历新设置的每个键
  for (const key in newSettings) {
    if (key in currentSettings) {
      // 如果键存在于当前设置中，则更新子对象
      Object.assign(currentSettings[key], newSettings[key])
    } else {
      // 如果键不存在，则将新键添加到当前设置
      currentSettings[key] = newSettings[key]
    }
  }

  return currentSettings
}
//#endregion

//#region *********************FileManager*********************

export function changeFileManagerState(mode: boolean) {
  useConfig().fileManagerState = mode
}
export function getFileManagerState() {
  return useConfig().fileManagerState
}

//#endregion *********************FileManager******************
