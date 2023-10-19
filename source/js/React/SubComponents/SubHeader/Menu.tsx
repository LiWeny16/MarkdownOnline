import * as React from "react"
import { styled, alpha } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Menu, { MenuProps } from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import EditIcon from "@mui/icons-material/Edit"
import AttachEmailIcon from "@mui/icons-material/AttachEmail"
import Divider from "@mui/material/Divider"
import ArchiveIcon from "@mui/icons-material/Archive"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import MyButton from "../../Components/myCom/CustomButton"
import myPrint from "@App/export/myPrint"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Message } from "@arco-design/web-react"
// import ImageManager from "./ImageManager"
import save, { isSaved } from "@App/save"
import { Modal } from "@arco-design/web-react"
import { kit } from "@Root/js/index"
import { useImage } from "@Mobx/Image"
import { observer } from "mobx-react"
import StyledMenu from "@Com/myCom/StyleMenu"
import CloudMail from "@App/share/CloudMail"
import { getRenderHTML } from "@App/text/getMdText"
import exportAsImage from "@App/export/domToImg"
// import domtoimg from "@App/export/domToImg"

const CustomizedMenus = observer(() => {
  const image = useImage()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null)
  const [modalState, setModalState] = React.useState<boolean>(false)
  const open = Boolean(anchorEl)
  const openShare = Boolean(anchorEl2)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleHover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget)
    event.stopPropagation()
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClose2 = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(null)
    e.stopPropagation()
  }
  const handleExport = async () => {
    if (await isSaved()) {
      myPrint()
    } else {
      handleClose()
      setModalState(true)
    }
  }
  const handleImageManager = () => {
    // console.log(image.displayState)
    image.display()
    handleClose()
    // 点击这个的时候 传递一个信号给另一个抽屉组件
  }
  return (
    <div>
      <Modal
        title={
          <>
            <div className="ERR">注意!</div>
          </>
        }
        visible={modalState}
        onOk={() => {
          setModalState(false)
          save()
          kit.sleep(1000).then(() => {
            myPrint()
          })
        }}
        onCancel={() => setModalState(false)}
        autoFocus={false}
        focusLock={true}
      >
        <div className="FLEX JUS-CENTER">
          <b>您还未保存，确定要导出吗？</b>
          (确定将会自动保存并导出)
        </div>
      </Modal>
      <MyButton
        open={open}
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        // endIcon={<KeyboardArrowDownIcon />}
        // style={{ fontFamily: "monospace" }}
      >
        {"更多"}
      </MyButton>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        elevation={24}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleImageManager} disableRipple>
          <EditIcon />
          图片管理器
          {/* {imgManagerState ? <ImageManager /> : undefined} */}
        </MenuItem>
        <MenuItem onClick={handleExport} disableRipple>
          <FileCopyIcon />
          导出为PDF
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={(e) => {
            handleHover(e)
            // handleClose()
          }}
          disableRipple
        >
          <ArchiveIcon />
          {/* 
          <MyButton
            open={openShare}
            endIcon={<MoreVertIcon />}
            onClick={handleHover}
            // endIcon={<KeyboardArrowDownIcon />}
            // style={{ fontFamily: "monospace" }}
          >
            {"更多"}
          </MyButton> */}
          分享(测试中)
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
            anchorEl={anchorEl2}
            open={openShare}
            onClick={handleClose2}
          >
            <MenuItem
              onClick={() => {
                CloudMail(
                  "https://service-g12i7wh1-1321514649.sh.apigw.tencentcs.com/release/mail",
                  "post",
                  {
                    to: "454888395@qq.com",
                    subject: "My Markdown Shareヾ(•ω•`)o",
                    html: getRenderHTML(),
                  }
                )
                Message.info({
                  content: "此功能仍处于测试阶段！",
                  closable: true,
                  duration: 3000,
                  position: "bottom",
                })
              }}
              disableRipple
            >
              <AttachEmailIcon />
              邮箱分享
            </MenuItem>
          </StyledMenu>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()
            // exportAsImage()
            exportAsImage()
          }}
          disableRipple
        >
          <MoreHorizIcon />
          导出为图片(测试中)
        </MenuItem>
      </StyledMenu>
    </div>
  )
})

export default CustomizedMenus
