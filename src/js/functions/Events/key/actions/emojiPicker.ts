import { changeEmojiPickerState, getEmojiPickerState } from "@App/config/change"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeEmojiPickerAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  
  if (getEmojiPickerState() === "on") {
    changeEmojiPickerState("off")
  } else {
    changeEmojiPickerState("on")
  }
}

// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'

// function App() {
//   return (
//     <Picker data={data} onEmojiSelect={console.log} />
//   )
// }
