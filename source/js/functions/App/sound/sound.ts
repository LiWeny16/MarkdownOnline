export default (lang: string, startIt?: any) => {
  // 创建语音识别对象
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition()
  let recognizing: Boolean = false
  recognition.lang = lang
  // 设置参数
  recognition.continuous = true // 设置为持续识别模式
  recognition.interimResults = true

  // 开始语音识别
  if (startIt) {
    recognition.start()
  }
  recognition.onstart = () => {
    recognizing = true
  }
  // 监听识别结果
  recognition.onresult = (event: any) => {
    const transcript = event.results[event.results.length - 1][0].transcript
    console.log(transcript) // 输出结果到控制台

    // 如果识别到的文本包含"停止"，则停止语音识别
    if (transcript.includes("停止")) {
      recognition.stop()
    }
  }

  // 监听错误事件
  recognition.onerror = (event: any) => {
    console.error(event.error)
  }

  // 监听结束事件
  recognition.onend = () => {
    // 重新开始语音识别
    recognition.start()
  }
  return recognition
}
