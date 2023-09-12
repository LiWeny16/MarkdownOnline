import * as React from "react"
import { styled, alpha } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Menu, { MenuProps } from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import EditIcon from "@mui/icons-material/Edit"
import Divider from "@mui/material/Divider"
import ArchiveIcon from "@mui/icons-material/Archive"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import MyButton from "../../Components/myCom/CustomButton"
import myPrint from "@App/myPrint"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Message } from "@arco-design/web-react"
import ImageManager from "./ImageManager"
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        color:
          theme.palette.mode === "light"
            ? "rgb(55, 65, 81)"
            : theme.palette.grey[300],
        marginRight: theme.spacing(1.5)
      }
    }
  }
}))

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [imgManagerState, setImgManagerState] = React.useState<boolean>(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleExport = () => {
    myPrint()
  }
  const handleImageManager = () => {
    handleClose()
    Message.info({
      content: "此功能仍然在开发中",
      closable: true,
      duration: 3000,
      position: "bottom"
    })
    setImgManagerState(true)
  }
  return (
    <div>
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
          "aria-labelledby": "demo-customized-button"
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
          导出
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            handleClose()
            Message.info({
              content: "此功能仍然在开发中",
              closable: true,
              duration: 3000,
              position: "bottom"
            })
          }}
          disableRipple
        >
          <ArchiveIcon />
          分享(开发中)
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          敬请期待
        </MenuItem>
      </StyledMenu>
    </div>
  )
}
