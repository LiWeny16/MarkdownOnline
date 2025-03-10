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

interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  kind: 'directory';
  getFileHandle(name: string, options?: GetFileHandleOptions): Promise<FileSystemFileHandle>;
  getDirectoryHandle(name: string, options?: GetDirectoryHandleOptions): Promise<FileSystemDirectoryHandle>;
  removeEntry(name: string, options?: RemoveEntryOptions): Promise<void>;
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  keys(): AsyncIterableIterator<string>;
  values(): AsyncIterableIterator<FileSystemHandle>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  kind: 'file';
  getFile(): Promise<File>;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

interface GetFileHandleOptions {
  create?: boolean;
}

interface GetDirectoryHandleOptions {
  create?: boolean;
}

interface RemoveEntryOptions {
  recursive?: boolean;
}

interface FileSystemCreateWritableOptions {
  keepExistingData?: boolean;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: File | BufferSource | Blob | string | WriteParams): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

interface WriteParams {
  type: 'write' | 'seek' | 'truncate';
  data?: File | BufferSource | Blob | string;
  position?: number;
  size?: number;
}


// 
interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface FilePickerOptions {
  multiple?: boolean;
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: File | BufferSource | Blob | string | WriteParams): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}