import React from "react"


// import fastKeyEvent from "@Root/js/functions/fastKey"
// @ts-ignore
import { kit, enObj } from "@Root/js/index.js"
import fastKeyEvent from "@Root/js/functions/fastKey"
enObj.enFastKey ? fastKeyEvent() : undefined
export default function Body() {
  return (
    <>
      {/* <h1 style="display: none">
      markdown在线编辑,html在线展示,方便调试与快速实现目标效果,支持markdown基础语法。
      预计新增:LATEX拓展语法和PDF导出
    </h1> */}
      <div id="topBox">
        <div id="editor">
          {/* <Zmage src="http://bigonion.cn/background/wallheaven.jfif" alt="最简单的使用方式" /> */}
          <textarea placeholder="" id="md-area"></textarea>
          <article id="view-area" className="markdown-body"></article>
        </div>
      </div>

      <div id="aboutBox">
        <div id="markdownParser">
          <article id="aboutMd" className="aboutViewArea markdown-body">
            <span></span>
          </article>
        </div>
      </div>
    </>
  )
}
