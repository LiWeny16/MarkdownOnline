import React from "react"

// import fastKeyEvent from "@Root/js/functions/fastKey"
// @ts-ignore
import { kit, enObj } from "@Root/js/index.js"
import fastKeyEvent from "@Func/Events/fastKey"
import pasteEvent from "@Func/Events/pasteEvent"
import dragFileEvent from "@Func/Events/dragFile"
function enEvents(doIt: boolean): void {
  if (doIt) {
    enObj.enFastKey ? fastKeyEvent() : undefined
    enObj.enPasteEvent ? pasteEvent() : undefined
    enObj.enDragFile ? dragFileEvent() : undefined
  }
}

export default function Body() {
  React.useEffect(() => {
    enEvents(true)
  }, [])
  return (
    <>
      <h1 style={{ display: "none" }}>
        markdown在线编辑,html在线展示,方便调试与快速实现目标效果,支持markdown基础语法。
        预计新增:图片管理器、语音识别
      </h1>
      <div id="topBox">
        <div id="editor">
          <textarea placeholder="" id="md-area"></textarea>
          <article id="view-area-hidden" className="hidden-pre"></article>
          <article id="view-area" className="markdown-body"></article>
        </div>
      </div>

      <div id="aboutBox">
        <div id="markdownParser">
          <div id="aboutMd" className="aboutViewArea markdown-body">
            <span></span>
          </div>
        </div>
      </div>
    </>
  )
}
