import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Dialog from "@mui/material/Dialog";
import CachedIcon from "@mui/icons-material/Cached";
import DevicesIcon from "@mui/icons-material/Devices";
import gsap from "gsap";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Badge, } from "@mui/material";
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
import { readClipboard } from "@App/text/clipboard";
import alertUseArco from "@App/message/alert";
const url = "wss://md-server-md-server-bndnqhexdf.cn-hangzhou.fcapp.run";
export default function Settings(props) {
    const buttonStyle = {
        borderRadius: "12px",
        borderColor: "#e0e0e0",
    };
    const { t } = useTranslation();
    const theme = getTheme();
    const [msgFromSharing, setMsgFromSharing] = useState(null);
    const [fileFromSharing, setFileFromSharing] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [connectedUserIds, setConnectedUserIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedText, setSelectedText] = useState(null);
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setSelectedFile(file);
            setSelectedButton("file");
        }
    };
    const handleTextSelect = () => {
        setSelectedText(getMdTextFromMonaco());
        setSelectedButton("text");
    };
    const handleSendFile = (targetUserId) => {
        if (selectedFile) {
            realTimeColab.sendFileToUser(targetUserId, selectedFile);
            alert(`文件 ${selectedFile.name} 已发送！`);
            setSelectedFile(null); // 清除选中文件
            setSelectedButton(null); // 清除角标
        }
        else {
            alert("未选择文件！");
        }
    };
    // 搜索同WIFI下用户逻辑
    async function handleClickSearch() {
        setLoading(true);
        try {
            if (!realTimeColab.isConnected()) {
                await realTimeColab.connect(url, setMsgFromSharing, setFileFromSharing, setConnectedUserIds);
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
        const message = getMdTextFromMonaco();
        try {
            await realTimeColab.connectToUser(targetUserId);
            console.log(`Connected to user ${targetUserId}`);
            if (selectedButton === "file" && selectedFile) {
                await realTimeColab.sendFileToUser(targetUserId, selectedFile);
            }
            else if (selectedButton === "text" && selectedText) {
                await realTimeColab.sendMessageToUser(targetUserId, selectedText);
            }
            else if (selectedButton === "clip") {
                let clipText = readClipboard();
                await realTimeColab.sendMessageToUser(targetUserId, await clipText);
            }
            else {
                await realTimeColab.sendMessageToUser(targetUserId, message);
            }
            console.log(`Message sent to user ${targetUserId}`);
        }
        catch (error) {
            console.error(`Failed to send message to user ${targetUserId}:`, error);
        }
    };
    useEffect(() => {
        if (props.open) {
            realTimeColab
                .connect(url, (incomingMsg) => {
                // 当接收到新消息时，显示对话框以便用户决定是否接受
                setMsgFromSharing(incomingMsg);
                setOpenDialog(true);
            }, (incomingFile) => {
                setFileFromSharing(incomingFile);
                setOpenDialog(true);
            }, setConnectedUserIds)
                .catch((err) => {
                console.error("Failed to connect:", err);
            });
        }
        return () => {
            // 组件卸载时断开连接，通知其他用户
            realTimeColab.disconnect(setMsgFromSharing, setFileFromSharing);
        };
    }, [props.open]);
    const handleAcceptMessage = () => {
        try {
            if (msgFromSharing) {
                if (msgFromSharing) {
                    // writeClipboard(msgFromSharing)
                    alertUseArco("成功收到文本", 2000, { kind: "success" });
                    replaceMonacoAll(window.monaco, window.editor, msgFromSharing);
                }
                else {
                    replaceMonacoAll(window.monaco, window.editor, msgFromSharing);
                }
            }
            else if (fileFromSharing) {
                const blob = new Blob([fileFromSharing]);
                // 生成文件名（可根据需求自定义）
                const fileName = realTimeColab.fileMetaInfo.name;
                // 创建下载链接
                const url = URL.createObjectURL(blob);
                // 自动触发下载（或其他处理方式）
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                // 释放 URL 对象
                URL.revokeObjectURL(url);
            }
            setOpenDialog(false);
            kit.sleep(500).then(() => {
                setFileFromSharing(null);
                setMsgFromSharing(null);
            });
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
                            }, children: [_jsx(Badge, { color: "primary", badgeContent: selectedButton === "file" ? 1 : 0, overlap: "circular", sx: {
                                        "& .MuiBadge-badge": {
                                            top: "-2px", // 向上移动
                                            right: "-2px", // 向右移动
                                        },
                                    }, children: _jsx(Button, { variant: "outlined", sx: buttonStyle, startIcon: _jsx(FileIcon, {}), onClick: () => document.getElementById("file-input")?.click(), children: "\u6587\u4EF6" }) }), _jsx("input", { id: "file-input", type: "file", style: { display: "none" }, onChange: handleFileSelect }), _jsx(Button, { disabled: true, variant: "outlined", startIcon: _jsx(FolderIcon, {}), sx: buttonStyle, children: "\u6587\u4EF6\u5939" }), _jsx(Badge, { sx: {
                                        "& .MuiBadge-badge": {
                                            top: "-2px", // 向上移动
                                            right: "-2px", // 向右移动
                                        },
                                    }, color: "primary", badgeContent: selectedButton === "text" ? 1 : 0, overlap: "circular", children: _jsx(Button, { onClick: handleTextSelect, variant: "outlined", startIcon: _jsx(TextIcon, {}), sx: buttonStyle, children: "Markdown\u6587\u672C" }) }), _jsx(Badge, { sx: {
                                        "& .MuiBadge-badge": {
                                            top: "-2px", // 向上移动
                                            right: "-2px", // 向右移动
                                        },
                                    }, color: "primary", badgeContent: selectedButton === "clip" ? 1 : 0, overlap: "circular", children: _jsx(Button, { onClick: () => { setSelectedButton("clip"); }, variant: "outlined", startIcon: _jsx(ClipboardIcon, {}), sx: buttonStyle, children: "\u526A\u8D34\u677F" }) })] }), _jsxs(Box, { sx: {
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
                    kit.sleep(500).then(() => {
                        setFileFromSharing(null);
                        setMsgFromSharing(null);
                    });
                }, children: [_jsx(DialogTitle, { children: "\u2728\u65B0\u5206\u4EAB" }), _jsxs(DialogContent, { children: [_jsx(DialogContentText, { children: "\u60A8\u6709\u6765\u81EA\u5916\u90E8\u7684\u6D88\u606F\uFF0C\u662F\u5426\u63A5\u53D7\uFF1F" }), msgFromSharing ? _jsx(Box, { sx: {
                                    width: "100%", // 设置宽度
                                    height: 300, // 限制高度
                                    overflow: "auto", // 使内容可滚动
                                    padding: 2, // 内边距
                                    border: "1px solid #ccc", // 边框
                                    borderRadius: "4px", // 圆角
                                    backgroundColor: "#f9f9f9", // 背景色
                                    whiteSpace: "pre-wrap", // 保留换行符和空格
                                    fontFamily: "monospace", // 字体
                                    fontSize: 14, // 字体大小
                                }, children: msgFromSharing }) : _jsx(_Fragment, {})] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setOpenDialog(false);
                                    kit.sleep(500).then(() => {
                                        setFileFromSharing(null);
                                        setMsgFromSharing(null);
                                    });
                                }, color: "secondary", children: "\u62D2\u7EDD" }), _jsx(Button, { onClick: handleAcceptMessage, color: "primary", autoFocus: true, children: "\u63A5\u53D7" })] })] }), _jsx(ScreenShareIcon, {}), _jsx(Typography, { children: t("t-collaborative-office") })] }));
}
