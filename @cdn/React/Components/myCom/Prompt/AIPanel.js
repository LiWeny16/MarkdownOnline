import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Backdrop, Box, Button, Divider, InputBase, styled, Typography, } from "@mui/material";
import React, { useState } from "react";
import { observer } from "mobx-react";
import { gsap } from "gsap";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import ChatIcon from "@mui/icons-material/Chat";
import { changeStates, getStates, getTheme } from "@App/config/change";
import WrapTextIcon from "@mui/icons-material/WrapText";
import ScrollableBox from "../Layout/ScrollBox";
import bigModel from "@App/ai/ai";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
const panelClass = ".prompt-panel-content";
const IconButtonSq = React.memo(styled(Button)(({ theme, color, size }) => {
    color = "inherit";
    size = "small";
    return {
        "&:hover": {
            backgroundColor: getTheme() == "light"
                ? "rgba(238, 238, 238, 0.9)"
                : "rgba(66, 165, 245, 0.9)", // 使用透明背景色
            borderColor: "#0062cc",
            boxShadow: "none",
            transition: "background-color 0.4s ease-in-out, opacity 0.4s ease-in-out", // 添加透明度的过渡
        },
        "&": {
            transition: "background-color 0.4s ease-in-out, opacity 0.4s ease-in-out", // 正常状态过渡
        },
        color: getTheme() == "light" ? "black" : "white",
        height: "6svh",
        fontSize: "0.83rem",
    };
}));
export default observer(function AIPromptPanel(props) {
    const pickerHeight = 64;
    const _position = handleOverflowPosition();
    const panelRef = React.useRef(null);
    const [showState, setShowState] = React.useState(false);
    const [delayShowState, setDelayShowState] = React.useState(false);
    const inputQsRef = React.useRef(null);
    const aiResponseRef = React.useRef(null);
    const [answerBoxState, setAnswerBoxState] = React.useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [isEnd, setIsEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    function handleOverflowPosition() {
        let _position = getStates().unmemorable.selectEndPos;
        if (_position.posy + pickerHeight > window.document.body.clientHeight) {
            _position.posy = window.document.body.clientHeight - pickerHeight;
        }
        return _position;
    }
    React.useEffect(() => {
        if (inputQsRef.current) {
            setTimeout(() => {
                inputQsRef.current.focus();
                // 不懂为什么立即focus没用，tmd延时大法好！
            }, 100); // 延迟100毫秒
        }
        setShowState(props.open);
        if (!props.open) {
            gsap.to(panelClass, {
                opacity: 0,
                duration: 0.4,
                onComplete: function () {
                    setDelayShowState(false);
                },
            });
        }
        else {
            setDelayShowState(true);
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
        // 检查是否按下了 Ctrl 键和 Enter 键
        if (event.ctrlKey && event.key === "Enter") {
            // 执行你需要的操作，例如提交表单或发送请求
            handleSend();
            inputQsRef.current.value = "";
        }
    };
    const handleSend = () => {
        const inputValue = inputQsRef.current.value;
        if (!inputValue)
            return;
        setAnswerBoxState(true);
        setAiResponse(""); // 重置 AI 回复
        setIsLoading(true);
        setIsEnd(false);
        bigModel.askAI(inputValue, (messageChunk) => {
            if (aiResponseRef.current) {
                aiResponseRef.current.scrollTo(0, 10000);
            }
            setAiResponse((prev) => prev + messageChunk);
            setIsLoading(false);
        }, (finalMessage) => {
            setAiResponse(finalMessage);
            setIsEnd(true);
        }, (error) => {
            console.error("AI 请求错误:", error);
            setAiResponse("抱歉，发生了错误。");
            setIsLoading(false);
        });
        // setInputValue("")
    };
    const handleInsertAIResponse = () => {
        // insertTextAtCursor(aiResponse)
        insertTextMonacoAtCursor(aiResponse, false);
    };
    return (_jsx(Backdrop, { invisible: true, transitionDuration: { appear: 500, enter: 500, exit: 1000 }, sx: {
            zIndex: (theme) => theme.zIndex.drawer + 1,
            pointerEvents: showState ? "auto" : "none",
        }, open: showState, onContextMenu: handleBackdropContextMenu, onMouseUp: handleBackdropMouseUp, children: _jsxs(Box, { ref: panelRef, className: "prompt-panel-content", onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, sx: {
                width: "50svw",
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                top: _position.posy - window.document.body.clientHeight * 0.1,
                left: _position.posx - window.document.body.clientWidth * 0.02,
                borderRadius: "25px",
                boxShadow: "7px 6px 12px 7px rgb(0 0 0 / 21%)",
                backgroundColor: getTheme() == "light" ? "white" : "#333",
                // 其他样式...
            }, children: [answerBoxState ? (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { padding: "21px 2vw 4px 16px" }, children: _jsx(ScrollableBox, { ref: aiResponseRef, sx: { height: "20svh", width: "48svw" }, children: _jsx(Typography, { variant: "body1", gutterBottom: true, sx: { whiteSpace: "pre-wrap" }, children: isLoading ? "AI 正在思考中..." : aiResponse }) }) }), _jsx(Divider, {})] })) : (_jsx(_Fragment, {})), _jsxs(Box, { className: "FLEX COW", sx: { alignItems: "flex-end" }, children: [_jsx(InputBase, { autoFocus: true, multiline: true, className: "transparent-scrollbar", onKeyDown: handleInputKeyDown, fullWidth: true, inputRef: inputQsRef, sx: {
                                padding: "21px 6px 4px 16px",
                                ml: 1,
                                flex: 1,
                            }, maxRows: 5, placeholder: "Search in GLM-4 AI Model", inputProps: { "aria-label": "search google maps" } }), _jsx(IconButtonSq, { type: "button", sx: { p: "10px", borderRadius: "55px " }, "aria-label": "search", onClick: handleSend, children: _jsx(SearchIcon, {}) })] }), _jsxs(Box, { className: "FLEX COW", children: [_jsx(Tooltip, { title: "Ctrl+J", children: _jsxs(IconButtonSq, { disableRipple: true, sx: {
                                    padding: "0px 20px",
                                    fontWeight: "700",
                                    borderRadius: "25px ",
                                }, children: [_jsx(ChatIcon, {}), "Ask AI"] }) }), _jsx(InputBase, { multiline: true, disabled: true, fullWidth: true, sx: { ml: 1, flex: 1 }, maxRows: 5, autoFocus: true, placeholder: "Press Ctrl + Enter To Send", inputProps: { "aria-label": "search google maps" } }), _jsx(Tooltip, { title: "\u63A5\u53D7AI\u5E76\u63D2\u5165\u7F16\u8F91\u5668", children: _jsx(IconButtonSq, { disabled: isEnd ? false : true, color: "primary", onClick: handleInsertAIResponse, sx: {
                                    padding: "0px 20px",
                                    fontWeight: "700",
                                    borderRadius: "25px",
                                }, "aria-label": "directions", children: _jsx(WrapTextIcon, {}) }) })] })] }) }));
});
