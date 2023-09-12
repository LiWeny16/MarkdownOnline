/**
 * @description 插入文本
 */
export default function insertTextAtCursor(textElement:any, textToInsert:any) {
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