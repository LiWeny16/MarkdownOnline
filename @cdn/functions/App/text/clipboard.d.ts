/**
 * @description 操作剪切板
 * @param text 要粘贴的文本
 */
export declare function writeClipboard(text: string): void;
/**
 * @description 读取剪切板
 * @returns {Promise<string>}
 */
export declare function readClipboard(): Promise<string>;
