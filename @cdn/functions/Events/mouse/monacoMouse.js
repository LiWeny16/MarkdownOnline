import { setContextMenuClickPosition } from "@App/config/change";
export default function monacoMouseEvent(editor, monaco) {
    // editor.onMouseDown((e) => {
    //   // console.log(e)
    // })
    editor.onContextMenu((e) => {
        // console.log(e.event.posx)
        setContextMenuClickPosition({ posx: e.event.posx, posy: e.event.posy });
    });
}
