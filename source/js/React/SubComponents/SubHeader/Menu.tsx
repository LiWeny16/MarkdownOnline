import * as React from "react"
import MenuItem from "@mui/material/MenuItem"
import EditIcon from "@mui/icons-material/Edit"
import Divider from "@mui/material/Divider"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import MyButton from "../../Components/myCom/CustomButton"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import save, { isSaved } from "@App/save"
import { useImage } from "@Mobx/Image"
import { observer } from "mobx-react"
import StyledMenu from "@Com/myCom/StyleMenu"
import Share from "./Share/Share"
import Export from "./Export/Export"
import Settings from "./Settings/Settings"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material"
import { deleteDBAll } from "@App/db.js"
import myPrint from "@App/export/myPrint"
import FolderOpenOutlinedIcon from "@mui/icons-material/Folder"
import { changeFileManagerState, getFileManagerState } from "@App/config/change"
// import domtoimg from "@App/export/domToImg"

const CustomizedMenus = observer(() => {
  const image = useImage()
  // 1本menu anchor
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // 2分享 anchor
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null)

  // 3导出 anchor
  const [anchorEl3, setAnchorEl3] = React.useState<null | HTMLElement>(null)

  // 4设置 anchor
  const [anchorEl4, setAnchorEl4] = React.useState<null | HTMLElement>(null)

  // 保存提示
  const [modalState, setModalState] = React.useState<boolean>(false)
  const open = Boolean(anchorEl)
  const open2 = Boolean(anchorEl2)
  const open3 = Boolean(anchorEl3)
  const open4 = Boolean(anchorEl4)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget)
    event.stopPropagation()
  }
  const handleClick3 = async (event: React.MouseEvent<HTMLElement>) => {
    if (await isSaved()) {
      //@ts-ignore
      setAnchorEl3(event.target)
      event.stopPropagation()
    } else {
      event.stopPropagation()
      handleCloseMenu()
      setModalState(true)
    }
  }
  const handleClick4 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl4(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleCloseShare = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(null)
    e.stopPropagation()
  }
  const handleCloseExport = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl3(null)
    e.stopPropagation()
  }
  const handleCloseSettings = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl4(null)
    e.stopPropagation()
  }
  const handleImageManager = () => {
    // console.log(image.displayState)
    image.display()
    handleCloseMenu()
    // 点击这个的时候 传递一个信号给另一个抽屉组件
  }
  const handleFileManager = () => {
    changeFileManagerState(true)
    handleCloseMenu()
  }
  return (
    <div>
      <Dialog
        open={modalState}
        onClose={() => {
          setModalState(false)
        }}
      >
        <DialogTitle>
          <Typography variant="h6" gutterBottom>
            确定导出吗，你还没有保存呢！
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" gutterBottom>
              Once you have clicked the "yes" button, your text will be saved.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalState(false)
              save()
              myPrint()
            }}
          >
            是嘟
          </Button>
          <Button
            onClick={() => {
              setModalState(false)
            }}
            autoFocus
          >
            达咩
          </Button>
        </DialogActions>
      </Dialog>
      <MyButton open={open} endIcon={<MoreVertIcon />} onClick={handleClick}>
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
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleImageManager} disableRipple>
          <EditIcon />
          图片管理器
        </MenuItem>
        <MenuItem onClick={handleFileManager} disableRipple>
          <FolderOpenOutlinedIcon />
          文件管理器(实验性)
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleClick3(e)
            // handleCloseMenu()s
          }}
          disableRipple
        >
          <Export
            anchorEl={anchorEl3}
            open={open3}
            closeMenu={handleCloseMenu}
            closeExportMenu={handleCloseExport}
          />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={(e) => {
            handleClick2(e)
            // handleCloseMenu()
          }}
          disableRipple
        >
          <Share
            closAll={handleCloseMenu}
            anchorEl={anchorEl2}
            open={open2}
            onClick={handleCloseShare}
          />
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            handleClick4(e)
            // handleCloseMenu()
          }}
          disableRipple
        >
          <Settings
            closeAll={handleCloseMenu}
            anchorEl={anchorEl4}
            open={open4}
            onClick={handleCloseSettings}
          />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseMenu()
          }}
          disableRipple
        >
          <MoreHorizIcon />
          更多(敬请期待)&nbsp;&nbsp;
        </MenuItem>
      </StyledMenu>
    </div>
  )
})

export default CustomizedMenus
