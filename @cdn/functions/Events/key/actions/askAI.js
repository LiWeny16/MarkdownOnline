import { changeStates, getStates, } from "@App/config/change";
export default function exeAskAI(editor, monaco) {
    if (getStates().unmemorable.aiPanelState) {
        changeStates({ unmemorable: { aiPanelState: false } });
    }
    else {
        changeStates({ unmemorable: { selectEndPos: { posx: 350, posy: 299 } } });
        changeStates({ unmemorable: { aiPanelState: true } });
    }
}
