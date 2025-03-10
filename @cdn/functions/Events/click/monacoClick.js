export default function monacoClickEvent(editor, monaco) {
    editor.onDidFocusEditorWidget(() => {
        window._deco.clear();
    });
}
