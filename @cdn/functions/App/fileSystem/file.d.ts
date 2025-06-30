export declare const supportFileTypes: string[];
export declare const supportFileTypes2: string[];
export declare const supportedImageExtensions: string[];
declare class FileState {
    static fileState: 0 | 1;
    static fileHandle: FileSystemFileHandle | null;
    static topDirectoryArray: FileItem[];
}
/**
 * @description 文件管理类
 */
export declare class FileManager extends FileState {
    /**
     * @description 构造函数
     */
    constructor(fileHandle?: FileSystemFileHandle | null);
    get fileState(): 0 | 1;
    set fileState(state: 0 | 1);
    get fileHandle(): FileSystemFileHandle | null;
    set fileHandle(handle: FileSystemFileHandle | null);
    /**
     * @description 打开单个文件并获取句柄
     */
    openSingleFile(): Promise<FileSystemFileHandle | null>;
    /**
     * @description 读取文件内容
     * @returns 内容，如果没有打开则为undefined
     */
    readFile(fileHandle: FileSystemFileHandle): Promise<string | undefined>;
    /**
     * @description 静默保存文件
     */
    saveFileSilently(text: string): Promise<boolean | void>;
    /**
     * @description 另存为
     */
    saveAsFile(text: string): Promise<void>;
}
export interface FileItem {
    id: string;
    label: string;
    fileType: "file" | "folder";
    path: string;
    children?: FileItem[];
}
/**
 * @description 处理文件夹类
 */
export declare class FileFolderManager extends FileState {
    protected static topDirectoryHandle: FileSystemDirectoryHandle | undefined;
    protected currentDirectoryHandle: FileSystemDirectoryHandle | undefined;
    protected isWatching: boolean;
    watchInterval: ReturnType<typeof setInterval> | null;
    constructor(directoryHandle?: FileSystemDirectoryHandle);
    get topDirectoryArray(): Array<any>;
    set topDirectoryArray(state: any);
    get fileState(): 0 | 1;
    set fileState(state: 0 | 1);
    get fileHandle(): FileSystemFileHandle | null;
    set fileHandle(handle: FileSystemFileHandle | null);
    getTopDirectoryHandle(): FileSystemDirectoryHandle | undefined;
    getCurrentDirectoryHandle(): FileSystemDirectoryHandle | undefined;
    /**
     * @description 打开目录并存储句柄到全局变量
     */
    openDirectory(): Promise<FileSystemDirectoryHandle | null>;
    readDirectoryAsArray(directoryHandle: FileSystemDirectoryHandle, isTop?: boolean): Promise<any[]>;
    /**
     * @description 性能优化版本的目录读取方法，支持懒加载和深度限制
     * @param directoryHandle 目录句柄
     * @param isTop 是否为顶级目录
     * @param maxDepth 最大读取深度，1表示只读取当前层级，2表示读取到下一层，0表示无限制
     * @param currentDepth 当前深度（内部使用）
     */
    readDirectoryAsArrayOptimized(directoryHandle: FileSystemDirectoryHandle, isTop?: boolean, maxDepth?: number, currentDepth?: number): Promise<any[]>;
    /**
     * @description 懒加载特定文件夹的子内容
     * @param directoryHandle 根目录句柄
     * @param folderPath 要加载的文件夹路径
     */
    loadFolderLazily(directoryHandle: FileSystemDirectoryHandle, folderPath: string): Promise<any[]>;
    listDirectoryAsObject(directoryHandle: any): Promise<any>;
    readFileContent(directoryHandle: FileSystemDirectoryHandle, filePath: string, isFile?: boolean): Promise<string>;
    /**
     * @description 检查该目录是否存在，如果存在那么设置当前目录为该目录的句柄
     */
    checkOrCreateNestedDirectory(directoryHandle: FileSystemDirectoryHandle, nestedPath: string): Promise<FileSystemDirectoryHandle>;
    renameFolder(directoryHandle: FileSystemDirectoryHandle, oldName: string, newName: string): Promise<void>;
    writeFile(directoryHandle: FileSystemDirectoryHandle, fileName: string, content: string | Blob): Promise<void>;
    /**
     * @description Writes a base64 image to a file in a specified nested directory
     */
    writeBase64ImageFile(directoryHandle: FileSystemDirectoryHandle, fileName: string, base64Data: string, rootPath?: string): Promise<number>;
    watchDirectory(callback: () => void, interval?: number): Promise<void>;
    stopWatching(): void;
    private arrayBufferToBase64;
    private copyDirectory;
    /**
     * @description 在指定目录创建新的 Markdown 文件
     */
    createNewFile(directoryHandle: FileSystemDirectoryHandle, fileName: string, content?: string): Promise<void>;
    /**
     * @description 在指定路径创建新文件
     */
    createNewFileAtPath(rootDirectoryHandle: FileSystemDirectoryHandle, filePath: string, fileName: string, content?: string): Promise<void>;
    /**
     * @description 在指定目录创建新文件夹
     */
    createNewFolder(directoryHandle: FileSystemDirectoryHandle, folderName: string): Promise<FileSystemDirectoryHandle>;
    /**
     * @description 在指定路径创建新文件夹
     */
    createNewFolderAtPath(rootDirectoryHandle: FileSystemDirectoryHandle, folderPath: string, folderName: string): Promise<FileSystemDirectoryHandle>;
    /**
     * @description 根据路径获取目录句柄
     */
    getDirectoryHandleByPath(rootDirectoryHandle: FileSystemDirectoryHandle, path: string): Promise<FileSystemDirectoryHandle>;
    /**
     * @description 根据路径获取文件句柄
     */
    getFileHandleByPath(rootDirectoryHandle: FileSystemDirectoryHandle, filePath: string): Promise<FileSystemFileHandle>;
    /**
     * @description 删除文件
     */
    deleteFile(directoryHandle: FileSystemDirectoryHandle, fileName: string): Promise<void>;
    /**
     * @description 根据路径删除文件
     */
    deleteFileAtPath(rootDirectoryHandle: FileSystemDirectoryHandle, filePath: string): Promise<void>;
    /**
     * @description 删除文件夹及其所有内容
     */
    deleteFolder(directoryHandle: FileSystemDirectoryHandle, folderName: string): Promise<void>;
    /**
     * @description 根据路径删除文件夹
     */
    deleteFolderAtPath(rootDirectoryHandle: FileSystemDirectoryHandle, folderPath: string): Promise<void>;
    /**
     * @description 重命名文件
     */
    renameFile(directoryHandle: FileSystemDirectoryHandle, oldFileName: string, newFileName: string): Promise<void>;
    /**
     * @description 根据路径重命名文件
     */
    renameFileAtPath(rootDirectoryHandle: FileSystemDirectoryHandle, filePath: string, newFileName: string): Promise<void>;
    /**
     * @description 根据路径重命名文件夹
     */
    renameFolderAtPath(rootDirectoryHandle: FileSystemDirectoryHandle, folderPath: string, newFolderName: string): Promise<void>;
    /**
     * @description 移动文件到指定目录
     */
    moveFile(sourceDirectoryHandle: FileSystemDirectoryHandle, targetDirectoryHandle: FileSystemDirectoryHandle, fileName: string): Promise<void>;
    /**
     * @description 根据路径移动文件
     */
    moveFileByPath(rootDirectoryHandle: FileSystemDirectoryHandle, sourceFilePath: string, targetDirectoryPath: string): Promise<void>;
    /**
     * @description 移动文件夹到指定目录
     */
    moveFolder(rootDirectoryHandle: FileSystemDirectoryHandle, sourceFolderPath: string, targetDirectoryPath: string): Promise<void>;
    /**
     * @description 复制目录内容
     */
    private copyDirectoryContents;
    /**
     * @description 检查目录是否为空
     */
    isDirectoryEmpty(directoryHandle: FileSystemDirectoryHandle): Promise<boolean>;
    /**
     * @description 获取目录中的所有文件和文件夹名称
     */
    listDirectoryEntries(directoryHandle: FileSystemDirectoryHandle): Promise<{
        files: string[];
        folders: string[];
    }>;
}
export {};
