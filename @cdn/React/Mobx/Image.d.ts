declare class ImageStore {
    displayState: boolean;
    imgList: Array<any>;
    refreshCounter: number;
    constructor(displayState: boolean);
    display(): void;
    hidden(): void;
    loadImages(): Promise<void>;
    refreshImages(): void;
    getImages(): any[];
}
export declare const useImage: () => ImageStore;
export {};
