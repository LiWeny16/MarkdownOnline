import { isCursorInHtmlBlock } from "@App/text/cursor";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

export default function exeBoldAction(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  const selection = editor.getSelection();
  if (!selection) return;

  const model = editor.getModel();
  if (!model) return;

  let selectedText = model.getValueInRange(selection);
  let trimmedText = selectedText.trim();
  let newText;

  // 获取光标位置
  const position = selection.getStartPosition();

  // 判断是否在 HTML 块级标签内
  const isInHtmlTag = isCursorInHtmlBlock(model, position);

  if (isInHtmlTag) {
    // 如果在 HTML 块内，使用 <b></b> 进行加粗
    const isBoldHtml = trimmedText.startsWith("<b>") && trimmedText.endsWith("</b>");
    newText = isBoldHtml ? trimmedText.slice(3, -4) : `<b>${trimmedText}</b>`;
  } else {
    // 否则使用 Markdown ** 进行加粗
    const isFullyBold = trimmedText.startsWith("**") && trimmedText.endsWith("**");
    newText = isFullyBold ? trimmedText.slice(2, -2) : `**${trimmedText}**`;
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

  // 更新选中区域，确保加粗或去掉加粗后依然保持文本高亮
  const newSelection = new monaco.Selection(
    selection.startLineNumber,
    selection.startColumn,
    selection.startLineNumber,
    selection.startColumn + newText.length
  );
  editor.setSelection(newSelection);
}
