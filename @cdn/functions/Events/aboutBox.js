import { marked } from "@cdn-marked";
import svg_1 from "@Asset/img/aboutBox关闭.svg";
import welcomeText from "@Asset/about.md?raw";
export default async () => {
    let shutDownSvg = `
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${svg_1} alt="">
</div>
`;
    let aboutMd = welcomeText;
    if (document.getElementById("aboutMd")) {
        document.getElementById("aboutMd").innerHTML =
            shutDownSvg + (await md2Html(aboutMd));
    }
    function md2Html(md) {
        // console.log(md);
        return marked.parse(md);
    }
    // event mount
    document.getElementById("closeAboutSvg").addEventListener("click", () => {
        document.getElementById("aboutBox").style.display = "none";
    });
    document.getElementById("aboutBox").addEventListener("click", (e) => {
        if (e.target == document.getElementById("markdownParser")) {
            document.getElementById("aboutBox").style.display = "none";
        }
    });
    document.getElementById("aboutBox").style.display = "block";
};
