import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

/**
 * @description 快速标题1-4
 */
export default function exeHeadingAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
  level: number
) {
  const selection = editor.getSelection()
  const range = new monaco.Range(
    selection!.startLineNumber,
    1,
    selection!.startLineNumber,
    1
  )
  const lineContent = editor!
    .getModel()!
    .getLineContent(selection!.startLineNumber)
  const headingRegex = /^(#+) /

  const match = lineContent.match(headingRegex)
  if (["$"].includes(lineContent[0]) ||lineContent.match("\`\`\`")) {
    return
  }
  if (match && match[1].length === level) {
    console.log(lineContent)
    const newText = lineContent.slice(match[0].length)
    editor.executeEdits("", [
      {
        range: new monaco.Range(
          selection!.startLineNumber,
          1,
          selection!.startLineNumber,
          lineContent.length + 1
        ),
        text: newText,
      },
    ])
  } else {
    // Add or replace heading
    const newHeading = "#".repeat(level) + " "
    const replaceRange = match
      ? new monaco.Range(
          selection!.startLineNumber,
          1,
          selection!.startLineNumber,
          match[0].length + 1
        )
      : range
    editor.executeEdits("", [
      {
        range: replaceRange,
        text: newHeading,
      },
    ])
  }
}
