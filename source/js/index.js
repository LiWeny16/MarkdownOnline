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

# "新一代的$“Markdown^+”$编辑器".RED 


# 你好，我是标题

## 你好，我是二级标题

你好，我是正文  
"你好,我是markdown扩展语法".RIGHT 
正文换行需要结尾打两个空格
如果不打空格，就不换行

你好,我是LATEX  

$$
ln({1}) =3ln({2})  
\
int_{4}^{5} 6^2 dx=7
$$


<br>
<br>

我下面是分割线

---

| 我      | 是    | 
| -        |  -     |
| 表      |   格  |

我是 **强调语句**

[我是链接](https://bigonion.cn)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)

### 我是扩展语法

"![我是图片](http://bigonion.cn/background/wallheaven.jfif)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)".GRID4 

        
     
                
        
`)
        mdConverter()
    }
}
const enObj = {
    enFastKey: true,
    enScript: true,
    enHilightJs: true,
    enClue: true
}

initialize()
function initialize() {
    enObj.enFastKey ? enableFastKeyEvent() : console.log("fastKey is on");
}
async function mdConverter(save = true) {//按键触发，自动保存，主函数
    let view = getMdText()
    enObj.enClue ? view = await clueParse(view) : console.log("clue off");
   
    view = await latexParse2(view)
    view = await latexParse(view)
    view = markedParse(view)
    enObj.enScript ? enableScript(view) : console.log("fast scripts off");
    // view = md2html(view)

    // console.log(view);
    preViewText(view)
    if (save) {
        restoreText()//自动保存
    }
    // 拓展功能
    enObj.enHilightJs ? hljs.highlightAll() : console.log("hilight off");
    // mermaid.initialize()

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
/**
 * @description clue CSS HTML
*/
function clueParse(md) {
    md = md.replace(/\n/g,">br") //暂时替代换行符号
    return new Promise((resolve) => {
        const reg1 = /".*?"\..*?\s/g  //整个"content".CLASS 结构
        const reg2 = /".*?"/g //匹配 "之间"
        const reg3 = /\..*?\s/g //匹配class 的. 和空格之间 未反转前
        const reg3_reverse = /\s.*?\./g //匹配class 的. 和空格之间 反转
        const reg4 = /(?<=.).*?(?=\s)/g //匹配 . 和 空格之间 不包括. \s
        const reg5 = /(?<=").*(?=")/g  //匹配"之间"不包括""
        if (md) {
            md = md.replace(reg1, (e) => {
                var parsedHTML = ""
                var content
                var clueClass
                if (e.match(reg2)) {
                    content = e.match(reg5)[0]
                }
                if (e.match(reg3)) {
                    e = reverseString(e)
                    // console.log(e.match(reg4))
                    clueClass = e.match(reg3_reverse)[0]
                    clueClass = reverseString(clueClass)
                    clueClass = clueClass.replace(/(\s)|(\.)/g, "")
                    // clueClass = clueClass.match(reg4)[0]
                }
                // console.log(content);
                // console.log(clueClass);
                content = content.replace(/\>br/g,"\n")//解除换行限制
                parsedHTML = `<div class="${clueClass}">${markedParse(content)}</div>`
                return parsedHTML
            })
        }
        md=md.replace(/\>br/g,"\n")
        resolve(md)

    })
}

function latexParse2(md, center = true) {
    md = md.replace(/\n/g,"<!br") //暂时替代换行符号
    return new Promise((resolve) => {
        let reg1 = /\$\$.*?\$\$/g  //含有$的
        let reg2 = /(?<=(\$\$))(.+?)(?=(\$\$))/g
        if (md) {
            md = md.replace(reg1, (e) => {
                if (e.match(reg2)) {
                    e = e.match(reg2)[0]
                    e = e.replace(/\<\!br/g,"") //解除换行替代
                } else {
                    return ""
                }
                // 官方示例API
                if (e) {
                    var html = katex.renderToString(e, {
                        throwOnError: false
                    });
                    if (center) {
                        html = `<center>${html}</center>`
                    }
                    return html
                } else {
                    return ""
                }

            }) 
            md=md.replace(/\<\!br/g,"\n")//解除换行替代
            resolve(md)
        }
        else {
            resolve(md)
        }
    })
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
/**
 * @description showdown转换
*/
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
    let text = kit.getCookie("contentText").replace(/\<\? br \?\>/g, "\n")
    text = text.replace(/\<\? semicolon \?\>/g, ";")
    return text
}
function restoreText() {
    let md = getMdText()
    md = md.replace(/\n/g, "<? br ?>")
    md = md.replace(/\;/g, "<? semicolon ?>")
    kit.setCookie("contentText", md, 30, "/", "md.bigonion.cn")
    kit.setCookie("contentText", md, 30, "/", "127.0.0.1")
}
function fillInRemeText() {
    let text = getRememberText()
    writeMdText(text)
    return text
}
// print 函数
function myPrint() {
    let printString = document.getElementById("view-area").innerHTML
    console.log(printString);
    window.document.body.innerHTML = `<div class="markdown-body">${printString}</div>`
    window.print()
    location.reload();
}

// 快捷键
/**
 * @description 使能快捷键
*/
function enableFastKeyEvent() {
    document.addEventListener('keydown', (e) => {
        e.stopPropagation()
        // Ctrl + B 黑体
        let editor = document.getElementById("md-area")
        if (e.ctrlKey && e.key == "b") {
            replaceSelection(editor, "**", "**")
        }
        if (e.key == "c" && e.altKey) {
            replaceSelection(editor, "<center>", "</center>")
        }
    })
}
/**
 * @description 使能脚本注入
*/
function enableScript(md) {
    md = md ? md.match(/(?<=(\<script\>))(.+?)(?=(\<\/script\>))/g) : ""
    if (md) {
        md.forEach((e) => {
            e = e.match(/alert\(.*?\)/g) ? "" : e
            eval(e)
        })
    }
}

/**
 * @description 插入选中文本
 * @param e HTMLelement
 * @param leftStr String
 * @param rightStr String
*/
function replaceSelection(e, leftStr, rightStr) {
    var start = e.selectionStart;
    var end = e.selectionEnd;
    console.log(start, end);
    if (start == end) {
        return ""
    } else {
        temp = e.value.substr(0, start) + leftStr + e.value.substring(start, end) + rightStr +
            e.value.substring(end, e.value.length);
        e.value = temp
        console.log(e.value.substring(start, end));
        console.log(e.value.substring(start, end).length);
        // 移动光标
        e.setSelectionRange(start, end + leftStr.length + rightStr.length)

    }

}
/**
 * @description 倒序
 * @params string
 * @returns revser
*/

function reverseString(str) {
    return str.split('').reverse().join('');
}
