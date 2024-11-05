import { IConfig, MemorableStates, Settings, States } from "@Root/js/React/Mobx/Config";
export declare function changeTheme(mode: string): void;
export declare function getTheme(): import("@Root/js/React/Mobx/Config").ThemeState;
export declare function changeEmojiPickerState(mode: IConfig["emojiPickerState"]): void;
export declare function getEmojiPickerState(): import("@Root/js/React/Mobx/Config").OnOrOff;
export declare function setContextMenuClickPosition(pos: IConfig["contextMenuClickPosition"]): false | undefined;
export declare function getContextMenuClickPosition(): import("@Root/js/React/Mobx/Config").MousePosition;
/**
 * @description 更新设置,合并设置，存储到localStorage
 */
export declare function changeStatesMemorable(newStates: {
    memorable?: Partial<MemorableStates["memorable"]>;
}): void;
/**
 * @description 读取设置
 */
export declare function getStatesMemorable(): MemorableStates;
/**
 * @description 更新设置,合并设置，存储到localStorage
 */
export declare function changeStates(newStates: {
    unmemorable?: Partial<States["unmemorable"]>;
}): void;
/**
 * @description 读取设置
 */
export declare function getStates(): States;
export declare function changeSettings(newSettings: {
    basic?: Partial<Settings["basic"]>;
    advanced?: Partial<Settings["advanced"]>;
}): void;
export declare function getSettings(): Settings;
export declare function changeFileManagerState(mode: boolean): void;
export declare function getFileManagerState(): boolean;
