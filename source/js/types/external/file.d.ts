/**
 * @copyright Bigonion
 * @description file interface 
*/
interface SaveFilePickerOptions {
  types?: FilePickerAcceptType[] // 文件类型选项
  suggestedName?: string // 建议的文件名
  excludeAcceptAllOption?: boolean // 是否排除接受所有类型的选项
  startIn?: FileSystemHandle | string // 开始浏览的目录
}
interface FilePickerAcceptType {
  description: string // 文件类型描述
  accept: Record<string, string[]> // 具体的文件类型和扩展名
}
