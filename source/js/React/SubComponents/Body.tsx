import React from "react"

// import fastKeyEvent from "@Root/js/functions/fastKey"
import { enObj } from "@Root/js/index"
import fastKeyEvent from "@Func/Events/key/fastKey"
// import pasteEvent, { monacoPasteEvent, monacoPasteEventNative } from "@Func/Events/pasteEvent"
import dragFileEvent from "@Func/Events/dragFile"
import MdArea from "./SubBody/MdArea"
import { observer } from "mobx-react"
// import { useImage } from "@Root/js/React/Mobx/Image.ts"
// import { useTheme } from "@Root/js/React/Mobx/Theme"
import EmojiPicker from "@Com/myCom/EmojiPicker"
import { configInit } from "@Func/Init/allInit"
import { getEmojiPickerState, getTheme } from "@App/config/change"
import LoadingButton from "../Components/Mui/progressButton"
import CircularLoadingButton from "../Components/Mui/progressButton"

function enEvents(doIt: boolean): void {
  if (doIt) {
    enObj.enFastKey ? fastKeyEvent() : undefined
  }
}

export default observer(function Body() {
  React.useEffect(() => {
    enEvents(true)
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
          <article id="view-area" className={"markdown-body"}></article>
        </div>
        <div id="aboutBox">
          <div id="markdownParser">
            <div id="aboutMd" className="aboutViewArea markdown-body">
              <span></span>
            </div>
          </div>
        </div>
        <EmojiPicker open={getEmojiPickerState() === "on" ? true : false} />
      </div>
      {/* <CircularLoadingButton></CircularLoadingButton> */}
    </>
  )
})
