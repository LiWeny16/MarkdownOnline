import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

/**
 * @description 居右
 */
export default function exeAlignRightAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const selection = editor.getSelection() // 获取当前的选择区域
  const model = editor.getModel()!
  const lineNumber = selection!.startLineNumber
  const lineContent = model.getLineContent(lineNumber) // 获取当前行内容
  const lineEnd = lineContent.length // 当前行的长度

  let newText = ""
  let startColumn = lineEnd + 1 // 开始替换的列位置
  let endColumn = lineEnd + 1 // 结束替换的列位置

  // 检查当前行的最后两个字符
  const lastTwoChars = lineContent.slice(-2)
  if (lastTwoChars === ">>") {
    // 如果是 '>>'，则需要移除
    newText = "" // 将要替换的文本设置为空
    startColumn = lineEnd - 1 // 开始替换的位置调整为最后两个字符的开始
  } else if (lastTwoChars === "||") {
    // 如果是 '||'，则替换为 '>>'
    newText = ">>"
    startColumn = lineEnd - 1 // 开始替换的位置调整为最后两个字符的开始
  } else {
    // 如果不是这两种情况，直接在行尾添加 '>>'
    newText = ">>"
  }

  // 定义要替换的范围
  const rangeToReplace = new monaco.Range(
    lineNumber,
    startColumn,
    lineNumber,
    endColumn
  )

  // 执行编辑操作
  editor.executeEdits("my-source", [
    { range: rangeToReplace, text: newText, forceMoveMarkers: true },
  ])

  // 更新光标位置，光标应放在新文本之后
  const newSelection = new monaco.Selection(
    lineNumber,
    startColumn + newText.length,
    lineNumber,
    startColumn + newText.length
  )
  editor.setSelection(newSelection)
}
