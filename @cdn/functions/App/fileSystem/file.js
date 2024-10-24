import alertUseArco from "@App/message/alert";
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
// 定义支持的文件扩展名列表
export const supportedImageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
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
        Object.defineProperty(this, "topDirectoryHandle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentDirectoryHandle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.topDirectoryHandle = directoryHandle || window._directoryHandle;
        // this.currentDirectoryHandle = this.topDirectoryHandle
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
        return this.topDirectoryHandle;
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
            this.topDirectoryHandle = directoryHandle;
            this.fileState = 1;
            this.currentDirectoryHandle = directoryHandle;
            window._directoryHandle = directoryHandle;
            return directoryHandle;
        }
        catch (error) {
            console.error("Error opening directory:", error);
            return null;
        }
    }
    async readDirectoryAsArray(directoryHandle, isTop = false) {
        // 递归函数来读取和处理子目录及文件
        async function processEntry(entryHandle, path, idParts) {
            const name = entryHandle.name;
            const currentPath = path ? `${path}/${name}` : name;
            const id = idParts.join(".");
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
                    const childIdParts = [...idParts, index.toString()];
                    const childEntry = await processEntry(childHandle, currentPath, childIdParts);
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
        for (const [name, handle] of topEntriesArray) {
            const idParts = [index.toString()];
            const entry = await processEntry(handle, "", idParts);
            topLevelEntries.push(entry);
            index++;
        }
        return topLevelEntries;
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
    async readFileContent(directoryHandle, filePath, isImg = false) {
        try {
            // 将文件路径拆分为各个部分
            const pathParts = filePath.split("/");
            let currentHandle = directoryHandle;
            // 递归遍历目录以找到目标文件
            for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                currentHandle = await currentHandle.getDirectoryHandle(part);
            }
            // 获取文件名
            const fileName = pathParts[pathParts.length - 1];
            // 检查文件扩展名
            const fileExtension = fileName.split(".").pop()?.toLowerCase();
            if (!fileExtension) {
                throw new Error("无法识别文件扩展名。");
            }
            // 获取文件句柄
            const fileHandle = await currentHandle.getFileHandle(fileName);
            // 检查文件类型是否支持
            if (isImg) {
                // 处理图片文件
                if (!supportedImageExtensions.includes(fileExtension)) {
                    alertUseArco(`文件扩展名 .${fileExtension} 不被支持为图片文件。`, 1000, {
                        kind: "error",
                    });
                    throw new Error(`文件扩展名 .${fileExtension} 不被支持为图片文件。`);
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
            if (isImg) {
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
        catch (error) {
            console.error("读取文件时出错:", error);
            throw new Error("未找到文件或读取文件时出错。");
        }
    }
    /**
     * @description 检查该目录是否存在，如果存在那么设置当前目录为该目录的句柄
     */
    async checkOrCreateDirectory(directoryHandle, dirName) {
        try {
            // 尝试获取现有的子目录
            const dirHandle = await directoryHandle.getDirectoryHandle(dirName);
            // console.log("Directory already exists")
            this.currentDirectoryHandle = dirHandle;
            return dirHandle; // 目录已存在，直接返回句柄
        }
        catch (err) {
            if (err.name === "NotFoundError") {
                // 目录不存在，基于create选项创建它
                // console.log("Directory does not exist, creating...")
                const newDirHandle = await directoryHandle.getDirectoryHandle(dirName, {
                    create: true,
                });
                this.currentDirectoryHandle = newDirHandle;
                return newDirHandle; // 返回新创建的目录句柄
            }
            else {
                // 其他错误
                throw err;
            }
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
    /**
     * @description 在当前目录写入文件
     */
    async writeFile(directoryHandle, fileName, content) {
        try {
            const fileHandle = await directoryHandle.getFileHandle(fileName, {
                create: false,
            });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            // console.log(`File ${fileName} written successfully.`)
        }
        catch (error) {
            // 如果文件不存在，将会抛出异常
            if (error.name === "NotFoundError") {
                const fileHandle = await directoryHandle.getFileHandle(fileName, {
                    create: true,
                });
                const writable = await fileHandle.createWritable();
                await writable.write(content);
                await writable.close();
                // console.log(`File ${fileName} written successfully.`)
            }
            else {
                throw error;
            }
        }
    }
    /**
     * @description 以base64写入文件
     */
    async writeBase64ImageFile(directoryHandle, fileName, base64Data) {
        try {
            const binaryData = atob(base64Data.split(",")[1]);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            const blob = new Blob([uint8Array], { type: "image/png" });
            await this.writeFile(directoryHandle, fileName, blob);
        }
        catch (error) {
            console.error("Error writing Base64 image file:", error);
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
}
