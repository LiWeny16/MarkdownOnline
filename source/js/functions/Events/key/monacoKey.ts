import save from "@App/save"
import { insertQuotationInMonaco } from "@App/text/insertTextAtCursor"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function monacoKeyEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const keyMap = {
    save: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    left: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
    right: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
    quotation: monaco.KeyMod.Shift | monaco.KeyCode.Quote,
  }
  // editor.addAction({
  //   id: 'fsKey',
  //   label: 'fsKey',
  //   // precondition: 'isChrome == true',
  //   keybindings: [keyMap.save],
  //   run: () => {
  //     // save()
  //   },
  // })
  // editor.addAction({
  //   id: 'fsKey2',
  //   label: 'fsKey2',
  //   // precondition: 'isChrome == true',
  //   keybindings: [keyMap.right],
  //   run: () => {
  //       // window.alert('chrome: cmd + R');
  //   },
  // })
  editor.addAction({
    id: "fsKey3",
    label: "fsKey3",
    // precondition: 'isChrome == true',
    keybindings: [keyMap.left],
    run: () => {
      ctrl_R()
    },
  })
  editor.addAction({
    id: "fsKey4",
    label: "fsKey4",
    keybindings: [keyMap.quotation],
    run: () => {
      insertQuotationInMonaco()
      // editor.getAction('editor.action.selectToBracket')!.run() //格式化代码
    },
  })
}

function ctrl_R() {}
