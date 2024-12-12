import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Dialog from "@mui/material/Dialog";
import CachedIcon from "@mui/icons-material/Cached";
import DevicesIcon from "@mui/icons-material/Devices";
import gsap from "gsap";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, } from "@mui/material";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
import realTimeColab from "@App/share/colab/realTimeColab";
import { replaceMonacoAll } from "@App/text/replaceText";
import FileIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import TextIcon from "@mui/icons-material/TextFields";
import ClipboardIcon from "@mui/icons-material/ContentPaste";
import ScrollableBox from "@Root/js/React/Components/myCom/Layout/ScrollBox";
import { settingsBodyContentBoxStyle } from "../Settings/Subsettings/SettingsBody";
import LR from "@Root/js/React/Components/myCom/Layout/LR";
import kit from "bigonion-kit";
import { getMdTextFromMonaco } from "@App/text/getMdText";
const url = "wss://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run";
export default function Settings(props) {
    const buttonStyle = {
        borderRadius: "12px",
        borderColor: "#e0e0e0",
    };
    const { t } = useTranslation();
    const theme = getTheme();
    const [msgFromSharing, setMsgFromSharing] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [connectedUserIds, setConnectedUserIds] = useState([]);
    const [loading, setLoading] = useState(false);
    // 搜索同WIFI下用户逻辑
    async function handleClickSearch() {
        setLoading(true);
        try {
            if (!realTimeColab.isConnected()) {
                await realTimeColab.connect(url, setMsgFromSharing, setConnectedUserIds);
            }
            realTimeColab.broadcastSignal({
                type: "discover",
                id: realTimeColab.getUniqId(),
            });
            await kit.sleep(500);
        }
        catch (error) {
            console.error("Search error:", error);
        }
        finally {
            setLoading(false);
        }
    }
    const handleClickRippleBox = useCallback((event) => {
        const box = event.currentTarget;
        const createRipple = (delay, scale) => {
            const rippleElement = document.createElement("div");
            box.appendChild(rippleElement);
            const boundingRect = box.getBoundingClientRect();
            const size = Math.max(boundingRect.width, boundingRect.height);
            const xPos = event.clientX - boundingRect.left - size / 2;
            const yPos = event.clientY - boundingRect.top - size / 2;
            gsap.set(rippleElement, {
                width: size,
                height: size,
                x: xPos,
                y: yPos,
                borderRadius: "50%",
                opacity: 1,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                position: "absolute",
                pointerEvents: "none",
                transform: "scale(0)",
            });
            gsap.fromTo(rippleElement, { scale: 0, opacity: 1 }, {
                scale: scale,
                opacity: 0,
                duration: 2.2,
                ease: "power2.out",
                delay: delay,
                onComplete: () => {
                    rippleElement.remove();
                },
            });
        };
        createRipple(0, 2);
        createRipple(0.2, 2);
    }, []);
    const handleClickOtherClients = async (_e, targetUserId) => {
        const message = JSON.stringify({ message: getMdTextFromMonaco() });
        try {
            await realTimeColab.connectToUser(targetUserId);
            console.log(`Connected to user ${targetUserId}`);
            await realTimeColab.sendMessageToUser(targetUserId, message);
            console.log(`Message sent to user ${targetUserId}`);
        }
        catch (error) {
            console.error(`Failed to send message to user ${targetUserId}:`, error);
        }
    };
    useEffect(() => {
        realTimeColab
            .connect(url, (incomingMsg) => {
            // 当接收到新消息时，显示对话框以便用户决定是否接受
            setMsgFromSharing(incomingMsg);
            setOpenDialog(true);
        }, setConnectedUserIds)
            .catch((err) => {
            console.error("Failed to connect:", err);
        });
        return () => {
            // 组件卸载时断开连接，通知其他用户
            realTimeColab.disconnect();
        };
    }, []);
    const handleAcceptMessage = () => {
        try {
            if (msgFromSharing) {
                const parsed = JSON.parse(msgFromSharing);
                if (parsed.message) {
                    replaceMonacoAll(window.monaco, window.editor, parsed.message);
                }
                else {
                    replaceMonacoAll(window.monaco, window.editor, msgFromSharing);
                }
            }
            setOpenDialog(false);
            setMsgFromSharing(null);
        }
        catch (error) {
            console.error("Failed to accept message:", error);
        }
    };
    const handleCloseAll = (e) => {
        props.onClick(e);
        props.closeAll();
    };
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { hideBackdrop: true, fullScreen: false, maxWidth: false, open: props.open, onClose: handleCloseAll, sx: {
                    height: "100svh",
                    width: "100svw",
                }, children: _jsxs(Box, { sx: {
                        height: "67svh",
                        width: "55svw",
                        display: "flex",
                        background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
                        padding: "24px",
                        flexDirection: "column",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "24px",
                    }, children: [_jsxs(Box, { sx: {
                                width: "100%",
                                justifyContent: "flex-start",
                                display: "flex",
                                gap: "12px",
                            }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(FileIcon, {}), sx: buttonStyle, children: "\u6587\u4EF6" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(FolderIcon, {}), sx: buttonStyle, children: "\u6587\u4EF6\u5939" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(TextIcon, {}), sx: buttonStyle, children: "\u6587\u672C" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(ClipboardIcon, {}), sx: buttonStyle, children: "\u526A\u8D34\u677F" })] }), _jsxs(Box, { sx: {
                                width: "100%",
                                height: "100%",
                                justifyContent: "flex-start",
                                flexDirection: "column",
                                display: "flex",
                            }, children: [_jsx(Box, { sx: { mb: "10px" }, children: _jsx(LoadingButton, { sx: buttonStyle, onClick: handleClickSearch, endIcon: _jsx(CachedIcon, {}), loading: loading, loadingPosition: "end", variant: "contained", children: "\u641C\u7D22\u540CWIFI\u4E0B\u7528\u6237" }) }), _jsx(Divider, {}), _jsxs(Box, { sx: {
                                        width: "100%",
                                        height: "100%",
                                        justifyContent: "flex-start",
                                        flexDirection: "column",
                                        display: "flex",
                                    }, children: [_jsx(ScrollableBox, { sx: { userSelect: "none", width: "100%", height: "100%" }, children: connectedUserIds.map((value, index) => (_jsxs(Box, { sx: {
                                                    ...settingsBodyContentBoxStyle,
                                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                }, onClick: (e) => {
                                                    handleClickRippleBox(e);
                                                    handleClickOtherClients(e, value);
                                                }, children: [_jsxs(LR, { ali: "center", jus: "center", space: [5], children: [_jsx(Box, { sx: { height: "100%" }, className: "FLEX ALI-CEN JUS-CEN", children: _jsx(DevicesIcon, {}) }), _jsx("p", { children: value })] }), _jsx("span", { className: "ripple", style: {
                                                            background: "transparent",
                                                            position: "absolute",
                                                            borderRadius: "50%",
                                                            pointerEvents: "none",
                                                            transform: "scale(0)",
                                                        } })] }, index))) }), _jsx(Box, { className: "FLEX ALI-CEN JUS-CEN", children: _jsxs("p", { style: { color: "#8B8A8A" }, children: ["\u4F60\u7684ID: ", realTimeColab.getUniqId()] }) })] })] })] }) }), _jsxs(Dialog, { hideBackdrop: true, open: openDialog, onClose: () => {
                    setOpenDialog(false);
                    setMsgFromSharing(null);
                }, children: [_jsx(DialogTitle, { children: "\u2728\u65B0\u5206\u4EAB" }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: "\u60A8\u6709\u6765\u81EA\u5916\u90E8\u7684\u6D88\u606F\uFF0C\u662F\u5426\u63A5\u53D7\uFF1F" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setOpenDialog(false);
                                    setMsgFromSharing(null);
                                }, color: "secondary", children: "\u62D2\u7EDD" }), _jsx(Button, { onClick: handleAcceptMessage, color: "primary", autoFocus: true, children: "\u63A5\u53D7" })] })] }), _jsx(ScreenShareIcon, {}), _jsx(Typography, { children: t("t-collaborative-office") })] }));
}
