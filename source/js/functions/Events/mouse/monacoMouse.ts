import { setContextMenuClickPosition } from "@App/config/change"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function monacoMouseEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  // editor.onMouseDown((e) => {
  //   // console.log(e)
  // })
  editor.onContextMenu((e) => {
    // console.log(e.event.posx)
    setContextMenuClickPosition({ posx:e.event.posx, posy: e.event.posy })
  })
}
