export default function getCommandPaletteText() {
  if (document.getElementsByClassName("ibwrapper")[0]) {
    let inputPalette = document.getElementsByClassName("ibwrapper")[0]
      .children[0] as HTMLInputElement
    return inputPalette.value
  } else {
    return ""
  }
}
