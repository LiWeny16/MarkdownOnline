import { getSettings, } from "@App/config/change";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import speechRecognition from "@App/voice/speech";
export default function exeSpeechPanelAction(editor, monaco) {
    //   const currentPosition = editor.getPosition()
    //   const selection = editor.getSelection()
    const speechLanguage = getSettings().basic.speechLanguage ?? "zh-CN";
    let speechCallBack = (textLength) => {
        insertTextMonacoAtCursor(window._speechData.speechResult, true);
    };
    if (window._speechData.processing) {
        // 停止识别
        window._speechData.processing = false;
        window._speechData.speech.stopRecognition();
        window._speechData.speech = null;
        window._speechData.speechResult = "";
    }
    else {
        window._speechData.processing = true;
        let { recognition } = speechRecognition(speechLanguage, true, speechCallBack);
        window._speechData.speech = recognition;
    }
}
