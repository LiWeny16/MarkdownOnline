import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeSettings, changeTheme, getSettings, getTheme, } from "@App/config/change";
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
import { Box, Divider, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { speechLanguageMap } from "@App/voice/speech";
export default observer(function SettingsBody() {
    const theme = getTheme();
    const settingsBodyContentBoxStyle = {
        transition: "0.3s",
        position: "relative", // 添加相对定位
        padding: "5px",
        borderRadius: "3px",
        display: "flex",
        flexDirection: "column",
        mt: "10px",
        mb: "5px",
        ml: "0px",
        pl: "25px",
        "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: 4, // 左边框的宽度
            backgroundColor: "transparent",
            transition: "background-color 0.3s", // 添加过渡效果
        },
        "&:hover::before": {
            backgroundColor: theme === "light" ? "#840084" : "#d2d2d2", // 悬停时左边框的颜色
        },
        "&:hover": {
            backgroundColor: theme === "light" ? "#E7E6E5" : "",
            // borderLeft:"solid"
        },
    };
    const ContentDescriptionTextStyle = {
        color: "#8B8A8A",
        fontSize: "0.79rem",
        fontWeight: 500,
        mb: "5px",
    };
    const [themeState, setThemeState] = React.useState(false);
    function handleOnChangeThemeSwitch(e, b) {
        const markdownBodyElement = document.querySelector(".markdown-body");
        const lightObject = {
            "color-scheme": "light",
            "--color-prettylights-syntax-comment": "#6e7781",
            "--color-prettylights-syntax-constant": "#0550ae",
            "--color-prettylights-syntax-entity": "#8250df",
            "--color-prettylights-syntax-storage-modifier-import": "#24292f",
            "--color-prettylights-syntax-entity-tag": "#116329",
            "--color-prettylights-syntax-keyword": "#cf222e",
            "--color-prettylights-syntax-string": "#0a3069",
            "--color-prettylights-syntax-variable": "#953800",
            "--color-prettylights-syntax-brackethighlighter-unmatched": "#82071e",
            "--color-prettylights-syntax-invalid-illegal-text": "#f6f8fa",
            "--color-prettylights-syntax-invalid-illegal-bg": "#82071e",
            "--color-prettylights-syntax-carriage-return-text": "#f6f8fa",
            "--color-prettylights-syntax-carriage-return-bg": "#cf222e",
            "--color-prettylights-syntax-string-regexp": "#116329",
            "--color-prettylights-syntax-markup-list": "#3b2300",
            "--color-prettylights-syntax-markup-heading": "#0550ae",
            "--color-prettylights-syntax-markup-italic": "#24292f",
            "--color-prettylights-syntax-markup-bold": "#24292f",
            "--color-prettylights-syntax-markup-deleted-text": "#82071e",
            "--color-prettylights-syntax-markup-deleted-bg": "#FFEBE9",
            "--color-prettylights-syntax-markup-inserted-text": "#116329",
            "--color-prettylights-syntax-markup-inserted-bg": "#dafbe1",
            "--color-prettylights-syntax-markup-changed-text": "#953800",
            "--color-prettylights-syntax-markup-changed-bg": "#ffd8b5",
            "--color-prettylights-syntax-markup-ignored-text": "#eaeef2",
            "--color-prettylights-syntax-markup-ignored-bg": "#0550ae",
            "--color-prettylights-syntax-meta-diff-range": "#8250df",
            "--color-prettylights-syntax-brackethighlighter-angle": "#57606a",
            "--color-prettylights-syntax-sublimelinter-gutter-mark": "#8c959f",
            "--color-prettylights-syntax-constant-other-reference-link": "#0a3069",
            "--color-fg-default": "#24292f",
            "--color-fg-muted": "#57606a",
            "--color-fg-subtle": "#6e7781",
            "--color-canvas-default": "#ffffff",
            "--color-canvas-subtle": "#f6f8fa",
            "--color-border-default": "#d0d7de",
            "--color-border-muted": "hsla(210, 18%, 87%, 1)",
            "--color-neutral-muted": "rgba(175, 184, 193, 0.2)",
            "--color-accent-fg": "#0969da",
            "--color-accent-emphasis": "#0969da",
            "--color-attention-subtle": "#fff8c5",
            "--color-danger-fg": "#cf222e",
        };
        const darkObject = {
            "color-scheme": "dark",
            "color-prettylights-syntax-comment": "#8b949e",
            "color-prettylights-syntax-constant": "#79c0ff",
            "color-prettylights-syntax-entity": "#d2a8ff",
            "color-prettylights-syntax-storage-modifier-import": "#c9d1d9",
            "color-prettylights-syntax-entity-tag": "#7ee787",
            "color-prettylights-syntax-keyword": "#ff7b72",
            "color-prettylights-syntax-string": "#a5d6ff",
            "color-prettylights-syntax-variable": "#ffa657",
            "color-prettylights-syntax-brackethighlighter-unmatched": "#f85149",
            "color-prettylights-syntax-invalid-illegal-text": "#f0f6fc",
            "color-prettylights-syntax-invalid-illegal-bg": "#8e1519",
            "color-prettylights-syntax-carriage-return-text": "#f0f6fc",
            "color-prettylights-syntax-carriage-return-bg": "#b62324",
            "color-prettylights-syntax-string-regexp": "#7ee787",
            "color-prettylights-syntax-markup-list": "#f2cc60",
            "color-prettylights-syntax-markup-heading": "#1f6feb",
            "color-prettylights-syntax-markup-italic": "#c9d1d9",
            "color-prettylights-syntax-markup-bold": "#c9d1d9",
            "color-prettylights-syntax-markup-deleted-text": "#ffdcd7",
            "color-prettylights-syntax-markup-deleted-bg": "#67060c",
            "color-prettylights-syntax-markup-inserted-text": "#aff5b4",
            "color-prettylights-syntax-markup-inserted-bg": "#033a16",
            "color-prettylights-syntax-markup-changed-text": "#ffdfb6",
            "color-prettylights-syntax-markup-changed-bg": "#5a1e02",
            "color-prettylights-syntax-markup-ignored-text": "#c9d1d9",
            "color-prettylights-syntax-markup-ignored-bg": "#1158c7",
            "color-prettylights-syntax-meta-diff-range": "#d2a8ff",
            "color-prettylights-syntax-brackethighlighter-angle": "#8b949e",
            "color-prettylights-syntax-sublimelinter-gutter-mark": "#484f58",
            "color-prettylights-syntax-constant-other-reference-link": "#a5d6ff",
            "color-fg-default": "#c9d1d9",
            "color-fg-muted": "#8b949e",
            "color-fg-subtle": "#484f58",
            "color-canvas-default": "#0d1117",
            "color-canvas-subtle": "#161b22",
            "color-border-default": "#30363d",
            "color-border-muted": "#21262d",
            "color-neutral-muted": "rgba(110, 118, 129, 0.4)",
            "color-accent-fg": "#58a6ff",
            "color-accent-emphasis": "#1f6feb",
            "color-attention-subtle": "rgba(187, 128, 9, 0.15)",
            "color-danger-fg": "#f85149",
        };
        if (b) {
            changeTheme("dark");
            setThemeState(e.target.checked);
            console.log(markdownBodyElement.style.cssText);
            markdownBodyElement.style.cssText = "";
            // for (let i in darkObject) {
            //   markdownBodyElement.style.setProperty(i, darkObject[i])
            // }
        }
        else {
            changeTheme("light");
            setThemeState(e.target.checked);
            console.log(markdownBodyElement.style.cssText);
            // for (let i in lightObject) {
            //   markdownBodyElement.style.setProperty(i, lightObject[i])
            // }
        }
    }
    function handleOnChangeSyncScrollSwitch(_e, b) {
        if (b) {
            // 开
            changeSettings({
                basic: { syncScroll: true },
            });
        }
        else {
            changeSettings({
                basic: { syncScroll: false },
            });
        }
    }
    function handleSpeechLanguage(e) {
        changeSettings({
            basic: { speechLanguage: e.target.value },
        });
        // console.log(getSettings().basic.speechLanguage)
    }
    /**
     * @description 初始化设置
     */
    React.useEffect(() => {
        setThemeState(getTheme() === "dark" ? true : false);
    }, [getTheme()]);
    return (_jsx(_Fragment, { children: _jsxs(Box, { className: "transparent-scrollbar", sx: {
                width: "100%",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                fontSize: "0.89rem",
                maxHight: "200px",
                overflowY: "scroll",
            }, children: [_jsx(Typography, { id: "settings_1_x", sx: { fontSize: "30px", fontWeight: "700" }, children: "\u57FA\u7840\u8BBE\u7F6E" }), _jsx(Divider, {}), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { id: "settings_1_1", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Theme" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u7F16\u8F91\u5668\u7684\u4E3B\u9898" }), _jsx(SwitchTheme, { checked: themeState, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeThemeSwitch })] }), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { id: "settings_1_2", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Synchronous Scrolling" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u540C\u6B65\u6EDA\u52A8\u5DE6\u8FB9\u7F16\u8F91\u533A\u548C\u9884\u89C8\u533A\u57DF\u3002(\u5F00\u53D1\u4E2D)" }), _jsx(SwitchIOS, { checked: getSettings().basic.syncScroll, size: "small", 
                            // value={getSettings().basic.syncScroll}
                            inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeSyncScrollSwitch })] }), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Speech To Text" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u9009\u62E9\u8BED\u97F3\u8F6C\u6587\u5B57\u7684\u8BC6\u522B\u8BED\u8A00" }), _jsxs(Select
                        // label={"语言"}
                        , { 
                            // label={"语言"}
                            value: getSettings().basic.speechLanguage ?? "zh-CN", defaultChecked: true, 
                            // value={clearOptions}
                            fullWidth: true, size: "small", onChange: handleSpeechLanguage, children: [_jsx(MenuItem, { value: speechLanguageMap["1"][0], children: speechLanguageMap["1"][1] }), _jsx(MenuItem, { value: speechLanguageMap["2"][0], children: speechLanguageMap["2"][1] }), _jsx(MenuItem, { value: speechLanguageMap["3"][0], children: speechLanguageMap["3"][1] })] })] }), _jsx(Typography, { id: "settings_1_x", sx: { mt: "20px", fontSize: "30px", fontWeight: "700" }, children: "\u9AD8\u7EA7\u8BBE\u7F6E\uFF08\u65BD\u5DE5\u4E2D\uFF09" }), _jsx(Divider, {}), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { id: "settings_1_1", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Export Settings" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u5BFC\u51FA\u8BBE\u7F6E(\u65BD\u5DE5\u4E2D)" }), _jsx(SwitchIOS, { disabled: true, 
                            // defaultValue={1}
                            // checked={getSettings().basic.syncScroll}
                            size: "small", inputProps: { "aria-label": "controlled" } })] }), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { id: "settings_1_1", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Mermaid Configs" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539Mermaid\u6D41\u7A0B\u56FE\u7684\u8BBE\u7F6E(\u65BD\u5DE5\u4E2D)" }), _jsx(SwitchIOS, { disabled: true, 
                            // defaultValue={1}
                            // checked={getSettings().basic.syncScroll}
                            size: "small", inputProps: { "aria-label": "controlled" } })] })] }) }));
});
