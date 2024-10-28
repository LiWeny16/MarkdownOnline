import bigModel from "@App/ai/ai"
import {
  changeEmojiPickerState,
  changeStates,
  getEmojiPickerState,
  getStates,
} from "@App/config/change"
import getSelectionText from "@App/text/getSelection"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeAskAI(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  if (getStates().unmemorable.aiPanelState) {
    changeStates({ unmemorable: { aiPanelState: false } })
  } else {
    changeStates({unmemorable:{selectEndPos:{posx:350,posy:299}}})
    changeStates({ unmemorable: { aiPanelState: true } })
  }
}
