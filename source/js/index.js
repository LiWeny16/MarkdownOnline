window.onload = () => {
    // rememberText()
    // document.getElementById("view-area").innerHTML= md2html(document.getElementById("md-area").value)
    // md2html(document.getElementById("md-area").value)
    if (kit.getCookie("contentText")) { //有cookie
        preViewText(md2html(fillInRemeText()))
    }
    else {//否则显示教程
        writeMdText(`欢迎来到在线markdown，请在这里输入markdown语法  

比如:

# 你好，我是标题

## 你好，我是二级标题

你好，我是正文  
正文换行需要结尾打两个空格
如果不打空格，就不换行


我下面是分割线

---

| 我      | 是    | 
| -----   | ---- |
| 表      |   格  |

我是 **强调语句**

[我是链接](https://bigonion.cn)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)`)
        mdConverter()
    }
}


function mdConverter() {//按键触发，自动保存，主函数
    let md = getMdText()
    // console.log(md)
    let view = markedParse(md)
    // view = md2html(view)
    view = latexParse(view)
    preViewText(view)
    restoreText()//自动保存
    hljs.highlightAll()
}
function latexParse(md) {
    let latex = md.match(/\$.*?\$/g)
    if (latex) {
        try {
            latex = latex[0].match(/(?<=\$)(.+?)(?=\$)/g)
            // console.log(latex)
            if (latex) {
                let parsedLatex = katex.renderToString(latex[0], {
                    throwOnError: false
                })
                return md.replace(/\$.*?\$/g, parsedLatex)
            }
        } catch (err) {
            console.log(err);
        }

    }
    else return md
}
function markedParse(md) {
    return marked.parse(md)
}
function md2html(md) {
    // set Options
    var converter = new showdown.Converter()  //增加拓展table
    converter.setOption('tasklists', true)
    converter.setOption('moreStyling', true)
    converter.setOption('completeHTMLDocument', true)
    converter.setOption('smoothLivePreview', true)
    converter.setOption('simplifiedAutoLink', true)
    converter.setOption('tables', true)//启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
    var view = converter.makeHtml(md)
    return view
}
function writeMdText(text) {
    document.getElementById("md-area").value = text
}

function getMdText() {
    return document.getElementById("md-area").value
}
function preViewText(text) {
    document.getElementById("view-area").innerHTML = text
}