import React from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import Dialog from "@mui/material/Dialog"
import { useTheme } from "@mui/material/styles"
import { Box, Divider } from "@mui/material"
import { getTheme } from "@App/config/change"
import { useTranslation } from "react-i18next"

export default function Settings(props: any) {
  const { t } = useTranslation()
  const palette = useTheme().palette
  const theme = getTheme()
  let [mailSharePanelState, setMailSharePanelState] = React.useState(false)
  let handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    setMailSharePanelState(() => {
      return false
    })
    props.onClick(e)
    props.closeAll()
  }
  React.useEffect(() => {
    // console.log(theme)
  })
  return (
    <>
      <Dialog
        fullScreen={false}
        maxWidth={false}
        open={props.open}
        onClose={handleCloseAll}
        sx={{
          height: "100vh",
        }}
      >
        <Box
          sx={{
            background: theme === "light" ? "#F8FAFB" : "",
            padding: "1rem",
            height: "58vh",
            width: "60vw",
          }}
        >
          <ScreenShareIcon />
          <Divider sx={{ my: 0.5 }} />
          <Box
            sx={{
              height: "48vh",
              display: "flex",
              background: theme === "light" ? "#F8FAFB" : "",
              padding: "5px",
              flexDirection: "row",
              borderRradius: "50px",
              borderRadius: "5px",
            }}
          ></Box>
        </Box>
      </Dialog>
      <ScreenShareIcon />
      {/*  // 协同办公 (开发中) / Collaborative Office (In Development) */}
      {t("t-collaborative-office")}
    </>
  )
}
