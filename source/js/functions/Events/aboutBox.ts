import svg_1 from "@Asset/img/aboutBox关闭.svg"
// import welcomeText from "@Asset/about.md?raw"

import { markdownParser } from "@Func/Init/allInit"

let aboutMd
export default async () => {
  let shutDownSvg = `
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${svg_1} alt="">
</div>
`
  await fetch(
    "https://jsd.onmicrosoft.cn/gh/LiWeny16/MarkdownOnline@main/source/assets/about.md"
  )
    .then(async (response) => {
      aboutMd = response.text()
      if (document.getElementById("aboutMd")) {
        document.getElementById("aboutMd")!.innerHTML =
          shutDownSvg + md2Html(await aboutMd)
      }
    })
    .catch((error) => {
      console.error("Error fetching markdown:", error)
    })

  function md2Html(md: string) {
    // console.log(md);
    return markdownParser().render(md)
  }
  // event mount
  document.getElementById("closeAboutSvg")!.addEventListener("click", () => {
    document.getElementById("aboutBox")!.style.display = "none"
  })
  document.getElementById("aboutBox")!.addEventListener("click", (e) => {
    if (e.target == document.getElementById("markdownParser")) {
      document.getElementById("aboutBox")!.style.display = "none"
    }
  })
  document.getElementById("aboutBox")!.style.display = "block"
}
