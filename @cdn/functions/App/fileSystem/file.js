import alertUseArco from "@App/message/alert";
// 全局ID生成器，确保整个应用中ID的唯一性
class UniqueIdGenerator {
    constructor() {
        Object.defineProperty(this, "counter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "baseTimestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseTimestamp = Date.now();
    }
    static getInstance() {
        if (!UniqueIdGenerator.instance) {
            UniqueIdGenerator.instance = new UniqueIdGenerator();
        }
        return UniqueIdGenerator.instance;
    }
    generateId(path, isLazyPlaceholder = false) {
        // 使用路径作为id基础，将特殊字符转换为安全字符
        const basedId = path
            .replace(/[\/\\]/g, '_') // 替换路径分隔符
            .replace(/[^a-zA-Z0-9_-]/g, '_') // 替换其他特殊字符
            .replace(/_+/g, '_') // 合并连续的下划线
            .replace(/^_|_$/g, '') || 'root'; // 去除首尾下划线，空路径使用'root'
        // 使用基础时间戳、递增计数器和随机数确保唯一性
        this.counter++;
        const randomSuffix = Math.floor(Math.random() * 10000);
        const suffix = isLazyPlaceholder ? '.lazy' : '';
        return `${basedId}_${this.baseTimestamp}_${this.counter}_${randomSuffix}${suffix}`;
    }
}
// 导出单例实例
const idGenerator = UniqueIdGenerator.getInstance();
// 基础扩展名数组（不包含点号）
export const supportFileTypes = [
    "md",
    "txt",
    "go",
    "java",
    "kt",
    "py",
    "js",
    "ts",
    "html",
    "css",
    "c",
    "cpp",
    "json",
    "mjs",
    "jsx",
    "tsx",
    "ps1",
    "cmd",
    "xsl",
    "toml",
    "ipynb",
    "makefile",
    "yml",
];
// 包含点号的扩展名数组
export const supportFileTypes2 = supportFileTypes.map((ext) => `.${ext}`);
// 定义支持的图片扩展名列表
export const supportedImageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "fig",
];
class FileState {
}
// 0 is single file, 1 is folder
Object.defineProperty(FileState, "fileState", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0
});
Object.defineProperty(FileState, "fileHandle", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
Object.defineProperty(FileState, "topDirectoryArray", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: []
});
/**
 * @description 文件管理类
 */
export class FileManager extends FileState {
    /**
     * @description 构造函数
     */
    constructor(fileHandle) {
        super();
    }
    // Getter for fileState
    get fileState() {
        return FileState.fileState;
    }
    // Setter for fileState
    set fileState(state) {
        FileState.fileState = state;
    }
    // Getter for fileHandle
    get fileHandle() {
        return FileState.fileHandle;
    }
    // Setter for fileHandle
    set fileHandle(handle) {
        FileState.fileHandle = handle;
    }
    /**
     * @description 打开单个文件并获取句柄
     */
    async openSingleFile() {
        try {
            ;
            [this.fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [
                    {
                        description: "Text Files",
                        accept: { "text/plain": supportFileTypes2 },
                    },
                ],
            });
            this.fileState = 0;
            return this.fileHandle;
        }
        catch (error) {
            console.error("Error opening file:", error);
            return null;
        }
    }
    /**
     * @description 读取文件内容
     * @returns 内容，如果没有打开则为undefined
     */
    async readFile(fileHandle) {
        if (!this.fileHandle) {
            return;
        }
        const file = await this.fileHandle.getFile();
        const content = await file.text();
        // console.log("File content:", content)
        return content;
    }
    /**
     * @description 静默保存文件
     */
    async saveFileSilently(text) {
        if (!this.fileHandle) {
            // console.log("No file is opened to save.")
            return;
        }
        const writable = await this.fileHandle.createWritable();
        const content = text;
        await writable.write(content);
        await writable.close();
        return true;
    }
    /**
     * @description 另存为
     */
    async saveAsFile(text) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: "text",
                types: [
                    {
                        description: "Text Files",
                        accept: {
                            "text/plain": supportFileTypes2,
                        },
                    },
                ],
            });
            const writable = await handle.createWritable();
            await writable.write(text ?? "Sth..");
            await writable.close();
            console.log("File saved successfully as new file.");
        }
        catch (err) {
            console.error("Save As operation cancelled or failed:", err);
        }
    }
}
/**
 * @description 处理文件夹类
 */
export class FileFolderManager extends FileState {
    constructor(directoryHandle) {
        super();
        Object.defineProperty(this, "currentDirectoryHandle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isWatching", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "watchInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastLazyLoadTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 添加懒加载时间戳跟踪
    }
    // Getter for fileState
    get topDirectoryArray() {
        return FileState.topDirectoryArray;
    }
    // Setter for fileState
    set topDirectoryArray(state) {
        FileState.topDirectoryArray = state;
    }
    // Getter for fileState
    get fileState() {
        return FileState.fileState;
    }
    // Setter for fileState
    set fileState(state) {
        FileState.fileState = state;
    }
    // Getter for fileHandle
    get fileHandle() {
        return FileState.fileHandle;
    }
    // Setter for fileHandle
    set fileHandle(handle) {
        FileState.fileHandle = handle;
    }
    getTopDirectoryHandle() {
        return FileFolderManager.topDirectoryHandle;
    }
    getCurrentDirectoryHandle() {
        return this.currentDirectoryHandle;
    }
    /**
     * @description 打开目录并存储句柄到全局变量
     */
    async openDirectory() {
        try {
            // 通过 showDirectoryPicker 打开文件夹选择对话框
            const directoryHandle = await window.showDirectoryPicker();
            // console.log("Directory selected:", directoryHandle)
            FileFolderManager.topDirectoryHandle = directoryHandle;
            this.fileState = 1;
            this.currentDirectoryHandle = directoryHandle;
            return directoryHandle;
        }
        catch (error) {
            console.error("Error opening directory:", error);
            return null;
        }
    }
    async readDirectoryAsArray(directoryHandle, isTop = false) {
        // 递归函数来读取和处理子目录及文件
        async function processEntry(entryHandle, path) {
            const name = entryHandle.name;
            const currentPath = path ? `${path}/${name}` : name;
            const id = idGenerator.generateId(currentPath);
            if (entryHandle.kind === "file") {
                return {
                    id: id,
                    label: name,
                    fileType: "file",
                    path: currentPath,
                };
            }
            else if (entryHandle.kind === "directory") {
                const children = [];
                let index = 1;
                // 将 entries 转换为数组并排序，以保持顺序一致
                const entriesArray = [];
                for await (const [childName, childHandle] of entryHandle.entries()) {
                    entriesArray.push([childName, childHandle]);
                }
                entriesArray.sort((a, b) => a[0].localeCompare(b[0]));
                for (const [childName, childHandle] of entriesArray) {
                    const childEntry = await processEntry(childHandle, currentPath);
                    children.push(childEntry);
                    index++;
                }
                let temp = {
                    id: id,
                    label: name,
                    children: children,
                    fileType: "folder",
                    path: currentPath,
                };
                if (isTop) {
                    FileState.topDirectoryArray = [temp];
                }
                return temp;
            }
        }
        const topLevelEntries = [];
        let index = 1;
        // 将顶级 entries 转换为数组并排序
        const topEntriesArray = [];
        for await (const [name, handle] of directoryHandle.entries()) {
            topEntriesArray.push([name, handle]);
        }
        topEntriesArray.sort((a, b) => a[0].localeCompare(b[0]));
        for (let i = 0; i < topEntriesArray.length; i++) {
            const [name, handle] = topEntriesArray[i];
            const entry = await processEntry(handle, "");
            topLevelEntries.push(entry);
            index++;
        }
        return topLevelEntries;
    }
    /**
     * @description 性能优化版本的目录读取方法，支持懒加载和深度限制
     * @param directoryHandle 目录句柄
     * @param isTop 是否为顶级目录
     * @param maxDepth 最大读取深度，1表示只读取当前层级，2表示读取到下一层，0表示无限制
     * @param currentDepth 当前深度（内部使用）
     */
    async readDirectoryAsArrayOptimized(directoryHandle, isTop = false, maxDepth = 0, currentDepth = 0) {
        // 优化的递归函数，支持深度限制和批量处理
        async function processEntry(entryHandle, path, depth) {
            const name = entryHandle.name;
            const currentPath = path ? `${path}/${name}` : name;
            const id = idGenerator.generateId(currentPath);
            if (entryHandle.kind === "file") {
                return {
                    id: id,
                    label: name,
                    fileType: "file",
                    path: currentPath,
                };
            }
            else if (entryHandle.kind === "directory") {
                let children = [];
                // 如果达到最大深度限制，不再递归读取子目录内容
                if (maxDepth === 0 || depth < maxDepth) {
                    try {
                        // 批量读取目录entries，提高性能
                        const entriesArray = [];
                        // 使用Promise.all并行处理entries读取，提高性能
                        const entriesIterator = entryHandle.entries();
                        const entryPromises = [];
                        // 分批处理entries，避免一次性读取过多导致内存问题
                        const BATCH_SIZE = 50;
                        let batch = [];
                        for await (const entry of entriesIterator) {
                            entriesArray.push(entry);
                            // 如果批次达到限制，处理当前批次
                            if (entriesArray.length >= BATCH_SIZE) {
                                break; // 暂时简化，可以后续优化为真正的分批处理
                            }
                        }
                        // 对entries排序
                        entriesArray.sort((a, b) => a[0].localeCompare(b[0]));
                        // 并行处理子项，但限制并发数量
                        const CONCURRENT_LIMIT = 10;
                        const childPromises = [];
                        for (let i = 0; i < entriesArray.length; i++) {
                            const [childName, childHandle] = entriesArray[i];
                            childPromises.push(processEntry(childHandle, currentPath, depth + 1));
                            // 控制并发数量，避免过度并发导致性能问题
                            if (childPromises.length >= CONCURRENT_LIMIT) {
                                const batchResults = await Promise.all(childPromises);
                                children.push(...batchResults);
                                childPromises.length = 0; // 清空数组
                            }
                        }
                        // 处理剩余的promises
                        if (childPromises.length > 0) {
                            const batchResults = await Promise.all(childPromises);
                            children.push(...batchResults);
                        }
                    }
                    catch (error) {
                        console.error(`Error reading directory ${currentPath}:`, error);
                        // 出错时返回空子项，但不影响整体结构
                    }
                }
                else {
                    // 达到深度限制，添加懒加载占位符
                    const lazyPlaceholderId = idGenerator.generateId(`${currentPath}/[lazy-placeholder]`, true);
                    children.push({
                        id: lazyPlaceholderId,
                        label: "...",
                        fileType: "lazy-placeholder",
                        path: `${currentPath}/[lazy-placeholder]`,
                    });
                }
                let temp = {
                    id: id,
                    label: name,
                    children: children,
                    fileType: "folder",
                    path: currentPath,
                };
                if (isTop) {
                    FileState.topDirectoryArray = [temp];
                }
                return temp;
            }
            // 添加默认返回值以防止编译错误
            return null;
        }
        try {
            const topLevelEntries = [];
            // 读取顶级目录entries
            const topEntriesArray = [];
            for await (const [name, handle] of directoryHandle.entries()) {
                topEntriesArray.push([name, handle]);
            }
            // 排序
            topEntriesArray.sort((a, b) => a[0].localeCompare(b[0]));
            // 并行处理顶级entries，但控制并发数量
            const CONCURRENT_LIMIT = 15;
            const entryPromises = [];
            for (let i = 0; i < topEntriesArray.length; i++) {
                const [name, handle] = topEntriesArray[i];
                entryPromises.push(processEntry(handle, "", currentDepth));
                // 控制并发数量
                if (entryPromises.length >= CONCURRENT_LIMIT) {
                    const batchResults = await Promise.all(entryPromises);
                    topLevelEntries.push(...batchResults);
                    entryPromises.length = 0;
                }
            }
            // 处理剩余的entries
            if (entryPromises.length > 0) {
                const batchResults = await Promise.all(entryPromises);
                topLevelEntries.push(...batchResults);
            }
            return topLevelEntries;
        }
        catch (error) {
            console.error("Error in readDirectoryAsArrayOptimized:", error);
            // 发生错误时回退到原始方法
            return await this.readDirectoryAsArray(directoryHandle, isTop);
        }
    }
    /**
     * @description 懒加载特定文件夹的子内容
     * @param directoryHandle 根目录句柄
     * @param folderPath 要加载的文件夹路径
     */
    async loadFolderLazily(directoryHandle, folderPath) {
        try {
            // 更新懒加载时间戳
            this.lastLazyLoadTime = Date.now();
            const targetDirHandle = await this.getDirectoryHandleByPath(directoryHandle, folderPath);
            // 修复：传入正确的基础路径，这样生成的文件路径会包含完整的相对路径
            const children = await this.readDirectoryAsArrayLazilyWithPath(targetDirHandle, folderPath, 1);
            return children;
        }
        catch (error) {
            console.error("Error loading folder lazily:", error);
            return [];
        }
    }
    /**
     * @description 懒加载的专用方法，正确处理路径
     */
    async readDirectoryAsArrayLazilyWithPath(directoryHandle, basePath, maxDepth = 1) {
        try {
            // 递归处理目录条目
            async function processEntry(entryHandle, parentPath) {
                const name = entryHandle.name;
                const currentPath = parentPath ? `${parentPath}/${name}` : name;
                const fullPath = basePath ? `${basePath}/${currentPath}` : currentPath;
                const id = idGenerator.generateId(fullPath);
                if (entryHandle.kind === "file") {
                    return {
                        id: id,
                        label: name,
                        fileType: "file",
                        path: fullPath,
                    };
                }
                else if (entryHandle.kind === "directory") {
                    // 对于懒加载，目前只读取一层深度
                    const lazyPlaceholderId = idGenerator.generateId(`${fullPath}/[lazy-placeholder]`, true);
                    return {
                        id: id,
                        label: name,
                        fileType: "folder",
                        path: fullPath,
                        children: [{
                                id: lazyPlaceholderId,
                                label: "...",
                                fileType: "lazy-placeholder",
                                path: `${fullPath}/[lazy-placeholder]`,
                            }]
                    };
                }
            }
            const children = [];
            // 读取目录entries
            const entriesArray = [];
            for await (const [name, handle] of directoryHandle.entries()) {
                entriesArray.push([name, handle]);
            }
            // 排序
            entriesArray.sort((a, b) => a[0].localeCompare(b[0]));
            for (const [name, handle] of entriesArray) {
                const entry = await processEntry(handle, "");
                children.push(entry);
            }
            return children;
        }
        catch (error) {
            console.error("Error in readDirectoryAsArrayLazilyWithPath:", error);
            return [];
        }
    }
    async listDirectoryAsObject(directoryHandle) {
        let directoryObj = {};
        // 遍历目录中的各个条目
        for await (const [name, handle] of directoryHandle.entries()) {
            if (handle.kind === "file") {
                // 如果条目是文件，则将其添加到对象中
                directoryObj[name] = "file";
            }
            else if (handle.kind === "directory") {
                // 如果条目是目录，则递归调用listDirectoryAsObject
                directoryObj[name] = await this.listDirectoryAsObject(handle);
            }
        }
        // 返回表示目录结构的对象
        return directoryObj;
    }
    async readFileContent(directoryHandle, filePath, isFile = false) {
        console.log('readFileContent called with filePath:', filePath); // 添加调试信息
        // 解码文件路径，确保包含中文和空格的路径可以正确处理
        // console.log(filePath);
        const decodedFilePath = decodeURIComponent(filePath);
        console.log('decodedFilePath:', decodedFilePath); // 添加调试信息
        const pathParts = decodedFilePath.split("/");
        console.log('pathParts:', pathParts); // 添加调试信息
        let currentHandle = directoryHandle;
        // 递归遍历目录以找到目标文件
        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (part) {
                console.log('Navigating to directory:', part); // 添加调试信息
                currentHandle = await currentHandle.getDirectoryHandle(part);
            }
        }
        // 获取文件名
        const fileName = pathParts[pathParts.length - 1];
        console.log('Getting file:', fileName); // 添加调试信息
        // 调试：列出当前目录的所有文件
        console.log('Current directory contents:');
        try {
            for await (const [name, handle] of currentHandle.entries()) {
                console.log('  -', name, handle.kind);
            }
        }
        catch (error) {
            console.error('Error listing directory contents:', error);
        }
        // 检查文件扩展名
        const fileExtension = fileName.split(".").pop()?.toLowerCase();
        if (!fileExtension) {
            throw new Error("无法识别文件扩展名。");
        }
        // 获取文件句柄
        console.log('Attempting to get file handle for:', fileName);
        const fileHandle = await currentHandle.getFileHandle(fileName);
        // 检查文件类型是否支持
        if (isFile) {
            // 处理文件
            if (!(supportedImageExtensions.includes(fileExtension) ||
                fileExtension === "pdf")) {
                alertUseArco(`文件扩展名 .${fileExtension} 不被支持为可读文件。`, 1000, {
                    kind: "error",
                });
                throw new Error(`文件扩展名 .${fileExtension} 不被支持为可读文件。`);
            }
            // 不修改 this.fileHandle，保持之前的状态
        }
        else {
            // 处理文本文件
            if (!supportFileTypes.includes(fileExtension)) {
                alertUseArco(`文件扩展名 .${fileExtension} 不被支持为文本文件。`, 1000, {
                    kind: "error",
                });
                throw new Error(`文件扩展名 .${fileExtension} 不被支持为文本文件。`);
            }
            // 更新共享的 fileHandle
            this.fileHandle = fileHandle;
        }
        // 读取文件内容
        const file = await fileHandle.getFile();
        if (isFile) {
            // 将文件读取为 Base64
            const arrayBuffer = await file.arrayBuffer();
            const base64String = await this.arrayBufferToBase64(arrayBuffer, file.type);
            return base64String;
        }
        else {
            // 读取文本内容
            return await file.text();
        }
    }
    /**
     * @description 检查该目录是否存在，如果存在那么设置当前目录为该目录的句柄
     */
    async checkOrCreateNestedDirectory(directoryHandle, nestedPath) {
        try {
            const pathParts = nestedPath.split("/").filter(Boolean); // 过滤空字符串
            let currentDirHandle = directoryHandle;
            for (const part of pathParts) {
                // Check or create each directory part
                currentDirHandle = await currentDirHandle.getDirectoryHandle(part, {
                    create: true,
                });
            }
            // After loop, currentDirHandle will be the deepest directory handle
            this.currentDirectoryHandle = currentDirHandle;
            return currentDirHandle;
        }
        catch (error) {
            console.error("Error creating nested directory:", error);
            throw error;
        }
    }
    async renameFolder(directoryHandle, oldName, newName) {
        try {
            // 获取旧文件夹句柄
            const oldFolderHandle = await directoryHandle.getDirectoryHandle(oldName);
            // 创建新文件夹
            const newFolderHandle = await directoryHandle.getDirectoryHandle(newName, { create: true });
            // 复制旧文件夹内容到新文件夹
            for await (const entry of oldFolderHandle.values()) {
                if (entry.kind === "file") {
                    const file = await entry.getFile();
                    const newFileHandle = await newFolderHandle.getFileHandle(entry.name, { create: true });
                    const writable = await newFileHandle.createWritable();
                    await writable.write(file);
                    await writable.close();
                }
                else if (entry.kind === "directory") {
                    // 递归复制子目录
                    await this.copyDirectory(entry, newFolderHandle);
                }
            }
            // 删除旧文件夹
            await directoryHandle.removeEntry(oldName, { recursive: true });
            console.log(`Renamed folder from ${oldName} to ${newName}`);
        }
        catch (error) {
            console.error("Error renaming folder:", error);
        }
    }
    async writeFile(directoryHandle, fileName, content) {
        try {
            const fileHandle = await directoryHandle.getFileHandle(fileName, {
                create: true,
            });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
        }
        catch (error) {
            console.error(`Error writing file ${fileName}:`, error);
            throw error;
        }
    }
    /**
     * @description Writes a base64 image to a file in a specified nested directory
     */
    async writeBase64ImageFile(directoryHandle, fileName, base64Data, rootPath = "/images") {
        try {
            // Ensure the nested directory structure exists
            const targetDirectoryHandle = await this.checkOrCreateNestedDirectory(directoryHandle, rootPath);
            let maxNumberTemp = 0;
            let maxNumber = 0;
            for await (const entry of targetDirectoryHandle.values()) {
                if (entry.kind === "file") {
                    const match = entry.name.match(/^(\d+)\.png$/); // Match files with only numbers followed by .png
                    if (match) {
                        const number = parseInt(match[1], 10); // Extract and parse the number
                        if (number > maxNumberTemp) {
                            maxNumberTemp = number;
                        }
                    }
                }
            }
            maxNumber = maxNumberTemp + 1;
            // Extract and decode base64 content
            const base64Part = base64Data.split(",")[1];
            const binaryData = atob(base64Part);
            const uint8Array = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            // Create a blob for the image and write to the file
            const blob = new Blob([uint8Array], { type: "image/png" });
            await this.writeFile(targetDirectoryHandle, maxNumber + fileName, blob);
            return maxNumber;
        }
        catch (error) {
            console.error("Error writing Base64 image file:", error);
            throw error;
        }
    }
    async watchDirectory(callback, interval = 1000) {
        if (this.isWatching)
            return;
        this.isWatching = true;
        this.watchInterval = setInterval(callback, interval);
    }
    // 停止监控的方法
    stopWatching() {
        if (this.isWatching && this.watchInterval) {
            clearInterval(this.watchInterval);
            this.isWatching = false;
            this.watchInterval = null;
        }
    }
    // 辅助函数：将 ArrayBuffer 转换为 Base64
    async arrayBufferToBase64(buffer, mimeType) {
        return new Promise((resolve, reject) => {
            const blob = new Blob([buffer], { type: mimeType });
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    }
    async copyDirectory(sourceHandle, destinationHandle) {
        const newDirHandle = await destinationHandle.getDirectoryHandle(sourceHandle.name, { create: true });
        for await (const entry of sourceHandle.values()) {
            if (entry.kind === "file") {
                const file = await entry.getFile();
                const newFileHandle = await newDirHandle.getFileHandle(entry.name, {
                    create: true,
                });
                const writable = await newFileHandle.createWritable();
                await writable.write(file);
                await writable.close();
            }
            else if (entry.kind === "directory") {
                await this.copyDirectory(entry, newDirHandle);
            }
        }
    }
    /**
     * @description 在指定目录创建新的 Markdown 文件
     */
    async createNewFile(directoryHandle, fileName, content = "# New Document\n\nStart writing here...") {
        try {
            // 确保文件名以 .md 结尾
            const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
            const fileHandle = await directoryHandle.getFileHandle(finalFileName, {
                create: true,
            });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            console.log(`Created new file: ${finalFileName}`);
        }
        catch (error) {
            console.error("Error creating new file:", error);
            throw error;
        }
    }
    /**
     * @description 在指定路径创建新文件
     */
    async createNewFileAtPath(rootDirectoryHandle, filePath, fileName, content = "# New Document\n\nStart writing here...") {
        try {
            // 获取目标目录
            const targetDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, filePath);
            // 在目标目录创建文件
            await this.createNewFile(targetDirectoryHandle, fileName, content);
        }
        catch (error) {
            console.error("Error creating new file at path:", error);
            throw error;
        }
    }
    /**
     * @description 在指定目录创建新文件夹
     */
    async createNewFolder(directoryHandle, folderName) {
        try {
            const newFolderHandle = await directoryHandle.getDirectoryHandle(folderName, {
                create: true,
            });
            console.log(`Created new folder: ${folderName}`);
            return newFolderHandle;
        }
        catch (error) {
            console.error("Error creating new folder:", error);
            throw error;
        }
    }
    /**
     * @description 在指定路径创建新文件夹
     */
    async createNewFolderAtPath(rootDirectoryHandle, folderPath, folderName) {
        try {
            // 获取目标目录
            const targetDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, folderPath);
            // 在目标目录创建文件夹
            return await this.createNewFolder(targetDirectoryHandle, folderName);
        }
        catch (error) {
            console.error("Error creating new folder at path:", error);
            throw error;
        }
    }
    /**
     * @description 根据路径获取目录句柄
     */
    async getDirectoryHandleByPath(rootDirectoryHandle, path) {
        if (!path || path === "" || path === "/") {
            return rootDirectoryHandle;
        }
        const pathParts = path.split("/").filter(part => part !== "");
        let currentHandle = rootDirectoryHandle;
        for (const part of pathParts) {
            currentHandle = await currentHandle.getDirectoryHandle(part);
        }
        return currentHandle;
    }
    /**
     * @description 根据路径获取文件句柄
     */
    async getFileHandleByPath(rootDirectoryHandle, filePath) {
        const pathParts = filePath.split("/").filter(part => part !== "");
        const fileName = pathParts.pop();
        if (!fileName) {
            throw new Error("Invalid file path");
        }
        let currentHandle = rootDirectoryHandle;
        for (const part of pathParts) {
            currentHandle = await currentHandle.getDirectoryHandle(part);
        }
        return await currentHandle.getFileHandle(fileName);
    }
    /**
     * @description 删除文件
     */
    async deleteFile(directoryHandle, fileName) {
        try {
            await directoryHandle.removeEntry(fileName);
            console.log(`Deleted file: ${fileName}`);
        }
        catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
    /**
     * @description 根据路径删除文件
     */
    async deleteFileAtPath(rootDirectoryHandle, filePath) {
        try {
            const pathParts = filePath.split("/").filter(part => part !== "");
            const fileName = pathParts.pop();
            if (!fileName) {
                throw new Error("Invalid file path");
            }
            const directoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, pathParts.join("/"));
            await this.deleteFile(directoryHandle, fileName);
        }
        catch (error) {
            console.error("Error deleting file at path:", error);
            throw error;
        }
    }
    /**
     * @description 删除文件夹及其所有内容
     */
    async deleteFolder(directoryHandle, folderName) {
        try {
            await directoryHandle.removeEntry(folderName, { recursive: true });
            console.log(`Deleted folder: ${folderName}`);
        }
        catch (error) {
            console.error("Error deleting folder:", error);
            throw error;
        }
    }
    /**
     * @description 根据路径删除文件夹
     */
    async deleteFolderAtPath(rootDirectoryHandle, folderPath) {
        try {
            const pathParts = folderPath.split("/").filter(part => part !== "");
            const folderName = pathParts.pop();
            if (!folderName) {
                throw new Error("Invalid folder path");
            }
            const parentDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, pathParts.join("/"));
            await this.deleteFolder(parentDirectoryHandle, folderName);
        }
        catch (error) {
            console.error("Error deleting folder at path:", error);
            throw error;
        }
    }
    /**
     * @description 重命名文件
     */
    async renameFile(directoryHandle, oldFileName, newFileName) {
        try {
            // 获取旧文件
            const oldFileHandle = await directoryHandle.getFileHandle(oldFileName);
            const file = await oldFileHandle.getFile();
            // 创建新文件 - 直接使用 File 对象保持文件完整性
            const newFileHandle = await directoryHandle.getFileHandle(newFileName, {
                create: true,
            });
            const writable = await newFileHandle.createWritable();
            await writable.write(file); // 直接写入 File 对象而不是文本内容
            await writable.close();
            // 删除旧文件
            await directoryHandle.removeEntry(oldFileName);
            console.log(`Renamed file from ${oldFileName} to ${newFileName}`);
        }
        catch (error) {
            console.error("Error renaming file:", error);
            throw error;
        }
    }
    /**
     * @description 根据路径重命名文件
     */
    async renameFileAtPath(rootDirectoryHandle, filePath, newFileName) {
        try {
            const pathParts = filePath.split("/").filter(part => part !== "");
            const oldFileName = pathParts.pop();
            if (!oldFileName) {
                throw new Error("Invalid file path");
            }
            const directoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, pathParts.join("/"));
            await this.renameFile(directoryHandle, oldFileName, newFileName);
        }
        catch (error) {
            console.error("Error renaming file at path:", error);
            throw error;
        }
    }
    /**
     * @description 根据路径重命名文件夹
     */
    async renameFolderAtPath(rootDirectoryHandle, folderPath, newFolderName) {
        try {
            const pathParts = folderPath.split("/").filter(part => part !== "");
            const oldFolderName = pathParts.pop();
            if (!oldFolderName) {
                throw new Error("Invalid folder path");
            }
            const parentDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, pathParts.join("/"));
            await this.renameFolder(parentDirectoryHandle, oldFolderName, newFolderName);
        }
        catch (error) {
            console.error("Error renaming folder at path:", error);
            throw error;
        }
    }
    /**
     * @description 移动文件到指定目录
     */
    async moveFile(sourceDirectoryHandle, targetDirectoryHandle, fileName) {
        try {
            // 获取源文件
            const sourceFileHandle = await sourceDirectoryHandle.getFileHandle(fileName);
            const file = await sourceFileHandle.getFile();
            // 检查目标目录中是否有重名文件
            const { files } = await this.listDirectoryEntries(targetDirectoryHandle);
            const uniqueFileName = this.generateUniqueFileName(files, fileName);
            // 在目标目录创建文件 - 使用唯一文件名
            const targetFileHandle = await targetDirectoryHandle.getFileHandle(uniqueFileName, {
                create: true,
            });
            const writable = await targetFileHandle.createWritable();
            await writable.write(file); // 直接写入 File 对象而不是文本内容
            await writable.close();
            // 删除源文件
            await sourceDirectoryHandle.removeEntry(fileName);
            console.log(`Moved file ${fileName} to target directory as ${uniqueFileName}`);
            return uniqueFileName; // 返回实际使用的文件名
        }
        catch (error) {
            console.error("Error moving file:", error);
            throw error;
        }
    }
    /**
     * @description 根据路径移动文件
     */
    async moveFileByPath(rootDirectoryHandle, sourceFilePath, targetDirectoryPath) {
        try {
            // 解析源文件路径
            const sourcePathParts = sourceFilePath.split("/").filter(part => part !== "");
            const fileName = sourcePathParts.pop();
            if (!fileName) {
                throw new Error("Invalid source file path");
            }
            // 获取源目录和目标目录句柄
            const sourceDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, sourcePathParts.join("/"));
            const targetDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, targetDirectoryPath);
            // 移动文件并返回实际使用的文件名
            const actualFileName = await this.moveFile(sourceDirectoryHandle, targetDirectoryHandle, fileName);
            return actualFileName;
        }
        catch (error) {
            console.error("Error moving file by path:", error);
            throw error;
        }
    }
    /**
     * @description 移动文件夹到指定目录
     */
    async moveFolder(rootDirectoryHandle, sourceFolderPath, targetDirectoryPath) {
        try {
            // 解析源文件夹路径
            const sourcePathParts = sourceFolderPath.split("/").filter(part => part !== "");
            const folderName = sourcePathParts.pop();
            if (!folderName) {
                throw new Error("Invalid source folder path");
            }
            // 获取源文件夹、源父目录和目标目录句柄
            const sourceParentHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, sourcePathParts.join("/"));
            const sourceFolderHandle = await sourceParentHandle.getDirectoryHandle(folderName);
            const targetDirectoryHandle = await this.getDirectoryHandleByPath(rootDirectoryHandle, targetDirectoryPath);
            // 检查目标目录中是否有重名文件夹
            const { folders } = await this.listDirectoryEntries(targetDirectoryHandle);
            const uniqueFolderName = this.generateUniqueFolderName(folders, folderName);
            // 在目标目录创建新文件夹 - 使用唯一文件夹名
            const newFolderHandle = await targetDirectoryHandle.getDirectoryHandle(uniqueFolderName, {
                create: true,
            });
            // 复制文件夹内容
            await this.copyDirectoryContents(sourceFolderHandle, newFolderHandle);
            // 删除原文件夹
            await sourceParentHandle.removeEntry(folderName, { recursive: true });
            console.log(`Moved folder ${folderName} to ${targetDirectoryPath} as ${uniqueFolderName}`);
            return uniqueFolderName; // 返回实际使用的文件夹名
        }
        catch (error) {
            console.error("Error moving folder:", error);
            throw error;
        }
    }
    /**
     * @description 复制目录内容
     */
    async copyDirectoryContents(sourceHandle, targetHandle) {
        for await (const entry of sourceHandle.values()) {
            if (entry.kind === "file") {
                const fileHandle = entry;
                const file = await fileHandle.getFile();
                const newFileHandle = await targetHandle.getFileHandle(entry.name, {
                    create: true,
                });
                const writable = await newFileHandle.createWritable();
                await writable.write(file);
                await writable.close();
            }
            else if (entry.kind === "directory") {
                const dirHandle = entry;
                const newDirHandle = await targetHandle.getDirectoryHandle(entry.name, {
                    create: true,
                });
                await this.copyDirectoryContents(dirHandle, newDirHandle);
            }
        }
    }
    /**
     * @description 检查目录是否为空
     */
    async isDirectoryEmpty(directoryHandle) {
        try {
            for await (const entry of directoryHandle.values()) {
                return false; // 如果有任何条目，目录就不为空
            }
            return true; // 没有找到任何条目，目录为空
        }
        catch (error) {
            console.error("Error checking if directory is empty:", error);
            return false;
        }
    }
    /**
     * @description 获取目录中的所有文件和文件夹名称
     */
    async listDirectoryEntries(directoryHandle) {
        try {
            const files = [];
            const folders = [];
            for await (const [name, handle] of directoryHandle.entries()) {
                if (handle.kind === "file") {
                    files.push(name);
                }
                else if (handle.kind === "directory") {
                    folders.push(name);
                }
            }
            return { files, folders };
        }
        catch (error) {
            console.error("Error listing directory entries:", error);
            return { files: [], folders: [] };
        }
    }
    /**
     * @description 生成唯一文件名，避免重名冲突
     */
    generateUniqueFileName(existingNames, baseName) {
        if (!existingNames.includes(baseName)) {
            return baseName;
        }
        // 分离文件名和扩展名
        const lastDotIndex = baseName.lastIndexOf('.');
        const nameWithoutExt = lastDotIndex > 0 ? baseName.substring(0, lastDotIndex) : baseName;
        const extension = lastDotIndex > 0 ? baseName.substring(lastDotIndex) : '';
        let counter = 2;
        let newName;
        do {
            newName = `${nameWithoutExt} (${counter})${extension}`;
            counter++;
        } while (existingNames.includes(newName) && counter < 1000); // 防止无限循环
        return newName;
    }
    /**
     * @description 生成唯一文件夹名，避免重名冲突
     */
    generateUniqueFolderName(existingNames, baseName) {
        if (!existingNames.includes(baseName)) {
            return baseName;
        }
        let counter = 2;
        let newName;
        do {
            newName = `${baseName} (${counter})`;
            counter++;
        } while (existingNames.includes(newName) && counter < 1000); // 防止无限循环
        return newName;
    }
}
