import React from "react"

import fastKeyEvent from "@Func/Events/key/fastKey"
import MdArea from "./SubBody/MdArea"
import { observer } from "mobx-react"
import { getEmojiPickerState, getStates, getTheme } from "@App/config/change"
import { Suspense } from "react"
import WelcomeAnimation from "../Components/myCom/Prompt/WelcomeAni"

// 使用 React.lazy 懒加载组件
const LazyEmojiPicker = React.lazy(
  () => import("@Root/js/React/Components/myCom/EmojiPicker")
)
const LazyPromptPanel = React.lazy(() => import("@Com/myCom/Prompt/Prompt"))
const LazyPromptAIPanel = React.lazy(() => import("@Com/myCom/Prompt/AIPanel"))
export default observer(function Body() {
  const [content, setContent] = React.useState("")
  const articleRef = React.useRef(null)
  const [showWelcome, setShowWelcome] = React.useState(true)

  const handleEnter = () => {
    setShowWelcome(false)
  }
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
            style={{
              padding: getStates().unmemorable.previewMode ? "0px 5px" : "26px 38px",
            }}
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
        <WelcomeAnimation />
        <Suspense fallback={<></>}>
          <LazyEmojiPicker
            open={getEmojiPickerState() === "on" ? true : false}
          />
        </Suspense>
        <Suspense fallback={<></>}>
          <LazyPromptPanel open={getStates().unmemorable.promptPanelState} />
        </Suspense>
        <Suspense>
          <LazyPromptAIPanel open={getStates().unmemorable.aiPanelState} />
        </Suspense>
      </div>
    </>
  )
})
