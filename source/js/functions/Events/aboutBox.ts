import * as marked_esm from "@cdn-marked"
import svg_1 from "@Asset/img/aboutBox关闭.svg"
import welcomeText from "@Asset/about.md?raw"
export default () => {
  let shutDownSvg = `
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${svg_1} alt="">
</div>
`
  let aboutMd = welcomeText
  if (document.getElementById("aboutMd")) {
    document.getElementById("aboutMd")!.innerHTML =
      shutDownSvg + md2Html(aboutMd)
  }

  function md2Html(md: string) {
    // console.log(md);
    return marked_esm.marked.parse(md)
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
