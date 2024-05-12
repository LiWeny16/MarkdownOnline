import React from "react"
import ArchiveIcon from "@mui/icons-material/Archive"
import AttachEmailIcon from "@mui/icons-material/AttachEmail"
import StyledMenu from "@Com/myCom/StyleMenu"
import MenuItem from "@mui/material/MenuItem"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import ShortTextIcon from "@mui/icons-material/ShortText"
import CloudMail from "@App/share/CloudMail"
import { getRenderHTML } from "@App/text/getMdText"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import { Message } from "@arco-design/web-react"
import exportAsImage from "@App/export/domToImg"
import exportAsMd from "@App/export/exportAsMd"
import myPrint from "@App/export/myPrint"

import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"

import Box from "@mui/material/Box"
import LR from "@Com/myCom/Layout/LR"
import TB from "@Com/myCom/Layout/TB"

import { Notification } from "@arco-design/web-react"
import noteUseArco from "@App/message/note"
export default function Export(props: any) {
  let closeExportMenu = props.closeExportMenu
  let closeMenu = props.closeMenu
  let [openExportAsImgSettings, setOpenExportAsImgSettings] =
    React.useState(false)
  let handleCloseExportImageSetting = (e: React.MouseEvent) => {
    console.log(e)
    closeExportMenu(e)
    setOpenExportAsImgSettings(() => {
      return false
    })
  }

  let exportPicInputRef = React.useRef<any>()
  const [clearOptions, setClearOptions] = React.useState(3)

  const handleChange = (event: SelectChangeEvent) => {
    event.stopPropagation()
    setClearOptions(event.target.value as unknown as number)
  }
  /**
   * @description 导出出口函数
   */
  let handleExportAsImageConfirm = (e: React.MouseEvent) => {
    handleCloseExportImageSetting(e)
    let name = exportPicInputRef.current.value
    let clear = clearOptions
    exportAsImage(clear ?? 4, name ?? "md_snapshot.png")
    props.closeMenu(e)
    noteUseArco("导出成功！", `Beta版本`, {
      kind: "info",
      position: "topRight",
    })
  }
  return (
    <>
      {/* jpeg导出设置Panel */}
      <Dialog
        className="avoid"
        onClose={handleCloseExportImageSetting}
        open={openExportAsImgSettings}
        // fullScreen={false}
        fullWidth={true}
        maxWidth={"sm"}
      >
        {/* 这里必须要套一层div，否则冒泡会让上一层锚点更新，且最外层onClose和onClick有冲突 */}
        {/* MUI架构把遮罩层放在了Dialog大盒子里面，如果直接设置Dialog阻止冒泡的话会破坏MUI close的逻辑判断 */}
        {/* MUI原理是对内容层和最外层都设置了onClick，如果点击内容层则不动且仍由他冒泡，冒泡到最外层做逻辑判断 */}
        {/* 一但是内容层元素的点击则不予置评，反之触发关闭回调 */}
        {/* 在这里如果我设置最外层的onClick事件禁止冒泡，那么*/}
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <DialogTitle>导出设置</DialogTitle>
          <DialogContent>
            <DialogContentText>请选择图片清晰度</DialogContentText>
            <br />
            <FormControl fullWidth>
              <Box>
                <InputLabel id="demo-simple-select-label">
                  图片清晰度
                </InputLabel>
                <Select
                  label={"图片清晰度"}
                  defaultValue={"4"}
                  defaultChecked={true}
                  // defaultChecked={true}
                  // value={clearOptions}
                  fullWidth
                  onChange={handleChange}
                >
                  <MenuItem value={"1"}>1 (比较模糊,体积轻巧)</MenuItem>
                  <MenuItem value={"2"}>2 (有些模糊)</MenuItem>
                  <MenuItem value={"4"}>3 (默认,适中,推荐)</MenuItem>
                  <MenuItem value={"6"}>4 (比较清晰,体积稍大)</MenuItem>
                  <MenuItem value={"10"}>
                    5 (超鸡无敌霹雳霸清晰,体积较大)
                  </MenuItem>
                </Select>
              </Box>
              <Box marginX={"8px"}>
                <TextField
                  inputRef={exportPicInputRef}
                  margin="dense"
                  id="export_img_name"
                  defaultValue={"md_snapshot.png"}
                  label="导出的文件名"
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder="md_snapshot.png"
                />
              </Box>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseExportImageSetting}>取消</Button>
            <Button onClick={handleExportAsImageConfirm}>确认导出</Button>
          </DialogActions>
        </div>
      </Dialog>
      {/* jpeg导出设置Panel */}
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
        onClick={(e: any) => {
          closeExportMenu(e)
        }}
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
          onClick={(e) => {
            // handleClose()
            // exportAsImage()
            setOpenExportAsImgSettings(true)
            // closeMenu()
            closeExportMenu(e)
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
