import save, { isSaved } from "@App/save"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import exeTableAction from "./actions/table"
import myPrint from "@App/export/myPrint"
import exportAsImage from "@App/export/domToImg"
import kit from "@cdn-kit"
import exeInsertPageBreakerAction from "./actions/pageBreaker"
import exeLatexBlockAction from "./actions/latexBlock"
import exeEmojiPickerAction from "./actions/emojiPicker"
import exeSpeechPanelAction from "./actions/speechPanel"
import exeSyncScrollAction from "./actions/syncScroll"
import exeFileManagerAction from "./actions/fileManager"
import exeBoldAction from "./actions/markdownTextFastKey/bold"
import exeAlignRightAction from "./actions/markdownTextFastKey/right"
import exeAlignCenterAction from "./actions/markdownTextFastKey/center"
import exeItalicsAction from "./actions/markdownTextFastKey/italics"
import exeUnderlineAction from "./actions/markdownTextFastKey/underline"
import exeDeleteLinection from "./actions/markdownTextFastKey/delete"
import exeHeadingAction from "./actions/markdownTextFastKey/headings"

export default function monacoKeyEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  // // 假设你已经有了 Monaco Editor 实例的引用，名为 editor
  // const actions = window.editor.getActions()

  // actions.forEach((action) => {
  //   // 对每个动作移除其快捷键绑定
  //   console.log(action);
  //   // editor._standaloneKeybindingService.addDynamicKeybinding("-" + action.id)
  // })

  const keyMap = {
    save: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    quotation: monaco.KeyMod.Shift | monaco.KeyCode.Quote,
    format: monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    pageBreaker:
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Enter,
    latexBlock: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM,
    voice2Words:
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyV,
    syncScroll: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyQ,
    fileManager:
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    markdownTextEditFastKey: {
      bold: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB,
      italics: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI,
      underline: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU,
      alignCenter: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE,
      alignRight: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
      deleteLine: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote,
      h1: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit1,
      h2: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit2,
      h3: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit3,
      h4: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit4,
    },
  }
  /**
   * @description quotation
   */
  // editor.addAction({
  //   id: "fsKey4",
  //   label: "fsKey4",
  //   keybindings: [],
  //   run: () => {
  //     insertQuotationInMonaco()
  //   },
  // })
  editor.addAction({
    id: "show.emojiPicker",
    label: "打开表情包超市 🤪",
    keybindings: [],
    contextMenuGroupId: "navigation",
    contextMenuOrder: -100,
    run: () => {
      exeEmojiPickerAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.tableAny",
    label: "插入任意行和列,格式: table#x#x",
    keybindings: [],
    run: () => {
      exeTableAction()
    },
  })

  editor.addAction({
    id: "reload-no-cache",
    label: "强制刷新Markdown在线",
    keybindings: [],
    run: () => {
      //@ts-ignore
      window.location.reload(true)
    },
  })
  editor.addAction({
    id: "export.asPDF",
    label: "保存并导出为PDF",
    keybindings: [],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 0,
    run: async () => {
      if (await isSaved()) {
        myPrint()
      } else {
        save()
        kit.sleep(800).then(() => {
          myPrint()
        })
      }
    },
  })
  editor.addAction({
    id: "export.asImg",
    label: "作为PNG格式的图片导出",
    keybindings: [],
    run: () => {
      exportAsImage()
    },
  })
  editor.addAction({
    id: "insert.pageBreaker",
    label: "插入一个分页符",
    keybindings: [],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 0,
    run: () => {
      exeInsertPageBreakerAction()
    },
  })
  editor.addAction({
    id: "insert.latexBlock",
    label: "插入一个LaTex语法块",
    keybindings: [keyMap.latexBlock],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 0,
    run: () => {
      exeLatexBlockAction(editor, monaco)
    },
  })

  editor.addAction({
    id: "insert.voice2words",
    label: "语音转文字...嘟...喂...听得见吗....",
    keybindings: [keyMap.voice2Words],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1,
    run: () => {
      exeSpeechPanelAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "command.syncScroll",
    label: "同步滚动 (开启/关闭)",
    keybindings: [keyMap.syncScroll],
    contextMenuGroupId: "navigation",
    run: () => {
      exeSyncScrollAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "command.fileManagerState",
    label: "文件管理器 (开启/关闭)",
    keybindings: [keyMap.fileManager],
    contextMenuGroupId: "navigation",
    run: () => {
      exeFileManagerAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.bold",
    label: "加粗文本",
    keybindings: [keyMap.markdownTextEditFastKey.bold],
    contextMenuGroupId: "navigation",
    run: () => {
      exeBoldAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.alignRight",
    label: "文本居右",
    keybindings: [keyMap.markdownTextEditFastKey.alignRight],
    contextMenuGroupId: "navigation",
    run: () => {
      exeAlignRightAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.alignCenter",
    label: "文本居中",
    keybindings: [keyMap.markdownTextEditFastKey.alignCenter],
    contextMenuGroupId: "navigation",
    run: () => {
      exeAlignCenterAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.italics",
    label: "斜体",
    keybindings: [keyMap.markdownTextEditFastKey.italics],
    run: () => {
      exeItalicsAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.underline",
    label: "下划线",
    keybindings: [keyMap.markdownTextEditFastKey.underline],
    run: () => {
      exeUnderlineAction(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.deleteLine",
    label: "删除线",
    keybindings: [keyMap.markdownTextEditFastKey.deleteLine],
    run: () => {
      exeDeleteLinection(editor, monaco)
    },
  })
  editor.addAction({
    id: "insert.h1",
    label: "标题1",
    keybindings: [keyMap.markdownTextEditFastKey.h1],
    run: () => {
      exeHeadingAction(editor,monaco,1)
    },
  })
  editor.addAction({
    id: "insert.h2",
    label: "标题2",
    keybindings: [keyMap.markdownTextEditFastKey.h2],
    run: () => {
      exeHeadingAction(editor,monaco,2)
    },
  })
  editor.addAction({
    id: "insert.h3",
    label: "标题3",
    keybindings: [keyMap.markdownTextEditFastKey.h3],
    run: () => {
      exeHeadingAction(editor,monaco,3)
    },
  })
  editor.addAction({
    id: "insert.h4",
    label: "标题4",
    keybindings: [keyMap.markdownTextEditFastKey.h4],
    run: () => {
      exeHeadingAction(editor,monaco,4)
    },
  })
  editor.addAction({
    id: "reload",
    label: "重新加载窗口(Reload Window)",
    keybindings: [],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 100,
    run: () => {
      window.location.reload()
    },
  })
}
