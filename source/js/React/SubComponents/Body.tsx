import React from "react"

import { enObj } from "@Root/js/index"
import fastKeyEvent from "@Func/Events/key/fastKey"
import MdArea from "./SubBody/MdArea"
import { observer } from "mobx-react"
import EmojiPicker from "@Com/myCom/EmojiPicker"
import { getEmojiPickerState, getTheme } from "@App/config/change"
import CodePlugin from "@Func/Plugins/code"

function enEvents(doIt: boolean): void {
  if (doIt) {
    enObj.enFastKey ? fastKeyEvent() : undefined
  }
}

export default observer(function Body() {
  const [content, setContent] = React.useState("")
  const articleRef = React.useRef(null)

  React.useEffect(() => {
    enEvents(true)
    // const articleElement = articleRef.current

    // if (articleElement) {
    //   // 创建一个 observer 实例，关联一个回调函数来执行当观察到变化时
    //   const observer = new MutationObserver((mutations) => {
    //     // 这个回调函数会在DOM变化时被调用
    //     mutations.forEach((mutation) => {
    //       if (mutation.type === "childList") {
    //         // console.log("Article content has changed")
    //       }
    //     })
    //   })

    //   // 使用配置文件开始观察目标节点
    //   observer.observe(articleElement, {
    //     attributes: false,
    //     childList: false, // 监听子元素的增加或删除
    //     subtree: false, // 监听所有下级节点
    //   })

    //   // 当组件卸载时，断开观察器
    //   return () => {
    //     observer.disconnect()
    //   }
    // }
  }, [])
  return (
    <>
      <div style={{ marginTop: "1.3vh" }} id="bodyTopBox">
        <div
          id="editor"
          className={`${getTheme() == "light" ? "theme-light" : "theme-dark"} FLEX ROW`}
        >
          <MdArea />
          <article id="view-area-hidden" className="hidden-pre"></article>
          <article
            ref={articleRef}
            id="view-area"
            className={
              "markdown-body " +
              `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}`
            }
          ></article>
        </div>
        <div id="aboutBox">
          <div id="markdownParser">
            <div
              id="aboutMd"
              className={
                "aboutViewArea markdown-body " +
                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}`
              }
            ></div>
          </div>
        </div>
        <EmojiPicker open={getEmojiPickerState() === "on" ? true : false} />
      </div>
      {/* <CircularLoadingButton></CircularLoadingButton> */}
    </>
  )
})
