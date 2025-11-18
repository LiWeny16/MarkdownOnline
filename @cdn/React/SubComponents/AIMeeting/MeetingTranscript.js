import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { observer } from "mobx-react";
import { useAIMeeting } from "@Mobx/AIMeeting";
import { Box, Typography, Avatar, Paper, } from "@mui/material";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                        }, children: [_jsx(Typography, { variant: "caption", sx: { color: isDark ? "#7FFFD4" : "#2e7d32", fontWeight: "bold", mb: 0.5, display: "block" }, children: t("t-ai-meeting-translation") }), _jsx(Typography, { variant: "body2", sx: { whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: message.translatedText })] }))] })] }));
});
const MeetingTranscript = observer(({ themeStyles }) => {
    const aiMeeting = useAIMeeting();
    const { t } = useTranslation();
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
                }, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: "bold", fontSize: "1rem" }, children: t("t-ai-meeting-transcript-title") }) }), _jsx(Box, { ref: scrollRef, className: "uniform-scroller", sx: {
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                }, children: aiMeeting.messages.length === 0 && !aiMeeting.tempTranscript ? (_jsx(Box, { sx: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: themeStyles.color,
                        opacity: 0.5,
                    }, children: _jsx(Typography, { variant: "body1", children: t("t-ai-meeting-transcript-placeholder") }) })) : (_jsxs(_Fragment, { children: [aiMeeting.messages.map((message, index) => (_jsx(MessageItem, { message: message, themeStyles: themeStyles, tempText: index === aiMeeting.messages.length - 1 ? aiMeeting.tempTranscript : undefined, isLast: index === aiMeeting.messages.length - 1 }, message.id))), aiMeeting.messages.length === 0 && aiMeeting.tempTranscript && (_jsxs(Box, { sx: {
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
