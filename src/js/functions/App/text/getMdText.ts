/**
 * @description 获取Monaco全部文本
 */
export function getMdTextFromMonaco() {
  if (window.editor?.getValue) {
    let _text = window.editor.getValue()
    return _text
  } else {
    return "null"
  }
}
/**
 * @description 从行获取文本
 */
export function geTextFromMonacoLine(lineNumber: number) {
  return window.monaco.editor.getModels()[0].getLineContent(lineNumber)
}

export function getRenderHTML(id = "view-area") {
  let ele = document.getElementById(id) as HTMLInputElement
  if (ele) {
    return ele.innerHTML
  }
}
