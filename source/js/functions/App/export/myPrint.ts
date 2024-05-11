// import { kit } from "@Root/js/index"
import { getTheme } from "@App/config/change"
import kit from "@cdn-kit"

export default function myPrint() {
  // let printString = document.getElementById("view-area")!.innerHTML
  // // console.log(printString)
  // window.document.body.style.background =
  //   getTheme() === "light" ? "" : "#0D1117"
  // window.document.body.innerHTML = `<div class="markdown-body markdown-body-${getTheme() === "light" ? "light" : "dark"}">${printString}</div>`
  kit.sleep(400).then(() => {
    window.print()
  })
}
