/**
 * @description 文件管理类
 */
export declare class FileManager {
    fileHandle: FileSystemFileHandle | null;
    /**
     * @description 构造函数
     */
    constructor(fileHandle?: FileSystemFileHandle | null);
    /**
     * @description 打开单个文件并获取句柄
     */
    openSingleFile(): Promise<FileSystemFileHandle | null>;
    /**
     * @description 读取文件内容
     * @returns 内容，如果没有打开则为undefined
     */
    readFile(): Promise<string | undefined>;
    /**
     * @description 静默保存文件
     */
    saveFileSilently(text: string): Promise<boolean | void>;
    /**
     * @description 另存为
     */
    saveAsFile(text: string): Promise<void>;
}
