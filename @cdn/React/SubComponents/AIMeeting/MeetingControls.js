import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { observer } from "mobx-react";
import { useAIMeeting } from "@Mobx/AIMeeting";
import { Box, Button, Select, MenuItem, FormControl, InputLabel, TextField, IconButton, Tooltip, } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import speechRecognition, { speechLanguageMap } from "@App/voice/speech";
import { quickTranslate, BaiduLanguages } from "@App/ai/baidu";
import alertUseArco from "@App/message/alert";
const MeetingControls = observer(({ themeStyles }) => {
    const aiMeeting = useAIMeeting();
    const [recognitionInstance, setRecognitionInstance] = React.useState(null);
    const [meetingTitle, setMeetingTitle] = React.useState("");
    // 开始/停止录音
    const handleToggleRecording = () => {
        if (aiMeeting.isRecording) {
            // 停止录音
            if (recognitionInstance) {
                recognitionInstance.recognition.stopRecognition();
                setRecognitionInstance(null);
            }
            // 清除临时转录文本
            aiMeeting.clearTempTranscript();
            aiMeeting.stopRecording();
            alertUseArco("录音已停止", 2000);
        }
        else {
            // 开始录音
            if (!aiMeeting.currentMeeting) {
                alertUseArco("请先开始新会议", 2000);
                return;
            }
            try {
                const instance = speechRecognition(aiMeeting.sourceLanguage, true, async (length, isFinal) => {
                    const transcript = window._speechData.speechResult;
                    if (!transcript)
                        return;
                    if (isFinal) {
                        // 最终确认的文本 - 清除临时文本，添加到正式消息
                        aiMeeting.clearTempTranscript();
                        // 检查是否可以追加到最后一条消息
                        const lastMessage = aiMeeting.messages.length > 0
                            ? aiMeeting.messages[aiMeeting.messages.length - 1]
                            : null;
                        const canAppendToLast = lastMessage
                            && lastMessage.isFinal
                            && lastMessage.speaker === aiMeeting.currentSpeaker
                            && lastMessage.text.length < 130;
                        if (canAppendToLast && lastMessage) {
                            // 追加到最后一条消息
                            const updatedText = lastMessage.text + transcript;
                            aiMeeting.updateFinalMessage(lastMessage.id, updatedText);
                            // 如果需要翻译，重新翻译整个文本
                            if (aiMeeting.targetLanguage) {
                                try {
                                    const sourceLang = BaiduLanguages[aiMeeting.sourceLanguage] || "auto";
                                    const translatedText = await quickTranslate(updatedText, aiMeeting.targetLanguage, sourceLang);
                                    aiMeeting.updateMessageTranslation(lastMessage.id, translatedText);
                                }
                                catch (error) {
                                    console.error("翻译失败:", error);
                                }
                            }
                        }
                        else {
                            // 创建新消息（字符超过130或不同发言人）
                            const messageId = `msg_${Date.now()}`;
                            const newMessage = {
                                id: messageId,
                                speaker: aiMeeting.currentSpeaker,
                                text: transcript,
                                timestamp: Date.now(),
                                isFinal: true,
                                language: aiMeeting.sourceLanguage,
                            };
                            aiMeeting.addMessage(newMessage);
                            // 自动翻译（仅对最终确认的文本进行翻译）
                            if (aiMeeting.targetLanguage) {
                                try {
                                    const sourceLang = BaiduLanguages[aiMeeting.sourceLanguage] || "auto";
                                    const translatedText = await quickTranslate(transcript, aiMeeting.targetLanguage, sourceLang);
                                    aiMeeting.updateMessageTranslation(messageId, translatedText);
                                }
                                catch (error) {
                                    console.error("翻译失败:", error);
                                }
                            }
                        }
                    }
                    else {
                        // 临时文本 - 只作为预览显示在最后一条消息末尾，不翻译，不创建新消息
                        aiMeeting.setTempTranscript(transcript);
                    }
                });
                setRecognitionInstance(instance);
                aiMeeting.startRecording();
                alertUseArco("开始录音...", 2000);
            }
            catch (error) {
                console.error("启动语音识别失败:", error);
                alertUseArco("语音识别启动失败", 3000);
            }
        }
    };
    // 开始新会议
    const handleStartMeeting = async () => {
        await aiMeeting.startNewMeeting(aiMeeting.sourceLanguage, aiMeeting.targetLanguage, meetingTitle.trim() // 传入自定义标题，如果为空则使用默认标题
        );
        setMeetingTitle(""); // 清空输入框
        alertUseArco("新会议已创建，开始录音...", 2000);
        // 自动开始录音
        setTimeout(() => {
            handleToggleRecording();
        }, 300); // 延迟300ms确保会议创建完成
    };
    // 结束会议
    const handleEndMeeting = async () => {
        if (recognitionInstance) {
            recognitionInstance.recognition.stopRecognition();
            setRecognitionInstance(null);
        }
        await aiMeeting.endMeeting();
        alertUseArco("会议已结束并保存", 2000);
    };
    // 打开历史记录
    const handleOpenHistory = () => {
        aiMeeting.displayHistory();
    };
    return (_jsxs(Box, { sx: {
            p: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            background: themeStyles.background,
        }, children: [_jsx(Button, { variant: "contained", color: "primary", onClick: handleStartMeeting, disabled: !!aiMeeting.currentMeeting && !aiMeeting.currentMeeting.endTime, children: "\u65B0\u5EFA\u4F1A\u8BAE" }), _jsx(TextField, { size: "small", label: "\u4F1A\u8BAE\u540D\u79F0\uFF08\u53EF\u9009\uFF09", value: meetingTitle, onChange: (e) => setMeetingTitle(e.target.value), placeholder: "\u7559\u7A7A\u5219\u81EA\u52A8\u751F\u6210", disabled: !!aiMeeting.currentMeeting && !aiMeeting.currentMeeting.endTime, sx: { width: 200 }, onKeyPress: (e) => {
                    if (e.key === "Enter" && (!aiMeeting.currentMeeting || aiMeeting.currentMeeting.endTime)) {
                        handleStartMeeting();
                    }
                } }), _jsx(Button, { variant: "outlined", color: "secondary", onClick: handleEndMeeting, disabled: !aiMeeting.currentMeeting || !!aiMeeting.currentMeeting.endTime, children: "\u7ED3\u675F\u4F1A\u8BAE" }), _jsx(Tooltip, { title: aiMeeting.isRecording ? "停止录音" : "开始录音", children: _jsx(IconButton, { onClick: handleToggleRecording, disabled: !aiMeeting.currentMeeting || !!aiMeeting.currentMeeting.endTime, sx: {
                        bgcolor: aiMeeting.isRecording ? "error.main" : "primary.main",
                        color: "white",
                        "&:hover": {
                            bgcolor: aiMeeting.isRecording ? "error.dark" : "primary.dark",
                        },
                    }, children: aiMeeting.isRecording ? _jsx(MicIcon, {}) : _jsx(MicOffIcon, {}) }) }), _jsx(Tooltip, { title: "\u5386\u53F2\u8BB0\u5F55", children: _jsx(IconButton, { onClick: handleOpenHistory, children: _jsx(HistoryIcon, {}) }) }), _jsx(Box, { sx: { flex: 1 } }), _jsx(TextField, { size: "small", label: "\u53D1\u8A00\u4EBA", value: aiMeeting.currentSpeaker, onChange: (e) => aiMeeting.setSpeaker(e.target.value), disabled: aiMeeting.isRecording, sx: { width: 120 }, InputProps: {
                    startAdornment: _jsx(PersonIcon, { sx: { mr: 0.5, fontSize: 18 } }),
                } }), _jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "\u6E90\u8BED\u8A00" }), _jsx(Select, { value: aiMeeting.sourceLanguage, label: "\u6E90\u8BED\u8A00", onChange: (e) => aiMeeting.setSourceLanguage(e.target.value), disabled: aiMeeting.isRecording, children: speechLanguageMap.map(([code, name]) => (_jsx(MenuItem, { value: code, children: name }, code))) })] }), _jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "\u7FFB\u8BD1\u4E3A" }), _jsxs(Select, { value: aiMeeting.targetLanguage, label: "\u7FFB\u8BD1\u4E3A", onChange: (e) => aiMeeting.setTargetLanguage(e.target.value), children: [_jsx(MenuItem, { value: "zh", children: "\u4E2D\u6587" }), _jsx(MenuItem, { value: "en", children: "English" }), _jsx(MenuItem, { value: "jp", children: "\u65E5\u672C\u8A9E" }), _jsx(MenuItem, { value: "fra", children: "Fran\u00E7ais" }), _jsx(MenuItem, { value: "de", children: "Deutsch" }), _jsx(MenuItem, { value: "spa", children: "Espa\u00F1ol" }), _jsx(MenuItem, { value: "it", children: "Italiano" }), _jsx(MenuItem, { value: "kor", children: "\uD55C\uAD6D\uC5B4" }), _jsx(MenuItem, { value: "pt", children: "Portugu\u00EAs" }), _jsx(MenuItem, { value: "ru", children: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }), _jsx(MenuItem, { value: "th", children: "\u0E44\u0E17\u0E22" }), _jsx(MenuItem, { value: "ara", children: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" })] })] })] }));
});
export default MeetingControls;
