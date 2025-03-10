// import { kit } from "@Root/js/index"
import { getTheme } from "@App/config/change"
import kit from "@cdn-kit"

import html2canvas from "html2canvas"

// var node = document.getElementById("view-area")!

export default function exportAsImage(
  scale: number = 3,
  name = "markdown.jpeg"
) {
  let printString = document.getElementById("view-area")!.innerHTML
  // console.log(printString)
  window.document.body.innerHTML = `<div id="exportBox" style="width:64vw" class="markdown-body markdown-body-${getTheme() === "light" ? "light" : "dark"}">${printString}</div>`
  kit.sleep(250).then(() => {
    // 使用 html2canvas 将 HTML 元素渲染为图像
    html2canvas(document.getElementById("exportBox")!, {
      scale: scale, // 设置缩放因子以获得高清图像
    }).then((canvas) => {
      // 创建一个新的 <img> 元素并将图像数据赋值给它
      let dataURL = canvas.toDataURL("image/png", 0.6)
      // console.log(dataURL)
      var link = document.createElement("a")
      link.download = name
      link.href = dataURL
      link.click()
    })

    kit.sleep(2000).then(() => {
      window.location.reload()
    })
  })
}
