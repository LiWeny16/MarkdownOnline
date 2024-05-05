/// <reference types="@Root/js/types" />
import "@cdn-katex";
import "../css/index.less";
/**
 * @description 拓展使能配置
 */
export declare const enObj: {
    enMainConverter: boolean;
    enAboutBox: boolean;
    enPdfExport: boolean;
    enFastKey: boolean;
    enScript: boolean;
    enHilightJs: boolean;
    enClue: boolean;
    enDragFile: boolean;
    enPasteEvent: boolean;
    enVirtualFileSystem: boolean;
    enPageBreaker: boolean;
};
/**
 * @description 循环执行触发主解析事件流
 * @param {boolean} save
 */
export declare function mdConverter(save?: boolean): Promise<void>;
