import * as React from "react"
import { observer } from "mobx-react"
import { useAIMeeting, MeetingMessage } from "@Mobx/AIMeeting"
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
} from "@mui/material"
import { useTranslation } from "react-i18next"
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import StopIcon from "@mui/icons-material/Stop"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import HistoryIcon from "@mui/icons-material/History"
import PersonIcon from "@mui/icons-material/Person"
import TranslateIcon from "@mui/icons-material/Translate"
import IOSSwitch from "@Com/myCom/Switches/SwitchIOS"
import speechRecognition, { speechLanguageMap } from "@App/voice/speech"
import { quickTranslate, BaiduLanguages } from "@App/ai/baidu"
import alertUseArco from "@App/message/alert"

interface MeetingControlsProps {
  themeStyles: any
}

const MeetingControls = observer(({ themeStyles }: MeetingControlsProps) => {
  const aiMeeting = useAIMeeting()
  const { t } = useTranslation()
  const [recognitionInstance, setRecognitionInstance] = React.useState<any>(null)
  const [meetingTitle, setMeetingTitle] = React.useState("")

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

              // 检查是否可以追加到最后一条消息
              const lastMessage = aiMeeting.messages.length > 0 
                ? aiMeeting.messages[aiMeeting.messages.length - 1] 
                : null
              
              const canAppendToLast = lastMessage 
                && lastMessage.isFinal 
                && lastMessage.speaker === aiMeeting.currentSpeaker
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
                  speaker: aiMeeting.currentSpeaker,
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
    <Box
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        background: themeStyles.background,
      }}
    >
      {/* 会议控制按钮 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartMeeting}
        disabled={!!aiMeeting.currentMeeting && !aiMeeting.currentMeeting.endTime}
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
        sx={{ width: 200 }}
        onKeyPress={(e) => {
          if (e.key === "Enter" && (!aiMeeting.currentMeeting || aiMeeting.currentMeeting.endTime)) {
            handleStartMeeting()
          }
        }}
      />

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleEndMeeting}
        disabled={!aiMeeting.currentMeeting || !!aiMeeting.currentMeeting.endTime}
      >
        {t("t-ai-meeting-end-meeting")}
      </Button>

      {/* 录音按钮 */}
      <Tooltip title={aiMeeting.isRecording ? t("t-ai-meeting-stop-recording") : t("t-ai-meeting-start-recording")}>
        <IconButton
          onClick={handleToggleRecording}
          disabled={!aiMeeting.currentMeeting || !!aiMeeting.currentMeeting.endTime}
          sx={{
            bgcolor: aiMeeting.isRecording ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: aiMeeting.isRecording ? "error.dark" : "primary.dark",
            },
          }}
        >
          {aiMeeting.isRecording ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
      </Tooltip>

      {/* 历史记录按钮 */}
      <Tooltip title={t("t-ai-meeting-history")}>
        <IconButton onClick={handleOpenHistory}>
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{ flex: 1 }} />

      {/* 发言人名称 */}
      <TextField
        size="small"
        label={t("t-ai-meeting-speaker")}
        value={aiMeeting.currentSpeaker}
        onChange={(e) => aiMeeting.setSpeaker(e.target.value)}
        disabled={aiMeeting.isRecording}
        sx={{ width: 120 }}
        InputProps={{
          startAdornment: <PersonIcon sx={{ mr: 0.5, fontSize: 18 }} />,
        }}
      />

      {/* 源语言选择 */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t("t-ai-meeting-source-language")}</InputLabel>
        <Select
          value={aiMeeting.sourceLanguage}
          label={t("t-ai-meeting-source-language")}
          onChange={(e) => aiMeeting.setSourceLanguage(e.target.value)}
          disabled={aiMeeting.isRecording}
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
        <TranslateIcon sx={{ fontSize: 20, opacity: 0.7 }} />
        <IOSSwitch
          checked={aiMeeting.enableRealtimeTranslation}
          onChange={() => aiMeeting.toggleRealtimeTranslation()}
        />
      </Box>

      {/* 目标翻译语言 */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t("t-ai-meeting-translate-to")}</InputLabel>
        <Select
          value={aiMeeting.targetLanguage}
          label={t("t-ai-meeting-translate-to")}
          onChange={(e) => aiMeeting.setTargetLanguage(e.target.value)}
          disabled={!aiMeeting.enableRealtimeTranslation}
        >
          <MenuItem value="zh">中文</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="jp">日本語</MenuItem>
          <MenuItem value="fra">Français</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
          <MenuItem value="spa">Español</MenuItem>
          <MenuItem value="it">Italiano</MenuItem>
          <MenuItem value="kor">한国어</MenuItem>
          <MenuItem value="pt">Português</MenuItem>
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="th">ไทย</MenuItem>
          <MenuItem value="ara">العربية</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
})

export default MeetingControls

