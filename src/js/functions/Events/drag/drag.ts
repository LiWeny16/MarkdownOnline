import { changeStates } from "@App/config/change"
import { Monaco } from "@monaco-editor/react"
import { editor as monacoEditor, Range } from "monaco-editor"

export default function monacoDragEvent(
  editor: monacoEditor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const container = editor.getContainerDomNode()
  if (!container) return

  // 添加拖拽事件监听
  container.addEventListener("dragover", (event) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = "copy" // 显示复制图标
  })

  const handleDragEnd = (e:any) => {
    e.preventDefault()
    e.stopPropagation()
    window._setIsDragging(false)
    // 重置 dropEffect 以确保拖拽状态完全清除
    e.dataTransfer!.dropEffect = "none"
  }

  window.addEventListener("dragend", handleDragEnd, true)
  container.addEventListener(
    "drop",
    (event) => {
      window._setIsDragging(false)

      if (event.dataTransfer) {
        const data = event.dataTransfer.getData("text/plain")

        // 获取拖拽光标位置并转换为编辑器坐标
        const editorPosition = editor.getTargetAtClientPoint(
          event.clientX,
          event.clientY
        )

        if (editorPosition) {
          const { position } = editorPosition
          editor.executeEdits(null, [
            {
              range: new Range(
                position!.lineNumber,
                position!.column,
                position!.lineNumber,
                position!.column
              ),
              text: data,
              forceMoveMarkers: true,
            },
          ])

          editor.setPosition({
            lineNumber: position!.lineNumber,
            column: position!.column + data.length,
          })
          editor.focus()
        }

        // 清除拖拽状态
        event.dataTransfer.dropEffect = "none"
        console.log("Dropped data:", data)
      }
    },
    true
  )
}
