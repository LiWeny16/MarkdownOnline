/**
 * @description Err Intellisense
*/
function errIntellisense() {
  window.monaco.editor.setModelMarkers(window.editor.getModel(), "owner", [
    {
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 3,
      endColumn: 3,
      message: "???", // 提示文案
      severity: window.monaco.MarkerSeverity.Error, // 提示的类型
    },
  ])
}
export default errIntellisense
