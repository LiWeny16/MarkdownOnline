export type OnOrOff = "on" | "off";
export type ThemeState = "light" | "dark";
export type NormalConfigArr = Array<OnOrOff | ThemeState>;
export type EmojiPickerState = OnOrOff;
export type Config = {
    [K in keyof IConfig]?: IConfig[K];
};
export type MousePosition = {
    posx: number;
    posy: number;
};
export type Settings = {
    [key: string]: any;
    basic: SettingsBasic;
    advanced: SettingsAd;
};
type SettingsBasic = {
    syncScroll: boolean;
    speechLanguage: "zh-CN" | "en-US" | "ja-JP" | "yue-Hant-HK";
};
type SettingsAd = {};
export interface IConfig {
    [key: string]: any;
    themeState: ThemeState;
    emojiPickerState: EmojiPickerState;
    contextMenuClickPosition: MousePosition;
    settingsConfig: Settings;
}
/**
 * @description Config状态类
 */
declare class ConfigStore {
    [key: string]: any;
    themeState: ThemeState;
    emojiPickerState: EmojiPickerState;
    contextMenuClickPosition: MousePosition;
    settingsConfig: Settings;
    constructor({ themeState, emojiPickerState, contextMenuClickPosition, settingsConfig, }: IConfig);
    /**
     * @description getAllConfig
     */
    getAllConfig(): Config;
}
export { ConfigStore };
