// import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export default function exeUnderlineAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const selection = editor.getSelection()!;
  const model = editor.getModel()!;
  let selectedText = model.getValueInRange(selection);
  let newText;
  let isUnderline = selectedText.startsWith("<u>") && selectedText.endsWith("</u>");

  if (isUnderline) {
    // 如果已经加粗，则去除加粗
    newText = selectedText.slice(3, -4);
  } else {
    // 如果未加粗，则添加加粗
    newText = `<u>${selectedText}</u>`;
  }

  var range = new monaco.Range(
    selection.startLineNumber,
    selection.startColumn,
    selection.endLineNumber,
    selection.endColumn
  );

  // 执行编辑操作
  editor.executeEdits("my-source", [
    { range: range, text: newText, forceMoveMarkers: false },
  ]);

  // 如果我们改变了文本，更新选择区域以保持选中的文本高亮显示
  if (newText !== selectedText) {
    const newSelection = new monaco.Selection(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.startColumn + newText.length // 注意保持endColumn更新正确
    );
    editor.setSelection(newSelection);
  }
}