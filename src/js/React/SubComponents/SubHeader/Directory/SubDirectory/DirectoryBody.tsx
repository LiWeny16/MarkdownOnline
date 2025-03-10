import { getTheme } from '@App/config/change';
import { markdownParser } from '@Func/Init/allInit';
import { Box, Typography } from '@mui/material'
import React from 'react'

export default function DirectoryBody({ activeId }: { activeId: string[] }) {
    // 定义一个映射关系，假设每个组别的内容都是类似于 "你好1_x"
    const contentMap: { [key: string]: string[] } = {
        "0_1": [
            "# 前言",
            "你好，朋友，欢迎来到 Markdown 入门指南。本教程将帮助你掌握 Markdown 的基本语法，以及一些进阶的黑科技技巧。",
            "其实要开始写markdown很简单，你可以退出指南，按下`Ctrl+J`一键呼出AI，或者在编辑区右键呼出菜单后，点击AskAI即可开始写作,别忘了写完后`Ctrl+S`保存文本到浏览器缓存。",
            "",
            "如果你喜欢这个编辑器，不妨给个Star呗，[Github](https://github.com/LiWeny16/MarkdownOnline?tab=readme-ov-file)"
        ],
        "1_1": [
            "# 段落和标题",
            "Markdown 段落的写法很简单，只需直接输入文本即可。例如：",
            "",
            "```\n这是一个段落。\n```",
            "",
            "段落之间需要空行，否则会被认为是同一段内容。",
            "",
            "标题更简单，对这一行按下`Ctrl+1`即可"
        ],
        "1_2": [
            "# 换行",
            "Markdown 默认不会自动换行，如果你想换行，可以使用 `<br>`。",
            "```\n这是第一行。<br>这是第二行。\n```",
        ],
        "1_3": [
            "# 加粗",
            "Markdown 可以使用 `**` 或 `__` 来加粗文本。例如：",
            "",
            "```\n**这是加粗的文本**\n```",
            "",
            "效果： **这是加粗的文本**",
        ],
        "1_4": [
            "# 斜体",
            "Markdown 使用 `*` 或 `_` 让文本变成斜体。例如：",
            "",
            "```\n*这是斜体文本*\n```",
            "",
            "效果： *这是斜体文本*",
        ],
        "1_5": [
            "# 居中",
            "在新的一行，按下`/`斜杠，输入any-center-text回车,即可得到居中文本",
            "同理,居右是这样写",
            "```\n<p style=\"text-align: right\">居右</p>\n```",
            "",
            "或者直接`Ctrl+E`进行居中，`Ctrl+R`进行居右"
        ],
        "1_6": [
            "# 任意字体",
            "在新的一行，按下`/`斜杠，输入any-text回车,即可得到你想要它什么样子他就是什么样子的文本了！",
        ],
        "1_7": [
            "# 导出PDF",
            "右上角更多按钮里有导出功能，或者直接使用快捷键`Ctrl+P`",
            "",
            "在导出PDF的时候你经常会发现分割页往往不尽人意，所以这里提供`/page-breaker`来分割每个页",
            "或者在需要分割的地方打出`|---|`即可",
        ],
        "2_1": [
            "# 语音转文字",
            "免费、不限时长、高准确率的语音转文字，还不快来试试！",
            "",
            "快捷键:`Ctrl+Alt+V`"
        ],
        "2_2": [
            "# AI智能助手",
            "AI 可以帮助你自动生成 Markdown 格式的内容，例如自动排版、语法检查、代码格式化等。",
            "",
            "在任何时候，我都强烈推荐你询问AI具体的markdown语法是什么，这样更加高效",
            "",
            "快捷键：`Ctrl+J`"
        ],
        "2_3": [
            "# 自动排版",
            "Markdown 支持自动排版，可以使用工具如 `Prettier` 或 `Markdownlint` 来优化排版，使文档更易读。",
            "",
            "快捷键:`Shift+Alt+F`"
        ],
        "2_4": [
            "# 文件管理器",
            "编辑器引用了全新文件接口，可以直接对本地文件夹进行打开和修改，打开文件夹后，粘贴到编辑器的图片将会被自动保存到当前目录的image文件夹下",
            "",
            "快捷键:`Ctrl+Alt+F`(可能和微信冲突，请修改微信的热键)，或在右上角更多里打开"
        ],
        "2_5": [
            "# 图片上传",
            "简单易懂，复制图片文件然后粘贴到编辑器即可，若没有打开文件夹图片自动保存到浏览器缓存中",
            "",
            "图片可以批量复制上传，并且支持快捷键`Ctrl+E`调整居中，默认样式解释如下:",
            "",
            "> #w代表大小，#c代表居中(center)，\n#s代表阴影(shadow)，#r代表居右(right)"
        ],
        "2_6": [
            "# 同步滚动",
            "随时开启，高度智能的同步滚动算法，比起VScode降维打击的开关功能",
            "",
            "快捷键`Ctrl+Q`"
        ],
        "2_7": [
            "# 表情包超市",
            "表情包，任你挑选😍",
            "",
            "编辑区右键菜单，表情包超市"
        ],
        "2_8": [
            "# 协同办公",
            "两台设备同一个热点或支持内网共享的WIFI下(手机热点默认都支持)，即可急速分享文本和文件！",
            "",
            "在哪：右上角更多按钮，协同办公"
        ],
        "2_9": [
            "# 表格",
            "编辑区按下F1，然后输入table#3#2，回车！",
            "",
            "就会生成3行2列的内容表格啦(不含标题行)"
        ],
        "2_10": [
            "# 流程图，思维导图...",
            "新的一行按下`/`输如mermaid即可看到联想的思维导图、流程图...等等",
        ],
        "2_11": [
            "# 双击定位",
            "双击右边渲染后文本，即可定位到左边原文本，太太太方便啦！！",
        ],
        "3_1": [
            "# LaTex数学公式",
            "新起一行打`/latex`后回车，在latex中间按下`\\`即可开始享用智能语法提示！",
            "",
            "快捷键:`Ctrl+M`"
        ],
        "3_2": [
            "# 智能提示",
            "估计认真看过教程的你已经发现了，新的一行打一个`/`即可获得大量高频使用的markdown功能，有图片、公式、文本、流程图、列表...",
        ],
        "3_3": [
            "# 设置",
            "设置界面提供了双主题、以及一些高频使用的功能，如字体，语言等等",
        ],
    };

    // 基于传入的 ids，选择需要展示的内容
    const contentToShow = activeId.map(id => contentMap[id] || []).flat();
    return (
        <Box
            className="transparent-scrollbar"
            sx={{
                width: "100%",
                height: "100%",
                margin: "10px",
                overflowY: "scroll"
            }}>
            <Box className={
                " markdown-body " +
                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` + " transparent-scrollbar"
            }
                sx={{
                    ml: "10px",
                    backgroundColor: getTheme() === "light" ? "#F8FAFB" : "#393939"
                }}>
                {contentToShow.map((content: any, index: any) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: markdownParser().render(content) }} />
                ))}
            </Box>
        </Box>
    )
}
