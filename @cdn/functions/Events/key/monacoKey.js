import save, { isSaved } from "@App/save";
import { insertQuotationInMonaco } from "@App/text/insertTextAtCursor";
import exeTableAction from "./actions/table";
import myPrint from "@App/export/myPrint";
import exportAsImage from "@App/export/domToImg";
import kit from "@cdn-kit";
import exeInsertPageBreakerAction from "./actions/pageBreaker";
import exeLatexBlockAction from "./actions/latexBlock";
import exeEmojiPickerAction from "./actions/emojiPicker";
import exeSpeechPanelAction from "./actions/speechPanel";
import exeSyncScrollAction from "./actions/syncScroll";
export default function monacoKeyEvent(editor, monaco) {
    const keyMap = {
        save: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        left: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
        right: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
        quotation: monaco.KeyMod.Shift | monaco.KeyCode.Quote,
        format: monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
        pageBreaker: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Enter,
        latexBlock: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM,
        voice2Words: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyV,
        syncScroll: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyQ,
    };
    editor.addAction({
        id: "fsKey2",
        label: "fsKey2",
        keybindings: [],
        run: (e) => {
            editor.getAction("editor.action.formatDocument").run(); //格式化
        },
    });
    editor.addAction({
        id: "fsKey3",
        label: "fsKey3",
        // precondition: 'isChrome == true',
        keybindings: [keyMap.left],
        // contextMenuGroupId: "navigation",
        // contextMenuOrder: 1.5,
        run: () => {
            // ctrl_R()
        },
    });
    /**
     * @description quotation
     */
    editor.addAction({
        id: "fsKey4",
        label: "fsKey4",
        keybindings: [],
        run: () => {
            insertQuotationInMonaco();
        },
    });
    editor.addAction({
        id: "table-any",
        label: "table#x#x",
        keybindings: [],
        run: () => {
            exeTableAction();
        },
    });
    editor.addAction({
        id: "reload",
        label: "Reload Markdown Online View+",
        keybindings: [],
        contextMenuGroupId: "navigation",
        // contextMenuOrder: 1,
        run: () => {
            window.location.reload();
        },
    });
    editor.addAction({
        id: "reload-no-cache",
        label: "Reload Markdown Online View+ (With No Cache)",
        keybindings: [],
        run: () => {
            //@ts-ignore
            window.location.reload(true);
        },
    });
    editor.addAction({
        id: "export.asPDF",
        label: "Export AS PDF",
        keybindings: [],
        contextMenuGroupId: "navigation",
        contextMenuOrder: 0,
        run: async () => {
            if (await isSaved()) {
                myPrint();
            }
            else {
                save();
                kit.sleep(800).then(() => {
                    myPrint();
                });
            }
        },
    });
    editor.addAction({
        id: "export.asImg",
        label: "Export As Image",
        keybindings: [],
        run: () => {
            exportAsImage();
        },
    });
    editor.addAction({
        id: "insert.pageBreaker",
        label: "Insert A Page Breaker",
        keybindings: [],
        contextMenuGroupId: "navigation",
        contextMenuOrder: 0,
        run: () => {
            exeInsertPageBreakerAction();
        },
    });
    editor.addAction({
        id: "insert.latexBlock",
        label: "Insert A Latex Block",
        keybindings: [keyMap.latexBlock],
        contextMenuGroupId: "navigation",
        contextMenuOrder: 0,
        run: () => {
            exeLatexBlockAction(editor, monaco);
        },
    });
    editor.addAction({
        id: "show.emojiPicker",
        label: "Show Emoji Picker 🤪",
        keybindings: [],
        contextMenuGroupId: "navigation",
        contextMenuOrder: -100,
        run: () => {
            exeEmojiPickerAction(editor, monaco);
        },
    });
    editor.addAction({
        id: "insert.voice2words",
        label: "Speech to text",
        keybindings: [keyMap.voice2Words],
        contextMenuGroupId: "navigation",
        run: () => {
            exeSpeechPanelAction(editor, monaco);
        },
    });
    editor.addAction({
        id: "command.syncScroll",
        label: "同步滚动",
        keybindings: [keyMap.syncScroll],
        contextMenuGroupId: "navigation",
        run: () => {
            exeSyncScrollAction(editor, monaco);
        },
    });
}
function ctrl_R() { }
