import React from "react"
import ArchiveIcon from "@mui/icons-material/Archive"
import AttachEmailIcon from "@mui/icons-material/AttachEmail"
import SettingsIcon from "@mui/icons-material/Settings"
import StyledMenu from "@Com/myCom/StyleMenu"
import MenuItem from "@mui/material/MenuItem"
// import mailCss from "@Css/mail.css?raw"
// import katexCss from "@Css/katex.min.css?raw"
// import hljsCss from "@Css/hljs.css?raw"

// dialog
// import Button from "@mui/material/Button"
// import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
// import DialogActions from "@mui/material/DialogActions"
// import DialogContent from "@mui/material/DialogContent"
// import DialogContentText from "@mui/material/DialogContentText"
// import DialogTitle from "@mui/material/DialogTitle"
// import SettingsIcon from '@mui/icons-material/Settings';
// import ketaxCss from "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.css?raw"
// import CloudMail from "@App/share/CloudMail"
// import { getRenderHTML } from "@App/text/getMdText"
// import { Message } from "@arco-design/web-react"
// import { Notification } from "@arco-design/web-react"
import { useTheme } from "@mui/material/styles"
// import SettingsRight from "./Subsettings/SettingsRight"
import SettingsRoute from "./Subsettings/SettingsRoute"
import { Box, Divider, ThemeProvider } from "@mui/material"
import IconBreadcrumbs from "./Subsettings/SettingsBread"
import SettingsBody from "./Subsettings/SettingsBody"
import { getTheme } from "@App/config/change"
export default function Settings(props: any) {
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
          <IconBreadcrumbs></IconBreadcrumbs>
          <Divider sx={{ my: 0.5 }} />

          <Box
            sx={{
              height: "48vh",
              display: "flex",
              background: theme === "light" ? "#F8FAFB" : "",
              padding: "5px",
              flexDirection: "row",
              borderRradius: "50px",
              // background: "#ffffff",
              // boxShadow: theme === "light" ? "20px 20px 60px #d9d9d9,-20px -20px 60px #ffffff": "" ,
              borderRadius: "5px",
            }}
          >
            <SettingsRoute></SettingsRoute>
            <SettingsBody></SettingsBody>
          </Box>
        </Box>
      </Dialog>
      <SettingsIcon />
      设置
    </>
  )
}
