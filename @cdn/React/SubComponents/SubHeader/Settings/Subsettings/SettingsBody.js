import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeSettings, changeStatesMemorable, changeTheme, getSettings, getTheme, } from "@App/config/change";
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
import { Box, Divider, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography, useTheme, } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { speechLanguageMap } from "@App/voice/speech";
import { normalMermaidTheme, normalMermaidThemeMap } from "@Func/Init/allInit";
import mermaid from "mermaid";
import { mdConverter } from "@Root/js";
import kit from "@cdn-kit";
import { useTranslation } from "react-i18next";
export const settingsBodyContentBoxStyle = {
    transition: "background-color 0.4s ease, box-shadow 0.4s ease",
    position: "relative",
    padding: "5px",
    borderRadius: "3px",
    display: "flex",
    flexDirection: "column",
    mt: "10px",
    mb: "5px",
    ml: "0px",
    pl: "25px",
    willChange: "background-color, box-shadow",
    "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: 4,
        backgroundColor: "transparent",
        transition: "background-color 0.2s cubic-bezier(0.5, 0.05, 1, 0.5)",
    },
};
const settingsBodyContentBoxStyleFromTheme = (theme) => ({
    "&:hover::before": {
        backgroundColor: getTheme() === "light" ? "#840084" : "#d2d2d2",
    },
    "&:hover": {
        backgroundColor: getTheme() === "light" ? "#EAEAEA" : "#393939",
        boxShadow: "0px 4px 12px rgba(20, 15, 15, 0.1)", // 增加细微阴影增强效果
    },
});
export default observer(function SettingsBody() {
    const { t, i18n } = useTranslation();
    const theme = getTheme();
    const muiTheme = useTheme();
    const secondSettingsBodyContentBoxStyle = {
        ...settingsBodyContentBoxStyle,
        transition: "background-color 2s ease, box-shadow 0.4s ease",
        "&::before": {
            ...settingsBodyContentBoxStyle["&::before"],
            transition: "background-color 0.24s ease 0.1s",
        },
    };
    const ContentDescriptionTextStyle = {
        color: muiTheme.palette.info.contrastText ?? "#8B8A8A",
        fontSize: "0.79rem",
        fontWeight: 500,
        mb: "5px",
    };
    const [themeState, setThemeState] = React.useState(false);
    const handleOnChangeImagePrefer = (event) => {
        changeSettings({
            advanced: {
                imageSettings: {
                    ...getSettings().advanced.imageSettings,
                    modePrefer: event.target.value === "folder" ? "folder" : "vf",
                },
            },
        });
    };
    const handleOnChangeImageStyle = (event) => {
        changeSettings({
            advanced: {
                imageSettings: {
                    ...getSettings().advanced.imageSettings,
                    basicStyle: event.target.value,
                },
            },
        });
    };
    const handleOnChangeImageStorePath = (event) => {
        changeSettings({
            advanced: {
                imageSettings: {
                    ...getSettings().advanced.imageSettings,
                    imgStorePath: event.target.value,
                },
            },
        });
    };
    function handleOnChangeThemeSwitch(e, b) {
        const markdownBodyElement = document.querySelector(".markdown-body");
        if (b) {
            changeTheme("dark");
            setThemeState(e.target.checked);
            markdownBodyElement.style.cssText = "";
        }
        else {
            changeTheme("light");
            setThemeState(e.target.checked);
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
    }
    function handleOnChangeFontSize(e) {
        // console.log(getSettings().basic.fontSize)
        changeSettings({
            basic: { fontSize: e.target.value },
        });
        if (document.getElementsByClassName("fontSizeStyle")) {
            kit.removeAddedStyle("fontSizeStyle");
            kit.addStyle(`
      .markdown-body p,
      .markdown-body ol,
      .markdown-body li,
      .markdown-body div {
          font-size: ${getSettings().basic.fontSize}px;
      }
        `, "fontSizeStyle");
        }
    }
    function handleOnChangeEditorAutoWrap(e) {
        // console.log(getSettings().basic.fontSize)
        changeSettings({
            basic: { editorAutoWrap: e.target.value === 1 ? true : false },
        });
        window.editor.updateOptions({
            wordWrap: getSettings().basic.editorAutoWrap ? "on" : "off",
        });
    }
    function handleOnChangeFontFamily(e) {
        changeSettings({
            basic: { fontFamily: e.target.value === 1 ? "Times New Roman" : `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"` },
        });
    }
    function handleOnChangeLanguage(e) {
        let lang = e.target.value;
        i18n.changeLanguage(e.target.value);
        document.documentElement.lang = e.target.value;
        changeStatesMemorable({ memorable: { languageChanged: true } });
        changeSettings({ basic: { language: lang } });
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
            }, children: [_jsx(Typography, { id: "settings_1_x", sx: { fontSize: "30px", fontWeight: "700" }, children: "\u57FA\u7840\u8BBE\u7F6E" }), _jsx(Divider, {}), _jsxs(Box, { id: "settings_1_1", sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, children: [_jsx(Typography, { sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Theme" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u7F16\u8F91\u5668\u7684\u4E3B\u9898" }), _jsx(SwitchTheme, { checked: themeState, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeThemeSwitch })] }), _jsxs(Box, { id: "settings_1_2", sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, children: [_jsx(Typography, { sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Language" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u7F16\u8F91\u5668\u7684\u8BED\u8A00" }), _jsxs(Select, { value: getSettings().basic.language ?? "zh", defaultChecked: true, size: "small", color: "primary", onChange: handleOnChangeLanguage, children: [_jsx(MenuItem, { value: "zh", children: "\u4E2D\u6587" }), _jsx(MenuItem, { value: "en", children: "English" })] })] }), _jsx(SecondaryHeading, { id: "settings_1_3", content: "\u7F16\u8F91\u5668\u8BBE\u7F6E" }), _jsxs(Box, { sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, id: "settings_1_2", children: [_jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: "Font Size" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u6E32\u67D3\u540E\u6587\u5B57\u5B57\u4F53\u5927\u5C0F" }), _jsx(Select, { value: getSettings().basic.fontSize, defaultChecked: true, fullWidth: true, size: "small", onChange: handleOnChangeFontSize, children: [...Array(10).keys()].map((i) => {
                                        const size = 8 + i * 2; // 从9开始，每次增加2得到奇数
                                        return (_jsxs(MenuItem, { value: size, children: [size, " px"] }, size));
                                    }) })] }), _jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: "Font Family" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u6E32\u67D3\u540E\u6587\u5B57\u5B57\u4F53" }), _jsxs(Select, { value: getSettings().basic.fontFamily === "Times New Roman" ? 1 : 0, defaultChecked: true, fullWidth: true, size: "small", onChange: handleOnChangeFontFamily, children: [_jsx(MenuItem, { value: 0, children: "Defualt" }), _jsx(MenuItem, { value: 1, children: "Times New Roman" })] })] }), _jsxs(Box, { sx: {
                                ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                            }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: "Synchronous Scrolling" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u540C\u6B65\u6EDA\u52A8\u5DE6\u8FB9\u7F16\u8F91\u533A\u548C\u9884\u89C8\u533A\u57DF\u3002" }), _jsx(SwitchIOS, { checked: getSettings().basic.syncScroll, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeSyncScrollSwitch })] }), _jsxs(Box, { sx: {
                                ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                            }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: "Editor Auto Wrap" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u662F\u5426\u5F00\u542F\u7F16\u8F91\u5668\u81EA\u52A8\u6362\u884C" }), _jsxs(Select, { value: getSettings().basic.editorAutoWrap ? 1 : 0, defaultChecked: true, fullWidth: true, size: "small", onChange: handleOnChangeEditorAutoWrap, children: [_jsx(MenuItem, { value: 1, children: "On" }), _jsx(MenuItem, { value: 0, children: "OFF" })] })] })] }), _jsxs(Box, { id: "settings_1_4", sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, children: [_jsx(Typography, { sx: {
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
                            }) })] }), _jsx(Typography, { id: "settings_2_x", sx: { mt: "20px", fontSize: "30px", fontWeight: "700" }, children: "\u9AD8\u7EA7\u8BBE\u7F6E\uFF08\u65BD\u5DE5\u4E2D\uFF09" }), _jsx(Divider, {}), _jsxs(Box, { id: "settings_2_1", sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, children: [_jsx(Typography, { sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Export Settings" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u66F4\u6539\u5BFC\u51FA\u8BBE\u7F6E(\u65BD\u5DE5\u4E2D)" }), _jsx(SwitchIOS, { disabled: true, size: "small", inputProps: { "aria-label": "controlled" } })] }), _jsxs(Box, { sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, children: [_jsx(Typography, { id: "settings_2_2", sx: {
                                fontSize: "0.89rem",
                                fontWeight: 500,
                            }, children: "Mermaid Theme Configs" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "Mermaid\u6D41\u7A0B\u56FE\u4E3B\u9898" }), _jsx(Select, { value: getSettings().advanced.mermaidTheme ?? "default", defaultChecked: true, fullWidth: true, size: "small", 
                            // label="Theme"
                            color: "primary", onChange: handleOnChangeMermaidTheme, children: normalMermaidTheme.map((e, i) => (_jsx(MenuItem, { value: e, children: normalMermaidThemeMap[i] }, i))) })] }), _jsx(SecondaryHeading, { id: "settings_2_3", content: "\u56FE\u7247\u8BBE\u7F6E" }), _jsxs(Box, { sx: {
                        ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                    }, children: [_jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Typography, { id: "settings_2_3", sx: {
                                        fontSize: "0.89rem",
                                        fontWeight: 500,
                                    }, children: "Image Storage Mode Preference (Pasting)" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u9009\u62E9\u7C98\u8D34\u56FE\u7247\u4F18\u5148\u5B58\u50A8\u5728\u6D4F\u89C8\u5668/\u6587\u4EF6\u5939" }), _jsx(FormControl, { sx: { transition: "inherit" }, children: _jsxs(RadioGroup, { value: getSettings().advanced.imageSettings.modePrefer, onChange: handleOnChangeImagePrefer, children: [_jsx(FormControlLabel, { value: "folder", control: _jsx(Radio, { sx: {
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 22,
                                                            color: "#65C466",
                                                        },
                                                    } }), label: "\u672C\u5730\u6587\u4EF6\u5939 (Prefer In Local Folder)" }), _jsx(FormControlLabel, { value: "vf", control: _jsx(Radio, { sx: {
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 22,
                                                            color: "#65C466",
                                                        },
                                                    } }), label: "\u6D4F\u89C8\u5668 (Prefer In Browser)" })] }) })] }), _jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Typography, { id: "settings_2_4", sx: {
                                        fontSize: "0.89rem",
                                        fontWeight: 500,
                                    }, children: "Default Image Style" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u9ED8\u8BA4\u586B\u5145\u7684\u56FE\u7247\u6837\u5F0F\uFF0C\u5927\u5C0F\uFF0C\u4F4D\u7F6E\u7B49,w\u8868\u793A\u5927\u5C0F, c\u8868\u793Acenter, s\u8868\u793Ashadow" }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "basicStyle", label: "\u57FA\u672C\u6837\u5F0F", value: getSettings().advanced.imageSettings.basicStyle, onChange: handleOnChangeImageStyle })] }), _jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Typography, { id: "settings_2_5", sx: {
                                        fontSize: "0.89rem",
                                        fontWeight: 500,
                                    }, children: "Default Stored Path" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: "\u9ED8\u8BA4\u7C98\u8D34\u56FE\u7247\u4E0A\u4F20\u7684\u8DEF\u5F84\uFF0C\u5982\u8BBE\u7F6E\u4E3A\"images\"\uFF0C\u5219\u56FE\u7247\u4F1A\u4E0A\u4F20\u5230\u540D\u6839\u76EE\u5F55\u7684\u4E00\u4E2A\u4E3A\"images\"\u7684\u6587\u4EF6\u5939\u4E0B\uFF0C\u5982\u8BE5\u9879\u4E3A\u7A7A\uFF0C\u5219\u4FDD\u6301\u9ED8\u8BA4\u7684\"images\"\u6587\u4EF6\u5939" }), _jsx(TextField, { disabled: getSettings().advanced.imageSettings.modePrefer === "vf"
                                        ? true
                                        : false, fullWidth: true, margin: "none", name: "imgStorePath", label: "\u56FE\u7247\u5B58\u50A8\u8DEF\u5F84", value: getSettings().advanced.imageSettings.imgStorePath, onChange: handleOnChangeImageStorePath })] })] })] }) }));
});
const SecondaryHeading = ({ content, id }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Typography, { id: id, sx: {
                    mt: "5px",
                    fontSize: "22px",
                    fontWeight: 700,
                }, children: content }), _jsx(Divider, {})] }));
};
