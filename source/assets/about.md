# 关于

本项目使用了marked.js来快速转换Markdown=>HTML，并且能够实时预览效果，不需要额外的操作即可体验到十分不错的在线markdown实时预览体验<br>
能有什么坏心思，单纯想做一个不一样的markdown解析器罢了QAQ

## 什么是markdown?

&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;和word不同，markdown是文本标记语言，它会把所有操作都以文本的形式展现出来  
&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;例如你想写一个标题，你在word里可能得点击一下右上角的标题，但是在markdown里则是通过写在“#”后来表示这是一个标题文本  
例如：
```md
# 我是标题
```
&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;如果你想写一段代码区，在word里会比较难实现，但是在markdown里，你只需要用两个```包裹住代码即可  
```js
    ```js
    alert("welcome to markdown")
    ```
```


如果你还不了解什么是markdown语法，那请[点我了解markdown语法](https://markdown.com.cn/intro.html)  

## 为什么要使用markdown?
+ 足够快捷，方便，适合写博客
+ word排版容易乱， markdown舍弃了一些复杂的功能，  
  换来了一定程度的快捷
+ 输入代码足够容易，并支持高亮
+ 支持嵌入LATEX(word其实也可以)
+ 背靠HTML语法，想你所想，做你所做
+ ~~当然啦是颜狗最爱ヾ(•ω•`)o~~

## Todo
+ <s>增加PDF导出</s>
+ <s>增加代码高亮</s>
+ <s>LATEX公式支持</s>
+ <s>增加快捷键Ctrl+B加粗和Ctrl+Alt+C居中</s>
+ 像[jupyter](https://jupyter.org/)那样支持一行一行的运行JS/Python脚本(基于[WASM](https://developer.mozilla.org/zh-CN/docs/WebAssembly))
+ 增加设置按钮以配置脚本注入和换行等规则
+ Img图片支持
+ 替换成Vscode前端编辑器，加入完整的快捷键提示支持

## 教程
+ LATEX请写在用$$中间  
例如 $\lambda$ [知乎:LaTeX数学公式、常用符号大全](https://zhuanlan.zhihu.com/p/510451940)
+ mermaid请见官网[https://mermaid.js.org/intro/](https://mermaid.nodejs.cn/syntax/flowchart.html)

## 新增特性
+ 右对齐可以用 "右边对齐".RIGHT 
+ 红色文字可以用 "我是红色的耶".RED &nbsp;
+ 注意！最后必须有一个**空格**表示结束
+ [[DEV]](#)支持脚本注入，请用script标签包裹
+ mermaid 流程图支持！

## 更新日志 
+ v0.1.x 修复大量bug，新增图片管理器


## 作者

**Bigonion**

## 开源协议
/*  
\* @Author bigonion  
\* @Copyright 2022© 至今  
*/  
**MIT**

## Namespace 
[https://github.com/LiWeny16/MarkdownOnline](https://github.com/LiWeny16/MarkdownOnline)  
[https://bigonion.cn](https://bigonion.cn)


