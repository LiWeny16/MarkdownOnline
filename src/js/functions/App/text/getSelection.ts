import { editor } from "monaco-editor"

/**
 * @description 获取选中的文本
*/
export default function getSelectionText(
  editor: editor.IStandaloneCodeEditor = window.editor
) {
  const _editor = editor ?? window.editor
  // 获取当前选中内容
  var selection = _editor.getSelection()!
  // 获取选中内容的起始和结束位置
  var startLineNumber = selection.startLineNumber
  var startColumn = selection.startColumn
  var endLineNumber = selection.endLineNumber
  var endColumn = selection.endColumn
  // 通过起始和结束位置获取选中的文本
  var selectedText = _editor.getModel()!.getValueInRange({
    startLineNumber: startLineNumber,
    startColumn: startColumn,
    endLineNumber: endLineNumber,
    endColumn: endColumn,
  })
  return selectedText
}

/**
 * @description 判断selection是否为空
*/
export function selectionIsNull(
  editor: editor.IStandaloneCodeEditor = window.editor
) {
  const _editor = editor ?? window.editor
  // const position = window.editor.getPosition()
  const selection = _editor.getSelection()!
  if (
    selection.startLineNumber == selection.endLineNumber &&
    selection.startColumn == selection.endColumn
  ) {
    return true
  }
  return false
}
