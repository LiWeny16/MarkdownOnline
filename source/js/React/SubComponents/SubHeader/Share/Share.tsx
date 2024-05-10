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

// import ketaxCss from "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.css?raw"
import CloudMail from "@App/share/CloudMail"
import { getRenderHTML } from "@App/text/getMdText"
import { Message } from "@arco-design/web-react"
import { Notification } from "@arco-design/web-react"
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
  let handleSendMail = (e: React.MouseEvent<HTMLElement>) => {
    let mailTo = mailOptionsRef.current.value
    CloudMail(
      "https://service-g12i7wh1-1321514649.sh.apigw.tencentcs.com/release/mail",
      "post",
      {
        to: mailTo,
        subject: "Mailed from Markdown Online+",
        html:
          `<div class="markdown-body">${getRenderHTML()}</div>` ,
          // `<style>${mailCss + katexCss + hljsCss}</style>`,
        raw: 0,
      }
    )
    handleCloseAll(e)
    Notification.success({
      title: "邮件发送成功！",
      content: `Beta版本,请勿重复尝试`,
      position: "topRight",
    })
    Notification.info({
      title: "请注意,邮件发送暂时不能完全支持mermaid和Latex",
      content: `Beta版本,请勿重复尝试`,
      position: "topRight",
    })
    props.closAll()
  }
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={mailSharePanelState}
        onClose={handleCloseAll}
      >
        <DialogTitle>神奇邮箱</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请输入你要发送到的邮箱
            <br />
          </DialogContentText>
          <TextField
            inputRef={mailOptionsRef}
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAll}>取消</Button>
          <Button onClick={handleSendMail}>发送</Button>
        </DialogActions>
      </Dialog>
      {/* **************************** */}
      <ArchiveIcon />
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
            // console.log(mailCss);
            e.stopPropagation()
            setMailSharePanelState(true)
          }}
          disabled

          disableRipple
        >
          <AttachEmailIcon />
          邮箱分享
        </MenuItem>
      </StyledMenu>
    </>
  )
}
