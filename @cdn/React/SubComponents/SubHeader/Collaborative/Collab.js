import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
import realTimeColab from "@App/share/colab/realTimeColab";
import { replaceMonacoAll } from "@App/text/replaceText";
import { getMdTextFromMonaco } from "@App/text/getMdText";
// const url = "ws://127.0.0.1:9000"
const url = "ws://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run";
// https://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run
export default function Settings(props) {
    const { t } = useTranslation();
    const palette = useTheme().palette;
    const theme = getTheme();
    const [mailSharePanelState, setMailSharePanelState] = useState(false);
    const [msgFromSharing, setMsgFromSharing] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [receivingEnabled, setReceivingEnabled] = useState(true);
    const handleCloseAll = (e) => {
        setMailSharePanelState(false);
        props.onClick(e);
        props.closeAll();
    };
    useEffect(() => {
        if (msgFromSharing) {
            setOpenDialog(true);
        }
    }, [msgFromSharing]);
    const handleSendMessage = async () => {
        if (!(await realTimeColab.isConnected())) {
            await realTimeColab.connect(url, setMsgFromSharing);
        }
        await realTimeColab.sendBroadCastMessage(getMdTextFromMonaco());
    };
    const handleAcceptMessage = () => {
        try {
            replaceMonacoAll(window.monaco, window.editor, JSON.parse(msgFromSharing).message);
            setOpenDialog(false);
            setMsgFromSharing(null);
        }
        catch (error) { }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { hideBackdrop: true, fullScreen: false, maxWidth: false, open: props.open, onClose: handleCloseAll, sx: {
                    height: "100svh",
                    width: "100svw",
                }, children: _jsxs(Box, { sx: {
                        height: "60svh",
                        width: "25svw",
                        display: "flex",
                        background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
                        padding: "24px",
                        flexDirection: "column",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "24px",
                    }, children: [_jsx(Button, { variant: "contained", color: "primary", sx: {
                                padding: "12px 24px",
                                fontSize: "18px",
                                textTransform: "none",
                                borderRadius: "10px",
                            }, onClick: handleSendMessage, children: "\u5206\u4EAB\uFF0C\u4E00\u89E6\u5373\u53D1" }), _jsx(Button, { variant: "outlined", color: "secondary", sx: {
                                padding: "10px 20px",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: "600",
                                textTransform: "none",
                                color: theme === "light" ? "black" : "#F8FAFB",
                                borderColor: theme === "light" ? "#F8FAFB" : "#F8FAFB",
                                "&:hover": {
                                    backgroundColor: theme === "light" ? "#F5F5F5" : "#4A4A4A",
                                },
                            }, onClick: () => {
                                setReceivingEnabled(!receivingEnabled);
                                if (receivingEnabled) {
                                    realTimeColab.disconnect();
                                }
                            }, children: receivingEnabled ? "Disable Receiving" : "Enable Receiving" }), _jsx(Box, { sx: {
                                width: "100%",
                                backgroundColor: theme === "light" ? "#F8FAFB" : "#333333",
                                borderRadius: "12px",
                                padding: "18px",
                                fontSize: "16px",
                                textAlign: "center",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                overflow: "hidden",
                                whiteSpace: "nowrap", // 禁止换行
                                textOverflow: "ellipsis", // 超出内容省略号
                            }, children: msgFromSharing || "无消息" })] }) }), _jsxs(Dialog, { hideBackdrop: true, open: openDialog, onClose: () => {
                    setOpenDialog(false);
                    setMsgFromSharing(null);
                }, children: [_jsx(DialogTitle, { children: "\u2728\u65B0\u5206\u4EAB" }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: "\u60A8\u6709\u6765\u81EA\u5916\u90E8\u7684\u6D88\u606F\uFF0C\u662F\u5426\u63A5\u53D7\uFF1F" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setOpenDialog(false);
                                    setMsgFromSharing(null);
                                }, color: "secondary", children: "\u62D2\u7EDD" }), _jsx(Button, { onClick: handleAcceptMessage, color: "primary", autoFocus: true, children: "\u63A5\u53D7" })] })] }), _jsx(ScreenShareIcon, {}), _jsx(Typography, { children: t("t-collaborative-office") })] }));
}
