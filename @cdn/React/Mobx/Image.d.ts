declare class ImageStore {
    displayState: boolean;
    constructor(displayState: boolean);
    display(): void;
    hidden(): void;
}
export declare const useImage: () => ImageStore;
export {};
