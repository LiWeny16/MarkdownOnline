import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function monacoClickEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  editor.onDidFocusEditorWidget(() => {
    window._deco.clear()
  })
}
