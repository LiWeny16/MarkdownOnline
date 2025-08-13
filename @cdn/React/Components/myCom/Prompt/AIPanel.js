import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Backdrop, Box, Divider, InputBase, styled, Typography, Tooltip } from "@mui/material";
import React, { useState, useRef } from "react";
import { observer } from "mobx-react";
import { gsap } from "gsap";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import WrapTextIcon from "@mui/icons-material/WrapText";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import StopIcon from "@mui/icons-material/Stop";
import ScrollableBox from "../Layout/ScrollBox";
import bigModel from "@App/ai/ai";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import getSelectionText from "@App/text/getSelection";
import { changeStates, getTheme } from "@App/config/change";
const panelClass = ".prompt-panel-content";
const IconButtonSq = React.memo(styled("button")(({ theme }) => ({
    // 使用 button 标签来确保点击时不会出现默认提交行为
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    "&:hover": {
        backgroundColor: getTheme() === "light"
            ? "rgba(238, 238, 238, 0.9)"
            : "rgba(66, 165, 245, 0.9)",
        borderColor: "#0062cc",
        transition: "background-color 0.4s ease-in-out, opacity 0.4s ease-in-out",
    },
    "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
    },
    transition: "background-color 0.4s ease-in-out, opacity 0.4s ease-in-out",
    color: getTheme() === "light" ? "black" : "white",
    height: "6svh",
    minWidth: "60px", // 添加最小宽度以防止布局跳动
    fontSize: "0.83rem",
    borderRadius: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // 内部的图标与文字会继承样式
})));
export default observer(function AIPromptPanel(props) {
    const pickerHeight = 64;
    const _position = {
        posx: window.document.body.clientWidth / 4,
        posy: window.document.body.clientHeight / 2.5
    };
    const panelRef = useRef(null);
    const inputQsRef = useRef(null);
    const aiResponseRef = useRef(null);
    const [showState, setShowState] = useState(false);
    const [answerBoxState, setAnswerBoxState] = useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [isEnd, setIsEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false); // 新增：跟踪是否正在流式回答
    // 存储上传或粘贴的图片 Base64 数据
    const [imageBase64, setImageBase64] = useState("");
    // 隐藏的文件上传控件引用（现将其渲染在 Backdrop 外部）
    const fileInputRef = useRef(null);
    React.useEffect(() => {
        if (inputQsRef.current) {
            setTimeout(() => {
                inputQsRef.current.focus();
            }, 100);
        }
        setShowState(props.open);
        if (!props.open) {
            gsap.to(panelClass, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    /* 可在此处执行其它操作 */
                },
            });
        }
        else {
            gsap.fromTo(panelClass, { x: 0 }, {
                x: 20,
                opacity: 1,
                duration: 0.6,
            });
        }
    }, [props.open]);
    const handleClose = () => {
        changeStates({
            unmemorable: {
                aiPanelState: false,
            },
        });
    };
    const handleBackdropMouseUp = (e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) {
            handleClose();
        }
    };
    const handleBackdropContextMenu = (e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) {
            handleClose();
            e.preventDefault();
        }
    };
    const handleInputKeyDown = (event) => {
        // 如果正在流式回答，禁用发送
        if (isStreaming)
            return;
        if (event.ctrlKey && event.key === "Enter") {
            handleSend();
            inputQsRef.current.value = "";
        }
    };
    // 处理 Ctrl+V 粘贴事件，若粘贴内容中包含图片则转换为 Base64 保存
    const handlePaste = (event) => {
        if (event.clipboardData && event.clipboardData.items) {
            for (let i = 0; i < event.clipboardData.items.length; i++) {
                const item = event.clipboardData.items[i];
                if (item.type.indexOf("image") !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64 = e.target?.result;
                            setImageBase64(base64);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        }
    };
    // 点击图片选择按钮时触发，打开文件选择对话框
    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };
    // 处理文件选择，将图片转为 Base64 格式
    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result;
                setImageBase64(base64);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSend = () => {
        const inputValue = inputQsRef.current.value;
        if (!inputValue || isStreaming)
            return; // 如果正在流式回答，禁用发送
        setAnswerBoxState(true);
        setAiResponse("");
        setIsLoading(true);
        setIsEnd(false);
        setIsStreaming(true); // 开始流式回答
        bigModel.askAI(inputValue, getSelectionText(), (messageChunk) => {
            if (aiResponseRef.current) {
                aiResponseRef.current.scrollTo(0, 10000);
            }
            setAiResponse((prev) => prev + messageChunk);
            setIsLoading(false);
        }, (finalMessage) => {
            setAiResponse(finalMessage);
            setIsEnd(true);
            setIsStreaming(false); // 结束流式回答
        }, (error) => {
            console.error("AI 请求错误:", error);
            setAiResponse("抱歉，发生了错误，可能是宿主没充钱，请联系他olderonion@gmail.com :(");
            setIsLoading(false);
            setIsStreaming(false); // 结束流式回答
        }, imageBase64 // 传递图片 Base64 数据
        );
        inputQsRef.current.value = "";
        handleClearImgRestore();
    };
    const handleAbort = () => {
        bigModel.abortCurrentRequest();
        setIsStreaming(false);
        setIsLoading(false);
        setIsEnd(true);
    };
    const handleClearImgRestore = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 清空文件选择
        }
        setImageBase64("");
    };
    const handleInsertAIResponse = () => {
        insertTextMonacoAtCursor(aiResponse, false);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Backdrop, { invisible: true, transitionDuration: { appear: 500, enter: 500, exit: 1000 }, sx: {
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    pointerEvents: showState ? "auto" : "none",
                }, open: showState, onContextMenu: handleBackdropContextMenu, onMouseUp: handleBackdropMouseUp, children: _jsxs(Box, { ref: panelRef, className: "prompt-panel-content", onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }, sx: {
                        width: "50svw",
                        // height:answerBoxState?"40vh":"15vh",
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        top: _position.posy - window.document.body.clientHeight * 0.1,
                        left: _position.posx - window.document.body.clientWidth * 0.02,
                        borderRadius: "25px",
                        boxShadow: "7px 6px 12px 7px rgb(0 0 0 / 21%)",
                        backgroundColor: getTheme() === "light" ? "white" : "#333",
                    }, children: [answerBoxState ? (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { padding: "21px 2vw 4px 16px" }, children: _jsx(ScrollableBox, { ref: aiResponseRef, sx: { height: "20svh", width: "48svw" }, children: _jsx(Typography, { variant: "body1", gutterBottom: true, sx: { whiteSpace: "pre-wrap" }, children: isLoading ? "AI 正在思考中..." : aiResponse }) }) }), _jsx(Divider, {})] })) : null, _jsxs(Box, { className: "FLEX COW", sx: { alignItems: "flex-end" }, children: [_jsx(Box, { sx: {
                                        padding: "21px 6px 4px 16px",
                                        ml: 1,
                                        flex: "0 0 89%",
                                    }, children: _jsx(InputBase, { autoFocus: true, multiline: true, disabled: isStreaming, className: "transparent-scrollbar", onKeyDown: handleInputKeyDown, onPaste: handlePaste, fullWidth: true, inputRef: inputQsRef, maxRows: 5, placeholder: isStreaming ? "AI正在回答中，请稍候..." : "Search in GLM-4 AI Model", inputProps: { "aria-label": "search google maps" } }) }), _jsx(Box, { sx: { position: "relative", display: "inline-block" }, children: isStreaming ? (_jsx(Tooltip, { title: "\u4E2D\u65AD\u56DE\u7B54", children: _jsx(IconButtonSq, { style: {
                                                padding: "0px 20px",
                                                fontWeight: "700",
                                                backgroundColor: "#f44336",
                                                color: "white",
                                                minWidth: "60px", // 固定最小宽度
                                                height: "6svh", // 确保高度一致
                                                transform: "scale(1)", // 确保没有缩放差异
                                            }, onClick: handleAbort, "aria-label": "\u4E2D\u65AD", children: _jsx(StopIcon, { style: { fontSize: "1.2rem" } }) }) })) : (_jsx(IconButtonSq, { style: {
                                            padding: "0px 20px",
                                            fontWeight: "700",
                                            minWidth: "60px", // 固定最小宽度，与中断按钮保持一致
                                            height: "6svh", // 确保高度一致
                                            transform: "scale(1)", // 确保没有缩放差异
                                        }, onClick: handleSend, "aria-label": "\u53D1\u9001", disabled: isStreaming, children: _jsx(SearchIcon, { style: { fontSize: "1.2rem" } }) })) })] }), _jsxs(Box, { className: "FLEX COW", children: [_jsx(Tooltip, { title: "Ctrl+J", children: _jsxs(IconButtonSq, { style: { padding: "0px 20px", fontWeight: "700" }, children: [_jsx(ChatIcon, { style: { fontSize: "1.2rem", marginRight: "4px" } }), " Ask AI"] }) }), _jsx(Tooltip, { title: "\u9009\u62E9\u56FE\u7247", children: _jsx(IconButtonSq, { onClick: handleImageUploadClick, "aria-label": "\u9009\u62E9\u56FE\u7247", style: { padding: "0px 20px", fontWeight: "700" }, children: _jsx(PhotoCameraIcon, { style: { fontSize: "1.2rem" } }) }) }), _jsx(InputBase, { multiline: true, disabled: true, fullWidth: true, sx: { ml: 1, flex: 1 }, maxRows: 5, placeholder: "Press Ctrl + Enter To Send", inputProps: { "aria-label": "search google maps" } }), imageBase64 && (_jsxs(Box, { sx: { ml: 1, position: "relative", display: "inline-block" }, children: [_jsx("img", { src: imageBase64, alt: "\u56FE\u7247\u9884\u89C8", style: {
                                                width: 35,
                                                height: 35,
                                                borderRadius: "1px",
                                                objectFit: "cover",
                                            } }), _jsx(IconButtonSq, { onClick: () => handleClearImgRestore(), "aria-label": "\u5220\u9664\u56FE\u7247", style: {
                                                position: "absolute",
                                                top: -8,
                                                right: -8,
                                                backgroundColor: "rgba(255,255,255,0.8)",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                padding: 0,
                                                zIndex: 1,
                                            }, children: _jsx(CloseIcon, { style: { fontSize: 16 } }) })] })), _jsx(Tooltip, { title: "\u63A5\u53D7AI\u5E76\u63D2\u5165\u7F16\u8F91\u5668", children: _jsx(IconButtonSq, { onClick: handleInsertAIResponse, "aria-label": "\u63D2\u5165", disabled: !isEnd, style: { padding: "0px 20px", fontWeight: "700" }, children: _jsx(WrapTextIcon, { style: { fontSize: "1.2rem" } }) }) })] })] }) }), _jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, style: { display: "none" }, onChange: handleFileUpload })] }));
});
