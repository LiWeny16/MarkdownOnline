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
import SettingsLeft from "./Subsettings/SettingsLeft"
import SettingsRight from "./Subsettings/SettingsRight"
import SettingsTop from "./Subsettings/SettingsTop"
// import SettingsTop from "./Subsettings/SettingsTop"
export default function Settings(props: any) {
  let mailOptionsRef = React.useRef<any>()
  let [mailSharePanelState, setMailSharePanelState] = React.useState(false)
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
        fullWidth={true}
        maxWidth={"sm"}
        open={props.open}
        onClose={handleCloseAll}
      >
        <SettingsLeft></SettingsLeft>
        <SettingsTop></SettingsTop>
      </Dialog>
      {/* **************************** */}
      <SettingsIcon />
      设置
      {/* <StyledMenu
        style={{ width: "fitContent" }}
        anchorOrigin={{
          vertical: -5,
          horizontal: 12,
        }}
        // id="demo-customized-menu"
        // MenuListProps={{
        //   "aria-labelledby": "demo-customized-button",
        // }}
        elevation={24}
        anchorEl={props.anchorEl}
        open={props.open}
        onClick={props.onClick}
      >
        <MenuItem
          onClick={(e) => {
            // console.log(mailCss);
            e.stopPropagation()
            setMailSharePanelState(true)
          }}
          disableRipple
        >
          <AttachEmailIcon />
          详细设置
        </MenuItem>
      </StyledMenu> */}
    </>
  )
}
