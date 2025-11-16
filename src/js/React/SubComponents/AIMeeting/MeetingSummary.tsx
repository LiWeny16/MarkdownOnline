import * as React from "react"
import { observer } from "mobx-react"
import { useAIMeeting } from "@Mobx/AIMeeting"
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SaveIcon from "@mui/icons-material/Save"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import bigModel from "@App/ai/ai"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import alertUseArco from "@App/message/alert"
import { saveMeetingRecord } from "@App/memory/meetingDB"

interface MeetingSummaryProps {
  themeStyles: any
}

const MeetingSummary = observer(({ themeStyles }: MeetingSummaryProps) => {
  const aiMeeting = useAIMeeting()
  const [summary, setSummary] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [aiSuggestion, setAiSuggestion] = React.useState("")

  const isDark = themeStyles.background === "#1e1e1e"

  // 生成会议总结
  const handleGenerateSummary = async () => {
    if (aiMeeting.messages.length === 0) {
      alertUseArco("没有会议内容可以总结", 2000)
      return
    }

    setIsGenerating(true)
    setSummary("")

    try {
      // 构建会议内容
      const meetingContent = aiMeeting.messages
        .filter((msg) => msg.isFinal)
        .map((msg) => `${msg.speaker}: ${msg.text}`)
        .join("\n")

      const prompt = `请总结以下会议内容，提炼出关键要点、决策和行动项。用清晰的Markdown格式输出，包括：
1. 会议概述
2. 关键讨论点
3. 重要决策
4. 待办事项/行动项

会议内容：
${meetingContent}`

      let fullSummary = ""

      await bigModel.askAI(
        prompt,
        "",
        (chunk: string) => {
          fullSummary += chunk
          setSummary(fullSummary)
        },
        (finalMessage: string) => {
          setSummary(finalMessage)
          aiMeeting.setMeetingSummary(finalMessage)
          setIsGenerating(false)
          alertUseArco("会议总结生成完成", 2000)
        },
        (error: any) => {
          console.error("生成总结失败:", error)
          alertUseArco("生成总结失败", 3000)
          setIsGenerating(false)
        },
        ""
      )
    } catch (error) {
      console.error("生成总结失败:", error)
      alertUseArco("生成总结失败", 3000)
      setIsGenerating(false)
    }
  }

  // 导出总结到 Monaco 编辑器
  const handleExportToMonaco = () => {
    if (!summary) {
      alertUseArco("没有总结内容可以导出", 2000)
      return
    }

    try {
      // 添加标题和时间戳
      const timestamp = new Date().toLocaleString("zh-CN")
      const exportContent = `\n\n## 会议总结 - ${timestamp}\n\n${summary}\n\n`

      // 插入到 Monaco 编辑器（可撤回）
      insertTextMonacoAtCursor(exportContent, true)
      alertUseArco("已导出到编辑器", 2000)
    } catch (error) {
      console.error("导出失败:", error)
      alertUseArco("导出失败", 3000)
    }
  }

  // 保存会议记录
  const handleSaveMeeting = async () => {
    if (!aiMeeting.currentMeeting) {
      alertUseArco("没有会议记录可以保存", 2000)
      return
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
      }

      await saveMeetingRecord(meetingToSave)
      alertUseArco("会议记录已保存", 2000)
    } catch (error) {
      console.error("保存失败:", error)
      alertUseArco("保存失败", 3000)
    }
  }

  // 当会议变化时处理总结
  React.useEffect(() => {
    if (aiMeeting.currentMeeting?.summary) {
      // 如果会议有总结，加载它
      setSummary(aiMeeting.currentMeeting.summary)
    } else {
      // 如果是新会议或没有总结，清空
      setSummary("")
    }
  }, [aiMeeting.currentMeeting?.id, aiMeeting.currentMeeting?.summary])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 标题和操作按钮 */}
      <Box
        sx={{
          p: 2,
          background: themeStyles.headerBg,
          borderBottom: `1px solid ${themeStyles.divider}`,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            ✨ AI 会议总结
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={isGenerating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
              onClick={handleGenerateSummary}
              disabled={isGenerating || aiMeeting.messages.length === 0}
            >
              生成总结
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToMonaco}
              disabled={!summary}
            >
              导出
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveMeeting}
              disabled={!aiMeeting.currentMeeting}
            >
              保存
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 总结内容 */}
      <Box
        sx={{
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
        }}
      >
        {/* AI 总结区域 */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isDark ? "#2d2d30" : "#f9f9f9",
            border: `1px solid ${themeStyles.divider}`,
            minHeight: "200px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {isGenerating ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ color: themeStyles.color }}>
                正在生成总结...
              </Typography>
            </Box>
          ) : summary ? (
            <Box className="uniform-scroller" sx={{ flex: 1, overflow: "auto" }}>
              <TextField
                multiline
                fullWidth
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: themeStyles.color,
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    p: 0,
                  },
                }}
              />
            </Box>
          ) : (
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
              <Typography variant="body2" align="center">
                点击"生成总结"按钮，AI将为您总结会议内容
                <br />
                包括关键讨论点、决策和行动项
              </Typography>
            </Box>
          )}
        </Paper>

        <Divider sx={{ bgcolor: themeStyles.divider }} />

        {/* AI 实时提示区域（保留接口） */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isDark ? "#2d2d30" : "#f9f9f9",
            border: `1px solid ${themeStyles.divider}`,
            minHeight: "120px",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold", color: themeStyles.color }}>
            💡 AI 实时提示（功能开发中）
          </Typography>
          <Typography variant="body2" sx={{ color: themeStyles.color, opacity: 0.6 }}>
            此功能将在未来版本中提供实时会议建议，帮助您更好地参与讨论
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
})

export default MeetingSummary

