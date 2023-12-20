/**
 * @description 插入文本
 */
export default function insertTextAtCursor(
  textElement: any,
  textToInsert: any
) {
  const startPos = textElement.selectionStart
  const endPos = textElement.selectionEnd

  textElement.value =
    textElement.value.substring(0, startPos) +
    textToInsert +
    textElement.value.substring(endPos)

  textElement.selectionStart = startPos + textToInsert.length
  textElement.selectionEnd = startPos + textToInsert.length

  textElement.focus()
}

export function insertTextMonacoAtCursor(textToInsert: any) {
  const _editor = window.editor
  const newText = textToInsert
  // const position = window.editor.getPosition()
  const selection = window.editor.getSelections()[0]
  _editor.executeEdits("my-insert", [
    {
      range: new window.monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      ),
      text: newText,
      forceMoveMarkers: false,
    },
  ])
}
