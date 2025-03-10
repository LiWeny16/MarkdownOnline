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
    changeStates({
      unmemorable: {
        selectEndPos: {
          posx: window.innerWidth / 4,
          posy: window.innerHeight / 2.6,
        },
      },
    })
    changeStates({ unmemorable: { aiPanelState: true } })
  }
}
