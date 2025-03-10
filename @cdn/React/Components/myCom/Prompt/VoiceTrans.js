import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Backdrop, Box, Typography, Select, MenuItem, FormControl, styled } from "@mui/material";
import { observer } from "mobx-react";
import { changeStates, getStates, getTheme } from "@App/config/change";
// ======= 占位翻译函数：实际翻译时，可换为浏览器翻译/其他翻译 API =======
function translate(text, fromLang, toLang) {
    // 这里可以接入真正的翻译API
    // 暂时只做占位，返回原文
    return text;
}
// ======= 示例组件 =======
export default observer(function VoiceTransModal(props) {
    // 上半部分：语音识别的文字
    const [speechResult, setSpeechResult] = useState("这是语音识别的结果");
    // 翻译结果
    const [translationResult, setTranslationResult] = useState("");
    // 语言选择
    const [fromLang, setFromLang] = useState("auto"); // 检测语言
    const [toLang, setToLang] = useState("zh-CN"); // 简体中文
    const _position = {
        posx: window.document.body.clientWidth / 4,
        posy: window.document.body.clientHeight / 2.5
    };
    // 关闭弹窗
    const handleClose = () => {
        changeStates({
            unmemorable: {
                voicePanelState: false
            },
        });
    };
    // 点击 backdrop 关闭（如不需要点空白处关闭，可去掉 onClick）
    const handleBackdropClick = () => {
        handleClose();
    };
    // 阻止冒泡，防止点击内部内容也触发关闭
    const stopPropagation = (e) => {
        e.stopPropagation();
    };
    // 进行翻译
    const handleTranslate = () => {
        const result = translate(speechResult, fromLang, toLang);
        setTranslationResult(result);
    };
    // 可以使用 styled 或 sx 自定义样式。此处简单演示。
    const PanelBox = styled(Box)(({ theme }) => ({
        padding: "10px",
        width: "50svw",
        height: "50svh",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: _position.posy - window.document.body.clientHeight * 0.1,
        left: _position.posx - window.document.body.clientWidth * 0.02,
        borderRadius: "25px",
        boxShadow: "7px 6px 12px 7px rgb(0 0 0 / 21%)",
        backgroundColor: getTheme() === "light" ? "white" : "#333",
    }));
    const AreaBox = styled(Box)(({ theme }) => ({
        width: "100%",
        flex: 1,
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        boxSizing: "border-box",
    }));
    React.useEffect(() => {
        setSpeechResult(getStates().unmemorable.voiceData);
    }, [getStates().unmemorable.voiceData]);
    return (_jsx(Backdrop, { invisible: true, open: props.open, onClick: handleBackdropClick, sx: { zIndex: (theme) => theme.zIndex.drawer }, children: _jsxs(PanelBox, { onClick: stopPropagation, children: [_jsx(AreaBox, { children: _jsx(Typography, { variant: "body1", sx: { whiteSpace: "pre-wrap" }, children: window?._speechData?.speechResult ?? "" }) }), _jsxs(Box, { sx: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "8px 0",
                        gap: "16px"
                    }, children: [_jsx(FormControl, { size: "small", children: _jsxs(Select, { value: fromLang, onChange: (e) => setFromLang(e.target.value), children: [_jsx(MenuItem, { value: "auto", children: "\u68C0\u6D4B\u8BED\u8A00" }), _jsx(MenuItem, { value: "en", children: "English" }), _jsx(MenuItem, { value: "ja", children: "\u65E5\u672C\u8A9E" })] }) }), _jsx(Typography, { variant: "body2", children: "->" }), _jsx(FormControl, { size: "small", children: _jsxs(Select, { value: toLang, onChange: (e) => setToLang(e.target.value), children: [_jsx(MenuItem, { value: "zh-CN", children: "\u7B80\u4F53\u4E2D\u6587" }), _jsx(MenuItem, { value: "en", children: "English" })] }) })] }), _jsx(AreaBox, { children: _jsx(Typography, { variant: "body1", sx: { whiteSpace: "pre-wrap" }, children: translationResult }) }), _jsx(Box, { sx: {
                        marginTop: "8px",
                        cursor: "pointer",
                        color: "blue",
                        userSelect: "none"
                    }, onClick: handleTranslate, children: "\u7ACB\u5373\u7FFB\u8BD1" })] }) }));
});
