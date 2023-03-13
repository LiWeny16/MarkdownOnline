let shutDownSvg=`
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src="./source/assets/aboutBox关闭.svg" alt="">
</div>
`
let aboutMd = `
# 关于

本项目使用了Marked.js来快速转换Markdown=>HTML，并且能够实时预览效果，不需要额外的操作即可体验到十分不错的在线markdown实时预览<br>
如果你还不了解什么是markdown语法，那请[点我了解markdown语法](https://markdown.com.cn/intro.html)

## Todo
+ 增加PDF导出
+ 增加代码高亮

## 作者

**Bigonion**

## 开源协议

**MIT**

## Namespace 
[https://github.com/LiWeny16/MarkdownOnline](https://github.com/LiWeny16/MarkdownOnline)  
[https://bigonion.cn](https://bigonion.cn)
`
document.getElementById('aboutMd').innerHTML=shutDownSvg+md2Html(aboutMd)

function md2Html(md) {
    let converter = new showdown.Converter()
    converter.setOption('tables', true)
    let md_html = converter.makeHtml(md)
    console.log(md);
    console.log(md_html);
    return md_html
}
// event mount
document.getElementById('closeAboutSvg').addEventListener('click',()=>{
    document.getElementById('aboutBox').style.display="none"
})
document.getElementById('showAbout').addEventListener('click',()=>{
    document.getElementById('aboutBox').style.display="block"
})