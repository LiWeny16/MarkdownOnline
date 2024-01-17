import save from "@App/save";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

export default function monacoKeyEvent(editor:editor.IStandaloneCodeEditor,monaco:Monaco) {
  const keyMap = {
    save:monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    left:monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
    right:monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR
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
    id: 'fsKey3',
    label: 'fsKey3',
    // precondition: 'isChrome == true',
    keybindings: [keyMap.left],
    run: () => {
      ctrl_R()
    },
  })
}

function ctrl_R(){
  
}