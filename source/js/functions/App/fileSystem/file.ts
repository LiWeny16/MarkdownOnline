import OperateLocalStorage from "@App/localStorage/localStorage"
import alertUseArco from "@App/message/alert"

const supportFileTypes = [".md", ".py", ".js", ".ts"]

/**
 * @description 文件管理类
 */
export class FileManager {
  public fileHandle: FileSystemFileHandle | null = null
  /**
   * @description 构造函数
   */
  constructor(fileHandle?: FileSystemFileHandle | null) {
    if (fileHandle) {
      this.fileHandle = fileHandle
    } else {
      this.fileHandle = window._fileHandle ?? window._fileHandle
    }
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
            accept: { "text/plain": supportFileTypes },
          },
        ],
      })
      window._fileHandle = this.fileHandle!
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
  async readFile(): Promise<string | undefined> {
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
              "text/plain": supportFileTypes,
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
