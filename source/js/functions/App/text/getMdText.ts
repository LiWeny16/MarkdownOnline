export default function getMdText(id = "md-area") {
  let inputEle = document.getElementById(id) as HTMLInputElement
  if (inputEle) {
    return inputEle.value
  }
}

export function getMdTextFromMonaco() {
  if (window.editor?.getValue) {
    let _text= window.editor.getValue()
    _text = _text.replace(/\r\n/g, "\n");
    return _text
  } else {
    return "null"
  }
}

export function geTextFromMonacoLine(lineNumber:number){
  return window.monaco.editor.getModels()[0].getLineContent(lineNumber)
}

export function getRenderHTML(id = "view-area") {
  let ele = document.getElementById(id) as HTMLInputElement
  if (ele) {
    return ele.innerHTML
  }
}
