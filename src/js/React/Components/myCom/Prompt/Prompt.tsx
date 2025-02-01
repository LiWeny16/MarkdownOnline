import { Backdrop, Box, Button, styled } from "@mui/material"
import React from "react"
import { observer } from "mobx-react"
import { gsap } from "gsap"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import ChatIcon from "@mui/icons-material/Chat"
import { changeStates, getStates, getTheme } from "@App/config/change"
import exeBoldAction from "@Func/Events/key/actions/markdownTextFastKey/bold"
import exeItalicsAction from "@Func/Events/key/actions/markdownTextFastKey/italics"
import exeUnderlineAction from "@Func/Events/key/actions/markdownTextFastKey/underline"
import exeDeleteLinection from "@Func/Events/key/actions/markdownTextFastKey/delete"

// 创建自定义的 IconButton 组件，具有正方形水波纹效果
const IconButtonSq = React.memo(
  styled(Button)(({ theme, color, size }) => {
    color = "inherit"
    size = "small"
    return {
      "&:hover": {
        backgroundColor:
          getTheme() == "light"
            ? "rgba(238, 238, 238, 0.9)"
            : "rgba(66, 165, 245, 0.9)", // 使用透明背景色
        borderColor: "#0062cc",
        boxShadow: "none",
        transition:
          "background-color 0.4s ease-in-out, opacity 0.4s ease-in-out", // 添加透明度的过渡
      },
      "&": {
        transition:
          "background-color 0.4s ease-in-out, opacity 0.4s ease-in-out", // 正常状态过渡
      },
      color: getTheme() == "light" ? "black" : "white",
      height: "6svh",
      fontSize: "0.83rem",
    }
  })
)

export default observer(function PromptPanel(props: any) {
  const pickerHeight = 64
  const _position = handleOverflowPosition()
  const panelRef = React.useRef<HTMLDivElement>(null)
  const [showState, setShowState] = React.useState<boolean>(false)
  const [delayShowState, setDelayShowState] = React.useState<boolean>(false)

  function handleOverflowPosition() {
    let _position = getStates().unmemorable.selectEndPos
    if (_position.posy + pickerHeight > window.document.body.clientHeight) {
      _position.posy = window.document.body.clientHeight - pickerHeight
    }
    return _position
  }

  React.useEffect(() => {
    setShowState(props.open)
    if (!props.open) {
      gsap.to(".prompt-panel-content", {
        opacity: 0,
        duration: 0.4,
        onComplete: function () {
          setDelayShowState(false)
        },
      })
    } else {
      setDelayShowState(true)
      gsap.fromTo(
        ".prompt-panel-content",
        { x: 0 },
        {
          x: 20,
          opacity: 1,
          duration: 0.6,
        }
      )
    }
  }, [props.open])

  const handleClose = () => {
    changeStates({
      unmemorable: {
        promptPanelState: false,
      },
    })
  }

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      handleClose()
    }
  }

  const handleBackdropContextMenu = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      handleClose()
      e.preventDefault()
    }
  }

  return (
    <Backdrop
      invisible={true}
      transitionDuration={{ appear: 500, enter: 500, exit: 1000 }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        pointerEvents: showState ? "auto" : "none",
      }}
      open={showState}
      onContextMenu={handleBackdropContextMenu}
      onMouseUp={handleBackdropMouseUp}
    >
      <Box
        ref={panelRef}
        className="prompt-panel-content"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        sx={{
          position: "absolute",
          top: _position.posy - window.document.body.clientHeight * 0.1,
          left: _position.posx - window.document.body.clientWidth * 0.02,
          borderRadius: "25px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: getTheme() == "light" ? "white" : "#333",
          // 其他样式...
        }}
      >
        <Box>
          <Tooltip title="Ctrl+J">
            <IconButtonSq
              onClick={() => {
                handleClose()
                changeStates({ unmemorable: { aiPanelState: true } })
              }}
              sx={{
                padding: "0px 20px",
                fontWeight: "700",
                borderRadius: "25px 0 0 25px ",
              }}
            >
              <ChatIcon />
              Ask AI
            </IconButtonSq>
          </Tooltip>
          <Tooltip title="Bold">
            <IconButtonSq
              onClick={() => {
                exeBoldAction(window.editor, window.monaco)
              }}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButtonSq>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButtonSq
              onClick={() => {
                exeItalicsAction(window.editor, window.monaco)
              }}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButtonSq>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButtonSq
              onClick={() => {
                exeUnderlineAction(window.editor, window.monaco)
              }}
            >
              <FormatUnderlinedIcon fontSize="small" />
            </IconButtonSq>
          </Tooltip>
          <Tooltip title="Delete Line">
            <IconButtonSq
              onClick={() => {
                exeDeleteLinection(window.editor, window.monaco)
              }}
              sx={{ borderRadius: " 0 25px 25px 0" }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, textDecoration: "line-through" }}
              >
                S
              </Typography>
            </IconButtonSq>
          </Tooltip>
        </Box>
      </Box>
    </Backdrop>
  )
})
