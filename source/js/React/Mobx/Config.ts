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
export interface IConfig {
  [key: string]: any
  //
  themeState: ThemeState
  emojiPickerState: EmojiPickerState
  contextMenuClickPosition: MousePosition
}
// 对应用状态进行建模。

/**
 * @description Config状态类
 */
class ConfigStore {
  // 字符串索引签名
  [key: string]: any
  public themeState: ThemeState
  public emojiPickerState: EmojiPickerState
  public contextMenuClickPosition: MousePosition
  constructor({
    themeState,
    emojiPickerState,
    contextMenuClickPosition,
  }: IConfig) {
    makeAutoObservable(this, {
      themeState: observable,
      emojiPickerState: observable,
      contextMenuClickPosition: observable,
    })
    this.themeState = themeState
    this.emojiPickerState = emojiPickerState
    this.contextMenuClickPosition = contextMenuClickPosition
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
