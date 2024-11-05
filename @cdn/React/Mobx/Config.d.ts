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
    loading: boolean;
    previewMode: Boolean;
    aiPanelState: Boolean;
    promptPanelState: Boolean;
    mouseUpPos: MousePosition;
    selectEndPos: MousePosition;
};
type StateMemorable = {
    languageChanged: Boolean;
};
export type States = {
    [key: string]: any;
    unmemorable: StateUnmemorable;
};
export type MemorableStates = {
    [key: string]: any;
    memorable: StateMemorable;
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
    language: "zh" | "en";
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
    memorableStates: MemorableStates;
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
    memorableStates: MemorableStates;
    settingsConfig: Settings;
    constructor({ themeState, fileManagerState, emojiPickerState, contextMenuClickPosition, states, memorableStates, settingsConfig, }: IConfig);
    /**
     * @description getAllConfig
     */
    getAllConfig(): Config;
}
export { ConfigStore };
