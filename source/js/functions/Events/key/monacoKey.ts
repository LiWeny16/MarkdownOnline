import save from "@App/save";

export default function monacoKeyEvent() {
  window.editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_S, function() {
    console.log('按下了 Ctrl/Cmd + S');
    // e.preventDefault()w
    save()
  });
  
}
