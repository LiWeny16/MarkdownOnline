import { isCursorInHtmlBlock } from "@App/text/cursor";
// import { isCursorInHtmlBlock } from "./isCursorInHtmlBlock"; // 确保正确导入该函数
export default function exeItalicsAction(editor, monaco) {
    const selection = editor.getSelection();
    const model = editor.getModel();
    let selectedText = model.getValueInRange(selection);
    let newText;
    // 检查光标是否位于 HTML 块内
    const isInHtmlBlock = isCursorInHtmlBlock(model, selection.getStartPosition());
    if (isInHtmlBlock) {
        // 如果在 HTML 块内，使用 <i> 包裹斜体
        let isItalicHtml = selectedText.startsWith("<i>") && selectedText.endsWith("</i>");
        if (isItalicHtml) {
            // 如果已经是 <i> 斜体，则去掉 <i> 标签
            newText = selectedText.replace(/^<i>/, "").replace(/<\/i>$/, "");
        }
        else {
            // 否则添加 <i> 标签
            newText = `<i>${selectedText}</i>`;
        }
    }
    else {
        // Markdown 斜体
        let isItalicMarkdown = selectedText.startsWith("*") && selectedText.endsWith("*");
        if (isItalicMarkdown) {
            newText = selectedText.slice(1, -1); // 去除 *
        }
        else {
            newText = `*${selectedText}*`; // 添加 *
        }
    }
    var range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
    // 执行编辑操作
    editor.executeEdits("my-source", [
        { range: range, text: newText, forceMoveMarkers: false },
    ]);
    // 更新选区以保持选中的文本高亮显示
    if (newText !== selectedText) {
        const newSelection = new monaco.Selection(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.startColumn + newText.length);
        editor.setSelection(newSelection);
    }
}
