// let decorations: editor.IEditorDecorationsCollection
export default function preViewClickEvent(editor, monaco, decorations = editor.createDecorationsCollection()) {
    document
        .getElementById("view-area")
        .addEventListener("dblclick", function (e) {
        // console.log(e.target)
        let clickedEle = e.target;
        let dataLineValue = 0;
        if (clickedEle === this) {
            return;
        }
        while (clickedEle) {
            if (clickedEle.hasAttribute("data-line")) {
                dataLineValue = parseInt(clickedEle.getAttribute("data-line"));
                break;
            }
            clickedEle = clickedEle.parentElement; // 继续查找父元素
        }
        // console.log(dataLineValue)
        if (dataLineValue) {
            window.editor.setPosition({ lineNumber: dataLineValue + 1, column: 1 });
            window.editor.revealLineInCenter(dataLineValue + 1);
            decorations.clear();
            decorations.set([
                {
                    range: new monaco.Range(dataLineValue + 1, 1, dataLineValue + 1, 1),
                    options: {
                        isWholeLine: true,
                        className: "HILIGHT-MONACO",
                        zIndex: 0,
                    },
                },
            ]);
        }
    });
}
