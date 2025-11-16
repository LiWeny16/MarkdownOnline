import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { observer } from "mobx-react";
import { useAIMeeting } from "@Mobx/AIMeeting";
import { Box, Typography, Button, TextField, CircularProgress, Paper, Divider, } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SaveIcon from "@mui/icons-material/Save";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import bigModel from "@App/ai/ai";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import alertUseArco from "@App/message/alert";
import { saveMeetingRecord } from "@App/memory/meetingDB";
const MeetingSummary = observer(({ themeStyles }) => {
    const aiMeeting = useAIMeeting();
    const [summary, setSummary] = React.useState("");
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [aiSuggestion, setAiSuggestion] = React.useState("");
    const isDark = themeStyles.background === "#1e1e1e";
    // 生成会议总结
    const handleGenerateSummary = async () => {
        if (aiMeeting.messages.length === 0) {
            alertUseArco("没有会议内容可以总结", 2000);
            return;
        }
        setIsGenerating(true);
        setSummary("");
        try {
            // 构建会议内容
            const meetingContent = aiMeeting.messages
                .filter((msg) => msg.isFinal)
                .map((msg) => `${msg.speaker}: ${msg.text}`)
                .join("\n");
            const prompt = `请总结以下会议内容，提炼出关键要点、决策和行动项。用清晰的Markdown格式输出，包括：
1. 会议概述
2. 关键讨论点
3. 重要决策
4. 待办事项/行动项

会议内容：
${meetingContent}`;
            let fullSummary = "";
            await bigModel.askAI(prompt, "", (chunk) => {
                fullSummary += chunk;
                setSummary(fullSummary);
            }, (finalMessage) => {
                setSummary(finalMessage);
                aiMeeting.setMeetingSummary(finalMessage);
                setIsGenerating(false);
                alertUseArco("会议总结生成完成", 2000);
            }, (error) => {
                console.error("生成总结失败:", error);
                alertUseArco("生成总结失败", 3000);
                setIsGenerating(false);
            }, "");
        }
        catch (error) {
            console.error("生成总结失败:", error);
            alertUseArco("生成总结失败", 3000);
            setIsGenerating(false);
        }
    };
    // 导出总结到 Monaco 编辑器
    const handleExportToMonaco = () => {
        if (!summary) {
            alertUseArco("没有总结内容可以导出", 2000);
            return;
        }
        try {
            // 添加标题和时间戳
            const timestamp = new Date().toLocaleString("zh-CN");
            const exportContent = `\n\n## 会议总结 - ${timestamp}\n\n${summary}\n\n`;
            // 插入到 Monaco 编辑器（可撤回）
            insertTextMonacoAtCursor(exportContent, true);
            alertUseArco("已导出到编辑器", 2000);
        }
        catch (error) {
            console.error("导出失败:", error);
            alertUseArco("导出失败", 3000);
        }
    };
    // 保存会议记录
    const handleSaveMeeting = async () => {
        if (!aiMeeting.currentMeeting) {
            alertUseArco("没有会议记录可以保存", 2000);
            return;
        }
        try {
            // 将 MobX observable 对象转换为纯 JavaScript 对象
            const meetingToSave = {
                id: aiMeeting.currentMeeting.id,
                title: aiMeeting.currentMeeting.title,
                startTime: aiMeeting.currentMeeting.startTime,
                endTime: aiMeeting.currentMeeting.endTime || Date.now(),
                language: aiMeeting.currentMeeting.language,
                translateLanguage: aiMeeting.currentMeeting.translateLanguage,
                summary: summary || aiMeeting.currentMeeting.summary,
                messages: aiMeeting.messages
                    .filter((m) => m.isFinal) // 只保存最终确认的消息
                    .map((m) => ({
                    id: m.id,
                    speaker: m.speaker,
                    text: m.text,
                    translatedText: m.translatedText,
                    timestamp: m.timestamp,
                    isFinal: m.isFinal,
                    language: m.language,
                })),
            };
            await saveMeetingRecord(meetingToSave);
            alertUseArco("会议记录已保存", 2000);
        }
        catch (error) {
            console.error("保存失败:", error);
            alertUseArco("保存失败", 3000);
        }
    };
    // 当会议变化时处理总结
    React.useEffect(() => {
        if (aiMeeting.currentMeeting?.summary) {
            // 如果会议有总结，加载它
            setSummary(aiMeeting.currentMeeting.summary);
        }
        else {
            // 如果是新会议或没有总结，清空
            setSummary("");
        }
    }, [aiMeeting.currentMeeting?.id, aiMeeting.currentMeeting?.summary]);
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        }, children: [_jsx(Box, { sx: {
                    p: 2,
                    background: themeStyles.headerBg,
                    borderBottom: `1px solid ${themeStyles.divider}`,
                }, children: _jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: "bold", fontSize: "1rem" }, children: "\u2728 AI \u4F1A\u8BAE\u603B\u7ED3" }), _jsxs(Box, { sx: { display: "flex", gap: 1 }, children: [_jsx(Button, { size: "small", variant: "contained", startIcon: isGenerating ? _jsx(CircularProgress, { size: 16 }) : _jsx(AutoAwesomeIcon, {}), onClick: handleGenerateSummary, disabled: isGenerating || aiMeeting.messages.length === 0, children: "\u751F\u6210\u603B\u7ED3" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), onClick: handleExportToMonaco, disabled: !summary, children: "\u5BFC\u51FA" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(SaveIcon, {}), onClick: handleSaveMeeting, disabled: !aiMeeting.currentMeeting, children: "\u4FDD\u5B58" })] })] }) }), _jsxs(Box, { sx: {
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
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
                }, children: [_jsx(Paper, { elevation: 1, sx: {
                            p: 2,
                            bgcolor: isDark ? "#2d2d30" : "#f9f9f9",
                            border: `1px solid ${themeStyles.divider}`,
                            minHeight: "200px",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }, children: isGenerating ? (_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx(CircularProgress, { size: 20 }), _jsx(Typography, { variant: "body2", sx: { color: themeStyles.color }, children: "\u6B63\u5728\u751F\u6210\u603B\u7ED3..." })] })) : summary ? (_jsx(Box, { className: "uniform-scroller", sx: { flex: 1, overflow: "auto" }, children: _jsx(TextField, { multiline: true, fullWidth: true, value: summary, onChange: (e) => setSummary(e.target.value), variant: "standard", InputProps: {
                                    disableUnderline: true,
                                    sx: {
                                        color: themeStyles.color,
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                    },
                                }, sx: {
                                    "& .MuiInputBase-root": {
                                        p: 0,
                                    },
                                } }) })) : (_jsx(Box, { sx: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                color: themeStyles.color,
                                opacity: 0.5,
                            }, children: _jsxs(Typography, { variant: "body2", align: "center", children: ["\u70B9\u51FB\"\u751F\u6210\u603B\u7ED3\"\u6309\u94AE\uFF0CAI\u5C06\u4E3A\u60A8\u603B\u7ED3\u4F1A\u8BAE\u5185\u5BB9", _jsx("br", {}), "\u5305\u62EC\u5173\u952E\u8BA8\u8BBA\u70B9\u3001\u51B3\u7B56\u548C\u884C\u52A8\u9879"] }) })) }), _jsx(Divider, { sx: { bgcolor: themeStyles.divider } }), _jsxs(Paper, { elevation: 1, sx: {
                            p: 2,
                            bgcolor: isDark ? "#2d2d30" : "#f9f9f9",
                            border: `1px solid ${themeStyles.divider}`,
                            minHeight: "120px",
                        }, children: [_jsx(Typography, { variant: "subtitle2", sx: { mb: 1, fontWeight: "bold", color: themeStyles.color }, children: "\uD83D\uDCA1 AI \u5B9E\u65F6\u63D0\u793A\uFF08\u529F\u80FD\u5F00\u53D1\u4E2D\uFF09" }), _jsx(Typography, { variant: "body2", sx: { color: themeStyles.color, opacity: 0.6 }, children: "\u6B64\u529F\u80FD\u5C06\u5728\u672A\u6765\u7248\u672C\u4E2D\u63D0\u4F9B\u5B9E\u65F6\u4F1A\u8BAE\u5EFA\u8BAE\uFF0C\u5E2E\u52A9\u60A8\u66F4\u597D\u5730\u53C2\u4E0E\u8BA8\u8BBA" })] })] })] }));
});
export default MeetingSummary;
