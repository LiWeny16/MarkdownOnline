import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { observer } from "mobx-react";
import { useAIMeeting } from "@Mobx/AIMeeting";
import { Box, Typography, Avatar, Paper, } from "@mui/material";
// 生成头像颜色（根据名称生成一致的颜色）
function getAvatarColor(name) {
    const colors = [
        "#7FFFD4", // 薄荷绿
        "#98D8C8", // 淡薄荷绿
        "#6ECEB2", // 中薄荷绿
        "#5BBEA0", // 深薄荷绿
        "#8FD8D2", // 青薄荷
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
// 获取首字母
function getInitials(name) {
    if (!name)
        return "?";
    // 如果是中文，取第一个字
    if (/[\u4e00-\u9fa5]/.test(name)) {
        return name.charAt(0);
    }
    // 如果是英文，取首字母
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
}
// 单条消息组件
const MessageItem = observer(({ message, themeStyles, tempText, isLast }) => {
    const avatarColor = getAvatarColor(message.speaker);
    const initials = getInitials(message.speaker);
    const isDark = themeStyles.background === "#1e1e1e";
    return (_jsxs(Box, { sx: {
            display: "flex",
            gap: 1.5,
            mb: 2,
            alignItems: "flex-start",
        }, children: [_jsx(Avatar, { sx: {
                    bgcolor: avatarColor,
                    color: "#000",
                    fontWeight: "bold",
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                }, children: initials }), _jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 0.5 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "bold", color: themeStyles.color }, children: message.speaker }), _jsx(Typography, { variant: "caption", sx: { color: isDark ? "#888" : "#666" }, children: new Date(message.timestamp).toLocaleTimeString("zh-CN") })] }), _jsx(Paper, { elevation: 1, sx: {
                            p: 1.5,
                            bgcolor: isDark ? "#2d2d30" : "#f5f5f5",
                            color: themeStyles.color,
                            borderRadius: 2,
                            mb: message.translatedText ? 1 : 0,
                        }, children: _jsxs(Typography, { variant: "body2", sx: { whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: [message.text, isLast && tempText && (_jsxs("span", { style: {
                                        color: isDark ? "#888" : "#999",
                                        fontStyle: "italic"
                                    }, children: [tempText, " ..."] }))] }) }), message.translatedText && (_jsxs(Paper, { elevation: 1, sx: {
                            p: 1.5,
                            bgcolor: isDark ? "#1a3a2e" : "#e8f5e9",
                            color: themeStyles.color,
                            borderRadius: 2,
                            borderLeft: `3px solid ${avatarColor}`,
                        }, children: [_jsx(Typography, { variant: "caption", sx: { color: isDark ? "#7FFFD4" : "#2e7d32", fontWeight: "bold", mb: 0.5, display: "block" }, children: "\u7FFB\u8BD1" }), _jsx(Typography, { variant: "body2", sx: { whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: message.translatedText })] }))] })] }));
});
const MeetingTranscript = observer(({ themeStyles }) => {
    const aiMeeting = useAIMeeting();
    const scrollRef = React.useRef(null);
    // 自动滚动到底部（响应消息和临时文本变化）
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [aiMeeting.messages.length, aiMeeting.tempTranscript]);
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        }, children: [_jsx(Box, { sx: {
                    p: 2,
                    background: themeStyles.headerBg,
                    borderBottom: `1px solid ${themeStyles.divider}`,
                }, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: "bold", fontSize: "1rem" }, children: "\uD83D\uDCDD \u4F1A\u8BAE\u8F6C\u5F55 & \u7FFB\u8BD1" }) }), _jsx(Box, { ref: scrollRef, sx: {
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: themeStyles.background,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: themeStyles.divider,
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: themeStyles.color,
                    },
                }, children: aiMeeting.messages.length === 0 && !aiMeeting.tempTranscript ? (_jsx(Box, { sx: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: themeStyles.color,
                        opacity: 0.5,
                    }, children: _jsx(Typography, { variant: "body1", children: "\u70B9\u51FB\u9EA6\u514B\u98CE\u6309\u94AE\u5F00\u59CB\u5F55\u97F3\uFF0C\u5B9E\u65F6\u8F6C\u5F55\u548C\u7FFB\u8BD1\u4F1A\u663E\u793A\u5728\u8FD9\u91CC" }) })) : (_jsxs(_Fragment, { children: [aiMeeting.messages.map((message, index) => (_jsx(MessageItem, { message: message, themeStyles: themeStyles, tempText: index === aiMeeting.messages.length - 1 ? aiMeeting.tempTranscript : undefined, isLast: index === aiMeeting.messages.length - 1 }, message.id))), aiMeeting.messages.length === 0 && aiMeeting.tempTranscript && (_jsxs(Box, { sx: {
                                display: "flex",
                                gap: 1.5,
                                mb: 2,
                                alignItems: "flex-start",
                            }, children: [_jsx(Avatar, { sx: {
                                        bgcolor: getAvatarColor(aiMeeting.currentSpeaker),
                                        color: "#000",
                                        fontWeight: "bold",
                                        width: 40,
                                        height: 40,
                                        fontSize: "1rem",
                                    }, children: getInitials(aiMeeting.currentSpeaker) }), _jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 0.5 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: "bold", color: themeStyles.color }, children: aiMeeting.currentSpeaker }), _jsx(Typography, { variant: "caption", sx: { color: themeStyles.background === "#1e1e1e" ? "#888" : "#666" }, children: new Date().toLocaleTimeString("zh-CN") })] }), _jsx(Paper, { elevation: 1, sx: {
                                                p: 1.5,
                                                bgcolor: themeStyles.background === "#1e1e1e" ? "#2d2d30" : "#f5f5f5",
                                                color: themeStyles.background === "#1e1e1e" ? "#888" : "#999",
                                                borderRadius: 2,
                                                fontStyle: "italic",
                                            }, children: _jsxs(Typography, { variant: "body2", sx: { whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: [aiMeeting.tempTranscript, " ..."] }) })] })] }))] })) })] }));
});
export default MeetingTranscript;
