import { getSettings } from "@App/config/change";
import alertUseArco from "@App/message/alert";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import speechRecognition from "@App/voice/speech";
export default function exeSpeechPanelAction(editor, monaco) {
    const speechLanguage = getSettings().basic.speechLanguage ?? "zh-CN";
    let speechCallBack = (textLength) => {
        insertTextMonacoAtCursor(window._speechData.speechResult, true);
    };
    if (window._speechData.processing) {
        /**
         * @description 停止识别
         * */
        alertUseArco("语音识别已关闭，我不听...", 2000);
        window._speechData.processing = false;
        window._speechData.speech.stopRecognition();
        window._speechData.speech = null;
        window._speechData.speechResult = "";
    }
    else {
        /**
         * @description 开启识别
         */
        alertUseArco("语音识别已开启，嗯你说，我在听...", 3000);
        window._speechData.processing = true;
        let { recognition } = speechRecognition(speechLanguage, true, speechCallBack);
        window._speechData.speech = recognition;
    }
}
