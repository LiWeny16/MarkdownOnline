import getSelectionText, { selectionIsNull } from "./getSelection";
/**
 * @description 插入文本
 */
export default function insertTextAtCursor(textElement, textToInsert) {
    const startPos = textElement.selectionStart;
    const endPos = textElement.selectionEnd;
    textElement.value =
        textElement.value.substring(0, startPos) +
            textToInsert +
            textElement.value.substring(endPos);
    textElement.selectionStart = startPos + textToInsert.length;
    textElement.selectionEnd = startPos + textToInsert.length;
    textElement.focus();
}
export function insertTextMonacoAtCursor(textToInsert, forceMove, editor = window.editor, monaco = window.monaco) {
    const _editor = window.editor;
    const newText = textToInsert;
    // const position = window.editor.getPosition()
    const selection = window.editor.getSelections()[0];
    _editor.executeEdits("img-insert", [
        {
            range: new window.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
            text: newText,
            forceMoveMarkers: forceMove,
        },
    ]);
}
export function insertQuotationInMonaco(editor = window.editor) {
    const _editor = editor ?? window.editor;
    const selection = _editor.getSelection();
    if (!selectionIsNull() && !getSelectionText(editor)[0].match(/["']/)) {
        _editor.executeEdits("my-insert-quotation-double", [
            {
                range: new window.monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
                text: `"`,
                forceMoveMarkers: false,
            },
            {
                range: new window.monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
                text: `"`,
                forceMoveMarkers: false,
            },
        ]);
        let nextSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn + 1,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 1,
        };
        _editor.setSelection(nextSelection);
    }
    else if (selectionIsNull()) {
        _editor.executeEdits("my-insert-quotation-single", [
            {
                range: new window.monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
                text: `"`,
                forceMoveMarkers: true,
            },
        ]);
    }
    else {
        _editor.executeEdits("my-insert-quotation-single2", [
            {
                range: new window.monaco.Range(selection.startLineNumber, selection.startColumn + 1, selection.startLineNumber, selection.startColumn),
                text: `"`,
                forceMoveMarkers: true,
            },
        ]);
    }
}
