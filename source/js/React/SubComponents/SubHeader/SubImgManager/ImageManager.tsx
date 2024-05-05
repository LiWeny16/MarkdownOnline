import * as React from "react"
import { useEffect } from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"
import MagicImg from "@Com/myCom/MagicImg"
import { useImage } from "@Mobx/Image"
import { observer } from "mobx-react"
import Grid from "@mui/material/Unstable_Grid2/Grid2"
import { readAllMemoryImg } from "@App/textMemory/memory"
import Tooltip from "@mui/material/Tooltip"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import TB from "@Com/myCom/Layout/TB"
import LR from "@Com/myCom/Layout/LR"
import MyBox from "@Com/myCom/Layout/Box"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { lime, purple } from "@mui/material/colors"
// import { Modal } from "@arco-design/web-react"

import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

import { deleteDBAll } from "@App/db.js"

// THEME
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: purple,
  },
})

const TemporaryDrawer = observer((props: any) => {
  const colors = ["#3491FA", "#165DFF", "#722ED1"]
  const image = useImage()
  const [drawerState, setDrawerState] = React.useState(false)
  const [imgSrc, setImgSrc] = React.useState<Array<any>>([])
  const [openConfirmDelState, setOpenConfirmDelState] = React.useState(false)
  function handleDeleteImg() {
    setOpenConfirmDelState(true)
  }
  React.useEffect(() => {
    readAllMemoryImg().then((list) => {
      setImgSrc(list)
    })
  })
  React.useEffect(() => {
    setDrawerState(image.displayState)
  }, [image.displayState])
  // console.log(image.displayState)
  return (
    <>
      <Dialog
        open={openConfirmDelState}
        onClose={() => {
          setOpenConfirmDelState(false)
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Ready to delete all the images?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you have clicked the "yes" button, your pictures and your text
            will be deleted!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenConfirmDelState(false)
              deleteDBAll("md_content")
              window.location.reload()
            }}
          >
            YES
          </Button>
          <Button
            onClick={() => {
              setOpenConfirmDelState(false)
              // 删库
            }}
            autoFocus
          >
            NO
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor={"bottom"}
        open={drawerState}
        elevation={16}
        // onClick={() => {}}
        onClose={() => {
          // console.log("closed",drawerState)
          image.hidden()
        }}
      >
        <div style={{ height: "60svh" }}>
          <div>
            <ThemeProvider theme={theme}>
              <MyBox>
                <LR space={[90]}>
                  <MyBox min={1} move={{ x: "5svw" }}>
                    <p>图片管理器</p>
                    <Tooltip
                      title={
                        <div>
                          管理粘贴上传的图片
                          <ul style={{margin:"2px"}}>
                            <li>按住Ctrl点击图片插入</li>
                            <li>双击图片放大预览</li>
                            <li>按住Alt点击图片复制图片</li>
                          </ul>
                        </div>
                      }
                    >
                      <IconButton>
                        <HelpOutlineIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </MyBox>
                  <MyBox>
                    <Tooltip title="删除全部图片和储存的文字">
                      <IconButton onClick={handleDeleteImg}>
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </MyBox>
                </LR>
              </MyBox>
            </ThemeProvider>
          </div>

          <Divider style={{ marginBottom: "1.3svh" }} />
          <Grid
            container
            rowSpacing={5}
            // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            columns={16}
          >
            {imgSrc
              ? imgSrc.map((value, index) => {
                  return (
                    <Grid id={value.uuid} key={value.uuid} xs={8}>
                      <MagicImg
                        magic={0}
                        src={value.imgBase64}
                        uuid={value.uuid}
                      />
                    </Grid>
                  )
                })
              : undefined}

            {/* <Grid xs={8}>
              <MagicImg src="http://bigonion.cn/background/wallheaven.jfif"></MagicImg>
            </Grid>
            <Grid xs={8}>
              <MagicImg src="http://bigonion.cn/background/wallheaven.jfif"></MagicImg>
            </Grid>
            <Grid xs={8}>
              <MagicImg src="http://bigonion.cn/background/wallheaven.jfif"></MagicImg>
            </Grid>
            <Grid xs={8}>
              <MagicImg src="http://bigonion.cn/background/wallheaven.jfif"></MagicImg>
            </Grid> */}
          </Grid>
        </div>
      </Drawer>
    </>
  )
})
// 显示这个抽屉
export default TemporaryDrawer
