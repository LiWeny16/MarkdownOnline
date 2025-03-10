import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

// let decorations: editor.IEditorDecorationsCollection
export default function preViewClickEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
  decorations = editor.createDecorationsCollection()
) {
  document
    .getElementById("view-area")!
    .addEventListener("dblclick", function (e) {
      // console.log(e.target)
      let clickedEle = e.target as HTMLElement | null
      let dataLineValue = 0
      if (clickedEle === this) {
        return
      }
      while (clickedEle) {
        if (clickedEle.hasAttribute("data-line")) {
          dataLineValue = parseInt(
            clickedEle.getAttribute("data-line") as string
          )
          break
        }
        clickedEle = clickedEle.parentElement // 继续查找父元素
      }
      // console.log(dataLineValue)
      if (dataLineValue) {
        editor.setPosition({ lineNumber: dataLineValue + 1, column: 1 })
        editor.revealLineInCenter(dataLineValue + 1, 1)
        decorations.clear()
        decorations.set([
          {
            range: new monaco.Range(dataLineValue + 1, 1, dataLineValue + 1, 1),
            options: {
              isWholeLine: true,
              className: "HILIGHT-MONACO",
              zIndex: 0,
            },
          },
        ])
      }
    })
}
