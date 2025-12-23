import { observable, makeAutoObservable, runInAction } from "mobx"

// 参会人类型
export interface Participant {
  id: string
  name: string
  role: string // 岗位
  isActive: boolean // 是否参会
}

// 预设岗位列表
export const PRESET_ROLES = [
  "产品经理",
  "技术负责人",
  "UI设计师",
  "前端开发",
  "后端开发",
  "测试工程师",
  "项目经理",
  "运营",
  "市场",
  "客户",
  "其他",
]

// 会议消息类型
export interface MeetingMessage {
  id: string
  speaker: string // 发言人名称（用于生成头像）
  text: string // 转录文本
  translatedText?: string // 翻译后的文本
  timestamp: number
  isFinal: boolean // 是否是最终确认的文本
  language: string // 语言
}

// 会议记录类型
export interface MeetingRecord {
  id: string
  title: string
  startTime: number
  endTime?: number
  messages: MeetingMessage[]
  summary?: string // AI总结
  language: string // 主要语言
  translateLanguage: string // 翻译目标语言
}

// AI会议助手状态管理
class AIMeetingStore {
  displayState = false // 弹窗显示状态
  historyDisplayState = false // 历史记录弹窗显示状态
  
  currentMeeting: MeetingRecord | null = null // 当前会议
  isRecording = false // 是否正在录音
  currentSpeaker = "发言人" // 当前发言人
  
  messages: MeetingMessage[] = [] // 当前会议消息列表
  tempTranscript = "" // 临时转录文本（用于预览，不创建消息对象）
  
  // 语言设置
  sourceLanguage = "zh-CN" // 源语言
  targetLanguage = "en" // 目标翻译语言
  enableRealtimeTranslation = true // 是否启用实时翻译
  
  // 参会人管理
  participants: Participant[] = [
    { id: "p1", name: "参会人1", role: "产品经理", isActive: true },
    { id: "p2", name: "参会人2", role: "技术负责人", isActive: true },
    { id: "p3", name: "参会人3", role: "前端开发", isActive: true },
    { id: "p4", name: "参会人4", role: "后端开发", isActive: true },
  ]
  enableAISpeakerDetection = true // 是否启用AI说话人识别
  
  // AI提示（暂时保留接口）
  aiSuggestions: string[] = []
  
  constructor() {
    makeAutoObservable(this, {
      displayState: observable,
      historyDisplayState: observable,
      currentMeeting: observable,
      isRecording: observable,
      currentSpeaker: observable,
      messages: observable,
      tempTranscript: observable,
      sourceLanguage: observable,
      targetLanguage: observable,
      enableRealtimeTranslation: observable,
      aiSuggestions: observable,
      participants: observable,
      enableAISpeakerDetection: observable,
    })
  }

  // ========== 参会人管理方法 ==========
  
  // 获取活跃的参会人列表
  get activeParticipants(): Participant[] {
    return this.participants.filter(p => p.isActive)
  }

  // 添加参会人
  addParticipant(name: string = "", role: string = "其他") {
    runInAction(() => {
      const id = `p${Date.now()}`
      const defaultName = name || `参会人${this.participants.length + 1}`
      this.participants.push({
        id,
        name: defaultName,
        role,
        isActive: true,
      })
    })
  }

  // 删除参会人
  removeParticipant(id: string) {
    runInAction(() => {
      this.participants = this.participants.filter(p => p.id !== id)
    })
  }

  // 更新参会人信息
  updateParticipant(id: string, updates: Partial<Pick<Participant, "name" | "role">>) {
    runInAction(() => {
      const participant = this.participants.find(p => p.id === id)
      if (participant) {
        if (updates.name !== undefined) participant.name = updates.name
        if (updates.role !== undefined) participant.role = updates.role
      }
    })
  }

  // 切换参会人激活状态
  toggleParticipantActive(id: string) {
    runInAction(() => {
      const participant = this.participants.find(p => p.id === id)
      if (participant) {
        participant.isActive = !participant.isActive
        // 如果当前发言人是这个人且被取消激活，切换到第一个激活的参会人
        if (!participant.isActive && this.currentSpeaker === participant.name) {
          const firstActive = this.participants.find(p => p.isActive)
          if (firstActive) {
            this.currentSpeaker = firstActive.name
          }
        }
      }
    })
  }

  // 切换当前发言人（快速切换）
  switchToParticipant(id: string) {
    runInAction(() => {
      const participant = this.participants.find(p => p.id === id)
      if (participant && participant.isActive) {
        this.currentSpeaker = participant.name
      }
    })
  }

  // 切换AI说话人识别开关
  toggleAISpeakerDetection() {
    runInAction(() => {
      this.enableAISpeakerDetection = !this.enableAISpeakerDetection
    })
  }

  // 获取参会人信息描述（用于AI提示词）
  getParticipantsDescription(): string {
    const activeOnes = this.activeParticipants
    if (activeOnes.length === 0) return ""
    return activeOnes.map(p => `${p.name}(${p.role})`).join("、")
  }

  // 打开会议助手
  display() {
    this.displayState = true
  }

  // 关闭会议助手
  hidden() {
    this.displayState = false
  }

  // 打开历史记录
  displayHistory() {
    this.historyDisplayState = true
  }

  // 关闭历史记录
  hiddenHistory() {
    this.historyDisplayState = false
  }

  // 生成唯一会议ID
  private generateMeetingId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    return `meeting_${timestamp}_${random}`
  }

  // 生成会议标题
  private generateMeetingTitle(): string {
    const now = new Date()
    const date = now.toLocaleDateString("zh-CN", { 
      month: "2-digit", 
      day: "2-digit" 
    })
    const time = now.toLocaleTimeString("zh-CN", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    })
    const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][now.getDay()]
    return `会议记录 ${date} ${weekday} ${time}`
  }

  // 开始新会议
  async startNewMeeting(language: string = "zh-CN", targetLang: string = "en", customTitle: string = "") {
    // 如果有正在进行的会议，先保存
    if (this.currentMeeting && this.messages.length > 0) {
      await this.autoSaveMeeting()
    }

    runInAction(() => {
      const newMeeting: MeetingRecord = {
        id: this.generateMeetingId(),
        title: customTitle || this.generateMeetingTitle(), // 如果有自定义标题则使用，否则自动生成
        startTime: Date.now(),
        messages: [],
        language,
        translateLanguage: targetLang,
      }
      this.currentMeeting = newMeeting
      this.messages = []
      this.tempTranscript = "" // 清空临时转录
      this.sourceLanguage = language
      this.targetLanguage = targetLang
      this.isRecording = false
    })
  }

  // 结束会议
  async endMeeting() {
    runInAction(() => {
      if (this.currentMeeting) {
        this.currentMeeting.endTime = Date.now()
        // 只保存最终确认的消息，过滤掉临时消息
        this.currentMeeting.messages = this.messages.filter((m) => m.isFinal)
      }
      this.isRecording = false
    })

    // 自动保存会议
    await this.autoSaveMeeting()
  }

  // 自动保存会议（将 MobX 对象转换为纯对象）
  async autoSaveMeeting() {
    if (!this.currentMeeting) return

    try {
      const { saveMeetingRecord } = await import("@App/memory/meetingDB")
      
      const meetingToSave = {
        id: this.currentMeeting.id,
        title: this.currentMeeting.title,
        startTime: this.currentMeeting.startTime,
        endTime: this.currentMeeting.endTime || Date.now(),
        language: this.currentMeeting.language,
        translateLanguage: this.currentMeeting.translateLanguage,
        summary: this.currentMeeting.summary,
        messages: this.messages
          .filter((m) => m.isFinal)
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
      console.log("会议已自动保存")
    } catch (error) {
      console.error("自动保存会议失败:", error)
    }
  }

  // 开始录音
  startRecording() {
    this.isRecording = true
  }

  // 停止录音
  stopRecording() {
    this.isRecording = false
  }

  // 设置当前发言人
  setSpeaker(speaker: string) {
    this.currentSpeaker = speaker
  }

  // 添加消息（最终确认的消息）
  addMessage(message: MeetingMessage) {
    runInAction(() => {
      this.messages.push(message)
    })
  }

  // 设置临时转录文本（用于实时预览，不创建消息对象）
  setTempTranscript(text: string) {
    runInAction(() => {
      this.tempTranscript = text
    })
  }

  // 清除临时转录文本
  clearTempTranscript() {
    runInAction(() => {
      this.tempTranscript = ""
    })
  }

  // 更新最终消息的文本（用于追加同一发言人的多句话）
  updateFinalMessage(messageId: string, text: string) {
    runInAction(() => {
      const message = this.messages.find((m) => m.id === messageId)
      if (message && message.isFinal) {
        message.text = text
        message.timestamp = Date.now() // 更新时间戳
      }
    })
  }

  // 更新最后一条消息（用于实时转录）
  updateLastMessage(text: string, isFinal: boolean = false) {
    runInAction(() => {
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1]
        lastMessage.text = text
        lastMessage.isFinal = isFinal
      } else {
        // 如果没有消息，创建新消息
        this.addMessage({
          id: `msg_${Date.now()}`,
          speaker: this.currentSpeaker,
          text,
          timestamp: Date.now(),
          isFinal,
          language: this.sourceLanguage,
        })
      }
    })
  }

  // 更新消息翻译
  updateMessageTranslation(messageId: string, translatedText: string) {
    runInAction(() => {
      const message = this.messages.find((m) => m.id === messageId)
      if (message) {
        message.translatedText = translatedText
      }
    })
  }

  // 设置语言
  setSourceLanguage(lang: string) {
    this.sourceLanguage = lang
  }

  setTargetLanguage(lang: string) {
    this.targetLanguage = lang
  }

  // 切换实时翻译开关
  toggleRealtimeTranslation() {
    runInAction(() => {
      this.enableRealtimeTranslation = !this.enableRealtimeTranslation
    })
  }

  // 清空消息
  clearMessages() {
    runInAction(() => {
      this.messages = []
    })
  }

  // 设置会议总结
  setMeetingSummary(summary: string) {
    runInAction(() => {
      if (this.currentMeeting) {
        this.currentMeeting.summary = summary
      }
    })
  }

  // 加载历史会议
  loadMeeting(meeting: MeetingRecord) {
    runInAction(() => {
      this.currentMeeting = meeting
      this.messages = [...meeting.messages]
      this.sourceLanguage = meeting.language
      this.targetLanguage = meeting.translateLanguage
    })
  }
}

const aiMeetingStore = new AIMeetingStore()
export const useAIMeeting = () => aiMeetingStore

