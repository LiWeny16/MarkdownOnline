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

