import { changeFileManagerState, getFileManagerState } from "@App/config/change"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeFileManagerAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  if (getFileManagerState()) {
    changeFileManagerState(false)
  } else {
    changeFileManagerState(true)
  }
}
