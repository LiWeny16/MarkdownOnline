# Markdown Online View+

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
+ <s>Img图片支持</s>
+ <s>替换成Vscode前端编辑器，加入完整的快捷键提示支持</s>
+ 像[jupyter](https://jupyter.org/)那样支持一行一行的运行JS/Python脚本(基于[WASM](https://developer.mozilla.org/zh-CN/docs/WebAssembly))
+ 增加设置按钮以配置脚本注入和换行等规则
+ [TOC] 支持

## 教程
+ LATEX请写在用$$中间  
例如 $\lambda$ 详情请见:[LaTex语法大全](https://hub.fgit.cf/KaTeX/KaTeX/blob/main/docs/supported.md)
+ mermaid请见官网: [mermaid docs](https://mermaid.nodejs.cn/syntax/flowchart.html)
+ emoji标签码表见: [emoji I :hearts: You!](https://gist.github.com/rxaviers/7360908)
+ 本编辑器特性请见: [还没写文档嘻嘻](#)


## 新增特性
+ 右对齐可以用 "右边对齐".R 
+ 注意！最后必须有一个**空格**表示结束
+ mermaid 流程图支持！
+ 小表情支持！！！

## 更新日志 
+ v0.1.x 修复大量bug，新增图片管理器
+ v0.x.x 懒得写，更新N个特性了已经
+ v1.x

## 开源协议
/*  
\* @Author Bigonion  
\* @Copyright 2022© 至今  
*/  
**MIT**
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLiWeny16%2FMarkdownOnline.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FLiWeny16%2FMarkdownOnline?ref=badge_large&issueType=license)

## Namespace 
+ [github](https://github.com/LiWeny16/MarkdownOnline)  
+ [namespace](https://bigonion.cn)

## 在线地址

[md.bigonion.cn](https://md.bigonion.cn)

## 关于

作者：Bigonion  
邮箱：bigonion@bigonion.cn  

## 致谢

感谢以下开发者对本项目做出的贡献：

<a href="https://github.com/LiWeny16/MarkdownOnline/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LiWeny16/MarkdownOnline&max=1000" />
</a>

感谢以下开源项目对本项目做出的贡献：

[Reliance Report](/public/LICENSES/report.md)

[x]2323

$\lambda+232323$