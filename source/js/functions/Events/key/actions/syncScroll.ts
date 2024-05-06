import { changeSettings, getSettings } from "@App/config/change"
import { Message } from "@arco-design/web-react"
// import { syncScrollOnce } from "@Func/Events/scroll/monacoScroll"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeSyncScrollAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  if (getSettings().basic.syncScroll) {
    /**
     * @description 关闭同步滚动
     */
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: "同步滚动已关闭 🧐 ",
      closable: true,
      duration: 2000,
      position: "top",
    })
    changeSettings({ basic: { syncScroll: false } })
  } else {
    /**
     * @description 开启同步滚动
     */
    Message.success({
      style: { position: "relative", zIndex: 1 },
      content: "同步滚动已开启 😍 ",
      closable: true,
      duration: 2000,
      position: "top",
    })
    const currentScrollTop = editor.getScrollTop()

    // 设置新的滚动位置，向下移动 offset 的量
    editor.setScrollTop(currentScrollTop + 0.3)
    editor.setScrollTop(currentScrollTop - 0.3)
    const visibleRanges = editor.getVisibleRanges()
    if (visibleRanges.length > 0) {
      const firstVisibleRange = visibleRanges[0]
      const startLine = firstVisibleRange.startLineNumber
      const viewArea = document.getElementById("view-area") as HTMLElement
      if (startLine == 1) {
        viewArea.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }

    changeSettings({ basic: { syncScroll: true } })
  }
}
