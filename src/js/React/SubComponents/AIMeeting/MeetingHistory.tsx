import * as React from "react"
import { observer } from "mobx-react"
import { useAIMeeting, MeetingRecord } from "@Mobx/AIMeeting"
import {
  Dialog,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import {
  getAllMeetingRecords,
  deleteMeetingRecord,
  searchMeetingRecords,
} from "@App/memory/meetingDB"
import { getTheme } from "@App/config/change"
import alertUseArco from "@App/message/alert"

const MeetingHistory = observer(() => {
  const aiMeeting = useAIMeeting()
  const [meetings, setMeetings] = React.useState<MeetingRecord[]>([])
  const [searchKeyword, setSearchKeyword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const isDark = getTheme() === "dark"

  const themeStyles = {
    background: isDark ? "#1e1e1e" : "#ffffff",
    color: isDark ? "#d8d8d8" : "#000000",
    border: isDark ? "1px solid #404040" : "1px solid #e0e0e0",
    headerBg: isDark ? "#2d2d30" : "#f5f5f5",
    divider: isDark ? "#404040" : "#e0e0e0",
    itemHover: isDark ? "#2d2d30" : "#f5f5f5",
  }

  // 加载会议记录
  const loadMeetings = async () => {
    setLoading(true)
    try {
      const records = await getAllMeetingRecords()
      setMeetings(records)
    } catch (error) {
      console.error("加载会议记录失败:", error)
      alertUseArco("加载会议记录失败", 3000)
    } finally {
      setLoading(false)
    }
  }

  // 搜索会议
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadMeetings()
      return
    }

    setLoading(true)
    try {
      const results = await searchMeetingRecords(searchKeyword)
      setMeetings(results)
    } catch (error) {
      console.error("搜索失败:", error)
      alertUseArco("搜索失败", 3000)
    } finally {
      setLoading(false)
    }
  }

  // 打开会议
  const handleOpenMeeting = (meeting: MeetingRecord) => {
    aiMeeting.loadMeeting(meeting)
    aiMeeting.hiddenHistory()
    alertUseArco("已加载会议记录", 2000)
  }

  // 删除会议
  const handleDeleteMeeting = async (
    e: React.MouseEvent,
    meetingId: string
  ) => {
    e.stopPropagation()

    if (!confirm("确定要删除这条会议记录吗？")) {
      return
    }

    try {
      await deleteMeetingRecord(meetingId)
      alertUseArco("已删除会议记录", 2000)
      loadMeetings()
    } catch (error) {
      console.error("删除失败:", error)
      alertUseArco("删除失败", 3000)
    }
  }

  // 格式化时长
  const formatDuration = (meeting: MeetingRecord): string => {
    if (!meeting.endTime) {
      return "进行中"
    }

    const duration = meeting.endTime - meeting.startTime
    const minutes = Math.floor(duration / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`
    }
    return `${minutes}分钟`
  }

  // 初始加载
  React.useEffect(() => {
    if (aiMeeting.historyDisplayState) {
      loadMeetings()
    }
  }, [aiMeeting.historyDisplayState])

  return (
    <Dialog
      open={aiMeeting.historyDisplayState}
      onClose={() => aiMeeting.hiddenHistory()}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: themeStyles.background,
          color: themeStyles.color,
          minHeight: "70vh",
        },
      }}
    >
      {/* 标题栏 */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: themeStyles.headerBg,
          borderBottom: `1px solid ${themeStyles.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          📚 会议历史记录
        </Typography>
        <IconButton onClick={() => aiMeeting.hiddenHistory()} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 搜索栏 */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="搜索会议标题、内容或总结..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchKeyword && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchKeyword("")
                    loadMeetings()
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ bgcolor: themeStyles.divider }} />

      {/* 会议列表 */}
      <Box
        sx={{
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
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
            }}
          >
            <Typography variant="body2" sx={{ color: themeStyles.color }}>
              加载中...
            </Typography>
          </Box>
        ) : meetings.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: themeStyles.color,
              opacity: 0.5,
            }}
          >
            <Typography variant="body1">
              {searchKeyword ? "没有找到相关会议" : "还没有会议记录"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {meetings.map((meeting, index) => (
              <React.Fragment key={meeting.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDeleteMeeting(e, meeting.id)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => handleOpenMeeting(meeting)}
                    sx={{
                      "&:hover": {
                        bgcolor: themeStyles.itemHover,
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            {meeting.title}
                          </Typography>
                          {!meeting.endTime && (
                            <Typography
                              variant="caption"
                              sx={{
                                bgcolor: "success.main",
                                color: "white",
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                              }}
                            >
                              进行中
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {new Date(meeting.startTime).toLocaleString("zh-CN")}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.6, mx: 0.5 }}>
                              •
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {formatDuration(meeting)}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.6, mx: 0.5 }}>
                              •
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {meeting.messages.length} 条消息
                            </Typography>
                          </Box>
                          {meeting.summary && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                opacity: 0.7,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              总结: {meeting.summary.substring(0, 100)}...
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < meetings.length - 1 && (
                  <Divider sx={{ bgcolor: themeStyles.divider }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* 底部按钮 */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${themeStyles.divider}`,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={() => aiMeeting.hiddenHistory()} variant="outlined">
          关闭
        </Button>
      </Box>
    </Dialog>
  )
})

export default MeetingHistory

