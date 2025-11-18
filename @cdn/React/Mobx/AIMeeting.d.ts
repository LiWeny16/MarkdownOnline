export interface MeetingMessage {
    id: string;
    speaker: string;
    text: string;
    translatedText?: string;
    timestamp: number;
    isFinal: boolean;
    language: string;
}
export interface MeetingRecord {
    id: string;
    title: string;
    startTime: number;
    endTime?: number;
    messages: MeetingMessage[];
    summary?: string;
    language: string;
    translateLanguage: string;
}
declare class AIMeetingStore {
    displayState: boolean;
    historyDisplayState: boolean;
    currentMeeting: MeetingRecord | null;
    isRecording: boolean;
    currentSpeaker: string;
    messages: MeetingMessage[];
    tempTranscript: string;
    sourceLanguage: string;
    targetLanguage: string;
    enableRealtimeTranslation: boolean;
    aiSuggestions: string[];
    constructor();
    display(): void;
    hidden(): void;
    displayHistory(): void;
    hiddenHistory(): void;
    private generateMeetingId;
    private generateMeetingTitle;
    startNewMeeting(language?: string, targetLang?: string, customTitle?: string): Promise<void>;
    endMeeting(): Promise<void>;
    autoSaveMeeting(): Promise<void>;
    startRecording(): void;
    stopRecording(): void;
    setSpeaker(speaker: string): void;
    addMessage(message: MeetingMessage): void;
    setTempTranscript(text: string): void;
    clearTempTranscript(): void;
    updateFinalMessage(messageId: string, text: string): void;
    updateLastMessage(text: string, isFinal?: boolean): void;
    updateMessageTranslation(messageId: string, translatedText: string): void;
    setSourceLanguage(lang: string): void;
    setTargetLanguage(lang: string): void;
    toggleRealtimeTranslation(): void;
    clearMessages(): void;
    setMeetingSummary(summary: string): void;
    loadMeeting(meeting: MeetingRecord): void;
}
export declare const useAIMeeting: () => AIMeetingStore;
export {};
