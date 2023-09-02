import React from 'react'

export default function Body() {
  return (
    <>
    {/* <h1 style="display: none">
      markdown在线编辑,html在线展示,方便调试与快速实现目标效果,支持markdown基础语法。
      预计新增:LATEX拓展语法和PDF导出
    </h1> */}
    <div id="topBox">
      <div id="root"></div>
      <div id="editor">
        <textarea placeholder="" id="md-area"></textarea>
        <article id="view-area" className="markdown-body">
        </article>
      </div>
    </div>

    <div id="aboutBox">
      <div id="markdownParser">
        <article id="aboutMd" className="aboutViewArea markdown-body">
          <span
            >
          </span>
        </article>
      </div>
    </div>
    </>
  )
}
