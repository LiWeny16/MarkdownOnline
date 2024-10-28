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
type StateUnmemorable = {
    aiPanelState: Boolean;
    promptPanelState: Boolean;
    mouseUpPos: MousePosition;
    selectEndPos: MousePosition;
};
export type States = {
    [key: string]: any;
    unmemorable: StateUnmemorable;
};
export type Settings = {
    [key: string]: any;
    basic: SettingsBasic;
    advanced: SettingsAd;
};
type SettingsBasic = {
    syncScroll: boolean;
    speechLanguage: "zh-CN" | "en-US" | "ja-JP" | "yue-Hant-HK";
    fileEditLocal: boolean;
    fontSize: number;
    editorAutoWrap: boolean;
};
type SettingsAd = {
    mermaidTheme: MermaidTheme;
    imageSettings: ImageSettings;
};
type MermaidTheme = "default" | "forest" | "dark" | "neutral" | "null";
export interface ImageSettings {
    modePrefer: "vf" | "folder";
    basicStyle: string;
    imgStorePath: string;
    htmlOrMdStyle: "html" | "md";
}
export interface IConfig {
    [key: string]: any;
    themeState: ThemeState;
    emojiPickerState: EmojiPickerState;
    contextMenuClickPosition: MousePosition;
    states: States;
    settingsConfig: Settings;
}
/**
 * @description Config状态类
 */
declare class ConfigStore {
    [key: string]: any;
    themeState: ThemeState;
    fileManagerState: boolean;
    emojiPickerState: EmojiPickerState;
    contextMenuClickPosition: MousePosition;
    states: States;
    settingsConfig: Settings;
    constructor({ themeState, fileManagerState, emojiPickerState, contextMenuClickPosition, states, settingsConfig, }: IConfig);
    /**
     * @description getAllConfig
     */
    getAllConfig(): Config;
}
export { ConfigStore };
