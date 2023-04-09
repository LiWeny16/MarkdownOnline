window.onload = () => {
    allInit()
    // setInterval(()=>{restoreText()},4000)
}

function allInit() {
    if (kit.getCookie("contentText")) { //有cookie
        // preViewText(md2html(fillInRemeText()))
        fillInRemeText()
        mdConverter()
    }
    else {//否则显示教程
        writeMdText(`
欢迎来到在线markdown，请在这里输入markdown语法  

比如:

# 你好，我是标题

## 你好，我是二级标题

你好，我是正文  
正文换行需要结尾打两个空格
如果不打空格，就不换行

你好,我是LATEX  

<center>
$ln({😅}) =💧ln({😄})$ <br><br>  

$\int_{😅}^{😆} 😆^2 dx=😅$
</center>  

<br>
<br>

我下面是分割线

---

| 我      | 是    | 
| -----   | ---- |
| 表      |   格  |

我是 **强调语句**

[我是链接](https://bigonion.cn)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)
`)
        mdConverter()
    }
}


async function mdConverter(save = true) {//按键触发，自动保存，主函数
    let md = getMdText()
    let view = markedParse(md)
    // view = md2html(view)
    view = await latexParse(view)
    console.log(view);
    preViewText(view)
    if(save){
        restoreText()//自动保存
    }
    hljs.highlightAll()
}
function insertStr(source, start, newStr) {
    return source.slice(0, start) + newStr + source.slice(start)
}
function getRegIndex(text, regex) {
    // const text = '$匹配我$ $匹配我$ 不要匹配我 $匹配我$'
    // const regex = /\$(.*?)\$/g
    const result = Array.from(text.matchAll(regex), match => match.index)
    return result
}
function latexParse(md) {
    return new Promise((resolve) => {
        let reg1 = /\$.*?\$/g //含有$的
        let reg2 = /(?<=\$)(.+?)(?=\$)/g
        let parsedTex = new Array()
        let origin = md
        let latex = md.match(reg1)
        let latexIndex = getRegIndex(md, reg1)
        let finalResult = ""

        // let result
        if (latex) {
            try {
                latex.forEach((ele, index) => {
                    ele = ele.match(reg2)
                    if (ele) {
                        parsedTex[index] = katex.renderToString(ele[0], {
                            throwOnError: false
                        })
                    } else {
                        parsedTex[index] = "<span style='color:#cc0000;'>ERR_NULL</span>"
                        // resolve(origin)
                    }
                })
                // 取出来之后
                md = md.replace(reg1, "<!temp?.!>")
                md = md.split("<!temp?.!>")
                parsedTex = [...parsedTex, ""]
                // debugger
                for (let i = 0; i <= md.length - 1; i++) {
                    finalResult += md[i] + parsedTex[i]
                    // console.log(finalResult);
                    if (i == md.length - 1) {
                        resolve(finalResult)

                    }
                }
                // 以下都是无用功（悲）
                // parsedTex.forEach((ele, index) => {
                //     // let temp  = insertStr(md,latexIndex[index])
                //     // md= md[index]+ele+md[index+1]
                //     for(let i=0;i<=md.length;i++){
                //         md+=md[i]
                //     }
                //     // md = insertStr(md, latexIndex[index]+ele.length+1, ele)
                //     if (index == parsedTex.length - 1) {
                //         console.log(md)
                //         resolve(md)
                //     }
                // })
                // latex.forEach((ele, index) => {
                //     ele = ele.match(reg2)
                //     parsedTex[index] = katex.renderToString(ele[index], {
                //         throwOnError: false
                //     })
                // })
                // parsedTex.forEach((ele,index)=>{
                //     result = md.replace(reg1,) 
                // })
                // parsedTex.map(e => console.log(e))


                // latex = latex.match(/(?<=\$)(.+?)(?=\$)/g)


                // console.log(latex)
                // if (latex) {
                //     let parsedLatex = katex.renderToString(latex[0], {
                //         throwOnError: false
                //     })
                //     return md.replace(/\$.*?\$/g, parsedLatex) == undefined ? md : md.replace(/\$.*?\$/g, parsedLatex)
                // } else {
                //     return md
                // }
            } catch (err) {
                console.log(err)
                return 5
            }

        }
        else resolve(origin)
    })

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

function getRememberText() {
    let text = kit.getCookie("contentText").replace(/\<\? br \?\>/g,"\n")
    text = text.replace(/\<\? semicolon \?\>/g,";")
    return text
}
function restoreText() {
    let md = getMdText()
    md = md.replace(/\n/g, "<? br ?>")
    md = md.replace(/\;/g,"<? semicolon ?>")
    kit.setCookie("contentText", md, 30, "/", "md.bigonion.cn")
    kit.setCookie("contentText", md, 30, "/", "127.0.0.1")
}
function fillInRemeText(){
    let text = getRememberText()
    writeMdText(text)
    return text
}