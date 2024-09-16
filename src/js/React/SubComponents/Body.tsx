import React from "react"

import fastKeyEvent from "@Func/Events/key/fastKey"
import MdArea from "./SubBody/MdArea"
import { observer } from "mobx-react"
import { getEmojiPickerState, getTheme } from "@App/config/change"
import { Suspense } from "react"

// 使用 React.lazy 懒加载组件
const LazyEmojiPicker = React.lazy(() => import("@Com/myCom/EmojiPicker"))

export default observer(function Body() {
  const [content, setContent] = React.useState("")
  const articleRef = React.useRef(null)

  React.useEffect(() => {
    fastKeyEvent()
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
        <Suspense fallback={<></>}>
          <LazyEmojiPicker
            open={getEmojiPickerState() === "on" ? true : false}
          />
        </Suspense>
      </div>
      {/* <CircularLoadingButton></CircularLoadingButton> */}
    </>
  )
})
