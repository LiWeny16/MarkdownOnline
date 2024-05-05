import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
// import fastKeyEvent from "@Root/js/functions/fastKey"
import { enObj } from "@Root/js/index";
import fastKeyEvent from "@Func/Events/key/fastKey";
import MdArea from "./SubBody/MdArea";
import { observer } from "mobx-react";
// import { useImage } from "@Root/js/React/Mobx/Image.ts"
// import { useTheme } from "@Root/js/React/Mobx/Theme"
import EmojiPicker from "@Com/myCom/EmojiPicker";
import { getEmojiPickerState, getTheme } from "@App/config/change";
function enEvents(doIt) {
    if (doIt) {
        enObj.enFastKey ? fastKeyEvent() : undefined;
    }
}
export default observer(function Body() {
    React.useEffect(() => {
        enEvents(true);
    }, []);
    return (_jsx(_Fragment, { children: _jsxs("div", { style: { marginTop: "1.3vh" }, id: "bodyTopBox", children: [_jsxs("div", { id: "editor", className: `${getTheme() == "light" ? "theme-light" : "theme-dark"} FLEX ROW`, children: [_jsx(MdArea, {}), _jsx("article", { id: "view-area-hidden", className: "hidden-pre" }), _jsx("article", { id: "view-area", className: "markdown-body " +
                                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` })] }), _jsx("div", { id: "aboutBox", children: _jsx("div", { id: "markdownParser", children: _jsx("div", { id: "aboutMd", className: "aboutViewArea markdown-body", children: _jsx("span", {}) }) }) }), _jsx(EmojiPicker, { open: getEmojiPickerState() === "on" ? true : false })] }) }));
});
