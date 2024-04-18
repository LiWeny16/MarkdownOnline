let speechRecognition = (
  lang: string,
  startIt = true,
  callBack: Function
) => {
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
    console.log(transcript, transcript.length) // 输出结果到控制台
    // transcript = transcript.replace(/？/g, "?");
    window._speechData.speechResult = transcript
    callBack(transcript.length)
    if (recognizing === false) {
      recognition.stopRecognition()
    }
  }

  // 监听错误事件
  recognition.onerror = (event: any) => {
    console.error(event.error)
  }

  // 监听结束事件
  recognition.onend = () => {
    console.log(recognizing);
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

export default speechRecognition
