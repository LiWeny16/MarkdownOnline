import * as React from "react"
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
type Anchor = "top" | "left" | "bottom" | "right"

export default function TemporaryDrawer() {
  const [state, setState] = React.useState(true)

  return (
    <>
      <Drawer
        anchor={"top"}
        open={state}
        onClick={() => {
          setState((pre) => {
            return !pre
          })
        }}
        onClose={() => {
          console.log("closed")
        }}
      >
        <MagicImg src="http://bigonion.cn/background/wallheaven.jfif"></MagicImg>
      </Drawer>
    </>
  )
}
