import { changeStates, getStates, } from "@App/config/change";
export default function exeAskAI(editor, monaco) {
    if (getStates().unmemorable.aiPanelState) {
        changeStates({ unmemorable: { aiPanelState: false } });
    }
    else {
        changeStates({
            unmemorable: {
                selectEndPos: {
                    posx: window.innerWidth / 4,
                    posy: window.innerHeight / 2.6,
                },
            },
        });
        changeStates({ unmemorable: { aiPanelState: true } });
    }
}
