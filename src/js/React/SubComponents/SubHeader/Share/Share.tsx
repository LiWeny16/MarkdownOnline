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
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
// import { getMdFromFireDB, uploadMdToFireDB } from "@App/share/firebase"
import { Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
// import FormDialog from "@Com/myCom/Dialog"
export default function Share(props: any) {
  const { t } = useTranslation()

  let mailOptionsRef = React.useRef<any>()
  let [mailSharePanelState, setMailSharePanelState] = React.useState(false)
  const [sharedLink, setSharedLink] = React.useState("https://bigonion.cn")
  const [copied, setCopied] = React.useState(false)
  let handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    setMailSharePanelState(() => {
      return false
    })
    props.onClick(e)
    // console.log()
  }
  let handleCreateShareLink = async (e: React.MouseEvent<HTMLElement>) => {
    const shareContent = getMdTextFromMonaco()
    // await uploadMdToFireDB(shareContent)
    // await getMdFromFireDB().then((res) => {
    //   setSharedLink(res)
    // })
  }
  const handleAppClick = (urlScheme: string) => (e: any) => {
    e.stopPropagation()
    window.location.href = urlScheme
    // setMailSharePanelState(true)
  }
  const handleCopy = () => {
    navigator.clipboard
      .writeText(sharedLink)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // 2秒后恢复默认状态
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
      })
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
          <Tooltip title={copied ? "已复制!" : "点击复制"}>
            <TextField
              value={sharedLink}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              onClick={handleCopy}
            />
          </Tooltip>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateShareLink}>创建分享链接</Button>
        </DialogActions>
      </Dialog>
      {/* **************************** */}
      <ShareIcon />
      {/* // 分享 (开发中) / Share (In Development) */}
      {t("t-share")} 
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
          disabled
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
