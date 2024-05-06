import {
  changeEmojiPickerState,
  getEmojiPickerState,
  getSettings,
} from "@App/config/change"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import {
  replaceMonacoInRange,
  replaceMonacoSelection,
} from "@App/text/replaceText"
import speechRecognition from "@App/voice/speech"
import { Message } from "@arco-design/web-react"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeSpeechPanelAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  //   const currentPosition = editor.getPosition()
  //   const selection = editor.getSelection()
  const speechLanguage = getSettings().basic.speechLanguage ?? "zh-CN"
  let speechCallBack = (textLength: any) => {
    insertTextMonacoAtCursor(window._speechData.speechResult, true)
  }
  if (window._speechData.processing) {
    /**
     * @description 停止识别
     * */
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: "语音识别已关闭，嗯你闭嘴吧，我不听...",
      closable: true,
      duration: 2000,
      position: "top",
    })
    window._speechData.processing = false
    window._speechData.speech.stopRecognition()
    window._speechData.speech = null
    window._speechData.speechResult = ""
  } else {
    /**
     * @description 开启识别
     */
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: "语音识别已开启，嗯你说，我在听...",
      closable: true,
      duration: 3000,
      position: "top",
    })
    window._speechData.processing = true
    let { recognition } = speechRecognition(
      speechLanguage,
      true,
      speechCallBack
    )
    window._speechData.speech = recognition
  }
}
