import React from "react"

// import fastKeyEvent from "@Root/js/functions/fastKey"
import { kit, enObj } from "@Root/js/index"
import fastKeyEvent from "@Func/Events/fastKey"
import pasteEvent from "@Func/Events/pasteEvent"
import dragFileEvent from "@Func/Events/dragFile"
import MdArea from "./SubBody/MdArea"
import { observer } from "mobx-react"
import { useImage } from "@Root/js/React/Mobx/Image.ts"
import { useTheme } from "@Root/js/React/Mobx/Theme"
function enEvents(doIt: boolean): void {
  if (doIt) {
    enObj.enFastKey ? fastKeyEvent() : undefined
  }
}

export default observer(function Body() {
  // const image = useImage()
  let theme = useTheme()
  React.useEffect(() => {
    enEvents(true)
  }, [])
  return (
    <>
      <div id="topBox">
        <div
          id="editor"
          className={theme.themeState == "light" ? "theme-light" : "theme-dark"}
        >
          <MdArea />
          <article id="view-area-hidden" className="hidden-pre"></article>
          <article
            id="view-area"
            className={
              theme.themeState == "light"
                ? "markdown-body"
                : "markdown-body-dark"
            }
          ></article>
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
})
