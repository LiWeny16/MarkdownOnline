import * as React from "react"
import { observer } from "mobx-react"
import { useAIMeeting, MeetingMessage, PRESET_ROLES, Participant } from "@Mobx/AIMeeting"
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Divider,
  Avatar,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import StopIcon from "@mui/icons-material/Stop"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import HistoryIcon from "@mui/icons-material/History"
import PersonIcon from "@mui/icons-material/Person"
import TranslateIcon from "@mui/icons-material/Translate"
import GroupIcon from "@mui/icons-material/Group"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import IOSSwitch from "@Com/myCom/Switches/SwitchIOS"
import speechRecognition, { speechLanguageMap } from "@App/voice/speech"
import { quickTranslate, BaiduLanguages } from "@App/ai/baidu"
import alertUseArco from "@App/message/alert"
import { detectSpeaker } from "@App/ai/ai"

interface MeetingControlsProps {
  themeStyles: any
}

const MeetingControls = observer(({ themeStyles }: MeetingControlsProps) => {
  const aiMeeting = useAIMeeting()
  const { t } = useTranslation()
  const [recognitionInstance, setRecognitionInstance] = React.useState<any>(null)
  const [meetingTitle, setMeetingTitle] = React.useState("")
  const [participantDialogOpen, setParticipantDialogOpen] = React.useState(false)
  
  const isDark = themeStyles.background === "#1e1e1e"

  // 根据角色获取头像颜色（不同角色不同颜色，更好看）
  const getRoleColor = (role: string): string => {
    const roleColorMap: Record<string, string> = {
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
    return roleColorMap[role] || "#94A3B8"
  }

  // 根据参会人获取颜色
  const getParticipantColor = (name: string): string => {
    const participant = aiMeeting.participants.find(p => p.name === name)
    if (participant) {
      return getRoleColor(participant.role)
    }
    // 如果不是参会人，使用默认灰色
    return "#94A3B8"
  }

  // 开始/停止录音
  const handleToggleRecording = () => {
    if (aiMeeting.isRecording) {
      // 停止录音
      if (recognitionInstance) {
        recognitionInstance.recognition.stopRecognition()
        setRecognitionInstance(null)
      }
      // 清除临时转录文本
      aiMeeting.clearTempTranscript()
      aiMeeting.stopRecording()
      alertUseArco(t("t-ai-meeting-recording-stopped"), 2000)
    } else {
      // 开始录音
      if (!aiMeeting.currentMeeting) {
        alertUseArco(t("t-ai-meeting-please-start-meeting-first"), 2000)
        return
      }

      try {
        const instance = speechRecognition(
          aiMeeting.sourceLanguage,
          true,
          async (length: number, isFinal: boolean) => {
            const transcript = window._speechData.speechResult
            
            if (!transcript) return

            if (isFinal) {
              // 最终确认的文本 - 清除临时文本，添加到正式消息
              aiMeeting.clearTempTranscript()

              // AI 说话人识别（如果启用）
              let speakerName = aiMeeting.currentSpeaker
              if (aiMeeting.enableAISpeakerDetection && aiMeeting.activeParticipants.length > 1) {
                try {
                  speakerName = await detectSpeaker(
                    transcript,
                    aiMeeting.activeParticipants.map(p => ({ name: p.name, role: p.role })),
                    aiMeeting.messages.slice(-5).map(m => ({ speaker: m.speaker, text: m.text })),
                    aiMeeting.currentSpeaker
                  )
                  // 更新当前说话人
                  if (speakerName !== aiMeeting.currentSpeaker) {
                    aiMeeting.setSpeaker(speakerName)
                  }
                } catch (error) {
                  console.error("AI说话人识别失败:", error)
                }
              }

              // 检查是否可以追加到最后一条消息
              const lastMessage = aiMeeting.messages.length > 0 
                ? aiMeeting.messages[aiMeeting.messages.length - 1] 
                : null
              
              const canAppendToLast = lastMessage 
                && lastMessage.isFinal 
                && lastMessage.speaker === speakerName
                && lastMessage.text.length < 130

              if (canAppendToLast && lastMessage) {
                // 追加到最后一条消息
                const updatedText = lastMessage.text + transcript
                aiMeeting.updateFinalMessage(lastMessage.id, updatedText)

                // 如果需要翻译且开关已开启，重新翻译整个文本
                if (aiMeeting.enableRealtimeTranslation && aiMeeting.targetLanguage) {
                  try {
                    const sourceLang = BaiduLanguages[aiMeeting.sourceLanguage as keyof typeof BaiduLanguages] || "auto"
                    const translatedText = await quickTranslate(
                      updatedText,
                      aiMeeting.targetLanguage,
                      sourceLang
                    )
                    aiMeeting.updateMessageTranslation(lastMessage.id, translatedText)
                  } catch (error) {
                    console.error("翻译失败:", error)
                  }
                }
              } else {
                // 创建新消息（字符超过130或不同发言人）
                const messageId = `msg_${Date.now()}`
                const newMessage: MeetingMessage = {
                  id: messageId,
                  speaker: speakerName,
                  text: transcript,
                  timestamp: Date.now(),
                  isFinal: true,
                  language: aiMeeting.sourceLanguage,
                }
                
                aiMeeting.addMessage(newMessage)

                // 自动翻译（仅对最终确认的文本进行翻译，且开关已开启）
                if (aiMeeting.enableRealtimeTranslation && aiMeeting.targetLanguage) {
                  try {
                    const sourceLang = BaiduLanguages[aiMeeting.sourceLanguage as keyof typeof BaiduLanguages] || "auto"
                    const translatedText = await quickTranslate(
                      transcript,
                      aiMeeting.targetLanguage,
                      sourceLang
                    )
                    aiMeeting.updateMessageTranslation(messageId, translatedText)
                  } catch (error) {
                    console.error("翻译失败:", error)
                  }
                }
              }
            } else {
              // 临时文本 - 只作为预览显示在最后一条消息末尾，不翻译，不创建新消息
              aiMeeting.setTempTranscript(transcript)
            }
          }
        )
        
        setRecognitionInstance(instance)
        aiMeeting.startRecording()
        alertUseArco(t("t-ai-meeting-recording-started"), 2000)
      } catch (error) {
        console.error("启动语音识别失败:", error)
        alertUseArco(t("t-ai-meeting-recognition-failed"), 3000)
      }
    }
  }

  // 开始新会议
  const handleStartMeeting = async () => {
    await aiMeeting.startNewMeeting(
      aiMeeting.sourceLanguage, 
      aiMeeting.targetLanguage,
      meetingTitle.trim() // 传入自定义标题，如果为空则使用默认标题
    )
    setMeetingTitle("") // 清空输入框
    alertUseArco(t("t-ai-meeting-meeting-created"), 2000)
    
    // 自动开始录音
    setTimeout(() => {
      handleToggleRecording()
    }, 300) // 延迟300ms确保会议创建完成
  }

  // 结束会议
  const handleEndMeeting = async () => {
    if (recognitionInstance) {
      recognitionInstance.recognition.stopRecognition()
      setRecognitionInstance(null)
    }
    await aiMeeting.endMeeting()
    alertUseArco(t("t-ai-meeting-meeting-ended"), 2000)
  }

  // 打开历史记录
  const handleOpenHistory = () => {
    aiMeeting.displayHistory()
  }

  return (
    <>
      {/* 主控制栏 */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          background: themeStyles.headerBg || themeStyles.background,
        }}
      >
        {/* 会议控制按钮 */}
        <Button
          variant="contained"
          onClick={handleStartMeeting}
          disabled={!!aiMeeting.currentMeeting && !aiMeeting.currentMeeting.endTime}
          sx={{
            bgcolor: "#90CAF9",
            color: "#1a1a2e",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: 2.5,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#64B5F6",
              boxShadow: "none",
            },
          }}
        >
          {t("t-ai-meeting-new-meeting")}
        </Button>

        {/* 会议名称输入框 */}
        <TextField
          size="small"
          label={t("t-ai-meeting-meeting-name")}
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          placeholder={t("t-ai-meeting-meeting-name-placeholder")}
          disabled={!!aiMeeting.currentMeeting && !aiMeeting.currentMeeting.endTime}
          sx={{ 
            width: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: isDark ? "#3c3c3c" : "#f0f0f0",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: isDark ? "#555" : "#ccc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#90CAF9",
              },
            },
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" && (!aiMeeting.currentMeeting || aiMeeting.currentMeeting.endTime)) {
              handleStartMeeting()
            }
          }}
        />

        <Button
          variant="outlined"
          onClick={handleEndMeeting}
          disabled={!aiMeeting.currentMeeting || !!aiMeeting.currentMeeting.endTime}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            borderColor: isDark ? "#555" : "#ddd",
            color: themeStyles.color,
            "&:hover": {
              borderColor: isDark ? "#777" : "#bbb",
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            },
          }}
        >
          {t("t-ai-meeting-end-meeting")}
        </Button>

        {/* 录音按钮 */}
        <Tooltip title={aiMeeting.isRecording ? t("t-ai-meeting-stop-recording") : t("t-ai-meeting-start-recording")}>
          <IconButton
            onClick={handleToggleRecording}
            disabled={!aiMeeting.currentMeeting || !!aiMeeting.currentMeeting.endTime}
            sx={{
              bgcolor: aiMeeting.isRecording ? "#ef4444" : "#90CAF9",
              color: aiMeeting.isRecording ? "white" : "#1a1a2e",
              width: 40,
              height: 40,
              "&:hover": {
                bgcolor: aiMeeting.isRecording ? "#dc2626" : "#64B5F6",
              },
            }}
          >
            {aiMeeting.isRecording ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>

        {/* 历史记录按钮 */}
        <Tooltip title={t("t-ai-meeting-history")}>
          <IconButton 
            onClick={handleOpenHistory}
            sx={{ 
              color: isDark ? "#888" : "#666",
              "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>

        {/* 参会人管理按钮 */}
        <Tooltip title={t("t-ai-meeting-participants")}>
          <IconButton 
            onClick={() => setParticipantDialogOpen(true)}
            sx={{ 
              color: isDark ? "#888" : "#666",
              "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }
            }}
          >
            <GroupIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        {/* 源语言选择 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ fontSize: "0.85rem" }}>{t("t-ai-meeting-source-language")}</InputLabel>
          <Select
            value={aiMeeting.sourceLanguage}
            label={t("t-ai-meeting-source-language")}
            onChange={(e) => aiMeeting.setSourceLanguage(e.target.value)}
            disabled={aiMeeting.isRecording}
            sx={{
              borderRadius: 2,
              bgcolor: isDark ? "#3c3c3c" : "#f0f0f0",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#555" : "#ccc",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#90CAF9",
              },
            }}
          >
            {speechLanguageMap.map(([code, name]) => (
              <MenuItem key={code} value={code}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 实时翻译开关 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TranslateIcon sx={{ fontSize: 20, color: isDark ? "#888" : "#666" }} />
          <IOSSwitch
            checked={aiMeeting.enableRealtimeTranslation}
            onChange={() => aiMeeting.toggleRealtimeTranslation()}
          />
        </Box>

        {/* 目标翻译语言 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ fontSize: "0.85rem" }}>{t("t-ai-meeting-translate-to")}</InputLabel>
          <Select
            value={aiMeeting.targetLanguage}
            label={t("t-ai-meeting-translate-to")}
            onChange={(e) => aiMeeting.setTargetLanguage(e.target.value)}
            disabled={!aiMeeting.enableRealtimeTranslation}
            sx={{
              borderRadius: 2,
              bgcolor: isDark ? "#3c3c3c" : "#f0f0f0",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#555" : "#ccc",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#989affff",
              },
            }}
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="jp">日本語</MenuItem>
            <MenuItem value="fra">Français</MenuItem>
            <MenuItem value="de">Deutsch</MenuItem>
            <MenuItem value="spa">Español</MenuItem>
            <MenuItem value="it">Italiano</MenuItem>
            <MenuItem value="kor">한국어</MenuItem>
            <MenuItem value="pt">Português</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="th">ไทย</MenuItem>
            <MenuItem value="ara">العربية</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 参会人快速切换栏 */}
      {aiMeeting.activeParticipants.length > 0 && (
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            flexWrap: "wrap",
            background: isDark ? "#252526" : "#f0f0f0",
            borderTop: `1px solid ${isDark ? "#333" : "#e8e8e8"}`,
          }}
        >
          <Typography variant="caption" sx={{ color: isDark ? "#888" : "#666", mr: 1, fontWeight: 500 }}>
            {t("t-ai-meeting-quick-switch")}:
          </Typography>
          {aiMeeting.activeParticipants.map((p) => {
            // AI识别开启时，不高亮任何人
            const isSelected = !aiMeeting.enableAISpeakerDetection && aiMeeting.currentSpeaker === p.name
            const roleColor = getRoleColor(p.role)
            return (
              <Chip
                key={p.id}
                avatar={
                  <Avatar sx={{ 
                    bgcolor: roleColor, 
                    color: "#fff !important", 
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}>
                    {p.name.charAt(0)}
                  </Avatar>
                }
                label={`${p.name} (${p.role})`}
                onClick={() => {
                  // 手动点击时，关闭AI识别并切换到该参会人
                  if (aiMeeting.enableAISpeakerDetection) {
                    aiMeeting.toggleAISpeakerDetection()
                  }
                  aiMeeting.switchToParticipant(p.id)
                }}
                variant={isSelected ? "filled" : "outlined"}
                color={isSelected ? "primary" : "default"}
                size="small"
                sx={{
                  borderRadius: 2,
                  borderColor: isDark ? "#444" : "#ddd",
                  opacity: aiMeeting.enableAISpeakerDetection ? 0.6 : 1,
                  bgcolor: isSelected ? "#90CAF9" : "transparent",
                  "& .MuiChip-label": {
                    color: isSelected ? "#1a1a2e" : (isDark ? "#ddd" : "#333"),
                    fontWeight: 500,
                    fontSize: "0.8rem",
                  },
                  "&:hover": {
                    bgcolor: isSelected ? "#64B5F6" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"),
                  },
                }}
              />
            )
          })}
          
          {/* AI识别开关 */}
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title={t("t-ai-meeting-ai-speaker-detection")}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: aiMeeting.enableAISpeakerDetection ? "#90CAF9" : (isDark ? "#666" : "#999") }} />
            </Tooltip>
            <IOSSwitch
              checked={aiMeeting.enableAISpeakerDetection}
              onChange={() => aiMeeting.toggleAISpeakerDetection()}
              size="small"
            />
          </Box>
        </Box>
      )}

      {/* 参会人管理弹窗 */}
      <Dialog 
        open={participantDialogOpen} 
        onClose={() => setParticipantDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDark ? "#1e1e1e" : "#fff",
            color: themeStyles.color,
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <GroupIcon sx={{ color: "#90CAF9" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("t-ai-meeting-participants-title")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: isDark ? "#888" : "#666" }}>
            {t("t-ai-meeting-participants-desc")}
          </Typography>
          
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {aiMeeting.participants.map((participant) => (
              <ListItem
                key={participant.id}
                sx={{
                  bgcolor: participant.isActive 
                    ? (isDark ? "rgba(144, 202, 249, 0.1)" : "rgba(144, 202, 249, 0.08)") 
                    : "transparent",
                  borderRadius: 2,
                  mb: 1,
                  border: `1px solid ${participant.isActive ? (isDark ? "#555" : "#ddd") : (isDark ? "#333" : "#e8e8e8")}`,
                  transition: "all 0.2s",
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: participant.isActive ? getRoleColor(participant.role) : (isDark ? "#444" : "#ccc"),
                    color: "#fff",
                    mr: 2,
                    transition: "all 0.2s",
                  }}
                >
                  {participant.name.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={
                    <TextField
                      variant="standard"
                      value={participant.name}
                      onChange={(e) => aiMeeting.updateParticipant(participant.id, { name: e.target.value })}
                      size="small"
                      sx={{ 
                        width: 120,
                        "& .MuiInput-root": { color: themeStyles.color }
                      }}
                      InputProps={{
                        sx: { fontSize: "0.95rem", fontWeight: 600 }
                      }}
                    />
                  }
                  secondary={
                    <FormControl size="small" variant="standard" sx={{ minWidth: 100, mt: 0.5 }}>
                      <Select
                        value={participant.role}
                        onChange={(e) => aiMeeting.updateParticipant(participant.id, { role: e.target.value })}
                        sx={{ 
                          fontSize: "0.8rem",
                          color: isDark ? "#888" : "#666",
                          "&::before": { borderColor: isDark ? "#444" : "#ddd" }
                        }}
                      >
                        {PRESET_ROLES.map((role) => (
                          <MenuItem key={role} value={role} sx={{ fontSize: "0.85rem" }}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title={participant.isActive ? t("t-ai-meeting-participant-remove") : t("t-ai-meeting-participant-add")}>
                    <Chip
                      label={participant.isActive ? t("t-ai-meeting-attending") : t("t-ai-meeting-not-attending")}
                      size="small"
                      onClick={() => aiMeeting.toggleParticipantActive(participant.id)}
                      sx={{ 
                        mr: 1, 
                        cursor: "pointer",
                        borderRadius: 1.5,
                        bgcolor: participant.isActive ? "#22c55e" : (isDark ? "#444" : "#e8e8e8"),
                        color: participant.isActive ? "#fff" : (isDark ? "#888" : "#666"),
                        "&:hover": {
                          bgcolor: participant.isActive ? "#16a34a" : (isDark ? "#555" : "#ddd"),
                        },
                      }}
                    />
                  </Tooltip>
                  <IconButton 
                    edge="end" 
                    onClick={() => aiMeeting.removeParticipant(participant.id)}
                    size="small"
                    sx={{ 
                      color: isDark ? "#666" : "#999",
                      "&:hover": { color: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.1)" } 
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2, borderColor: isDark ? "#333" : "#e8e8e8" }} />
          
          <Button
            startIcon={<AddIcon />}
            onClick={() => aiMeeting.addParticipant()}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 2,
              borderColor: isDark ? "#555" : "#ddd",
              color: themeStyles.color,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#90CAF9",
                bgcolor: "rgba(144, 202, 249, 0.1)",
              },
            }}
          >
            {t("t-ai-meeting-add-participant")}
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setParticipantDialogOpen(false)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              color: isDark ? "#888" : "#666",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              },
            }}
          >
            {t("t-ai-meeting-close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

export default MeetingControls

