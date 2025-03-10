import kit from "@cdn-kit";
import {getMdTextFromMonaco} from "@App/text/getMdText";

export default function exportAsMd() {
  let md = getMdTextFromMonaco() ?? ""
  kit.sleep(250).then(() => {
    // 使用 html2canvas 将 HTML 元素渲染为图像

    // 创建一个新的 <img> 元素并将图像数据赋值给它
    var link = document.createElement("a")
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(md)
    link.download = "text.md"
    link.click()
  })
}
