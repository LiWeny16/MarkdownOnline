import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeSettings, changeTheme, getSettings, getTheme, } from "@App/config/change";
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
import { Box, Divider, MenuItem, Select, Typography, useTheme, } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { speechLanguageMap } from "@App/voice/speech";
import { normalMermaidTheme, normalMermaidThemeMap } from "@Func/Init/allInit";
import mermaid from "mermaid";
import { mdConverter } from "@Root/js";
export default observer(function SettingsBody() {
    const theme = getTheme();
    const muiTheme = useTheme();
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
        color: muiTheme.palette.info.contrastText ?? "#8B8A8A",
        fontSize: "0.79rem",
        fontWeight: 500,
        mb: "5px",
    };
    const [themeState, setThemeState] = React.useState(false);
    function handleOnChangeThemeSwitch(e, b) {
        const markdownBodyElement = document.querySelector(".markdown-body");
        if (b) {
            changeTheme("dark");
            setThemeState(e.target.checked);
            console.log(markdownBodyElement.style.cssText);
            markdownBodyElement.style.cssText = "";
        }
        else {
            changeTheme("light");
            setThemeState(e.target.checked);
            console.log(markdownBodyElement.style.cssText);
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
    function handleOnChangeMermaidTheme(e) {
        changeSettings({
            advanced: { mermaidTheme: e.target.value },
        });
        mermaid.init({
            theme: e.target.value,
        });
        mdConverter();
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
                            }, children: "Theme" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u7F16\u8F91\u5668\u7684\u4E3B\u9898" }), _jsx(SwitchTheme, { checked: themeState, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeThemeSwitch })] }), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { id: "settings_1_2", sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Synchronous Scrolling" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u540C\u6B65\u6EDA\u52A8\u5DE6\u8FB9\u7F16\u8F91\u533A\u548C\u9884\u89C8\u533A\u57DF\u3002(\u5F00\u53D1\u4E2D)" }), _jsx(SwitchIOS, { checked: getSettings().basic.syncScroll, size: "small", 
                            // value={getSettings().basic.syncScroll}
                            inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeSyncScrollSwitch })] }), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Speech To Text" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u9009\u62E9\u8BED\u97F3\u8F6C\u6587\u5B57\u7684\u8BC6\u522B\u8BED\u8A00" }), _jsx(Select
                        // label={"语言"}
                        , { 
                            // label={"语言"}
                            value: getSettings().basic.speechLanguage ?? "zh-CN", defaultChecked: true, 
                            // value={clearOptions}
                            fullWidth: true, size: "small", onChange: handleSpeechLanguage, children: speechLanguageMap.map((e, i) => {
                                return (_jsx(MenuItem, { value: e[0], children: e[1] }, i));
                            }) })] }), _jsx(Typography, { id: "settings_1_x", sx: { mt: "20px", fontSize: "30px", fontWeight: "700" }, children: "\u9AD8\u7EA7\u8BBE\u7F6E\uFF08\u65BD\u5DE5\u4E2D\uFF09" }), _jsx(Divider, {}), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { id: "settings_1_1", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Export Settings" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u5BFC\u51FA\u8BBE\u7F6E(\u65BD\u5DE5\u4E2D)" }), _jsx(SwitchIOS, { disabled: true, 
                            // defaultValue={1}
                            // checked={getSettings().basic.syncScroll}
                            size: "small", inputProps: { "aria-label": "controlled" } })] }), _jsxs(Box, { sx: settingsBodyContentBoxStyle, children: [_jsx(Typography, { id: "settings_1_1", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Mermaid Theme Configs" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "Mermaid\u6D41\u7A0B\u56FE\u4E3B\u9898" }), _jsx(Select, { value: getSettings().advanced.mermaidTheme ?? "default", defaultChecked: true, fullWidth: true, size: "small", 
                            // label="Theme"
                            color: "primary", onChange: handleOnChangeMermaidTheme, children: normalMermaidTheme.map((e, i) => (_jsx(MenuItem, { value: e, children: normalMermaidThemeMap[i] }, i))) })] })] }) }));
});
