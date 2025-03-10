import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import fastKeyEvent from "@Func/Events/key/fastKey";
import MdArea from "./SubBody/MdArea";
import { observer } from "mobx-react";
import { getEmojiPickerState, getSettings, getStates, getStatesMemorable, getTheme } from "@App/config/change";
import { Suspense } from "react";
import WelcomeAnimation from "../Components/myCom/Prompt/WelcomeAni";
// 使用 React.lazy 懒加载组件
const LazyEmojiPicker = React.lazy(() => import("@Root/js/React/Components/myCom/EmojiPicker"));
// const LazyPromptPanel = React.lazy(() => import("@Com/myCom/Prompt/Prompt"))
const LazyPromptAIPanel = React.lazy(() => import("@Com/myCom/Prompt/AIPanel"));
const LazyVoiceTrans = React.lazy(() => import("@Com/myCom/Prompt/VoiceTrans"));
export default observer(function Body() {
    const mdViewerRef = React.useRef(null);
    const [markdownViewerWidth, setMarkdownViewerWidth] = React.useState("100%");
    React.useEffect(() => {
        fastKeyEvent();
    }, []);
    return (_jsx(_Fragment, { children: _jsxs("div", { style: { marginTop: "1.3vh" }, id: "bodyTopBox", children: [_jsxs("div", { id: "editor", className: `${getTheme() == "light" ? "theme-light" : "theme-dark"} FLEX ROW`, children: [_jsx(MdArea, { setMarkdownViewerWidth: setMarkdownViewerWidth }), _jsx("article", { id: "view-area-hidden", className: "hidden-pre" }), _jsx("article", { ref: mdViewerRef, id: "view-area", style: {
                                fontFamily: getSettings().basic.fontFamily,
                                width: markdownViewerWidth,
                                padding: getStates().unmemorable.previewMode
                                    ? "0px 5px"
                                    : "26px 38px",
                            }, className: "markdown-body " +
                                `${getTheme() === "light" ? "markdown-body-light" : "markdown-body-dark"}` })] }), getStatesMemorable().memorable.welcomeAnimationState ? _jsx(WelcomeAnimation, {}) : _jsx(_Fragment, {}), _jsx(Suspense, { fallback: _jsx(_Fragment, {}), children: _jsx(LazyEmojiPicker, { open: getEmojiPickerState() === "on" ? true : false }) }), _jsx(Suspense, { children: _jsx(LazyPromptAIPanel, { open: getStates().unmemorable.aiPanelState }) }), _jsx(Suspense, { children: _jsx(LazyVoiceTrans, { open: getStates().unmemorable.voicePanelState }) })] }) }));
});
