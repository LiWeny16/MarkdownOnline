import React from "react"

import fastKeyEvent from "@Func/Events/key/fastKey"
import MdArea from "./SubBody/MdArea"
import { observer } from "mobx-react"
import { getEmojiPickerState, getSettings, getStates, getStatesMemorable, getTheme } from "@App/config/change"
import { Suspense } from "react"
import WelcomeAnimation from "../Components/myCom/Prompt/WelcomeAni"

// 使用 React.lazy 懒加载组件
// const LazyEmojiPicker = React.lazy(
//   () => import("@Root/js/React/Components/myCom/EmojiPicker")
// )
// const LazyPromptPanel = React.lazy(() => import("@Com/myCom/Prompt/Prompt"))
const LazyPromptAIPanel = React.lazy(() => import("@Com/myCom/Prompt/AIPanel"))
const LazyVoiceTrans = React.lazy(() => import("@Com/myCom/Prompt/VoiceTrans"))
export default observer(function Body() {
  const mdViewerRef: any = React.useRef(null)
  const [markdownViewerWidth, setMarkdownViewerWidth] = React.useState("100%")
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
          <MdArea setMarkdownViewerWidth={setMarkdownViewerWidth} />
          <article id="view-area-hidden" className="hidden-pre"></article>
          <article
            ref={mdViewerRef}
            id="view-area"
            style={{
              fontFamily: getSettings().basic.fontFamily,
              width: markdownViewerWidth,
              padding: getStates().unmemorable.previewMode
                ? "0px 5px"
                : "26px 38px",
            }}
            className={
              "uniform-scroller " +
              "markdown-body " +
              `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}`
            }
          ></article>
        </div>
        {getStatesMemorable().memorable.welcomeAnimationState ? <WelcomeAnimation /> : <></>}
        {/* <Suspense fallback={<></>}>
          <LazyEmojiPicker
            open={getEmojiPickerState() === "on" ? true : false}
          />
        </Suspense> */}
        {/* <Suspense fallback={<></>}>
          <LazyPromptPanel open={getStates().unmemorable.promptPanelState} />
        </Suspense> */}
        <Suspense>
          <LazyPromptAIPanel open={getStates().unmemorable.aiPanelState} />
        </Suspense>
        <Suspense>
          <LazyVoiceTrans open={getStates().unmemorable.voicePanelState} />
        </Suspense>
      </div>
    </>
  )
})
