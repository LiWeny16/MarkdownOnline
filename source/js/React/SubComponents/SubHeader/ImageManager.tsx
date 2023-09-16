import * as React from "react"
import { useEffect } from 'react'
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
import { useImage } from '@Store/Image'
import { observer } from "mobx-react"
type Anchor = "top" | "left" | "bottom" | "right"

const TemporaryDrawer = observer((props: any) => {
  const image  = useImage()
  const [ drawerState, setDrawerState ] = React.useState(image.displayState)
  console.log(image.displayState)
  return (
    <>
      <Drawer
        anchor={"top"}
        open={image.displayState}
        onClick={() => {
          image.hidden()
        }}
        onClose={() => {
          console.log("closed",drawerState)
        }}
      >
        <MagicImg src="http://bigonion.cn/background/wallheaven.jfif"></MagicImg>
      </Drawer>
    </>
  )
})
// 显示这个抽屉
export default TemporaryDrawer
