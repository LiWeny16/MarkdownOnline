import React, { useCallback, useEffect, useState } from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import Dialog from "@mui/material/Dialog"
import { useTheme } from "@mui/material/styles"
import CachedIcon from "@mui/icons-material/Cached"
import DevicesIcon from "@mui/icons-material/Devices"
import gsap from "gsap"
import LoadingButton from "@mui/lab/LoadingButton"
import {
  Box,
  Button,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Divider,
} from "@mui/material"
import { getTheme } from "@App/config/change"
import { useTranslation } from "react-i18next"
import realTimeColab from "@App/share/colab/realTimeColab"
import { replaceMonacoAll } from "@App/text/replaceText"
import { getMdTextFromMonaco } from "@App/text/getMdText"
import FileIcon from "@mui/icons-material/Description"
import FolderIcon from "@mui/icons-material/Folder"
import TextIcon from "@mui/icons-material/TextFields"
import ClipboardIcon from "@mui/icons-material/ContentPaste"
import ScrollableBox from "@Root/js/React/Components/myCom/Layout/ScrollBox"
import { settingsBodyContentBoxStyle } from "../Settings/Subsettings/SettingsBody"
import LR from "@Root/js/React/Components/myCom/Layout/LR"
import kit from "bigonion-kit"

const url = "ws://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run"

export default function Settings(props: any) {
  const buttonStyle = {
    borderRadius: "12px",
    borderColor: "#e0e0e0",
  }
  const { t } = useTranslation()
  const theme = getTheme()
  const [mailSharePanelState, setMailSharePanelState] = useState(false)
  const [msgFromSharing, setMsgFromSharing] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [receivingEnabled, setReceivingEnabled] = useState(true)
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  async function handleClickSearch() {
    setLoading(true)
    if (!(await realTimeColab.isConnected())) {
      await realTimeColab.connect(url, setMsgFromSharing, setConnectedUserIds)
    } else {
      realTimeColab.broadcastSignal({
        type: "discover",
        id: realTimeColab.getUniqId(),
      })

      kit.sleep(500).then(() => {
        setLoading(false)
      })
    }
  }

  const handleClickRippleBox = useCallback(
    (event: { currentTarget: any; clientX: number; clientY: number }) => {
      const box = event.currentTarget

      const createRipple = (delay: number, scale: number) => {
        const rippleElement = document.createElement("div")
        box.appendChild(rippleElement)

        const boundingRect = box.getBoundingClientRect()
        const size = Math.max(boundingRect.width, boundingRect.height)
        const xPos = event.clientX - boundingRect.left - size / 2
        const yPos = event.clientY - boundingRect.top - size / 2

        gsap.set(rippleElement, {
          width: size,
          height: size,
          x: xPos,
          y: yPos,
          borderRadius: "50%",
          opacity: 1,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          position: "absolute",
          pointerEvents: "none",
          transform: "scale(0)",
        })

        gsap.fromTo(
          rippleElement,
          { scale: 0, opacity: 1 },
          {
            scale: scale,
            opacity: 0,
            duration: 2.2,
            ease: "power2.out",
            delay: delay,
            onComplete: () => {
              rippleElement.remove() // Clean up the DOM by removing the ripple
            },
          }
        )
      }

      // Create multiple ripple effects with staggered timings
      createRipple(0, 2)
      createRipple(0.2, 2)
    },
    []
  )
  const handleClickOtherClients = (
    _e: React.MouseEvent,
    targetUserId: string
  ) => {
    const message = "Hello, user!" // 要发送的消息
    // 连接到另一个用户
    realTimeColab.connectToUser(targetUserId).then(() => {
      console.log(`Connected to user ${targetUserId}`)
      realTimeColab.sendMessageToUser(targetUserId, message)
    })

    
  }
  useEffect(() => {
    realTimeColab
      .connect(url, setMsgFromSharing, setConnectedUserIds)
      .then(async (e) => {})
      .catch((err) => {
        console.error("Failed to connect:", err)
      })

    return () => {
      realTimeColab.disconnect()
    }
  }, [])

  const handleAcceptMessage = () => {
    try {
      if (msgFromSharing) {
        replaceMonacoAll(
          window.monaco,
          window.editor,
          JSON.parse(msgFromSharing).message
        )
      }
      setOpenDialog(false)
      setMsgFromSharing(null)
    } catch (error) {
      console.error("Failed to accept message:", error)
    }
  }

  const handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    setMailSharePanelState(false)
    props.onClick(e)
    props.closeAll()
  }

  return (
    <>
      <Dialog
        hideBackdrop={true}
        fullScreen={false}
        maxWidth={false}
        open={props.open}
        onClose={handleCloseAll}
        sx={{
          height: "100svh",
          width: "100svw",
        }}
      >
        <Box
          sx={{
            height: "67svh",
            width: "55svw",
            display: "flex",
            background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
            padding: "24px",
            flexDirection: "column",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              display: "flex",
              gap: "12px",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FileIcon />}
              sx={buttonStyle}
            >
              文件
            </Button>
            <Button
              variant="outlined"
              startIcon={<FolderIcon />}
              sx={buttonStyle}
            >
              文件夹
            </Button>
            <Button
              variant="outlined"
              startIcon={<TextIcon />}
              sx={buttonStyle}
            >
              文本
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClipboardIcon />}
              sx={buttonStyle}
            >
              剪贴板
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-start",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Box sx={{ mb: "10px" }}>
              <LoadingButton
                sx={buttonStyle}
                onClick={handleClickSearch}
                endIcon={<CachedIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                搜索同WIFI下用户
              </LoadingButton>
            </Box>
            <Divider />
            <Box
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-start",
                flexDirection: "column",
                display: "flex",
              }}
            >
              <ScrollableBox
                sx={{ userSelect: "none", width: "100%", height: "100%" }}
              >
                {connectedUserIds.map((value, index) => (
                  <Box
                    sx={{
                      ...settingsBodyContentBoxStyle,
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    key={index}
                    onClick={(e) => {
                      handleClickRippleBox(e)
                      handleClickOtherClients(e, value)
                    }}
                  >
                    <LR ali="center" jus="center" space={[5]}>
                      <Box
                        sx={{ height: "100%" }}
                        className="FLEX ALI-CEN JUS-CEN"
                      >
                        <DevicesIcon />
                      </Box>
                      <p>{value}</p>
                    </LR>
                    <span
                      className="ripple"
                      style={{
                        background: "transparent",
                        position: "absolute",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        transform: "scale(0)",
                      }}
                    ></span>
                  </Box>
                ))}
              </ScrollableBox>
              <Box className="FLEX ALI-CEN JUS-CEN">
                <p color="#8B8A8A">你的ID: {realTimeColab.getUniqId()}</p>
              </Box>
              {/* 这里是从 */}
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        hideBackdrop={true}
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setMsgFromSharing(null)
        }}
      >
        <DialogTitle>✨新分享</DialogTitle>
        <DialogContent>
          <DialogContentText>您有来自外部的消息，是否接受？</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false)
              setMsgFromSharing(null)
            }}
            color="secondary"
          >
            拒绝
          </Button>
          <Button onClick={handleAcceptMessage} color="primary" autoFocus>
            接受
          </Button>
        </DialogActions>
      </Dialog>

      <ScreenShareIcon />
      <Typography>{t("t-collaborative-office")}</Typography>
    </>
  )
}
