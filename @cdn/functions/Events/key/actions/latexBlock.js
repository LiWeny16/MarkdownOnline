import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
export default function exeLatexBlockAction(editor, monaco) {
    const position = editor.getPosition();
    if (position.column == 1) {
        insertTextMonacoAtCursor(`$$\n\n$$`, true);
        editor.setPosition({
            column: 1,
            lineNumber: position.lineNumber + 1,
        });
    }
}
