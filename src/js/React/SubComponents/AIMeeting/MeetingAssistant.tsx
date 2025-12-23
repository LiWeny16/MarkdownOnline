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
  Tabs,
  Tab,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SaveIcon from "@mui/icons-material/Save"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import RefreshIcon from "@mui/icons-material/Refresh"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import bigModel from "@App/ai/ai"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import alertUseArco from "@App/message/alert"

interface MeetingAssistantProps {
  themeStyles: any
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`meeting-tabpanel-${index}`}
      aria-labelledby={`meeting-tab-${index}`}
      sx={{
        flex: 1,
        display: value === index ? "flex" : "none",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%"
      }}
      {...other}
    >
      {value === index && children}
    </Box>
  )
}

const MeetingAssistant = observer(({ themeStyles }: MeetingAssistantProps) => {
  const aiMeeting = useAIMeeting()
  const { t } = useTranslation()
  const [tabValue, setTabValue] = React.useState(0)
  
  // Summary State
  const [summary, setSummary] = React.useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false)
  
  // Suggestions State
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = React.useState(false)
  const [suggestionContext, setSuggestionContext] = React.useState("会议") // 会议, 面试, 谈判

  const isDark = themeStyles.background === "#1e1e1e"

  // --- Summary Logic ---

  const handleGenerateSummary = async () => {
    if (aiMeeting.messages.length === 0) {
      alertUseArco(t("t-ai-meeting-no-content-to-summarize"), 2000)
      return
    }

    setIsGeneratingSummary(true)
    setSummary("")

    try {
      // 构建参会人信息
      const activeParticipants = aiMeeting.participants.filter(p => p.isActive)
      const participantsInfo = activeParticipants.length > 0
        ? `参会人员：\n${activeParticipants.map(p => `- ${p.name}（${p.role}）`).join("\n")}\n\n`
        : ""

      const meetingContent = aiMeeting.messages
        .filter((msg) => msg.isFinal)
        .map((msg) => {
          // 尝试获取发言人的岗位信息
          const participant = activeParticipants.find(p => p.name === msg.speaker)
          const speakerLabel = participant ? `${msg.speaker}(${participant.role})` : msg.speaker
          return `${speakerLabel}: ${msg.text}`
        })
        .join("\n")

      const prompt = `请总结以下会议内容，提炼出关键要点、决策和行动项。用清晰的Markdown格式输出，包括：
1. 会议概述（简要说明会议主题和参会人员）
2. 各方观点（按参会人岗位角色归纳各自的主要观点）
3. 关键讨论点
4. 重要决策
5. 待办事项/行动项（明确责任人）

${participantsInfo}会议内容：
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
          setIsGeneratingSummary(false)
          alertUseArco(t("t-ai-meeting-summary-generated"), 2000)
        },
        (error: any) => {
          console.error("生成总结失败:", error)
          alertUseArco(t("t-ai-meeting-summary-failed"), 3000)
          setIsGeneratingSummary(false)
        },
        ""
      )
    } catch (error) {
      console.error("生成总结失败:", error)
      alertUseArco(t("t-ai-meeting-summary-failed"), 3000)
      setIsGeneratingSummary(false)
    }
  }

  const handleExportToMonaco = () => {
    if (!summary) {
      alertUseArco(t("t-ai-meeting-no-summary-to-export"), 2000)
      return
    }
    try {
      const timestamp = new Date().toLocaleString("zh-CN")
      const exportContent = `\n\n## ${t("t-ai-meeting-summary-tab")} - ${timestamp}\n\n${summary}\n\n`
      insertTextMonacoAtCursor(exportContent, true)
      alertUseArco(t("t-ai-meeting-exported-to-editor"), 2000)
    } catch (error) {
      console.error("导出失败:", error)
      alertUseArco(t("t-ai-meeting-export-failed"), 3000)
    }
  }

  const handleSaveMeeting = async () => {
    if (!aiMeeting.currentMeeting) {
      alertUseArco(t("t-ai-meeting-no-meeting-to-save"), 2000)
      return
    }
    try {
      await aiMeeting.autoSaveMeeting()
      alertUseArco(t("t-ai-meeting-saved"), 2000)
    } catch (error) {
      console.error("保存失败:", error)
      alertUseArco(t("t-ai-meeting-save-failed"), 3000)
    }
  }

  React.useEffect(() => {
    if (aiMeeting.currentMeeting?.summary) {
      setSummary(aiMeeting.currentMeeting.summary)
    } else {
      setSummary("")
    }
  }, [aiMeeting.currentMeeting?.id, aiMeeting.currentMeeting?.summary])

  // --- Suggestions Logic ---

  const handleGenerateSuggestions = async () => {
    if (aiMeeting.messages.length === 0) {
      alertUseArco(t("t-ai-meeting-no-content-to-analyze"), 2000)
      return
    }

    setIsGeneratingSuggestions(true)
    setSuggestions([])

    try {
      // Get last 20 messages or all if less
      const recentMessages = aiMeeting.messages
        .slice(-20)
        .map((msg) => `${msg.speaker}: ${msg.text}`)
        .join("\n")

      const prompt = `作为我的实时${suggestionContext}助手，请根据以下最近的对话内容，提供3-5个简短的建议或发言思路。
建议应包括：
1. 我可以提出的问题
2. 我可以补充的观点
3. 需要注意的潜在问题
请直接列出建议点，不要废话。

最近对话：
${recentMessages}`

      let fullResponse = ""

      await bigModel.askAI(
        prompt,
        "",
        (chunk: string) => {
          fullResponse += chunk
        },
        (finalMessage: string) => {
          // Parse the response into a list (assuming AI returns a list)
          // Simple split by newline and cleanup
          const lines = finalMessage.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)))
            .map(line => line.replace(/^[-*\d\.]+\s*/, ''))
          
          if (lines.length > 0) {
            setSuggestions(lines)
          } else {
            // Fallback if format is different
            setSuggestions([finalMessage])
          }
          
          setIsGeneratingSuggestions(false)
        },
        (error: any) => {
          console.error("生成建议失败:", error)
          alertUseArco(t("t-ai-meeting-summary-failed"), 3000)
          setIsGeneratingSuggestions(false)
        },
        ""
      )
    } catch (error) {
      console.error("生成建议失败:", error)
      alertUseArco(t("t-ai-meeting-summary-failed"), 3000)
      setIsGeneratingSuggestions(false)
    }
  }

  const handleCopySuggestion = (text: string) => {
    navigator.clipboard.writeText(text)
    alertUseArco(t("t-ai-meeting-copied-to-clipboard"), 1000)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: themeStyles.background,
      }}
    >
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: themeStyles.divider, bgcolor: themeStyles.headerBg }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: isDark ? "#888" : "#666",
              "&.Mui-selected": {
                color: "#90CAF9",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#90CAF9",
            },
          }}
        >
          <Tab label={t("t-ai-meeting-summary-tab")} icon={<AutoAwesomeIcon fontSize="small" />} iconPosition="start" />
          <Tab label={t("t-ai-meeting-assistant-tab")} icon={<LightbulbIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab 1: Summary */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ p: 2, display: "flex", gap: 1, justifyContent: "flex-end", borderBottom: `1px solid ${themeStyles.divider}` }}>
          <Button
            size="small"
            variant="contained"
            startIcon={isGeneratingSummary ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || aiMeeting.messages.length === 0}
            sx={{
              bgcolor: "#90CAF9",
              color: "#1a1a2e",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#64B5F6", boxShadow: "none" },
            }}
          >
            {t("t-ai-meeting-generate-summary")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportToMonaco}
            disabled={!summary}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: isDark ? "#555" : "#ddd",
              color: themeStyles.color,
              "&:hover": { borderColor: isDark ? "#777" : "#bbb" },
            }}
          >
            {t("t-ai-meeting-export")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveMeeting}
            disabled={!aiMeeting.currentMeeting}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: isDark ? "#555" : "#ddd",
              color: themeStyles.color,
              "&:hover": { borderColor: isDark ? "#777" : "#bbb" },
            }}
          >
            {t("t-ai-meeting-save")}
          </Button>
        </Box>

        <Box className="uniform-scroller" sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: isDark ? "#2d2d30" : "#f9f9f9",
              border: `1px solid ${themeStyles.divider}`,
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isGeneratingSummary ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", height: "100%" }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ color: themeStyles.color }}>
                  {t("t-ai-meeting-summary-generating")}
                </Typography>
              </Box>
            ) : summary ? (
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
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: themeStyles.color,
                  opacity: 0.7,
                  flexDirection: "column",
                  gap: 2
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  borderRadius: "50%", 
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  display: "flex"
                }}>
                  <AutoAwesomeIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
                <Typography variant="body1" align="center" sx={{ fontWeight: 500 }}>
                  {t("t-ai-meeting-summary-placeholder-title")}
                </Typography>
                <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
                  {t("t-ai-meeting-summary-placeholder-desc")}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </TabPanel>

      {/* Tab 2: Assistant */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${themeStyles.divider}` }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {[
              { key: "会议", label: t("t-ai-meeting-context-meeting") },
              { key: "面试", label: t("t-ai-meeting-context-interview") },
              { key: "谈判", label: t("t-ai-meeting-context-negotiation") },
              { key: "头脑风暴", label: t("t-ai-meeting-context-brainstorming") }
            ].map((ctx) => (
              <Chip
                key={ctx.key}
                label={ctx.label}
                onClick={() => setSuggestionContext(ctx.key)}
                size="small"
                clickable
                sx={{
                  borderRadius: 2,
                  borderColor: isDark ? "#444" : "#ddd",
                  bgcolor: suggestionContext === ctx.key ? "#90CAF9" : "transparent",
                  color: suggestionContext === ctx.key ? "#1a1a2e" : (isDark ? "#ddd" : "#333"),
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: suggestionContext === ctx.key ? "#64B5F6" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"),
                  },
                }}
              />
            ))}
          </Box>
          <Button
            fullWidth
            variant="contained"
            startIcon={isGeneratingSuggestions ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
            onClick={handleGenerateSuggestions}
            disabled={isGeneratingSuggestions || aiMeeting.messages.length === 0}
            sx={{
              bgcolor: "#90CAF9",
              color: "#1a1a2e",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": { bgcolor: "#64B5F6", boxShadow: "none" },
            }}
          >
            {t("t-ai-meeting-get-suggestions")}
          </Button>
        </Box>

        <Box className="uniform-scroller" sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          {isGeneratingSuggestions ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2, color: themeStyles.color }}>
                {t("t-ai-meeting-suggestions-generating")}
              </Typography>
            </Box>
          ) : suggestions.length > 0 ? (
            <List>
              {suggestions.map((suggestion, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    mb: 2,
                    bgcolor: isDark ? "#2d2d30" : "#fff",
                    border: `1px solid ${themeStyles.divider}`,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3
                    }
                  }}
                >
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end" aria-label="copy" onClick={() => handleCopySuggestion(suggestion)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                      <LightbulbIcon sx={{ color: "#90CAF9" }} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: themeStyles.color, lineHeight: 1.6 }}>
                          {suggestion}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: themeStyles.color,
                opacity: 0.7,
                flexDirection: "column",
                gap: 2
              }}
            >
              <Box sx={{ 
                p: 3, 
                borderRadius: "50%", 
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                display: "flex"
              }}>
                <LightbulbIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Typography variant="body1" align="center" sx={{ fontWeight: 500 }}>
                {t("t-ai-meeting-suggestions-placeholder-title")}
              </Typography>
              <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
                {t("t-ai-meeting-suggestions-placeholder-desc")}
              </Typography>
            </Box>
          )}
        </Box>
      </TabPanel>
    </Box>
  )
})

export default MeetingAssistant
