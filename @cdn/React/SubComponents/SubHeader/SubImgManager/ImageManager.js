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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import LR from "@Com/myCom/Layout/LR";
import MyBox from "@Com/myCom/Layout/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteDBAll, openDB, cursorDelete } from "@App/db.js";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
// THEME
const theme = createTheme({
    palette: {
        primary: { main: "#1976d2" },
    },
});
const TemporaryDrawer = observer(() => {
    const { t } = useTranslation();
    const image = useImage();
    const [drawerState, setDrawerState] = React.useState(false);
    const [openConfirmDelState, setOpenConfirmDelState] = React.useState(false);
    const currentTheme = getTheme();
    function handleDeleteImg() {
        setOpenConfirmDelState(true);
    }
    // 删除单个图片
    async function handleDeleteSingleImg(uuid) {
        try {
            const db = await openDB("md_content", 2);
            cursorDelete(db, "users_img", "uuid", uuid);
            // 刷新图片列表
            setTimeout(() => {
                image.refreshImages();
            }, 100); // 稍微延迟确保删除操作完成
        }
        catch (error) {
            console.error("删除图片失败:", error);
        }
    }
    React.useEffect(() => {
        setDrawerState(image.displayState);
    }, [image.displayState]);
    // 获取响应式的图片列表
    const imgSrc = image.getImages();
    return (_jsxs(_Fragment, { children: [_jsxs(Dialog, { open: openConfirmDelState, onClose: () => {
                    setOpenConfirmDelState(false);
                }, style: { zIndex: 9999 }, children: [_jsx(DialogTitle, { id: "alert-dialog-title", children: t("t-image-manager-delete-all-title") }), _jsx(DialogContent, { children: _jsx(DialogContentText, { id: "alert-dialog-description", children: t("t-image-manager-delete-all-content") }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setOpenConfirmDelState(false);
                                    deleteDBAll("md_content");
                                    // 刷新图片列表而不是重新加载页面
                                    image.refreshImages();
                                }, children: t("t-image-manager-confirm-yes") }), _jsx(Button, { onClick: () => {
                                    setOpenConfirmDelState(false);
                                }, autoFocus: true, children: t("t-image-manager-confirm-no") })] })] }), _jsx(Drawer, { anchor: "bottom", open: drawerState, elevation: 16, onClose: () => {
                    image.hidden();
                }, children: _jsxs("div", { style: { height: "60vh", overflow: "auto" }, children: [_jsx("div", { children: _jsx(ThemeProvider, { theme: theme, children: _jsx(MyBox, { children: _jsxs(LR, { space: [90], children: [_jsxs(MyBox, { min: 1, move: { x: "5vw" }, children: [_jsx("p", { children: t("t-image-manager-title") }), _jsx(Tooltip, { title: _jsxs("div", { children: [t("t-image-manager-tooltip-title"), _jsxs("ul", { style: { margin: "2px" }, children: [_jsx("li", { children: t("t-image-manager-tooltip-ctrl-click") }), _jsx("li", { children: t("t-image-manager-tooltip-double-click") }), _jsx("li", { children: t("t-image-manager-tooltip-alt-click") })] })] }), children: _jsx(IconButton, { children: _jsx(HelpOutlineIcon, { color: "primary" }) }) })] }), _jsx(MyBox, { children: _jsx(Tooltip, { title: t("t-image-manager-tooltip-delete-all"), children: _jsx(IconButton, { onClick: handleDeleteImg, children: _jsx(DeleteIcon, { color: "primary" }) }) }) })] }) }) }) }), _jsx(Divider, { style: { marginBottom: "1.3vh" } }), imgSrc.length > 0 ? (_jsx("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                gap: "1rem",
                                padding: "0 1rem 1rem 1rem"
                            }, children: imgSrc.map((value) => (_jsxs("div", { style: {
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    backgroundColor: currentTheme === "light" ? "#f9f9f9" : "#2a2a2a",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    transition: "all 0.2s ease",
                                    border: `1px solid ${currentTheme === "light" ? "#e0e0e0" : "#404040"}`,
                                }, children: [_jsx(Tooltip, { title: t("t-image-manager-tooltip-delete-single"), children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteSingleImg(value.uuid), style: {
                                                position: "absolute",
                                                top: "8px",
                                                right: "8px",
                                                backgroundColor: currentTheme === "light" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
                                                color: "#f44336",
                                                zIndex: 10,
                                                width: "24px",
                                                height: "24px"
                                            }, children: _jsx(CloseIcon, { style: { fontSize: "16px" } }) }) }), _jsx("div", { style: {
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            marginBottom: "0.5rem"
                                        }, children: _jsx(MagicImg, { magic: 0, src: value.imgBase64, uuid: value.uuid, style: {
                                                maxWidth: "100%",
                                                maxHeight: "300px",
                                                objectFit: "contain",
                                                borderRadius: "4px"
                                            } }) }), _jsxs("div", { style: {
                                            fontSize: "12px",
                                            color: currentTheme === "light" ? "#666" : "#999",
                                            textAlign: "center",
                                            wordBreak: "break-all"
                                        }, children: ["UUID: ", value.uuid] })] }, value.uuid))) })) : (_jsxs("div", { style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "3rem 1rem",
                                color: currentTheme === "light" ? "#999" : "#666",
                                textAlign: "center"
                            }, children: [_jsx(HelpOutlineIcon, { style: {
                                        fontSize: "48px",
                                        marginBottom: "1rem",
                                        opacity: 0.5
                                    } }), _jsx("h3", { style: { margin: "0 0 0.5rem 0", fontWeight: "normal" }, children: t("t-image-manager-no-images-title") }), _jsx("p", { style: { margin: 0, fontSize: "14px" }, children: t("t-image-manager-no-images-description") })] }))] }) })] }));
});
export default TemporaryDrawer;
