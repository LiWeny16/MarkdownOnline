import alertUseArco from "@App/message/alert"

let speechRecognition = (lang: string, startIt = true, callBack: Function) => {
  // 创建语音识别对象
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition()
  let recognizing: Boolean = false
  recognition.lang = lang
  // 设置参数
  recognition.continuous = true // 设置为持续识别模式
  recognition.interimResults = false

  // 开始语音识别
  if (startIt) {
    recognition.start()
  }
  recognition.onstart = () => {
    recognizing = true // 修改 recognizing 的值
  }
  // 监听识别结果
  recognition.onresult = (event: any) => {
    let transcript = event.results[event.results.length - 1][0].transcript
    // console.log(transcript, transcript.length) // 输出结果到控制台
    transcript = transcript.replace(/ /g, "")
    window._speechData.speechResult = transcript
    callBack(transcript.length)
    if (recognizing === false) {
      recognition.stopRecognition()
    }
  }

  // 监听错误事件
  recognition.onerror = function (event: any) {
    if (event.error == "not-allowed") {
      alertUseArco("语音权限被拒绝，世界，拒绝了我...", 4500)
    } else {
      console.log("语音识别错误:", event.error)
    }
  }

  // 监听结束事件
  recognition.onend = () => {
    console.log(recognizing)
    // 如果未主动停止语音识别，则重新开始语音识别
    if (recognizing) {
      recognition.start()
    }
  }

  // 添加主动结束方法
  recognition.stopRecognition = () => {
    recognition.stop()
    recognizing = false // 修改 recognizing 的值
  }

  return { recognition, recognizing: recognizing }
}

const speechLanguageMap = [
  ["zh-CN", "普通话"],
  ["en-US", "English"],
  ["ja-JP", "日本語"],
  ["fr-ch", "法语（瑞士）"],
  ["ko", "韩语"],
]
export { speechLanguageMap }
export default speechRecognition
