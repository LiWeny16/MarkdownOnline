import React from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import Dialog from "@mui/material/Dialog"
import { useTheme } from "@mui/material/styles"
import SettingsRoute from "./Subsettings/SettingsRoute"
import { Box, Divider, } from "@mui/material"
import IconBreadcrumbs from "./Subsettings/SettingsBread"
import SettingsBody from "./Subsettings/SettingsBody"
import { getTheme } from "@App/config/change"
import { useTranslation } from "react-i18next"
export default function Settings(props: any) {
  const { t } = useTranslation()
  const palette = useTheme().palette
  const theme = getTheme()
  let mailOptionsRef = React.useRef<any>()
  let [mailSharePanelState, setMailSharePanelState] = React.useState(false)
  let [settingsRouter, setSettingsRouter] = React.useState("")
  let handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    setMailSharePanelState(() => {
      return false
    })
    props.onClick(e)
    props.closeAll()
  }
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
            height: { xs: "80vh", sm: "75vh", md: "68vh" },
            width: { xs: "95vw", sm: "85vw", md: "70vw" },
            maxWidth: "1200px",
            maxHeight: "800px",
          }}
        >
          <IconBreadcrumbs></IconBreadcrumbs>
          <Divider sx={{ my: 0.5 }} />

          <Box
            sx={{
              height: "calc(100% - 40px)",
              display: "flex",
              background: theme === "light" ? "#F8FAFB" : "",
              padding: "5px",
              flexDirection: "row",
              borderRadius: "5px",
            }}
          >
            <SettingsRoute></SettingsRoute>
            <SettingsBody></SettingsBody>
          </Box>
        </Box>
      </Dialog>
      <SettingsIcon />
      {/* // 设置 / Settings */}
      {t("t-settings")}
    </>
  )
}
