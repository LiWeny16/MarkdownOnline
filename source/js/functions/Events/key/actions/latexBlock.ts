import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeLatexBlockAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const position = editor.getPosition()!
  if (position.column == 1) {
    insertTextMonacoAtCursor(`$$\n\n$$`, true)
    editor.setPosition({
      column: 1,
      lineNumber: position.lineNumber + 1,
    })
  }
}
