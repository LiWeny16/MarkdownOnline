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
type Anchor = "top" | "left" | "bottom" | "right"

const TemporaryDrawer = observer((props: any) => {
  const image = useImage()
  const [drawerState, setDrawerState] = React.useState(false)
  const [imgSrc, setImgSrc] = React.useState<Array<any>>([])
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
        <div style={{ height: "60vh" }}>
          <center>
            <p>图片管理器</p>
          </center>
          <Divider style={{ marginBottom: "1.3vh" }} />
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
                      <MagicImg src={value.imgBase64}></MagicImg>
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
