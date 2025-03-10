import { changeEmojiPickerState, getEmojiPickerState } from "@App/config/change";
export default function exeEmojiPickerAction(editor, monaco) {
    if (getEmojiPickerState() === "on") {
        changeEmojiPickerState("off");
    }
    else {
        changeEmojiPickerState("on");
    }
}
// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'
// function App() {
//   return (
//     <Picker data={data} onEmojiSelect={console.log} />
//   )
// }
