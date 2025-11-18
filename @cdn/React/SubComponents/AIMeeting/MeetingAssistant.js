import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { observer } from "mobx-react";
import { useAIMeeting } from "@Mobx/AIMeeting";
import { Box, Typography, Button, TextField, CircularProgress, Paper, Tabs, Tab, Chip, IconButton, List, ListItem, ListItemText, ListItemIcon, } from "@mui/material";
import { useTranslation } from "react-i18next";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SaveIcon from "@mui/icons-material/Save";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import bigModel from "@App/ai/ai";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import alertUseArco from "@App/message/alert";
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx(Box, { role: "tabpanel", hidden: value !== index, id: `meeting-tabpanel-${index}`, "aria-labelledby": `meeting-tab-${index}`, sx: {
            flex: 1,
            display: value === index ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            height: "100%"
        }, ...other, children: value === index && children }));
}
const MeetingAssistant = observer(({ themeStyles }) => {
    const aiMeeting = useAIMeeting();
    const { t } = useTranslation();
    const [tabValue, setTabValue] = React.useState(0);
    // Summary State
    const [summary, setSummary] = React.useState("");
    const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);
    // Suggestions State
    const [suggestions, setSuggestions] = React.useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = React.useState(false);
    const [suggestionContext, setSuggestionContext] = React.useState("会议"); // 会议, 面试, 谈判
    const isDark = themeStyles.background === "#1e1e1e";
    // --- Summary Logic ---
    const handleGenerateSummary = async () => {
        if (aiMeeting.messages.length === 0) {
            alertUseArco(t("t-ai-meeting-no-content-to-summarize"), 2000);
            return;
        }
        setIsGeneratingSummary(true);
        setSummary("");
        try {
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
                setIsGeneratingSummary(false);
                alertUseArco(t("t-ai-meeting-summary-generated"), 2000);
            }, (error) => {
                console.error("生成总结失败:", error);
                alertUseArco(t("t-ai-meeting-summary-failed"), 3000);
                setIsGeneratingSummary(false);
            }, "");
        }
        catch (error) {
            console.error("生成总结失败:", error);
            alertUseArco(t("t-ai-meeting-summary-failed"), 3000);
            setIsGeneratingSummary(false);
        }
    };
    const handleExportToMonaco = () => {
        if (!summary) {
            alertUseArco(t("t-ai-meeting-no-summary-to-export"), 2000);
            return;
        }
        try {
            const timestamp = new Date().toLocaleString("zh-CN");
            const exportContent = `\n\n## ${t("t-ai-meeting-summary-tab")} - ${timestamp}\n\n${summary}\n\n`;
            insertTextMonacoAtCursor(exportContent, true);
            alertUseArco(t("t-ai-meeting-exported-to-editor"), 2000);
        }
        catch (error) {
            console.error("导出失败:", error);
            alertUseArco(t("t-ai-meeting-export-failed"), 3000);
        }
    };
    const handleSaveMeeting = async () => {
        if (!aiMeeting.currentMeeting) {
            alertUseArco(t("t-ai-meeting-no-meeting-to-save"), 2000);
            return;
        }
        try {
            await aiMeeting.autoSaveMeeting();
            alertUseArco(t("t-ai-meeting-saved"), 2000);
        }
        catch (error) {
            console.error("保存失败:", error);
            alertUseArco(t("t-ai-meeting-save-failed"), 3000);
        }
    };
    React.useEffect(() => {
        if (aiMeeting.currentMeeting?.summary) {
            setSummary(aiMeeting.currentMeeting.summary);
        }
        else {
            setSummary("");
        }
    }, [aiMeeting.currentMeeting?.id, aiMeeting.currentMeeting?.summary]);
    // --- Suggestions Logic ---
    const handleGenerateSuggestions = async () => {
        if (aiMeeting.messages.length === 0) {
            alertUseArco(t("t-ai-meeting-no-content-to-analyze"), 2000);
            return;
        }
        setIsGeneratingSuggestions(true);
        setSuggestions([]);
        try {
            // Get last 20 messages or all if less
            const recentMessages = aiMeeting.messages
                .slice(-20)
                .map((msg) => `${msg.speaker}: ${msg.text}`)
                .join("\n");
            const prompt = `作为我的实时${suggestionContext}助手，请根据以下最近的对话内容，提供3-5个简短的建议或发言思路。
建议应包括：
1. 我可以提出的问题
2. 我可以补充的观点
3. 需要注意的潜在问题
请直接列出建议点，不要废话。

最近对话：
${recentMessages}`;
            let fullResponse = "";
            await bigModel.askAI(prompt, "", (chunk) => {
                fullResponse += chunk;
            }, (finalMessage) => {
                // Parse the response into a list (assuming AI returns a list)
                // Simple split by newline and cleanup
                const lines = finalMessage.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0 && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)))
                    .map(line => line.replace(/^[-*\d\.]+\s*/, ''));
                if (lines.length > 0) {
                    setSuggestions(lines);
                }
                else {
                    // Fallback if format is different
                    setSuggestions([finalMessage]);
                }
                setIsGeneratingSuggestions(false);
            }, (error) => {
                console.error("生成建议失败:", error);
                alertUseArco(t("t-ai-meeting-summary-failed"), 3000);
                setIsGeneratingSuggestions(false);
            }, "");
        }
        catch (error) {
            console.error("生成建议失败:", error);
            alertUseArco(t("t-ai-meeting-summary-failed"), 3000);
            setIsGeneratingSuggestions(false);
        }
    };
    const handleCopySuggestion = (text) => {
        navigator.clipboard.writeText(text);
        alertUseArco(t("t-ai-meeting-copied-to-clipboard"), 1000);
    };
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: themeStyles.background,
        }, children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider', bgcolor: themeStyles.headerBg }, children: _jsxs(Tabs, { value: tabValue, onChange: (e, newValue) => setTabValue(newValue), textColor: "primary", indicatorColor: "primary", variant: "fullWidth", children: [_jsx(Tab, { label: t("t-ai-meeting-summary-tab"), icon: _jsx(AutoAwesomeIcon, { fontSize: "small" }), iconPosition: "start" }), _jsx(Tab, { label: t("t-ai-meeting-assistant-tab"), icon: _jsx(LightbulbIcon, { fontSize: "small" }), iconPosition: "start" })] }) }), _jsxs(TabPanel, { value: tabValue, index: 0, children: [_jsxs(Box, { sx: { p: 2, display: "flex", gap: 1, justifyContent: "flex-end", borderBottom: `1px solid ${themeStyles.divider}` }, children: [_jsx(Button, { size: "small", variant: "contained", startIcon: isGeneratingSummary ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : _jsx(AutoAwesomeIcon, {}), onClick: handleGenerateSummary, disabled: isGeneratingSummary || aiMeeting.messages.length === 0, children: t("t-ai-meeting-generate-summary") }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), onClick: handleExportToMonaco, disabled: !summary, children: t("t-ai-meeting-export") }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(SaveIcon, {}), onClick: handleSaveMeeting, disabled: !aiMeeting.currentMeeting, children: t("t-ai-meeting-save") })] }), _jsx(Box, { className: "uniform-scroller", sx: { flex: 1, p: 2, overflowY: "auto" }, children: _jsx(Paper, { elevation: 0, sx: {
                                p: 2,
                                bgcolor: isDark ? "#2d2d30" : "#f9f9f9",
                                border: `1px solid ${themeStyles.divider}`,
                                minHeight: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }, children: isGeneratingSummary ? (_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, justifyContent: "center", height: "100%" }, children: [_jsx(CircularProgress, { size: 24 }), _jsx(Typography, { variant: "body2", sx: { color: themeStyles.color }, children: t("t-ai-meeting-summary-generating") })] })) : summary ? (_jsx(TextField, { multiline: true, fullWidth: true, value: summary, onChange: (e) => setSummary(e.target.value), variant: "standard", InputProps: {
                                    disableUnderline: true,
                                    sx: {
                                        color: themeStyles.color,
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                    },
                                } })) : (_jsxs(Box, { sx: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    color: themeStyles.color,
                                    opacity: 0.7,
                                    flexDirection: "column",
                                    gap: 2
                                }, children: [_jsx(Box, { sx: {
                                            p: 3,
                                            borderRadius: "50%",
                                            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                            display: "flex"
                                        }, children: _jsx(AutoAwesomeIcon, { sx: { fontSize: 48, opacity: 0.8 } }) }), _jsx(Typography, { variant: "body1", align: "center", sx: { fontWeight: 500 }, children: t("t-ai-meeting-summary-placeholder-title") }), _jsx(Typography, { variant: "body2", align: "center", sx: { opacity: 0.7 }, children: t("t-ai-meeting-summary-placeholder-desc") })] })) }) })] }), _jsxs(TabPanel, { value: tabValue, index: 1, children: [_jsxs(Box, { sx: { p: 2, borderBottom: `1px solid ${themeStyles.divider}` }, children: [_jsx(Box, { sx: { display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }, children: [
                                    { key: "会议", label: t("t-ai-meeting-context-meeting") },
                                    { key: "面试", label: t("t-ai-meeting-context-interview") },
                                    { key: "谈判", label: t("t-ai-meeting-context-negotiation") },
                                    { key: "头脑风暴", label: t("t-ai-meeting-context-brainstorming") }
                                ].map((ctx) => (_jsx(Chip, { label: ctx.label, onClick: () => setSuggestionContext(ctx.key), color: suggestionContext === ctx.key ? "primary" : "default", variant: suggestionContext === ctx.key ? "filled" : "outlined", size: "small", clickable: true }, ctx.key))) }), _jsx(Button, { fullWidth: true, variant: "contained", startIcon: isGeneratingSuggestions ? _jsx(CircularProgress, { size: 16, color: "inherit" }) : _jsx(RefreshIcon, {}), onClick: handleGenerateSuggestions, disabled: isGeneratingSuggestions || aiMeeting.messages.length === 0, children: t("t-ai-meeting-get-suggestions") })] }), _jsx(Box, { className: "uniform-scroller", sx: { flex: 1, p: 2, overflowY: "auto" }, children: isGeneratingSuggestions ? (_jsxs(Box, { sx: { display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }, children: [_jsx(CircularProgress, { size: 24 }), _jsx(Typography, { variant: "body2", sx: { ml: 2, color: themeStyles.color }, children: t("t-ai-meeting-suggestions-generating") })] })) : suggestions.length > 0 ? (_jsx(List, { children: suggestions.map((suggestion, index) => (_jsx(Paper, { elevation: 1, sx: {
                                    mb: 2,
                                    bgcolor: isDark ? "#2d2d30" : "#fff",
                                    border: `1px solid ${themeStyles.divider}`,
                                    transition: "transform 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 3
                                    }
                                }, children: _jsxs(ListItem, { alignItems: "flex-start", secondaryAction: _jsx(IconButton, { edge: "end", "aria-label": "copy", onClick: () => handleCopySuggestion(suggestion), children: _jsx(ContentCopyIcon, { fontSize: "small" }) }), children: [_jsx(ListItemIcon, { sx: { minWidth: 36, mt: 0.5 }, children: _jsx(LightbulbIcon, { color: "warning", fontSize: "small" }) }), _jsx(ListItemText, { primary: _jsx(Typography, { variant: "body2", sx: { color: themeStyles.color, lineHeight: 1.6 }, children: suggestion }) })] }) }, index))) })) : (_jsxs(Box, { sx: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                color: themeStyles.color,
                                opacity: 0.7,
                                flexDirection: "column",
                                gap: 2
                            }, children: [_jsx(Box, { sx: {
                                        p: 3,
                                        borderRadius: "50%",
                                        bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                        display: "flex"
                                    }, children: _jsx(LightbulbIcon, { sx: { fontSize: 48, opacity: 0.8 } }) }), _jsx(Typography, { variant: "body1", align: "center", sx: { fontWeight: 500 }, children: t("t-ai-meeting-suggestions-placeholder-title") }), _jsx(Typography, { variant: "body2", align: "center", sx: { opacity: 0.7 }, children: t("t-ai-meeting-suggestions-placeholder-desc") })] })) })] })] }));
});
export default MeetingAssistant;
