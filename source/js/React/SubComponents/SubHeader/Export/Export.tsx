import React from "react"
import ArchiveIcon from "@mui/icons-material/Archive"
import AttachEmailIcon from "@mui/icons-material/AttachEmail"
import StyledMenu from "@Com/myCom/StyleMenu"
import MenuItem from "@mui/material/MenuItem"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import ShortTextIcon from '@mui/icons-material/ShortText';
import CloudMail from "@App/share/CloudMail"
import { getRenderHTML } from "@App/text/getMdText"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Message } from "@arco-design/web-react"
import exportAsImage from "@App/export/domToImg"
import exportAsMd from "@App/export/exportAsMd"
import myPrint from "@App/export/myPrint"
export default function Export(props: any) {
  return (
    <>
      <FileCopyIcon />
      导出
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
          onClick={() => {
            myPrint()
          }}
          disableRipple
        >
          <PictureAsPdfIcon />
          导出为PDF
        </MenuItem>
        <MenuItem
          onClick={() => {
            // handleClose()
            exportAsImage()
            Message.info({
              content: "此功能仍处于测试阶段！",
              closable: true,
              duration: 3000,
              position: "bottom",
            })
          }}
          disableRipple
        >
          <AddPhotoAlternateIcon />
          导出为图片(Beta1.0)
        </MenuItem>

        <MenuItem
          onClick={() => {
            exportAsMd()
          }}
          disableRipple
        >
          <ShortTextIcon />
          导出为Markdown
        </MenuItem>
      </StyledMenu>
    </>
  )
}
