import { changeStates, setContextMenuClickPosition, } from "@App/config/change";
export default function monacoMouseEvent(editor, monaco) {
    let selectionTimeout;
    let mousePosition = { posx: 50, posy: 50 };
    function onSelectionEnd(e) {
        changeStates({
            unmemorable: {
                promptPanelState: false,
                selectEndPos: mousePosition,
            },
        });
    }
    // 监听鼠标的 `mouseup` 事件来获取当前位置
    document.addEventListener("mouseup", (event) => {
        let _mousePos = { posx: event.clientX, posy: event.clientY };
        if (
        // @ts-ignore 乱报错
        !event.target.closest(".prompt-panel-content")
        // getStates().unmemorable.promptPanelState
        ) {
            mousePosition = { posx: event.clientX, posy: event.clientY };
            changeStates({
                unmemorable: {
                    mouseUpPos: mousePosition,
                },
            });
        }
    });
    editor.onDidChangeCursorSelection((event) => {
        const selection = editor.getSelection();
        // 清除之前的计时器
        clearTimeout(selectionTimeout);
        if (selection && !selection.isEmpty()) {
            // 如果有非空选区，开始一个延迟判断用户是否结束选择
            selectionTimeout = setTimeout(() => {
                onSelectionEnd(event); // 在选择结束时调用所需的函数
            }, 700); // 200ms 的延迟，可以根据需要调整
        }
    });
    editor.onContextMenu((e) => {
        setContextMenuClickPosition({ posx: e.event.posx, posy: e.event.posy });
    });
}
