import { marked } from 'marked';
import svg_1 from "../assets/img/aboutBox关闭.svg"
import welcomeText from "../assets/about.md?raw"

export default () => {
    let shutDownSvg = `
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${svg_1} alt="">
</div>
`
    let aboutMd = welcomeText
    document.getElementById('aboutMd').innerHTML = shutDownSvg + md2Html(aboutMd)

    function md2Html(md) {
        // let converter = new showdown.Converter()
        // converter.setOption('tables', true)
        // let md_html = converter.makeHtml(md)
        console.log(md);
        // console.log(md_html);
        return marked.parse(md)
    }
    // event mount
    document.getElementById('closeAboutSvg').addEventListener('click', () => {
        document.getElementById('aboutBox').style.display = "none"
    })
    document.getElementById('aboutBox').addEventListener('click', (e) => {
        if (e.target == document.getElementById('markdownParser')) {
            document.getElementById('aboutBox').style.display = "none"
        }
    })
    document.getElementById('showAbout').addEventListener('click', () => {
        document.getElementById('aboutBox').style.display = "block"
        document.body.style.background = "#00000066"
    })
}