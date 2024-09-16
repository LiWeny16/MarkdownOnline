import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import fastKeyEvent from "@Func/Events/key/fastKey";
import MdArea from "./SubBody/MdArea";
import { observer } from "mobx-react";
import { getEmojiPickerState, getTheme } from "@App/config/change";
import { Suspense } from "react";
// 使用 React.lazy 懒加载组件
const LazyEmojiPicker = React.lazy(() => import("@Com/myCom/EmojiPicker"));
export default observer(function Body() {
    const [content, setContent] = React.useState("");
    const articleRef = React.useRef(null);
    React.useEffect(() => {
        fastKeyEvent();
    }, []);
    return (_jsx(_Fragment, { children: _jsxs("div", { style: { marginTop: "1.3vh" }, id: "bodyTopBox", children: [_jsxs("div", { id: "editor", className: `${getTheme() == "light" ? "theme-light" : "theme-dark"} FLEX ROW`, children: [_jsx(MdArea, {}), _jsx("article", { id: "view-area-hidden", className: "hidden-pre" }), _jsx("article", { ref: articleRef, id: "view-area", className: "markdown-body " +
                                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` })] }), _jsx("div", { id: "aboutBox", children: _jsx("div", { id: "markdownParser", children: _jsx("div", { id: "aboutMd", className: "aboutViewArea markdown-body " +
                                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` }) }) }), _jsx(Suspense, { fallback: _jsx(_Fragment, {}), children: _jsx(LazyEmojiPicker, { open: getEmojiPickerState() === "on" ? true : false }) })] }) }));
});
