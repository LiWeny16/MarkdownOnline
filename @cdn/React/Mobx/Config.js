import { makeAutoObservable, observable } from "mobx";
// 对应用状态进行建模。
/**
 * @description Config状态类
 */
class ConfigStore {
    constructor({ themeState, fileManagerState, emojiPickerState, contextMenuClickPosition, states, memorableStates, settingsConfig, }) {
        Object.defineProperty(this, "themeState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fileManagerState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "emojiPickerState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contextMenuClickPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "states", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "memorableStates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "settingsConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeAutoObservable(this, {
            themeState: observable,
            fileManagerState: observable,
            emojiPickerState: observable,
            contextMenuClickPosition: observable,
            states: observable,
            memorableStates: observable,
            settingsConfig: observable,
        });
        this.themeState = themeState;
        this.fileManagerState = fileManagerState;
        this.emojiPickerState = emojiPickerState;
        this.contextMenuClickPosition = contextMenuClickPosition;
        this.states = states;
        this.memorableStates = memorableStates;
        this.settingsConfig = settingsConfig;
    }
    /**
     * @description getAllConfig
     */
    getAllConfig() {
        let configObject = {};
        Object.getOwnPropertyNames(this).forEach((value, index) => {
            configObject[value] = this[value];
        });
        return configObject;
    }
}
// const configStore = new ConfigStore({
//   themeState: "light",
//   emojiPickerState: "on",
// })
// export const useConfig = () => configStore
export { ConfigStore };
