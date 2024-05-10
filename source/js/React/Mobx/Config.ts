import { makeAutoObservable, observable } from "mobx"

export type OnOrOff = "on" | "off"
export type ThemeState = "light" | "dark"
export type NormalConfigArr = Array<OnOrOff | ThemeState>
export type EmojiPickerState = OnOrOff
export type Config = {
  [K in keyof IConfig]?: IConfig[K]
}
export type MousePosition = {
  posx: number
  posy: number
}
export type Settings = {
  [key: string]: any // 添加索引签名
  basic: SettingsBasic
  advanced: SettingsAd
}
type SettingsBasic = {
  syncScroll: boolean
  speechLanguage: "zh-CN" | "en-US" | "ja-JP" | "yue-Hant-HK"
  fileEditLocal: boolean
}
type SettingsAd = {
  mermaidTheme: MermaidTheme
}
type MermaidTheme = "default" | "forest" | "dark" | "neutral" | "null"
export interface IConfig {
  [key: string]: any
  //
  themeState: ThemeState
  emojiPickerState: EmojiPickerState
  contextMenuClickPosition: MousePosition
  settingsConfig: Settings
}
// 对应用状态进行建模。

/**
 * @description Config状态类
 */
class ConfigStore {
  // 字符串索引签名
  [key: string]: any
  public themeState: ThemeState
  public fileManagerState: boolean
  public emojiPickerState: EmojiPickerState
  public contextMenuClickPosition: MousePosition
  public settingsConfig: Settings
  constructor({
    themeState,
    fileManagerState,
    emojiPickerState,
    contextMenuClickPosition,
    settingsConfig,
  }: IConfig) {
    makeAutoObservable(this, {
      themeState: observable,
      fileManagerState: observable,
      emojiPickerState: observable,
      contextMenuClickPosition: observable,
      settingsConfig: observable,
    })
    this.themeState = themeState
    this.fileManagerState = fileManagerState
    this.emojiPickerState = emojiPickerState
    this.contextMenuClickPosition = contextMenuClickPosition
    this.settingsConfig = settingsConfig
  }
  /**
   * @description getAllConfig
   */
  public getAllConfig() {
    let configObject: Config = {}
    Object.getOwnPropertyNames(this).forEach((value, index) => {
      configObject[value as keyof Config] = this[value]
    })
    return configObject
  }
}
// const configStore = new ConfigStore({
//   themeState: "light",
//   emojiPickerState: "on",
// })
// export const useConfig = () => configStore
export { ConfigStore }
