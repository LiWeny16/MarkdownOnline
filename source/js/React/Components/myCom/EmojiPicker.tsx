import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Backdrop, Box } from "@mui/material"
import React from "react"
// @ts-ignore
// import { useGSAP } from "https://cdn.jsdelivr.net/npm/@gsap/react@2.1.0/+esm"
import { useGSAP } from "@gsap/react"
import { observer } from "mobx-react"
// @ts-ignore
import { gsap } from "gsap"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import {
  changeEmojiPickerState,
  getContextMenuClickPosition,
  getEmojiPickerState,
} from "@App/config/change"
import { isElementOverflow } from "@App/user/layout"
// or
// import { Fade } from "@mui/material"
// import { Zoom } from "@mui/material"
export default observer(function EmojiPicker(props: any) {
  const _position = getContextMenuClickPosition()
  const container = React.useRef()
  // const [targetNow, setTargetNow] = React.useState<boolean>(false)
  const [showState, setShowState] = React.useState<boolean>(false)
  const [delayShowState, setDelayShowState] = React.useState<boolean>(false)
  function handleOnEmojiSelected(e: { shortcodes: string }) {
    // console.log(e);
    // @ts-ignore
    insertTextMonacoAtCursor(e.native, true)
  }
  React.useEffect(() => {
    setShowState(props.open)
    // if(isElementOverflow(document.querySelector("em-emoji-picker"))){
    //   console.log("yes");
    // }
    // gsap.to(container.current, { x: 200 }) // <-- automatically reverted
    if (!props.open) {
      // 关闭
      gsap.to(".emojiPicker", {
        // x: "0",
        // y: "+=-40",
        opacity: 0,
        duration: 0.4,
        onComplete: function () {
          setDelayShowState(showState)
          // this.targets()[0].style.display = "none" // make it not to occupy space after animation completes
        },
      })
    } else {
      // console.log(getEmojiPickerState());
      setDelayShowState(props.open)
      // container.current.style.display = "block"
      gsap.fromTo(
        ".emojiPicker",
        { x: 0 },
        {
          x: 20,
          opacity: 1,
          duration: 0.6,
        }
      )
    }
    // let emojiDomNode = document.querySelector("em-emoji-picker") as HTMLElement
    // emojiDomNode.style.transition = "1s"
  }, [props.open])
  // useGSAP(
  //   (context, contextSafe) => {
  //     // const onClick = contextSafe(() => {
  //     //   gsap.to(container.current, { rotation: 0, duration: 0 })
  //     // })
  //     // container.current.addEventListener("click", onClick)
  //     // return () => {
  //     //   container.current.removeEventListener("click", onClick)
  //     // }
  //   },
  //   { scope: container }
  // ) // <-- scope is for selector text (optional)

  return (
    <>
      <Backdrop
        invisible={true}
        ref={container}
        transitionDuration={{ appear: 500, enter: 500, exit: 1000 }}
        // TransitionComponent={Zoom}
        sx={{
          // color: "transparent",
          // transition:"none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // @important 这里非常重要，因为过场动画的缘故需要背景板持续展示，但是又不希望阻止用户点击
          pointerEvents: showState ? "" : "none",
        }}
        open={showState}
        onContextMenu={(e) => {
          // @ts-ignore
          if (e.target.tagName != "EM-EMOJI-PICKER") {
            changeEmojiPickerState("off")
            e.preventDefault()
          }
        }}
        onMouseUp={(e) => {
          if (e.button == 2) {
          } else if (e.button == 0) {
            // @ts-ignore
            if (e.target.tagName != "EM-EMOJI-PICKER") {
              changeEmojiPickerState("off")
            }
          }
        }}
      >
        <Box
          sx={{
            // height: "435px",
            // width:"352px",
            position: "absolute",
            top: _position.posy - window.document.body.clientHeight * 0.1,
            left: _position.posx + window.document.body.clientWidth * 0.02,
          }}
          className="MIN emojiPicker"
        >
          <Picker data={data} onEmojiSelect={handleOnEmojiSelected} />
        </Box>
      </Backdrop>
    </>
  )
})
