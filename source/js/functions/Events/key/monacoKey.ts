import save, { isSaved } from "@App/save"
import { insertQuotationInMonaco } from "@App/text/insertTextAtCursor"
import getCommandPaletteText from "@App/text/palette"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import exeTableAction from "./actions/table"
import myPrint from "@App/export/myPrint"
import exportAsImage from "@App/export/domToImg"
import kit from "@cdn-kit"

export default function monacoKeyEvent(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const keyMap = {
    save: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    left: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
    right: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
    quotation: monaco.KeyMod.Shift | monaco.KeyCode.Quote,
    format: monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
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
  editor.addAction({
    id: "fsKey2",
    label: "fsKey2",
    keybindings: [],
    run: (e) => {
      editor.getAction("editor.action.formatDocument")!.run() //格式化
    },
  })
  editor.addAction({
    id: "fsKey3",
    label: "fsKey3",
    // precondition: 'isChrome == true',
    keybindings: [keyMap.left],
    // contextMenuGroupId: "navigation",
    // contextMenuOrder: 1.5,
    run: () => {
      // ctrl_R()
    },
  })
  editor.addAction({
    id: "fsKey4",
    label: "fsKey4",
    keybindings: [keyMap.quotation],
    run: () => {
      insertQuotationInMonaco()
    },
  })
  editor.addAction({
    id: "table-any",
    label: "table#x#x",
    keybindings: [],
    run: () => {
      exeTableAction()
    },
  })
  editor.addAction({
    id: "reload",
    label: "Reload Markdown Online View+",
    keybindings: [],
    contextMenuGroupId: "navigation",
    // contextMenuOrder: 1,
    run: () => {
      window.location.reload()
    },
  })
  editor.addAction({
    id: "reload-no-cache",
    label: "Reload Markdown Online View+ (With No Cache)",
    keybindings: [],
    run: () => {
      //@ts-ignore
      window.location.reload(true)
    },
  })
  editor.addAction({
    id: "export.asPDF",
    label: "Export AS PDF",
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
    label: "Export As Image",
    keybindings: [],
    run: () => {
      exportAsImage()
    },
  })
  
}

function ctrl_R() {}
