import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { observer } from "mobx-react";
import { useAIMeeting } from "@Mobx/AIMeeting";
import { Dialog, Box, Typography, List, ListItem, ListItemButton, ListItemText, IconButton, Button, Divider, TextField, InputAdornment, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getAllMeetingRecords, deleteMeetingRecord, searchMeetingRecords, } from "@App/memory/meetingDB";
import { getTheme } from "@App/config/change";
import alertUseArco from "@App/message/alert";
const MeetingHistory = observer(() => {
    const aiMeeting = useAIMeeting();
    const [meetings, setMeetings] = React.useState([]);
    const [searchKeyword, setSearchKeyword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const isDark = getTheme() === "dark";
    const themeStyles = {
        background: isDark ? "#1e1e1e" : "#ffffff",
        color: isDark ? "#d8d8d8" : "#000000",
        border: isDark ? "1px solid #404040" : "1px solid #e0e0e0",
        headerBg: isDark ? "#2d2d30" : "#f5f5f5",
        divider: isDark ? "#404040" : "#e0e0e0",
        itemHover: isDark ? "#2d2d30" : "#f5f5f5",
    };
    // 加载会议记录
    const loadMeetings = async () => {
        setLoading(true);
        try {
            const records = await getAllMeetingRecords();
            setMeetings(records);
        }
        catch (error) {
            console.error("加载会议记录失败:", error);
            alertUseArco("加载会议记录失败", 3000);
        }
        finally {
            setLoading(false);
        }
    };
    // 搜索会议
    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            loadMeetings();
            return;
        }
        setLoading(true);
        try {
            const results = await searchMeetingRecords(searchKeyword);
            setMeetings(results);
        }
        catch (error) {
            console.error("搜索失败:", error);
            alertUseArco("搜索失败", 3000);
        }
        finally {
            setLoading(false);
        }
    };
    // 打开会议
    const handleOpenMeeting = (meeting) => {
        aiMeeting.loadMeeting(meeting);
        aiMeeting.hiddenHistory();
        alertUseArco("已加载会议记录", 2000);
    };
    // 删除会议
    const handleDeleteMeeting = async (e, meetingId) => {
        e.stopPropagation();
        if (!confirm("确定要删除这条会议记录吗？")) {
            return;
        }
        try {
            await deleteMeetingRecord(meetingId);
            alertUseArco("已删除会议记录", 2000);
            loadMeetings();
        }
        catch (error) {
            console.error("删除失败:", error);
            alertUseArco("删除失败", 3000);
        }
    };
    // 格式化时长
    const formatDuration = (meeting) => {
        if (!meeting.endTime) {
            return "进行中";
        }
        const duration = meeting.endTime - meeting.startTime;
        const minutes = Math.floor(duration / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}小时${minutes % 60}分钟`;
        }
        return `${minutes}分钟`;
    };
    // 初始加载
    React.useEffect(() => {
        if (aiMeeting.historyDisplayState) {
            loadMeetings();
        }
    }, [aiMeeting.historyDisplayState]);
    return (_jsxs(Dialog, { open: aiMeeting.historyDisplayState, onClose: () => aiMeeting.hiddenHistory(), maxWidth: "md", fullWidth: true, PaperProps: {
            sx: {
                background: themeStyles.background,
                color: themeStyles.color,
                minHeight: "70vh",
            },
        }, children: [_jsxs(Box, { sx: {
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: themeStyles.headerBg,
                    borderBottom: `1px solid ${themeStyles.divider}`,
                }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: "bold" }, children: "\uD83D\uDCDA \u4F1A\u8BAE\u5386\u53F2\u8BB0\u5F55" }), _jsx(IconButton, { onClick: () => aiMeeting.hiddenHistory(), size: "small", children: _jsx(CloseIcon, {}) })] }), _jsx(Box, { sx: { p: 2 }, children: _jsx(TextField, { fullWidth: true, size: "small", placeholder: "\u641C\u7D22\u4F1A\u8BAE\u6807\u9898\u3001\u5185\u5BB9\u6216\u603B\u7ED3...", value: searchKeyword, onChange: (e) => setSearchKeyword(e.target.value), onKeyPress: (e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }, InputProps: {
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                        endAdornment: searchKeyword && (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { size: "small", onClick: () => {
                                    setSearchKeyword("");
                                    loadMeetings();
                                }, children: _jsx(CloseIcon, { fontSize: "small" }) }) })),
                    } }) }), _jsx(Divider, { sx: { bgcolor: themeStyles.divider } }), _jsx(Box, { sx: {
                    flex: 1,
                    overflowY: "auto",
                    minHeight: "400px",
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
                }, children: loading ? (_jsx(Box, { sx: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "200px",
                    }, children: _jsx(Typography, { variant: "body2", sx: { color: themeStyles.color }, children: "\u52A0\u8F7D\u4E2D..." }) })) : meetings.length === 0 ? (_jsx(Box, { sx: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "200px",
                        color: themeStyles.color,
                        opacity: 0.5,
                    }, children: _jsx(Typography, { variant: "body1", children: searchKeyword ? "没有找到相关会议" : "还没有会议记录" }) })) : (_jsx(List, { sx: { p: 0 }, children: meetings.map((meeting, index) => (_jsxs(React.Fragment, { children: [_jsx(ListItem, { disablePadding: true, secondaryAction: _jsx(IconButton, { edge: "end", onClick: (e) => handleDeleteMeeting(e, meeting.id), sx: { color: "error.main" }, children: _jsx(DeleteIcon, {}) }), children: _jsx(ListItemButton, { onClick: () => handleOpenMeeting(meeting), sx: {
                                        "&:hover": {
                                            bgcolor: themeStyles.itemHover,
                                        },
                                    }, children: _jsx(ListItemText, { primary: _jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 0.5 }, children: [_jsx(Typography, { variant: "subtitle1", sx: { fontWeight: "bold" }, children: meeting.title }), !meeting.endTime && (_jsx(Typography, { variant: "caption", sx: {
                                                        bgcolor: "success.main",
                                                        color: "white",
                                                        px: 1,
                                                        py: 0.25,
                                                        borderRadius: 1,
                                                    }, children: "\u8FDB\u884C\u4E2D" }))] }), secondary: _jsxs(Box, { sx: { mt: 0.5 }, children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }, children: [_jsx(AccessTimeIcon, { sx: { fontSize: 14, opacity: 0.6 } }), _jsx(Typography, { variant: "caption", sx: { opacity: 0.8 }, children: new Date(meeting.startTime).toLocaleString("zh-CN") }), _jsx(Typography, { variant: "caption", sx: { opacity: 0.6, mx: 0.5 }, children: "\u2022" }), _jsx(Typography, { variant: "caption", sx: { opacity: 0.8 }, children: formatDuration(meeting) }), _jsx(Typography, { variant: "caption", sx: { opacity: 0.6, mx: 0.5 }, children: "\u2022" }), _jsxs(Typography, { variant: "caption", sx: { opacity: 0.8 }, children: [meeting.messages.length, " \u6761\u6D88\u606F"] })] }), meeting.summary && (_jsxs(Typography, { variant: "caption", sx: {
                                                        display: "block",
                                                        opacity: 0.7,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }, children: ["\u603B\u7ED3: ", meeting.summary.substring(0, 100), "..."] }))] }) }) }) }), index < meetings.length - 1 && (_jsx(Divider, { sx: { bgcolor: themeStyles.divider } }))] }, meeting.id))) })) }), _jsx(Box, { sx: {
                    p: 2,
                    borderTop: `1px solid ${themeStyles.divider}`,
                    display: "flex",
                    justifyContent: "flex-end",
                }, children: _jsx(Button, { onClick: () => aiMeeting.hiddenHistory(), variant: "outlined", children: "\u5173\u95ED" }) })] }));
});
export default MeetingHistory;
