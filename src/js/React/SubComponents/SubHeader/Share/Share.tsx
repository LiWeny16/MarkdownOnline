import React from "react"
import ArchiveIcon from "@mui/icons-material/Archive"
import AttachEmailIcon from "@mui/icons-material/AttachEmail"
import StyledMenu from "@Com/myCom/StyleMenu"
import MenuItem from "@mui/material/MenuItem"
// import mailCss from "@Css/mail.css?raw"
// import katexCss from "@Css/katex.min.css?raw"
// import hljsCss from "@Css/hljs.css?raw"

// dialog
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import ShareIcon from "@mui/icons-material/Share"
// import ketaxCss from "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.css?raw"
import CloudMail from "@App/share/CloudMail"
import { getMdTextFromMonaco, getRenderHTML } from "@App/text/getMdText"
import { Message } from "@arco-design/web-react"
import { Notification } from "@arco-design/web-react"
import ChatIcon from "@mui/icons-material/Chat"
import { getMdFromFireDB, uploadMdToFireDB } from "@App/share/firebase"
// import FormDialog from "@Com/myCom/Dialog"
export default function Share(props: any) {
  let mailOptionsRef = React.useRef<any>()
  let [mailSharePanelState, setMailSharePanelState] = React.useState(false)
  let handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    setMailSharePanelState(() => {
      return false
    })
    props.onClick(e)
    // console.log()
  }
  let handleCreateShareLink = async (e: React.MouseEvent<HTMLElement>) => {
    const shareContent = getMdTextFromMonaco()
    // uploadMdToFireDB(shareContent)
    getMdFromFireDB()
    // console.log(await uploadMdToFireDB(window.monaco.getValue(), "bigonion"));
    mailOptionsRef.current.value = " wow"
  }
  const handleAppClick = (urlScheme: string) => (e: any) => {
    e.stopPropagation()
    window.location.href = urlScheme
    // setMailSharePanelState(true)
  }
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={mailSharePanelState}
        onClose={handleCloseAll}
      >
        <DialogTitle>真·分享</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={mailOptionsRef}
            margin="dense"
            id="name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateShareLink}>创建分享链接</Button>
        </DialogActions>
      </Dialog>
      {/* **************************** */}
      <ShareIcon />
      分享(开发中)
      <StyledMenu
        style={{ width: "fitContent" }}
        anchorOrigin={{
          vertical: -5,
          horizontal: 12,
        }}
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        elevation={24}
        anchorEl={props.anchorEl}
        open={props.open}
        onClick={props.onClick}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation()
            setMailSharePanelState(true)
          }}
          disableRipple
        >
          <ShareIcon />
          真·分享
        </MenuItem>
        {/* 打开微信应用 */}
        <MenuItem onClick={handleAppClick("weixin://dl/scan")} disableRipple>
          <ChatIcon />
          WeChat
        </MenuItem>
        <MenuItem onClick={handleAppClick("tg://")} disableRipple>
          <ChatIcon />
          Telegram
        </MenuItem>
        {/* 打开邮箱客户端 */}
        <MenuItem
          onClick={handleAppClick(
            "mailto:bigonion@bigonion.cn?subject=你的主题&body=你的邮件内容"
          )}
          disableRipple
        >
          <AttachEmailIcon />
          Email
        </MenuItem>
      </StyledMenu>
    </>
  )
}
