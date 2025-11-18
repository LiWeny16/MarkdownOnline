import * as React from "react"
import { observer } from "mobx-react"
import { useAIMeeting, MeetingMessage } from "@Mobx/AIMeeting"
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
} from "@mui/material"
import { useTranslation } from "react-i18next"

interface MeetingTranscriptProps {
  themeStyles: any
}

// 生成头像颜色（根据名称生成一致的颜色）
function getAvatarColor(name: string): string {
  const colors = [
    "#7FFFD4", // 薄荷绿
    "#98D8C8", // 淡薄荷绿
    "#6ECEB2", // 中薄荷绿
    "#5BBEA0", // 深薄荷绿
    "#8FD8D2", // 青薄荷
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// 获取首字母
function getInitials(name: string): string {
  if (!name) return "?"
  
  // 如果是中文，取第一个字
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.charAt(0)
  }
  
  // 如果是英文，取首字母
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }
  return name.charAt(0).toUpperCase()
}

// 单条消息组件
const MessageItem = observer(({ message, themeStyles, tempText, isLast }: { 
  message: MeetingMessage; 
  themeStyles: any;
  tempText?: string;
  isLast?: boolean;
}) => {
  const { t } = useTranslation()
  const avatarColor = getAvatarColor(message.speaker)
  const initials = getInitials(message.speaker)
  const isDark = themeStyles.background === "#1e1e1e"

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 2,
        alignItems: "flex-start",
      }}
    >
      {/* 头像 */}
      <Avatar
        sx={{
          bgcolor: avatarColor,
          color: "#000",
          fontWeight: "bold",
          width: 40,
          height: 40,
          fontSize: "1rem",
        }}
      >
        {initials}
      </Avatar>

      {/* 消息内容 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* 发言人和时间 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: themeStyles.color }}>
            {message.speaker}
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? "#888" : "#666" }}>
            {new Date(message.timestamp).toLocaleTimeString("zh-CN")}
          </Typography>
        </Box>

        {/* 文本气泡 - 原文 */}
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            bgcolor: isDark ? "#2d2d30" : "#f5f5f5",
            color: themeStyles.color,
            borderRadius: 2,
            mb: message.translatedText ? 1 : 0,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {message.text}
            {/* 如果是最后一条消息且有临时文本，显示临时文本 */}
            {isLast && tempText && (
              <span style={{ 
                color: isDark ? "#888" : "#999",
                fontStyle: "italic"
              }}>
                {tempText} ...
              </span>
            )}
          </Typography>
        </Paper>

        {/* 翻译文本气泡 */}
        {message.translatedText && (
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              bgcolor: isDark ? "#1a3a2e" : "#e8f5e9",
              color: themeStyles.color,
              borderRadius: 2,
              borderLeft: `3px solid ${avatarColor}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: isDark ? "#7FFFD4" : "#2e7d32", fontWeight: "bold", mb: 0.5, display: "block" }}
            >
              {t("t-ai-meeting-translation")}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {message.translatedText}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  )
})

const MeetingTranscript = observer(({ themeStyles }: MeetingTranscriptProps) => {
  const aiMeeting = useAIMeeting()
  const { t } = useTranslation()
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // 自动滚动到底部（响应消息和临时文本变化）
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [aiMeeting.messages.length, aiMeeting.tempTranscript])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 标题 */}
      <Box
        sx={{
          p: 2,
          background: themeStyles.headerBg,
          borderBottom: `1px solid ${themeStyles.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
          {t("t-ai-meeting-transcript-title")}
        </Typography>
      </Box>

      {/* 消息列表 */}
      <Box
        ref={scrollRef}
        className="uniform-scroller"
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {aiMeeting.messages.length === 0 && !aiMeeting.tempTranscript ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: themeStyles.color,
              opacity: 0.5,
            }}
          >
            <Typography variant="body1">
              {t("t-ai-meeting-transcript-placeholder")}
            </Typography>
          </Box>
        ) : (
          <>
            {aiMeeting.messages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                themeStyles={themeStyles}
                tempText={index === aiMeeting.messages.length - 1 ? aiMeeting.tempTranscript : undefined}
                isLast={index === aiMeeting.messages.length - 1}
              />
            ))}
            {/* 如果没有消息但有临时文本，显示临时消息 */}
            {aiMeeting.messages.length === 0 && aiMeeting.tempTranscript && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(aiMeeting.currentSpeaker),
                    color: "#000",
                    fontWeight: "bold",
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                  }}
                >
                  {getInitials(aiMeeting.currentSpeaker)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: themeStyles.color }}>
                      {aiMeeting.currentSpeaker}
                    </Typography>
                    <Typography variant="caption" sx={{ color: themeStyles.background === "#1e1e1e" ? "#888" : "#666" }}>
                      {new Date().toLocaleTimeString("zh-CN")}
                    </Typography>
                  </Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      bgcolor: themeStyles.background === "#1e1e1e" ? "#2d2d30" : "#f5f5f5",
                      color: themeStyles.background === "#1e1e1e" ? "#888" : "#999",
                      borderRadius: 2,
                      fontStyle: "italic",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {aiMeeting.tempTranscript} ...
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
})

export default MeetingTranscript

