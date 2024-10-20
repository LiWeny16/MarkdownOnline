const supportFileTypes = [".md", ".py", ".js", ".ts"];
/**
 * @description 文件管理类
 */
export class FileManager {
    /**
     * @description 构造函数
     */
    constructor(fileHandle) {
        Object.defineProperty(this, "fileHandle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        if (fileHandle) {
            this.fileHandle = fileHandle;
        }
        else {
            this.fileHandle = window._fileHandle;
        }
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
                        accept: { "text/plain": supportFileTypes },
                    },
                ],
            });
            window._fileHandle = this.fileHandle;
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
                            "text/plain": supportFileTypes,
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
export class FileFolderManager {
    constructor(directoryHandle) {
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
        if (directoryHandle) {
            this.topDirectoryHandle = directoryHandle;
            this.currentDirectoryHandle = directoryHandle;
        }
        else {
            this.topDirectoryHandle = window._directoryHandle;
            this.currentDirectoryHandle = window._directoryHandle;
        }
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
            this.currentDirectoryHandle = directoryHandle;
            window._directoryHandle = directoryHandle;
            return directoryHandle;
        }
        catch (error) {
            console.error("Error opening directory:", error);
            return null;
        }
    }
    async readDirectoryAsArray(directoryHandle) {
        // 递归函数来读取和处理子目录及文件
        async function processEntry(entryHandle, idPrefix) {
            const id = `${idPrefix}.${entryHandle.name}`;
            // 检查是目录还是文件
            if (entryHandle.kind === "file") {
                const file = await entryHandle.getFile();
                // 这里返回文件的信息，可以根据文件类型设置 fileType
                return {
                    id: id,
                    label: entryHandle.name,
                    // fileType 需要根据实际的文件类型来设置，这里假设全部为文件
                    fileType: "file",
                };
            }
            else if (entryHandle.kind === "directory") {
                // 处理目录
                const entries = [];
                for await (const [childName, childHandle] of entryHandle.entries()) {
                    // 迭代处理子目录及文件，递归调用
                    const childEntry = await processEntry(childHandle, id);
                    entries.push(childEntry);
                }
                return {
                    id: id,
                    label: entryHandle.name,
                    children: entries,
                    fileType: "folder", // 标记为文件夹
                };
            }
        }
        // 父目录的 ID 从 1 开始
        const topLevelEntries = [];
        let prefixCounter = 1;
        for await (const [name, handle] of directoryHandle.entries()) {
            // 对于每个顶级子项，调用 processEntry 并传递正确的 ID 前缀
            const entry = await processEntry(handle, prefixCounter.toString());
            topLevelEntries.push(entry);
            prefixCounter++;
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
