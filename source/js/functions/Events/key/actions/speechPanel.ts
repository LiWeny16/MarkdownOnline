import { getSettings } from "@App/config/change"
import alertUseArco from "@App/message/alert"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"

import speechRecognition from "@App/voice/speech"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeSpeechPanelAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const speechLanguage = getSettings().basic.speechLanguage ?? "zh-CN"
  let speechCallBack = (textLength: any) => {
    insertTextMonacoAtCursor(window._speechData.speechResult, true)
  }
  if (window._speechData.processing) {
    /**
     * @description 停止识别
     * */
    alertUseArco("语音识别已关闭，嗯你闭嘴吧，我不听...", 2000)
    window._speechData.processing = false
    window._speechData.speech.stopRecognition()
    window._speechData.speech = null
    window._speechData.speechResult = ""
  } else {
    /**
     * @description 开启识别
     */
    alertUseArco("语音识别已开启，嗯你说，我在听...", 3000)
    window._speechData.processing = true
    let { recognition } = speechRecognition(
      speechLanguage,
      true,
      speechCallBack
    )
    window._speechData.speech = recognition
  }
}
