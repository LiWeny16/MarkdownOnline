import { changeFileManagerState, getFileManagerState } from "@App/config/change";
export default function exeFileManagerAction(editor, monaco) {
    if (getFileManagerState()) {
        changeFileManagerState(false);
    }
    else {
        changeFileManagerState(true);
    }
}
