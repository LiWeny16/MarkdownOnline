export default function getMdText(id = "md-area") {
  let inputEle = document.getElementById(id) as HTMLInputElement
  if (inputEle) {
    return inputEle.value
  }
}

export function getRenderHTML(id = "view-area") {
  let ele = document.getElementById(id) as HTMLInputElement
  if (ele) {
    return ele.innerHTML
  }
}
