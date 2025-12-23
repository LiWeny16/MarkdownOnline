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

// 根据角色获取头像颜色（不同角色不同颜色）
const ROLE_COLOR_MAP: Record<string, string> = {
  "产品经理": "#FF6B6B",      // 珊瑚红
  "技术负责人": "#4ECDC4",    // 青绿色
  "UI设计师": "#A78BFA",      // 紫罗兰
  "前端开发": "#60A5FA",      // 天蓝色
  "后端开发": "#34D399",      // 翡翠绿
  "测试工程师": "#FBBF24",    // 金黄色
  "项目经理": "#F472B6",      // 粉红色
  "运营": "#FB923C",          // 橙色
  "市场": "#22D3EE",          // 青色
  "客户": "#E879F9",          // 洋红色
  "其他": "#94A3B8",          // 灰蓝色
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
  const aiMeeting = useAIMeeting()
  
  // 根据发言人获取角色颜色
  const getSpeakerColor = (speakerName: string): string => {
    const participant = aiMeeting.participants.find(p => p.name === speakerName)
    if (participant) {
      return ROLE_COLOR_MAP[participant.role] || "#94A3B8"
    }
    return "#94A3B8"
  }
  
  const avatarColor = getSpeakerColor(message.speaker)
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
          color: "#fff",
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
              bgcolor: isDark ? "rgba(144, 202, 249, 0.1)" : "rgba(144, 202, 249, 0.08)",
              color: themeStyles.color,
              borderRadius: 2,
              borderLeft: `3px solid #90CAF9`,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64B5F6", fontWeight: 600, mb: 0.5, display: "block" }}
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

// 临时消息框组件（用于显示正在识别的文本）
const TempMessageBox = observer(({ aiMeeting, themeStyles }: { aiMeeting: any; themeStyles: any }) => {
  const isDark = themeStyles.background === "#1e1e1e"
  
  // 根据发言人获取角色颜色
  const getSpeakerColor = (speakerName: string): string => {
    const participant = aiMeeting.participants.find((p: any) => p.name === speakerName)
    if (participant) {
      return ROLE_COLOR_MAP[participant.role] || "#94A3B8"
    }
    return "#94A3B8"
  }
  
  const avatarColor = getSpeakerColor(aiMeeting.currentSpeaker)
  
  return (
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
          bgcolor: avatarColor,
          color: "#fff",
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
          <Typography variant="caption" sx={{ color: isDark ? "#888" : "#666" }}>
            {new Date().toLocaleTimeString("zh-CN")}
          </Typography>
        </Box>
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            bgcolor: isDark ? "#2d2d30" : "#f5f5f5",
            color: isDark ? "#888" : "#999",
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
            {aiMeeting.messages.map((message, index) => {
              const isLast = index === aiMeeting.messages.length - 1
              // 只有当最后一条消息的说话人与当前说话人相同时，才在该消息后显示临时文本
              const showTempText = isLast && message.speaker === aiMeeting.currentSpeaker
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  themeStyles={themeStyles}
                  tempText={showTempText ? aiMeeting.tempTranscript : undefined}
                  isLast={isLast}
                />
              )
            })}
            {/* 如果没有消息但有临时文本，或者最后一条消息的说话人与当前说话人不同，显示新的临时消息框 */}
            {((aiMeeting.messages.length === 0 && aiMeeting.tempTranscript) || 
              (aiMeeting.messages.length > 0 && aiMeeting.tempTranscript && 
               aiMeeting.messages[aiMeeting.messages.length - 1].speaker !== aiMeeting.currentSpeaker)) && (
              <TempMessageBox aiMeeting={aiMeeting} themeStyles={themeStyles} />
            )}
          </>
        )}
      </Box>
    </Box>
  )
})

export default MeetingTranscript

