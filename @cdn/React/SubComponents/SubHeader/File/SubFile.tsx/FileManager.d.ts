import { FileFolderManager } from "@App/fileSystem/file";
type FileType = "image" | "pdf" | "doc" | "video" | "folder" | "pinned" | "trash";
export type ExtendedTreeItemProps = {
    fileType?: FileType;
    id: string;
    label: string;
};
declare module "react" {
    interface CSSProperties {
        "--tree-view-color"?: string;
        "--tree-view-bg-color"?: string;
    }
}
export default function FileExplorer(props: {
    fileDirectoryArr: any;
    folderManager: FileFolderManager;
    setIsDragging: Function;
    fillText: Function;
    onRefresh?: () => void;
    onManualRefresh?: (operationType?: string) => Promise<void>;
    currentEditingFile?: string;
    onFileSelect?: (filePath: string) => void;
    onLoadLazily?: (itemId: string, folderPath: string) => Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
export {};
