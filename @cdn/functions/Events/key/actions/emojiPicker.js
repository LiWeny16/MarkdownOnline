import { changeEmojiPickerState, getEmojiPickerState } from "@App/config/change";
export default function exeEmojiPickerAction(editor, monaco) {
    if (getEmojiPickerState() === "on") {
        changeEmojiPickerState("off");
    }
    else {
        changeEmojiPickerState("on");
    }
}
