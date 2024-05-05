import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Box } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import GetAppIcon from "@mui/icons-material/GetApp";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import WorkIcon from "@mui/icons-material/Work"
import EditNoteIcon from "@mui/icons-material/EditNote";
// import BeachAccessIcon from "@mui/icons-material/BeachAccess"
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "./SubHeader/Menu";
import ImageManger from "./SubHeader/SubImgManager/ImageManager";
import HomeIcon from "@mui/icons-material/Home";
// import Stack from "@mui/material/"
// import { alpha, styled } from "@mui/material/styles"
// import Paper from "@mui/material/Paper"
import { enObj } from "@Root/js/index";
import kit from "@cdn-kit";
import MyButton from "../Components/myCom/CustomButton";
import myPrint from "@App/export/myPrint";
import aboutBox from "@Func/Events/aboutBox";
// import Alert from "@mui/material/Alert"
// Arco-Design
// import { Message } from '@arco-design/web-react';
import { Message } from "@arco-design/web-react";
import { observer } from "mobx-react";
import { useTheme } from "@mui/material";
const runTo = (url, delay) => {
    kit.sleep(delay).then(() => {
        window.location.href = url;
    });
};
const handleHomeClick = () => {
    runTo("https://bigonion.cn", 300);
};
const boxShadow = "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);";
const drawerWidth = 240;
// const navItems = ["Home", "About3", "Contact"]
const DrawerAppBar = observer((props) => {
    const theme = useTheme();
    const { window } = props;
    // const image = useImage()
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const container = window !== undefined ? () => window().document.body : undefined;
    const [alertState, setAlertState] = React.useState(false);
    const handleAlert = () => {
        // setAlertState((pre) => !pre)
        Message.info({
            content: "此功能仍然在开发中",
            closable: true,
            duration: 3000,
            position: "bottom",
        });
    };
    const drawer = (
    // <ThemeProvider theme={theme}>
    _jsxs(Box, { onClick: handleDrawerToggle, sx: { textAlign: "center", height: "100%", bgcolor: "black" }, children: [_jsx(Typography, { variant: "h1", sx: {
                    fontSize: "20px",
                    my: 2,
                    color: "wheat",
                    textAlign: "center",
                    boxShadow: boxShadow,
                }, children: "Markdown+ Online View" }), _jsxs(List, { sx: { height: "100%", bgcolor: "background.paper" }, children: [_jsx(ListItem, { children: _jsxs(ListItemButton, { onClick: handleHomeClick, children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { children: _jsx(HomeIcon, {}) }) }), _jsx(ListItemText, { primary: "Home", secondary: "" })] }) }), _jsx(ListItem, { children: _jsxs(ListItemButton, { onClick: handleAlert, children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { children: _jsx(ImageIcon, {}) }) }), _jsx(ListItemText, { primary: "Photos", secondary: "" })] }) }), _jsx(ListItem, { children: _jsxs(ListItemButton, { onClick: myPrint, children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { children: _jsx(GetAppIcon, {}) }) }), _jsx(ListItemText, { primary: "Export", secondary: "" })] }) }), _jsx(ListItem, { children: _jsxs(ListItemButton, { onClick: () => {
                                enObj.enAboutBox ? aboutBox() : undefined;
                            }, children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { children: _jsx(InfoIcon, {}) }) }), _jsx(ListItemText, { primary: "About", secondary: "" })] }) })] })] })
    // </ThemeProvider>
    );
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "FLEX ", style: { flex: "0 0 8.7vh" }, children: [_jsx(CssBaseline, {}), _jsx(AppBar, { component: "nav", 
                    // enableColorOnDark={false}
                    sx: {
                        position: "inherit",
                        justifyContent: "center",
                        zIndex: 100,
                        height: "8.7vh",
                        transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", onClick: handleDrawerToggle, sx: { mr: 200, display: { sm: "none" } }, children: _jsx(MenuIcon, {}) }), _jsx(EditNoteIcon, { sx: {
                                    color: theme.palette.mode == "light" ? "black" : "white",
                                    display: { xs: "none", md: "flex" },
                                    transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                                    mr: 1,
                                } }), _jsx(Typography, { variant: "h1", component: "a", fontFamily: "monospace", href: "/", sx: {
                                    flexGrow: 1,
                                    display: { xs: "none", sm: "block" },
                                    color: theme.palette.mode === "light"
                                        ? theme.palette.primary.contrastText
                                        : theme.palette.secondary.contrastText,
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    textDecoration: "none",
                                }, children: _jsx("h1", { style: { fontSize: "28px" }, children: "Markdown+ Online View" }) }), _jsxs(Box, { sx: { display: { xs: "none", sm: "flex", flexDirection: "row" } }, children: [_jsx(MyButton, { href: "https://bigonion.cn", startIcon: _jsx(LinkIcon, {}), children: "\u9996\u9875" }), _jsx(MyButton, { onClick: () => {
                                            enObj.enAboutBox ? aboutBox() : undefined;
                                        }, startIcon: _jsx(HelpOutlineIcon, {}), children: "\u5173\u4E8E" }), _jsx(Menu, {}), _jsx(ImageManger, {})] })] }) }), _jsx(Box, { sx: { display: { xs: "flex", sm: "none" } }, component: "nav", children: _jsx(Drawer, { container: container, variant: "temporary", open: mobileOpen, onClose: handleDrawerToggle, ModalProps: {
                            keepMounted: true, // Better open performance on mobile.
                        }, sx: {
                            display: { xs: "block", sm: "none" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }, children: drawer }) })] }) }));
});
export default DrawerAppBar;
