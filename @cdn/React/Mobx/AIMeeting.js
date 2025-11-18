import { observable, makeAutoObservable, runInAction } from "mobx";
// AI会议助手状态管理
class AIMeetingStore {
    constructor() {
        Object.defineProperty(this, "displayState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 弹窗显示状态
        Object.defineProperty(this, "historyDisplayState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 历史记录弹窗显示状态
        Object.defineProperty(this, "currentMeeting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); // 当前会议
        Object.defineProperty(this, "isRecording", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 是否正在录音
        Object.defineProperty(this, "currentSpeaker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "发言人"
        }); // 当前发言人
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); // 当前会议消息列表
        Object.defineProperty(this, "tempTranscript", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        }); // 临时转录文本（用于预览，不创建消息对象）
        // 语言设置
        Object.defineProperty(this, "sourceLanguage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "zh-CN"
        }); // 源语言
        Object.defineProperty(this, "targetLanguage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "en"
        }); // 目标翻译语言
        Object.defineProperty(this, "enableRealtimeTranslation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        }); // 是否启用实时翻译
        // AI提示（暂时保留接口）
        Object.defineProperty(this, "aiSuggestions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
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
        });
    }
    // 打开会议助手
    display() {
        this.displayState = true;
    }
    // 关闭会议助手
    hidden() {
        this.displayState = false;
    }
    // 打开历史记录
    displayHistory() {
        this.historyDisplayState = true;
    }
    // 关闭历史记录
    hiddenHistory() {
        this.historyDisplayState = false;
    }
    // 生成唯一会议ID
    generateMeetingId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `meeting_${timestamp}_${random}`;
    }
    // 生成会议标题
    generateMeetingTitle() {
        const now = new Date();
        const date = now.toLocaleDateString("zh-CN", {
            month: "2-digit",
            day: "2-digit"
        });
        const time = now.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][now.getDay()];
        return `会议记录 ${date} ${weekday} ${time}`;
    }
    // 开始新会议
    async startNewMeeting(language = "zh-CN", targetLang = "en", customTitle = "") {
        // 如果有正在进行的会议，先保存
        if (this.currentMeeting && this.messages.length > 0) {
            await this.autoSaveMeeting();
        }
        runInAction(() => {
            const newMeeting = {
                id: this.generateMeetingId(),
                title: customTitle || this.generateMeetingTitle(), // 如果有自定义标题则使用，否则自动生成
                startTime: Date.now(),
                messages: [],
                language,
                translateLanguage: targetLang,
            };
            this.currentMeeting = newMeeting;
            this.messages = [];
            this.tempTranscript = ""; // 清空临时转录
            this.sourceLanguage = language;
            this.targetLanguage = targetLang;
            this.isRecording = false;
        });
    }
    // 结束会议
    async endMeeting() {
        runInAction(() => {
            if (this.currentMeeting) {
                this.currentMeeting.endTime = Date.now();
                // 只保存最终确认的消息，过滤掉临时消息
                this.currentMeeting.messages = this.messages.filter((m) => m.isFinal);
            }
            this.isRecording = false;
        });
        // 自动保存会议
        await this.autoSaveMeeting();
    }
    // 自动保存会议（将 MobX 对象转换为纯对象）
    async autoSaveMeeting() {
        if (!this.currentMeeting)
            return;
        try {
            const { saveMeetingRecord } = await import("@App/memory/meetingDB");
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
            };
            await saveMeetingRecord(meetingToSave);
            console.log("会议已自动保存");
        }
        catch (error) {
            console.error("自动保存会议失败:", error);
        }
    }
    // 开始录音
    startRecording() {
        this.isRecording = true;
    }
    // 停止录音
    stopRecording() {
        this.isRecording = false;
    }
    // 设置当前发言人
    setSpeaker(speaker) {
        this.currentSpeaker = speaker;
    }
    // 添加消息（最终确认的消息）
    addMessage(message) {
        runInAction(() => {
            this.messages.push(message);
        });
    }
    // 设置临时转录文本（用于实时预览，不创建消息对象）
    setTempTranscript(text) {
        runInAction(() => {
            this.tempTranscript = text;
        });
    }
    // 清除临时转录文本
    clearTempTranscript() {
        runInAction(() => {
            this.tempTranscript = "";
        });
    }
    // 更新最终消息的文本（用于追加同一发言人的多句话）
    updateFinalMessage(messageId, text) {
        runInAction(() => {
            const message = this.messages.find((m) => m.id === messageId);
            if (message && message.isFinal) {
                message.text = text;
                message.timestamp = Date.now(); // 更新时间戳
            }
        });
    }
    // 更新最后一条消息（用于实时转录）
    updateLastMessage(text, isFinal = false) {
        runInAction(() => {
            if (this.messages.length > 0) {
                const lastMessage = this.messages[this.messages.length - 1];
                lastMessage.text = text;
                lastMessage.isFinal = isFinal;
            }
            else {
                // 如果没有消息，创建新消息
                this.addMessage({
                    id: `msg_${Date.now()}`,
                    speaker: this.currentSpeaker,
                    text,
                    timestamp: Date.now(),
                    isFinal,
                    language: this.sourceLanguage,
                });
            }
        });
    }
    // 更新消息翻译
    updateMessageTranslation(messageId, translatedText) {
        runInAction(() => {
            const message = this.messages.find((m) => m.id === messageId);
            if (message) {
                message.translatedText = translatedText;
            }
        });
    }
    // 设置语言
    setSourceLanguage(lang) {
        this.sourceLanguage = lang;
    }
    setTargetLanguage(lang) {
        this.targetLanguage = lang;
    }
    // 切换实时翻译开关
    toggleRealtimeTranslation() {
        runInAction(() => {
            this.enableRealtimeTranslation = !this.enableRealtimeTranslation;
        });
    }
    // 清空消息
    clearMessages() {
        runInAction(() => {
            this.messages = [];
        });
    }
    // 设置会议总结
    setMeetingSummary(summary) {
        runInAction(() => {
            if (this.currentMeeting) {
                this.currentMeeting.summary = summary;
            }
        });
    }
    // 加载历史会议
    loadMeeting(meeting) {
        runInAction(() => {
            this.currentMeeting = meeting;
            this.messages = [...meeting.messages];
            this.sourceLanguage = meeting.language;
            this.targetLanguage = meeting.translateLanguage;
        });
    }
}
const aiMeetingStore = new AIMeetingStore();
export const useAIMeeting = () => aiMeetingStore;
