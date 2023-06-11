import*as marked_esm from"https://npm.elemecdn.com/marked/lib/marked.esm.js";import{marked}from"https://npm.elemecdn.com/marked/lib/marked.esm.js";import mermaid from"https://npm.elemecdn.com/mermaid@10/dist/mermaid.esm.min.mjs";import kit from"https://npm.elemecdn.com/bigonion-kit@0.11.0/esm/esm-kit.mjs";import hljs from"https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=a(r);fetch(r.href,i)}})();const svg_1="/2904f250.aboutBox关闭.svg",welcomeText$1=`# 关于\r
\r
本项目使用了marked.js来快速转换Markdown=>HTML，并且能够实时预览效果，不需要额外的操作即可体验到十分不错的在线markdown实时预览体验<br>\r
\r
## 什么是markdown?\r
\r
&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;和word不同，markdown是文本标记语言，它会把所有操作都以文本的形式展现出来  \r
&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;例如你想写一个标题，你在word里可能得点击一下右上角的标题，但是在markdown里则是通过写在“#”后来表示这是一个标题文本  \r
例如：\r
\`\`\`md\r
# 我是标题\r
\`\`\`\r
&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;如果你想写一段代码区，在word里会比较难实现，但是在markdown里，你只需要用两个\`\`\`包裹住代码即可  \r
\`\`\`js\r
    \`\`\`js\r
    alert("welcome to markdown")\r
    \`\`\`\r
\`\`\`\r
\r
\r
如果你还不了解什么是markdown语法，那请[点我了解markdown语法](https://markdown.com.cn/intro.html)  \r
\r
## 为什么要使用markdown?\r
+ 足够快捷，方便，适合写博客\r
+ word排版容易乱， markdown舍弃了一些复杂的功能，  \r
  换来了一定程度的快捷\r
+ 输入代码足够容易，并支持高亮\r
+ 支持嵌入LATEX(word其实也可以)\r
+ 背靠HTML语法，想你所想，做你所做\r
+ ~~当然啦是颜狗最爱ヾ(•ω•\`)o~~\r
\r
## Todo\r
+ <s>增加PDF导出</s>\r
+ <s>增加代码高亮</s>\r
+ <s>LATEX公式支持</s>\r
+ <s>增加快捷键Ctrl+B加粗和Ctrl+Alt+C居中</s>\r
+ 像[jupyter](https://jupyter.org/)那样支持一行一行的运行JS/Python脚本(基于[WASM](https://developer.mozilla.org/zh-CN/docs/WebAssembly))\r
+ 增加设置按钮以配置脚本注入和换行等规则\r
+ Img图片支持\r
+ 替换成Vscode前端编辑器，加入完整的快捷键提示支持\r
\r
## 教程\r
+ LATEX请写在用$$中间  \r
例如 $\\lambda$ [知乎:LaTeX数学公式、常用符号大全](https://zhuanlan.zhihu.com/p/510451940)\r
+ mermaid请见官网[https://mermaid.js.org/intro/](https://mermaid.js.org/intro/)\r
\r
## 新增特性\r
+ 右对齐可以用 "右边对齐".RIGHT \r
+ 红色文字可以用 "我是红色的耶".RED &nbsp;\r
+ 注意！最后必须有一个**空格**表示结束\r
+ [[DEV]](#)支持脚本注入，请用script标签包裹\r
+ mermaid 流程图支持！\r
## 作者\r
\r
**Bigonion**\r
\r
## 开源协议\r
/*  \r
\\* @Author bigonion  \r
\\* @Copyright 2022© 至今  \r
*/  \r
**MIT**\r
\r
## Namespace \r
[https://github.com/LiWeny16/MarkdownOnline](https://github.com/LiWeny16/MarkdownOnline)  \r
[https://bigonion.cn](https://bigonion.cn)\r
\r
\r
`,aboutBox=()=>{let n=`
<div class="closeBox" id="closeAbout">
<img id="closeAboutSvg" class="closeSvg" src=${svg_1} alt="">
</div>
`,t=welcomeText$1;document.getElementById("aboutMd").innerHTML=n+a(t);function a(o){return console.log(o),marked_esm.marked.parse(o)}document.getElementById("closeAboutSvg").addEventListener("click",()=>{document.getElementById("aboutBox").style.display="none"}),document.getElementById("aboutBox").addEventListener("click",o=>{o.target==document.getElementById("markdownParser")&&(document.getElementById("aboutBox").style.display="none")}),document.getElementById("showAbout").addEventListener("click",()=>{document.getElementById("aboutBox").style.display="block",document.body.style.background="#00000066"})},welcomeText=`# "新一代的$“Markdown^+”$编辑器".RED \r
\r
\r
# 你好，我是标题\r
\r
## 你好，我是二级标题\r
\r
你好，我是正文  \r
"你好,我是markdown扩展语法".RIGHT \r
\r
\`正文换行需要结尾打两个空格\r
如果不打空格，就不换行\`\r
\r
你好,我是LATEX  \r
\r
$$\r
\\begin{bmatrix}\r
1&2&3\\\\\r
4&5&6\\\\\r
7&8&9\r
\\end{bmatrix}\r
*\r
\\begin{bmatrix}\r
1&2&3\\\\\r
4&5&6\\\\\r
7&8&9\r
\\end{bmatrix}=?\r
$$\r
\r
<br>\r
\r
\r
\r
我下面是分割线\r
\r
---\r
\r
| 我      | 是    | \r
| -        |  -     |\r
| 表      |   格  |\r
\r
我是 **强调语句**\r
\r
[我是链接](https://bigonion.cn)\r
\r
### 我是扩展语法\r
\r
"![我是图片](http://bigonion.cn/background/wallheaven.jfif)\r
![我是图片](http://bigonion.cn/background/wallheaven.jfif)\r
![我是图片](http://bigonion.cn/background/wallheaven.jfif)\r
![我是图片](http://bigonion.cn/background/wallheaven.jfif)".GRID4 \r
\r
\r
\r
\`\`\`js\r
// 我是代码\r
// 创建模型  \r
const model = tf.sequential();  \r
model.add(tf.layers.dense({units: 1, inputShape: [1]}));  \r
  \r
// 编译模型  \r
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});  \r
  \r
// 准备训练数据  \r
const xs = tf.tensor2d([[0], [1], [2], [3], [4], [5]], [6, 1]);  \r
const ys = tf.tensor2d([[1], [3], [5], [7], [9], [11]], [6, 1]);  \r
  \r
// 训练模型  \r
model.fit(xs, ys, {epochs: 100}).then(() => {  \r
  // 使用模型进行预测  \r
  const prediction = model.predict(tf.tensor2d([6], [1, 1]));  \r
    \r
  // 打印预测结果  \r
  prediction.data().then((result) => {  \r
    console.log(result); // 输出 12.002  \r
  });  \r
});  \r
\`\`\`\r
     \r
                \r
\r
我是mermaid**流程图表** \r
\r
\r
"sequenceDiagram\r
    participant Alice\r
    participant Bob\r
    Alice->>John: Hello John, how are you?\r
    loop Healthcheck\r
        John->>John: Fight against hypochondria\r
    end\r
    Note right of John: Rational thoughts <br/>prevail!\r
    John-->>Alice: Great!\r
    John->>Bob: How about you?\r
    Bob-->>John: Jolly good!".mermaid `;function replaceAsync(n,t,a){try{if(typeof a=="function"){var o=[];return String.prototype.replace.call(n,t,function(){return o.push(a.apply(void 0,arguments)),""}),Promise.all(o).then(function(r){return String.prototype.replace.call(n,t,function(){return r.shift()})})}else return Promise.resolve(String.prototype.replace.call(n,t,a))}catch(r){return Promise.reject(r)}}function myPrint(){let n=document.getElementById("view-area").innerHTML;console.log(n),window.document.body.innerHTML=`<div class="markdown-body">${n}</div>`,kit.sleep(250).then(()=>{window.print(),location.reload()})}const index="";window.onload=()=>{allInit()};function allInit(){new settingsClass().settingsAllInit(),blankTextInit(),mdConverter(),triggerConverterEvent(),exportToPdfEvent(),dragFileEvent(),aboutBox(),enableFastKeyEvent()}async function mdConverter(n=!0){let t=getMdText();t=await clueParser(t),t=await latexParse2(t),t=await latexParse(t),t=markedParse(t),enableScript(t),preViewText(t),n&&restoreText(),hljs.highlightAll()}class settingsClass{constructor(){}markedInit(){marked.use({mangle:!1,headerIds:!1,strict:!1})}mermaidInit(){mermaid.initialize({securityLevel:"loose"}),mermaid.mermaidAPI.initialize({startOnLoad:!1})}hljsInit(){hljs.configure({ignoreUnescapedHTML:!0})}settingsAllInit(){this.markedInit(),this.mermaidInit(),this.hljsInit()}static newSettings(){return new this}}function clueParser(n){return new Promise(async t=>{n=n.replace(/\n/g,">br");const a=/".*?"\..*?\s/g,o=/".*?"/g,r=/\..*?\s/g,i=/\s.*?\./g,c=new RegExp('(?<=").*(?=")',"g");if(n){n=await replaceAsync(n,a,l);async function l(s,u){var g="f",m,d;if(s.match(o)&&(m=s.match(c)[0]),s.match(r)&&(s=reverseString(s),d=s.match(i)[0],d=reverseString(d),d=d.replace(/(\s)|(\.)/g,"")),m=m.replace(/\>br/g,`
`),d=="mermaid")try{g=`${await mermaidParse2(m,u)}`}catch(p){g=`<div class='RED P5'> MERMAID ERROR! </div>  <pre><code class="language-js hljs language-javascript"><span class="hljs-number">${p}</span></code></pre>`}else g=`<div class="${d}">${markedParse(m)}</div>`;return g}}n=n.replace(/\>br/g,`
`),t(n)})}async function mermaidParse2(n,t){if(await mermaid.parse(n)){const{svg:o}=await mermaid.mermaidAPI.render("seq_"+t,n);return o}else return"err"}function latexParse2(n,t=!0){return n=n.replace(/\n/g,"<!br"),new Promise(a=>{let o=/\$\$.*?\$\$/g,r=new RegExp("(?<=(\\$\\$))(.+?)(?=(\\$\\$))","g");n&&(n=n.replace(o,i=>{if(i.match(r))i=i.match(r)[0],i=i.replace(/\<\!br/g,"");else return"";if(i){var c=katex.renderToString(i,{throwOnError:!1,strict:!1});return t&&(c=`<center>${c}</center>`),c}else return""}),n=n.replace(/\<\!br/g,`
`)),a(n)})}function latexParse(n){return new Promise(t=>{let a=/\$.*?\$/g,o=new RegExp("(?<=\\$)(.+?)(?=\\$)","g"),r=new Array,i=n,c=n.match(a);getRegIndex(n,a);let l="";if(c)try{c.forEach((s,u)=>{s=s.match(o),s?r[u]=katex.renderToString(s[0],{throwOnError:!1,strict:!1}):r[u]="<span style='color:#cc0000;'>ERR_NULL</span>"}),n=n.replace(a,"<!temp?.!>"),n=n.split("<!temp?.!>"),r=[...r,""];for(let s=0;s<=n.length-1;s++)l+=n[s]+r[s],s==n.length-1&&t(l)}catch(s){return console.log(s),5}else t(i)})}function markedParse(n){return marked.parse(n)}function writeMdText(n){document.getElementById("md-area").value=n}function getMdText(){return document.getElementById("md-area").value}function preViewText(n){document.getElementById("view-area").innerHTML=n}function getRememberText(){let n=kit.getCookie("contentText").replace(/\<\? br \?\>/g,`
`);return n=n.replace(/\<\? semicolon \?\>/g,";"),n}function restoreText(){let n=getMdText();n=n.replace(/\n/g,"<? br ?>"),n=n.replace(/\;/g,"<? semicolon ?>"),kit.setCookie("contentText",n,30,"/","md.bigonion.cn"),kit.setCookie("contentText",n,30,"/","127.0.0.1")}function fillInRemeText(){let n=getRememberText();return writeMdText(n),n}function getRegIndex(n,t){return Array.from(n.matchAll(t),o=>o.index)}function enableFastKeyEvent(){document.addEventListener("keydown",n=>{n.stopPropagation();let t=document.getElementById("md-area");n.ctrlKey&&n.key=="b"&&replaceSelection(t,"**","**"),n.key=="c"&&n.altKey&&replaceSelection(t,"<center>","</center>")})}function enableScript(md){md=md?md.match(new RegExp("(?<=(\\<script\\>))(.+?)(?=(\\<\\/script\\>))","g")):"",md&&md.forEach(e=>{e=e.match(/alert\(.*?\)/g)?"":e,eval(e)})}function replaceSelection(n,t,a){var o=n.selectionStart,r=n.selectionEnd;if(console.log(o,r),o==r)return"";temp=n.value.substr(0,o)+t+n.value.substring(o,r)+a+n.value.substring(r,n.value.length),n.value=temp,console.log(n.value.substring(o,r)),console.log(n.value.substring(o,r).length),n.setSelectionRange(o,r+t.length+a.length)}function reverseString(n){return n.split("").reverse().join("")}function triggerConverterEvent(){document.getElementById("md-area").addEventListener("keyup",()=>{mdConverter()}),document.getElementById("md-area").addEventListener("blur",()=>{mdConverter()})}function blankTextInit(){kit.getCookie("contentText")?fillInRemeText():writeMdText(welcomeText)}function exportToPdfEvent(){document.getElementById("pdfButton").addEventListener("click",()=>{myPrint()})}function dragFileEvent(){let n=document.getElementById("md-area"),t="#c4c4c482",a="#cc0000",o="#f5f5f5";n.addEventListener("dragenter",function(){n.style.background=t},!1),n.addEventListener("dragleave",function(){n.style.background=o,allInit()},!1),n.addEventListener("dragover",function(r){r.preventDefault()},!1),n.addEventListener("drop",function(r){r.preventDefault(),n.style.background=o;try{let i=new FileReader,c=r.dataTransfer.files[0];console.log(c);let l=c.name.split(".");l=l[l.length-1],l=="bat"||l=="txt"||l=="md"||l=="js"||l=="html"||l=="css"?(i.onload=function(){console.log("上传成功"),n.value=this.result,mdConverter(!0)},i.onerror=function(){console.log("上传失败")},i.readAsText(c)):(n.style.color=a,l=="lnk"?n.value="错误的文件格式: "+l+" ,请不要直接拖拽快捷方式！":n.value="错误的文件格式: "+l+" ,仅支持txt/md/html/js/css/bat",kit.sleep(2e3).then(()=>{n.style.color="",fillInRemeText()}).catch(s=>{}))}catch(i){console.log(i)}},!1)}
