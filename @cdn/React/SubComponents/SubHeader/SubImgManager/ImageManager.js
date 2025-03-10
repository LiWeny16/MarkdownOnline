import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MagicImg from "@Com/myCom/MagicImg";
import { useImage } from "@Mobx/Image";
import { observer } from "mobx-react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import LR from "@Com/myCom/Layout/LR";
import MyBox from "@Com/myCom/Layout/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { readAllMemoryImg } from "@App/memory/memory";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteDBAll } from "@App/db.js";
// THEME
const theme = createTheme({
    palette: {
        primary: { main: "#1976d2" },
    },
});
const TemporaryDrawer = observer(() => {
    const image = useImage();
    const [drawerState, setDrawerState] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState([]);
    const [openConfirmDelState, setOpenConfirmDelState] = React.useState(false);
    function handleDeleteImg() {
        setOpenConfirmDelState(true);
    }
    React.useEffect(() => {
        readAllMemoryImg().then((list) => {
            setImgSrc(list);
        });
    }, []);
    React.useEffect(() => {
        setDrawerState(image.displayState);
    }, [image.displayState]);
    return (_jsxs(_Fragment, { children: [_jsxs(Dialog, { open: openConfirmDelState, onClose: () => {
                    setOpenConfirmDelState(false);
                }, children: [_jsx(DialogTitle, { id: "alert-dialog-title", children: "Ready to delete all the images?" }), _jsx(DialogContent, { children: _jsx(DialogContentText, { id: "alert-dialog-description", children: "Once you have clicked the \"yes\" button, your pictures and your text will be deleted!" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setOpenConfirmDelState(false);
                                    deleteDBAll("md_content");
                                    window.location.reload();
                                }, children: "YES" }), _jsx(Button, { onClick: () => {
                                    setOpenConfirmDelState(false);
                                }, autoFocus: true, children: "NO" })] })] }), _jsx(Drawer, { anchor: "bottom", open: drawerState, elevation: 16, onClose: () => {
                    image.hidden();
                }, children: _jsxs("div", { style: { height: "60vh", overflow: "auto" }, children: [_jsx("div", { children: _jsx(ThemeProvider, { theme: theme, children: _jsx(MyBox, { children: _jsxs(LR, { space: [90], children: [_jsxs(MyBox, { min: 1, move: { x: "5vw" }, children: [_jsx("p", { children: "\u56FE\u7247\u7BA1\u7406\u5668" }), _jsx(Tooltip, { title: _jsxs("div", { children: ["\u7BA1\u7406\u7C98\u8D34\u4E0A\u4F20\u7684\u56FE\u7247", _jsxs("ul", { style: { margin: "2px" }, children: [_jsx("li", { children: "\u6309\u4F4FCtrl\u70B9\u51FB\u56FE\u7247\u63D2\u5165" }), _jsx("li", { children: "\u53CC\u51FB\u56FE\u7247\u653E\u5927\u9884\u89C8" }), _jsx("li", { children: "\u6309\u4F4FAlt\u70B9\u51FB\u56FE\u7247\u590D\u5236\u56FE\u7247" })] })] }), children: _jsx(IconButton, { children: _jsx(HelpOutlineIcon, { color: "primary" }) }) })] }), _jsx(MyBox, { children: _jsx(Tooltip, { title: "\u5220\u9664\u5168\u90E8\u56FE\u7247\u548C\u50A8\u5B58\u7684\u6587\u5B57", children: _jsx(IconButton, { onClick: handleDeleteImg, children: _jsx(DeleteIcon, { color: "primary" }) }) }) })] }) }) }) }), _jsx(Divider, { style: { marginBottom: "1.3vh" } }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "1rem" }, children: imgSrc.length > 0 &&
                                imgSrc.map((value) => (_jsx("div", { style: { flex: "1 0 calc(50% - 1rem)" }, children: _jsx(MagicImg, { magic: 0, src: value.imgBase64, uuid: value.uuid }) }, value.uuid))) })] }) })] }));
});
export default TemporaryDrawer;
