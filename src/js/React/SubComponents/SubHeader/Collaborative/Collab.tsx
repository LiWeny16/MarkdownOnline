import React, { useEffect, useState } from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import Dialog from "@mui/material/Dialog"
import { useTheme } from "@mui/material/styles"
import {
  Box,
  Button,
  Divider,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { getTheme } from "@App/config/change"
import { useTranslation } from "react-i18next"
import realTimeColab from "@App/share/colab/realTimeColab"
import CustomizedButtons from "@Root/js/React/Components/myCom/CustomButton"
import { replaceMonacoAll } from "@App/text/replaceText"
import { getMdTextFromMonaco } from "@App/text/getMdText"
// const url = "ws://127.0.0.1:9000"
const url = "ws://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run"
// https://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run
export default function Settings(props: any) {
  const { t } = useTranslation()
  const palette = useTheme().palette
  const theme = getTheme()
  const [mailSharePanelState, setMailSharePanelState] = useState(false)
  const [msgFromSharing, setMsgFromSharing] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [receivingEnabled, setReceivingEnabled] = useState(true)

  const handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    setMailSharePanelState(false)
    props.onClick(e)
    props.closeAll()
  }

  useEffect(() => {
    if (msgFromSharing) {
      setOpenDialog(true)
    }
  }, [msgFromSharing])

  const handleSendMessage = async () => {
    if (!(await realTimeColab.isConnected())) {
      await realTimeColab.connect(url, setMsgFromSharing)
    }
    await realTimeColab.sendBroadCastMessage(getMdTextFromMonaco())
  }

  const handleAcceptMessage = () => {
    try {
      replaceMonacoAll(
        window.monaco,
        window.editor,
        JSON.parse(msgFromSharing!).message
      )
      setOpenDialog(false)
      setMsgFromSharing(null)
    } catch (error) {}
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
            height: "60svh",
            width: "25svw",
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
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "12px 24px",
              fontSize: "18px",
              textTransform: "none",
              borderRadius: "10px",
            }}
            onClick={handleSendMessage}
          >
            分享，一触即发
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            sx={{
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              textTransform: "none",
              color: theme === "light" ? "black" : "#F8FAFB",
              borderColor: theme === "light" ? "#F8FAFB" : "#F8FAFB",
              "&:hover": {
                backgroundColor: theme === "light" ? "#F5F5F5" : "#4A4A4A",
              },
            }}
            onClick={() => {
              setReceivingEnabled(!receivingEnabled)
              if (receivingEnabled) {
                realTimeColab.disconnect()
              }
            }}
          >
            {receivingEnabled ? "Disable Receiving" : "Enable Receiving"}
          </Button>

          <Box
            sx={{
              width: "100%",
              backgroundColor: theme === "light" ? "#F8FAFB" : "#333333",
              borderRadius: "12px",
              padding: "18px",
              fontSize: "16px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
              whiteSpace: "nowrap", // 禁止换行
              textOverflow: "ellipsis", // 超出内容省略号
            }}
          >
            {msgFromSharing || "无消息"}
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
