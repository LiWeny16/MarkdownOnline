// import { useConfig } from "@Root/js/React/Mobx/Config"
import OperateLocalStorage from "@App/localStorage/localStorage";
import { useConfig } from "@Func/Init/allInit";
import { toJS, runInAction } from "mobx";
let opLocalStorage = new OperateLocalStorage();
//#region *********************Theme*********************
export function changeTheme(mode) {
    runInAction(() => {
        if (mode == "light") {
            useConfig().themeState = "light";
            opLocalStorage.setItem("themeState", "light");
        }
        else {
            useConfig().themeState = "dark";
            opLocalStorage.setItem("themeState", "dark");
        }
    });
}
export function getTheme() {
    return useConfig().themeState;
}
//#endregion *********************Theme******************
//#region *********************EmojiPicker*********************
export function changeEmojiPickerState(mode) {
    runInAction(() => {
        if (mode == "on") {
            useConfig().emojiPickerState = "on";
            opLocalStorage.setItem("emojiPickerState", "on");
        }
        else {
            useConfig().emojiPickerState = "off";
            opLocalStorage.setItem("emojiPickerState", "off");
        }
    });
}
export function getEmojiPickerState() {
    return useConfig().emojiPickerState;
}
//#endregion *********************EmojiPicker******************
//#region
export function setContextMenuClickPosition(pos) {
    if (pos.posx && pos.posy) {
        runInAction(() => {
            useConfig().contextMenuClickPosition = pos;
        });
    }
    else {
        return false;
    }
}
export function getContextMenuClickPosition() {
    return useConfig().contextMenuClickPosition;
}
//#endregion
//#region
/**
 * @description 更新设置,合并设置，存储到localStorage
 */
export function changeStatesMemorable(newStates) {
    const currentStates = getStatesMemorable();
    const updatedStates = updateMemorableStatesConfig(currentStates, newStates);
    runInAction(() => {
        useConfig().memorableStates = updatedStates;
    });
    opLocalStorage.setItem("memorableStates", JSON.stringify(updatedStates));
}
/**
 * @description 读取设置
 */
export function getStatesMemorable() {
    return toJS(useConfig().memorableStates);
}
/**
 * @description 更新设置,合并设置，存储到localStorage
 */
export function changeStates(newStates) {
    const currentStates = getStates();
    const updatedStates = updateStatesConfig(currentStates, newStates);
    runInAction(() => {
        useConfig().states = updatedStates;
    });
    opLocalStorage.setItem("states", JSON.stringify(updatedStates));
}
/**
 * @description 读取设置
 */
export function getStates() {
    return toJS(useConfig().states);
}
export function changeSettings(newSettings) {
    const currentSettings = getSettings();
    const updatedSettings = updateSettingsConfig(currentSettings, newSettings);
    runInAction(() => {
        useConfig().settingsConfig = updatedSettings;
    });
    opLocalStorage.setItem("settingsConfig", JSON.stringify(updatedSettings));
}
export function getSettings() {
    return toJS(useConfig().settingsConfig);
}
/**
 * @description 合并新设置和旧设置
 */
function updateMemorableStatesConfig(currentStates, newSettings) {
    // 遍历新设置的每个键
    for (const key in newSettings) {
        if (key in currentStates) {
            // 如果键存在于当前设置中，则更新子对象
            Object.assign(currentStates[key], newSettings[key]);
        }
        else {
            // 如果键不存在，则将新键添加到当前设置
            currentStates[key] = newSettings[key];
        }
    }
    return currentStates;
}
/**
 * @description 合并新设置和旧设置
 */
function updateStatesConfig(currentStates, newSettings) {
    // 遍历新设置的每个键
    for (const key in newSettings) {
        if (key in currentStates) {
            // 如果键存在于当前设置中，则更新子对象
            Object.assign(currentStates[key], newSettings[key]);
        }
        else {
            // 如果键不存在，则将新键添加到当前设置
            currentStates[key] = newSettings[key];
        }
    }
    return currentStates;
}
function updateSettingsConfig(currentSettings, newSettings) {
    // 遍历新设置的每个键
    for (const key in newSettings) {
        if (key in currentSettings) {
            // 如果键存在于当前设置中，则更新子对象
            Object.assign(currentSettings[key], newSettings[key]);
        }
        else {
            // 如果键不存在，则将新键添加到当前设置
            currentSettings[key] = newSettings[key];
        }
    }
    return currentSettings;
}
//#endregion
//#region *********************FileManager*********************
export function changeFileManagerState(mode) {
    runInAction(() => {
        useConfig().fileManagerState = mode;
    });
}
export function getFileManagerState() {
    return useConfig().fileManagerState;
}
//#endregion *********************FileManager******************
