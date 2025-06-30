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
    
    // 检查是否有图片的 HTML 数据
    const types = event.dataTransfer?.types || []
    if (types.includes('text/html')) {
      // 图片拖拽，显示复制图标
      event.dataTransfer!.dropEffect = "copy"
    } else if (types.includes('text/plain')) {
      // 纯文本拖拽，显示复制图标
      event.dataTransfer!.dropEffect = "copy"
    } else {
      event.dataTransfer!.dropEffect = "copy"
    }
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
        // 优先使用 text/html 数据（图片的 markdown 语法）
        let data = event.dataTransfer.getData("text/html")
        let isImageDrop = false
        
        if (data) {
          // 这是图片拖拽，使用 markdown 语法
          isImageDrop = true
        } else {
          // 没有 HTML 数据，检查是否有纯文本数据
          const plainData = event.dataTransfer.getData("text/plain")
          if (plainData) {
            try {
              // 尝试解析为文件移动的 JSON 数据
              const parsedData = JSON.parse(plainData)
              if (parsedData.itemId && parsedData.path) {
                // 这是文件管理器的数据，但拖拽到了编辑器
                // 对于文本文件，我们可以插入文件路径或链接
                if (parsedData.fileType === 'file') {
                  data = `./${parsedData.path}` // 插入相对路径
                } else {
                  return // 文件夹不处理
                }
              } else {
                data = plainData // 普通文本
              }
            } catch {
              data = plainData // 普通文本
            }
          }
        }

        // 获取拖拽光标位置并转换为编辑器坐标
        const editorPosition = editor.getTargetAtClientPoint(
          event.clientX,
          event.clientY
        )

        if (editorPosition && data) {
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
        console.log("Dropped data:", data, "isImageDrop:", isImageDrop)
      }
    },
    true
  )
}
