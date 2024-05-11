import * as React from "react"
import AppBar from "@mui/material/AppBar"
import { Box, ThemeProvider, createTheme } from "@mui/material/"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import InfoIcon from "@mui/icons-material/Info"
import GetAppIcon from "@mui/icons-material/GetApp"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import ImageIcon from "@mui/icons-material/Image"
import LinkIcon from "@mui/icons-material/Link"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
// import WorkIcon from "@mui/icons-material/Work"
import EditNoteIcon from "@mui/icons-material/EditNote"
// import BeachAccessIcon from "@mui/icons-material/BeachAccess"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
// import Button from "@mui/material/Button"
import { grey, lime, purple } from "@mui/material/colors"
import Menu from "./SubHeader/Menu"
import ImageManger from "./SubHeader/SubImgManager/ImageManager"
import HomeIcon from "@mui/icons-material/Home"
// import Stack from "@mui/material/"
// import { alpha, styled } from "@mui/material/styles"
// import Paper from "@mui/material/Paper"
import { enObj } from "@Root/js/index"
import kit from "@cdn-kit"
import MyButton from "../Components/myCom/CustomButton"
import myPrint from "@App/export/myPrint"
import aboutBox from "@Func/Events/aboutBox"
// import Alert from "@mui/material/Alert"
// Arco-Design
// import { Message } from '@arco-design/web-react';
import { Message } from "@arco-design/web-react"
import { useImage } from "@Root/js/React/Mobx/Image"
import { observer } from "mobx-react"
import { useTheme } from "@mui/material"
import FileDrawer from "./SubHeader/File/File"

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
}

const runTo = (url: string, delay: number) => {
  kit.sleep(delay).then(() => {
    window.location.href = url
  })
}
const handleHomeClick = () => {
  runTo("https://bigonion.cn", 300)
}

const boxShadow =
  "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);"

const drawerWidth = 240
// const navItems = ["Home", "About3", "Contact"]

const DrawerAppBar = observer((props: Props) => {
  const theme = useTheme()
  const { window } = props
  // const image = useImage()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const container =
    window !== undefined ? () => window().document.body : undefined

  const [alertState, setAlertState] = React.useState<boolean>(false)
  const handleAlert = () => {
    // setAlertState((pre) => !pre)
    Message.info({
      content: "此功能仍然在开发中",
      closable: true,
      duration: 3000,
      position: "bottom",
    })
  }
  const drawer = (
    // <ThemeProvider theme={theme}>
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", height: "100%", bgcolor: "black" }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "20px",
          my: 2,
          color: "wheat",
          textAlign: "center",
          boxShadow: boxShadow,
        }}
      >
        Markdown+ Online View
      </Typography>
      <List sx={{ height: "100%", bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemButton onClick={handleHomeClick}>
            <ListItemAvatar>
              <Avatar>
                <HomeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Home" secondary="" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={handleAlert}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={myPrint}>
            <ListItemAvatar>
              <Avatar>
                <GetAppIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Export" secondary="" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton
            onClick={() => {
              enObj.enAboutBox ? aboutBox() : undefined
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <InfoIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="About" secondary="" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
    // </ThemeProvider>
  )

  return (
    <>
      <div className="FLEX header-app-bar" style={{ flex: "0 0 8.7vh" }}>
        <CssBaseline />
        <AppBar
          component="nav"
          // enableColorOnDark={false}
          sx={{
            position: "inherit",
            justifyContent: "center",
            zIndex: 100,
            height: "8.7vh",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
          // sx={{ bgcolor: "black" }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 200, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <EditNoteIcon
              sx={{
                color: theme.palette.mode == "light" ? "black" : "white",
                display: { xs: "none", md: "flex" },
                transition:
                  "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                mr: 1,
              }}
            />
            <Typography
              variant="h1"
              component="a"
              fontFamily="monospace"
              href="/"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.primary.contrastText
                    : theme.palette.secondary.contrastText,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                textDecoration: "none",
              }}
            >
              <h1 style={{ fontSize: "28px" }}>Markdown+ Online View</h1>
            </Typography>
            <Box
              sx={{ display: { xs: "none", sm: "flex", flexDirection: "row" } }}
            >
              <MyButton href="https://bigonion.cn" startIcon={<LinkIcon />}>
                首页
              </MyButton>
              <MyButton
                onClick={() => {
                  enObj.enAboutBox ? aboutBox() : undefined
                }}
                startIcon={<HelpOutlineIcon />}
              >
                关于
              </MyButton>
              <Menu />
              <ImageManger />
              <FileDrawer />
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: { xs: "flex", sm: "none" } }} component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </div>
    </>
  )
})
export default DrawerAppBar
