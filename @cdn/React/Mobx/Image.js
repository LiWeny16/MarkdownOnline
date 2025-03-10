import { observable, makeAutoObservable } from "mobx";
// 对应用状态进行建模。
class ImageStore {
    constructor(displayState) {
        Object.defineProperty(this, "displayState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        makeAutoObservable(this, {
            displayState: observable,
        });
        this.displayState = displayState;
    }
    display() {
        this.displayState = true;
    }
    hidden() {
        this.displayState = false;
    }
}
const imageStore = new ImageStore(false);
export const useImage = () => imageStore;
