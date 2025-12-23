import { getSettings } from "@App/config/change"
import alertUseArco from "@App/message/alert"
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"

import speechRecognition from "@App/voice/speech"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

// 存储上一次插入的文本，避免重复插入（模块级变量，在多次调用间保持状态）
let lastInsertedText = ""

// 初始化 window._speechData
if (!window._speechData) {
  window._speechData = {
    processing: false,
    speechResult: "",
    isFinal: false,
    speech: null
  }
}

export default function exeSpeechPanelAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const speechLanguage = getSettings().basic.speechLanguage ?? "zh-CN"
  
  const speechCallBack = (textLength: any, isFinal: boolean) => {
    const transcript = window._speechData.speechResult
    
    // 只在最终确认时才插入文本，避免中间态重复插入
    if (isFinal && transcript && transcript !== lastInsertedText) {
      insertTextMonacoAtCursor(transcript, true)
      lastInsertedText = transcript // 记录已插入的文本
      console.log("✅ 插入最终识别结果:", transcript)
    } else if (!isFinal) {
      // 临时结果只打印日志，不插入
      console.log("⏳ 临时识别结果:", transcript)
    }
  }
  
  if (window._speechData.processing) {
    /**
     * @description 停止识别
     * */
    alertUseArco("语音识别已关闭，我不听...", 2000)
    window._speechData.processing = false
    window._speechData.speech.stopRecognition()
    window._speechData.speech = null
    window._speechData.speechResult = ""
    lastInsertedText = "" // 重置记录
  } else {
    /**
     * @description 开启识别
     */
    alertUseArco("语音识别已开启，嗯你说，我在听...", 3000)
    window._speechData.processing = true
    lastInsertedText = "" // 重置记录
    let { recognition } = speechRecognition(
      speechLanguage,
      true,
      speechCallBack
    )
    window._speechData.speech = recognition
  }
}