import { marked } from 'marked';
import svg_1 from "../assets/aboutBox关闭.svg"


let shutDownSvg = `
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${svg_1} alt="">
</div>
`
let aboutMd = `
# 关于

本项目使用了Showdown.js来快速转换Markdown=>HTML，并且能够实时预览效果，不需要额外的操作即可体验到十分不错的在线markdown实时预览<br>
如果你还不了解什么是markdown语法，那请[点我了解markdown语法](https://markdown.com.cn/intro.html)

## Todo
+ <s>增加PDF导出</s>
+ <s>增加代码高亮</s>
+ <s>LATEX公式支持</s>
+ <s>增加快捷键Ctrl+B加粗和Ctrl+Alt+C居中</s>
+ 增加设置按钮以配置脚本注入和换行等规则
+ img图片支持

## 教程
+ LATEX请写在用$$中间  
例如 $\lambda$ 

## 新增特性
+ 右对齐可以用 "右边对齐".RIGHT 
+ 红色文字可以用 "我是红色的耶".RED 
+ 注意!，最后必须有一个**空格**表示结束
+ 支持脚本注入,请用script标签包裹

## 作者

**Bigonion**

## 开源协议

**MIT**

## Namespace 
[https://github.com/LiWeny16/MarkdownOnline](https://github.com/LiWeny16/MarkdownOnline)  
[https://bigonion.cn](https://bigonion.cn)
`
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
document.getElementById('aboutBox').addEventListener('click', () => {
    document.getElementById('aboutBox').style.display = "none"
})
document.getElementById('showAbout').addEventListener('click', () => {
    document.getElementById('aboutBox').style.display = "block"
    document.body.style.background = "#00000066"
})