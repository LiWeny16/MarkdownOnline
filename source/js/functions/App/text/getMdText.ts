export default function getMdText(id = "md-area") {
  let inputEle = document.getElementById(id) as HTMLInputElement
  if (inputEle) {
    return inputEle.value
  }
}
