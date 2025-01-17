import alertUseArco from "@App/message/alert"
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
]

// 包含点号的扩展名数组
export const supportFileTypes2 = supportFileTypes.map((ext) => `.${ext}`)

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
]

class FileState {
  // 0 is single file, 1 is folder
  public static fileState: 0 | 1 = 0
  public static fileHandle: FileSystemFileHandle | null = null
  public static topDirectoryArray: FileItem[] = []
}
/**
 * @description 文件管理类
 */
export class FileManager extends FileState {
  /**
   * @description 构造函数
   */
  constructor(fileHandle?: FileSystemFileHandle | null) {
    super()
  }
  // Getter for fileState
  public get fileState(): 0 | 1 {
    return FileState.fileState
  }

  // Setter for fileState
  public set fileState(state: 0 | 1) {
    FileState.fileState = state
  }
  // Getter for fileHandle
  public get fileHandle(): FileSystemFileHandle | null {
    return FileState.fileHandle
  }

  // Setter for fileHandle
  public set fileHandle(handle: FileSystemFileHandle | null) {
    FileState.fileHandle = handle
  }
  /**
   * @description 打开单个文件并获取句柄
   */
  async openSingleFile(): Promise<FileSystemFileHandle | null> {
    try {
      ;[this.fileHandle] = await window.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: "Text Files",
            accept: { "text/plain": supportFileTypes2 },
          },
        ],
      })
      this.fileState = 0
      return this.fileHandle
    } catch (error) {
      console.error("Error opening file:", error)
      return null
    }
  }

  /**
   * @description 读取文件内容
   * @returns 内容，如果没有打开则为undefined
   */
  async readFile(
    fileHandle: FileSystemFileHandle
  ): Promise<string | undefined> {
    if (!this.fileHandle) {
      return
    }
    const file = await this.fileHandle.getFile()
    const content = await file.text()
    // console.log("File content:", content)
    return content
  }

  /**
   * @description 静默保存文件
   */
  async saveFileSilently(text: string): Promise<boolean | void> {
    if (!this.fileHandle) {
      // console.log("No file is opened to save.")
      return
    }
    const writable = await this.fileHandle.createWritable()
    const content = text
    await writable.write(content)
    await writable.close()
    return true
  }
  /**
   * @description 另存为
   */
  async saveAsFile(text: string): Promise<void> {
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
      })

      const writable = await handle.createWritable()
      await writable.write(text ?? "Sth..")
      await writable.close()
      console.log("File saved successfully as new file.")
    } catch (err) {
      console.error("Save As operation cancelled or failed:", err)
    }
  }
}
export interface FileItem {
  id: string
  label: string
  fileType: "file" | "folder"
  path: string
  children?: FileItem[]
}
/**
 * @description 处理文件夹类
 */
export class FileFolderManager extends FileState {
  protected static topDirectoryHandle: FileSystemDirectoryHandle | undefined
  protected currentDirectoryHandle: FileSystemDirectoryHandle | undefined
  protected isWatching: boolean = false
  public watchInterval: ReturnType<typeof setInterval> | null = null

  constructor(directoryHandle?: FileSystemDirectoryHandle) {
    super()
  }
  // Getter for fileState
  public get topDirectoryArray(): Array<any> {
    return FileState.topDirectoryArray
  }
  // Setter for fileState
  public set topDirectoryArray(state: any) {
    FileState.topDirectoryArray = state
  }
  // Getter for fileState
  public get fileState(): 0 | 1 {
    return FileState.fileState
  }

  // Setter for fileState
  public set fileState(state: 0 | 1) {
    FileState.fileState = state
  }
  // Getter for fileHandle
  public get fileHandle(): FileSystemFileHandle | null {
    return FileState.fileHandle
  }

  // Setter for fileHandle
  public set fileHandle(handle: FileSystemFileHandle | null) {
    FileState.fileHandle = handle
  }
  public getTopDirectoryHandle() {
    return FileFolderManager.topDirectoryHandle
  }
  public getCurrentDirectoryHandle() {
    return this.currentDirectoryHandle
  }
  /**
   * @description 打开目录并存储句柄到全局变量
   */
  public async openDirectory(): Promise<FileSystemDirectoryHandle | null> {
    try {
      // 通过 showDirectoryPicker 打开文件夹选择对话框
      const directoryHandle: FileSystemDirectoryHandle =
        await window.showDirectoryPicker()
      // console.log("Directory selected:", directoryHandle)
      FileFolderManager.topDirectoryHandle = directoryHandle
      this.fileState = 1
      this.currentDirectoryHandle = directoryHandle
      return directoryHandle
    } catch (error) {
      console.error("Error opening directory:", error)
      return null
    }
  }
  public async readDirectoryAsArray(
    directoryHandle: FileSystemDirectoryHandle,
    isTop = false
  ) {
    // 递归函数来读取和处理子目录及文件
    async function processEntry(
      this: any,
      entryHandle: FileSystemHandle | any,
      path: string,
      idParts: string[]
    ): Promise<any> {
      const name = entryHandle.name
      const currentPath = path ? `${path}/${name}` : name
      const id = idParts.join(".")

      if (entryHandle.kind === "file") {
        return {
          id: id,
          label: name,
          fileType: "file",
          path: currentPath,
        }
      } else if (entryHandle.kind === "directory") {
        const children = []
        let index = 1
        // 将 entries 转换为数组并排序，以保持顺序一致
        const entriesArray = []
        for await (const [childName, childHandle] of entryHandle.entries()) {
          entriesArray.push([childName, childHandle])
        }
        entriesArray.sort((a, b) => a[0].localeCompare(b[0]))

        for (const [childName, childHandle] of entriesArray) {
          const childIdParts = [...idParts, index.toString()]
          const childEntry = await processEntry(
            childHandle,
            currentPath,
            childIdParts
          )
          children.push(childEntry)
          index++
        }
        let temp: FileItem = {
          id: id,
          label: name,
          children: children,
          fileType: "folder",
          path: currentPath,
        }
        if (isTop) {
          FileState.topDirectoryArray = [temp]
        }
        return temp
      }
    }

    const topLevelEntries = []
    let index = 1
    // 将顶级 entries 转换为数组并排序
    const topEntriesArray: any = []
    for await (const [name, handle] of directoryHandle.entries()) {
      topEntriesArray.push([name, handle])
    }
    topEntriesArray.sort((a: any, b: any[]) => a[0].localeCompare(b[0]))

    for (const [name, handle] of topEntriesArray) {
      const idParts = [index.toString()]
      const entry = await processEntry(handle, "", idParts)
      topLevelEntries.push(entry)
      index++
    }

    return topLevelEntries
  }

  public async listDirectoryAsObject(directoryHandle: any) {
    let directoryObj: any = {}

    // 遍历目录中的各个条目
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === "file") {
        // 如果条目是文件，则将其添加到对象中
        directoryObj[name] = "file"
      } else if (handle.kind === "directory") {
        // 如果条目是目录，则递归调用listDirectoryAsObject
        directoryObj[name] = await this.listDirectoryAsObject(handle)
      }
    }
    // 返回表示目录结构的对象
    return directoryObj
  }
  public async readFileContent(
    directoryHandle: FileSystemDirectoryHandle,
    filePath: string,
    isFile: boolean = false
  ): Promise<string> {
    // 解码文件路径，确保包含中文和空格的路径可以正确处理
    // console.log(filePath);
    const decodedFilePath = decodeURIComponent(filePath)
    const pathParts = decodedFilePath.split("/")
    let currentHandle = directoryHandle

    // 递归遍历目录以找到目标文件
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i]
      if (part) {
        currentHandle = await currentHandle.getDirectoryHandle(part)
      }
    }

    // 获取文件名
    const fileName = pathParts[pathParts.length - 1]
    // 检查文件扩展名
    const fileExtension = fileName.split(".").pop()?.toLowerCase()
    if (!fileExtension) {
      throw new Error("无法识别文件扩展名。")
    }

    // 获取文件句柄
    const fileHandle = await currentHandle.getFileHandle(fileName)
    // 检查文件类型是否支持
    if (isFile) {
      // 处理文件
      if (
        !(
          supportedImageExtensions.includes(fileExtension) ||
          fileExtension === "pdf"
        )
      ) {
        alertUseArco(
          `文件扩展名 .${fileExtension} 不被支持为可读文件。`,
          1000,
          {
            kind: "error",
          }
        )
        throw new Error(`文件扩展名 .${fileExtension} 不被支持为可读文件。`)
      }
      // 不修改 this.fileHandle，保持之前的状态
    } else {
      // 处理文本文件
      if (!supportFileTypes.includes(fileExtension)) {
        alertUseArco(
          `文件扩展名 .${fileExtension} 不被支持为文本文件。`,
          1000,
          {
            kind: "error",
          }
        )
        throw new Error(`文件扩展名 .${fileExtension} 不被支持为文本文件。`)
      }
      // 更新共享的 fileHandle
      this.fileHandle = fileHandle
    }

    // 读取文件内容
    const file = await fileHandle.getFile()

    if (isFile) {
      // 将文件读取为 Base64
      const arrayBuffer = await file.arrayBuffer()
      const base64String = await this.arrayBufferToBase64(
        arrayBuffer,
        file.type
      )
      return base64String
    } else {
      // 读取文本内容
      return await file.text()
    }
  }

  /**
   * @description 检查该目录是否存在，如果存在那么设置当前目录为该目录的句柄
   */
  public async checkOrCreateNestedDirectory(
    directoryHandle: FileSystemDirectoryHandle,
    nestedPath: string
  ): Promise<FileSystemDirectoryHandle> {
    try {
      const pathParts = nestedPath.split("/").filter(Boolean) // 过滤空字符串
      let currentDirHandle = directoryHandle

      for (const part of pathParts) {
        // Check or create each directory part
        currentDirHandle = await currentDirHandle.getDirectoryHandle(part, {
          create: true,
        })
      }

      // After loop, currentDirHandle will be the deepest directory handle
      this.currentDirectoryHandle = currentDirHandle
      return currentDirHandle
    } catch (error) {
      console.error("Error creating nested directory:", error)
      throw error
    }
  }

  public async renameFolder(
    directoryHandle: FileSystemDirectoryHandle,
    oldName: string,
    newName: string
  ): Promise<void> {
    try {
      // 获取旧文件夹句柄
      const oldFolderHandle: any =
        await directoryHandle.getDirectoryHandle(oldName)
      // 创建新文件夹
      const newFolderHandle: FileSystemDirectoryHandle =
        await directoryHandle.getDirectoryHandle(newName, { create: true })

      // 复制旧文件夹内容到新文件夹
      for await (const entry of oldFolderHandle.values()) {
        if (entry.kind === "file") {
          const file = await entry.getFile()
          const newFileHandle = await newFolderHandle.getFileHandle(
            entry.name,
            { create: true }
          )
          const writable = await newFileHandle.createWritable()
          await writable.write(file)
          await writable.close()
        } else if (entry.kind === "directory") {
          // 递归复制子目录
          await this.copyDirectory(entry, newFolderHandle)
        }
      }

      // 删除旧文件夹
      await directoryHandle.removeEntry(oldName, { recursive: true })

      console.log(`Renamed folder from ${oldName} to ${newName}`)
    } catch (error) {
      console.error("Error renaming folder:", error)
    }
  }
  public async writeFile(
    directoryHandle: FileSystemDirectoryHandle,
    fileName: string,
    content: string | Blob
  ): Promise<void> {
    try {
      const fileHandle = await directoryHandle.getFileHandle(fileName, {
        create: true,
      })
      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()
    } catch (error: any) {
      console.error(`Error writing file ${fileName}:`, error)
      throw error
    }
  }

  /**
   * @description Writes a base64 image to a file in a specified nested directory
   */
  public async writeBase64ImageFile(
    directoryHandle: FileSystemDirectoryHandle,
    fileName: string,
    base64Data: string,
    rootPath: string = "/images"
  ): Promise<number> {
    try {
      // Ensure the nested directory structure exists
      const targetDirectoryHandle = await this.checkOrCreateNestedDirectory(
        directoryHandle,
        rootPath
      )
      let maxNumberTemp = 0
      let maxNumber = 0
      for await (const entry of targetDirectoryHandle.values()) {
        if (entry.kind === "file") {
          const match = entry.name.match(/^(\d+)\.png$/) // Match files with only numbers followed by .png
          if (match) {
            const number = parseInt(match[1], 10) // Extract and parse the number
            if (number > maxNumberTemp) {
              maxNumberTemp = number
            }
          }
        }
      }
      maxNumber = maxNumberTemp + 1
      // Extract and decode base64 content
      const base64Part = base64Data.split(",")[1]
      const binaryData = atob(base64Part)
      const uint8Array = new Uint8Array(binaryData.length)

      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i)
      }

      // Create a blob for the image and write to the file
      const blob = new Blob([uint8Array], { type: "image/png" })
      await this.writeFile(targetDirectoryHandle, maxNumber + fileName, blob)
      return maxNumber
    } catch (error) {
      console.error("Error writing Base64 image file:", error)
      throw error
    }
  }

  public async watchDirectory(callback: () => void, interval: number = 1000) {
    if (this.isWatching) return

    this.isWatching = true
    this.watchInterval = setInterval(callback, interval)
  }

  // 停止监控的方法
  public stopWatching() {
    if (this.isWatching && this.watchInterval) {
      clearInterval(this.watchInterval)
      this.isWatching = false
      this.watchInterval = null
    }
  }

  // 辅助函数：将 ArrayBuffer 转换为 Base64
  private async arrayBufferToBase64(
    buffer: ArrayBuffer,
    mimeType: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const blob = new Blob([buffer], { type: mimeType })
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        resolve(base64data)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsDataURL(blob)
    })
  }
  private async copyDirectory(
    sourceHandle: any,
    destinationHandle: FileSystemDirectoryHandle
  ): Promise<void> {
    const newDirHandle = await destinationHandle.getDirectoryHandle(
      sourceHandle.name,
      { create: true }
    )

    for await (const entry of sourceHandle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile()
        const newFileHandle = await newDirHandle.getFileHandle(entry.name, {
          create: true,
        })
        const writable = await newFileHandle.createWritable()
        await writable.write(file)
        await writable.close()
      } else if (entry.kind === "directory") {
        await this.copyDirectory(entry, newDirHandle)
      }
    }
  }
}
