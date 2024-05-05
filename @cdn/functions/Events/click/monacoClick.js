export default function monacoClickEvent(editor, monaco) {
    editor.onDidFocusEditorWidget(() => {
        window.deco.clear();
    });
}
