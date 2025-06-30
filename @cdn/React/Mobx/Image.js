import { observable, makeAutoObservable, runInAction } from "mobx";
import { readAllMemoryImg } from "@App/memory/memory";
// 对应用状态进行建模。
class ImageStore {
    constructor(displayState) {
        Object.defineProperty(this, "displayState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "imgList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "refreshCounter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 用于强制触发重新加载
        makeAutoObservable(this, {
            displayState: observable,
            imgList: observable,
            refreshCounter: observable,
        });
        this.displayState = displayState;
        this.loadImages();
    }
    display() {
        this.displayState = true;
        // 每次显示时刷新图片列表
        this.refreshImages();
    }
    hidden() {
        this.displayState = false;
    }
    // 加载图片列表
    async loadImages() {
        try {
            const list = await readAllMemoryImg();
            runInAction(() => {
                this.imgList = list || [];
            });
        }
        catch (error) {
            console.error("Failed to load images:", error);
            runInAction(() => {
                this.imgList = [];
            });
        }
    }
    // 刷新图片列表
    refreshImages() {
        this.loadImages();
        this.refreshCounter++;
    }
    // 获取图片列表
    getImages() {
        return this.imgList;
    }
}
const imageStore = new ImageStore(false);
export const useImage = () => imageStore;
