import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeSettings, changeStatesMemorable, changeTheme, getSettings, getTheme, } from "@App/config/change";
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
import { Box, Divider, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { speechLanguageMap } from "@App/voice/speech";
import { normalMermaidTheme, normalMermaidThemeMap } from "@Func/Init/allInit";
import mermaid from "mermaid";
import { mdConverter } from "@Root/js";
import kit from "bigonion-kit";
import { useTranslation } from "react-i18next";
import alertUseArco from "@App/message/alert";
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
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
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
            kit.removeAddedStyle();
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
    /**
     * @description 重置所有数据 - 清除localStorage、cookies、indexedDB和service worker缓存
     */
    const handleResetAllData = async () => {
        try {
            // 清除localStorage
            localStorage.clear();
            // 清除sessionStorage
            sessionStorage.clear();
            // 清除所有cookies
            document.cookie.split(";").forEach((c) => {
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                if (name) {
                    // 尝试多种路径和域名清除
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
                }
            });
            // 清除indexedDB - 使用更安全的方法
            if ('indexedDB' in window) {
                try {
                    const databases = await indexedDB.databases();
                    // 首先尝试关闭所有数据库连接
                    for (const dbInfo of databases) {
                        if (dbInfo.name) {
                            try {
                                // 先尝试打开然后立即关闭，强制断开连接
                                const openReq = indexedDB.open(dbInfo.name);
                                openReq.onsuccess = () => {
                                    openReq.result.close();
                                };
                            }
                            catch (e) {
                                console.log(`无法关闭数据库 ${dbInfo.name}:`, e);
                            }
                        }
                    }
                    // 等待一下让连接关闭
                    await new Promise(resolve => setTimeout(resolve, 100));
                    // 然后删除数据库
                    for (const dbInfo of databases) {
                        if (dbInfo.name) {
                            try {
                                await new Promise((resolve, reject) => {
                                    const deleteReq = indexedDB.deleteDatabase(dbInfo.name);
                                    let resolved = false;
                                    const timeout = setTimeout(() => {
                                        if (!resolved) {
                                            resolved = true;
                                            console.warn(`删除数据库 ${dbInfo.name} 超时，但继续处理`);
                                            resolve();
                                        }
                                    }, 3000); // 3秒超时
                                    deleteReq.onsuccess = () => {
                                        if (!resolved) {
                                            resolved = true;
                                            clearTimeout(timeout);
                                            console.log(`成功删除数据库: ${dbInfo.name}`);
                                            resolve();
                                        }
                                    };
                                    deleteReq.onerror = () => {
                                        if (!resolved) {
                                            resolved = true;
                                            clearTimeout(timeout);
                                            console.warn(`删除数据库 ${dbInfo.name} 失败，但继续处理:`, deleteReq.error);
                                            resolve(); // 继续而不是失败
                                        }
                                    };
                                    deleteReq.onblocked = () => {
                                        console.warn(`数据库 ${dbInfo.name} 删除被阻塞，将在页面刷新后清除`);
                                        if (!resolved) {
                                            resolved = true;
                                            clearTimeout(timeout);
                                            resolve(); // 继续而不是失败
                                        }
                                    };
                                });
                            }
                            catch (e) {
                                console.warn(`删除数据库 ${dbInfo.name} 时出错:`, e);
                                // 继续处理其他数据库
                            }
                        }
                    }
                }
                catch (e) {
                    console.warn('清除IndexedDB时出错，但继续处理其他数据:', e);
                }
            }
            // 清除service worker缓存
            if ('serviceWorker' in navigator && 'caches' in window) {
                try {
                    const cacheNames = await caches.keys();
                    await Promise.allSettled(cacheNames.map(cacheName => caches.delete(cacheName)));
                    // 注销所有service workers
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    await Promise.allSettled(registrations.map(registration => registration.unregister()));
                }
                catch (e) {
                    console.warn('清除Service Worker缓存时出错:', e);
                }
            }
            alertUseArco(t("t-reset-success"), 3000, { kind: "success" });
            // 3秒后强制刷新页面
            setTimeout(() => {
                // 使用更强力的刷新方式
                window.location.href = window.location.href;
            }, 3000);
        }
        catch (error) {
            console.error('重置数据时出错:', error);
            alertUseArco(t("t-reset-warning"), 3000, { kind: "warning" });
            // 即使出错也刷新页面
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 3000);
        }
    };
    /**
     * @description 显示重置确认对话框
     */
    const showResetConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };
    /**
     * @description 确认重置操作
     */
    const handleConfirmReset = () => {
        setConfirmDialogOpen(false);
        handleResetAllData();
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Box, { className: "transparent-scrollbar", sx: {
                    width: "100%",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "0.89rem",
                    maxHight: "200px",
                    overflowY: "scroll",
                }, children: [_jsx(Typography, { id: "settings_1_x", sx: { fontSize: "30px", fontWeight: "700" }, children: t("t-basic-settings-title") }), _jsx(Divider, {}), _jsxs(Box, { id: "settings_1_1", sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsx(Typography, { sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Theme" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-theme-description") }), _jsx(SwitchTheme, { checked: themeState, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeThemeSwitch })] }), _jsxs(Box, { id: "settings_1_2", sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsx(Typography, { sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Language" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-language-description") }), _jsxs(Select, { value: getSettings().basic.language ?? "zh", defaultChecked: true, size: "small", color: "primary", onChange: handleOnChangeLanguage, children: [_jsx(MenuItem, { value: "zh", children: t("t-chinese") }), _jsx(MenuItem, { value: "en", children: t("t-english") })] })] }), _jsx(SecondaryHeading, { id: "settings_1_3", content: t("t-editor-settings-title") }), _jsxs(Box, { sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, id: "settings_1_2", children: [_jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                                fontSize: "0.89rem",
                                                fontWeight: 500,
                                            }, children: "Font Size" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-font-size-description") }), _jsx(Select, { value: getSettings().basic.fontSize, defaultChecked: true, fullWidth: true, size: "small", onChange: handleOnChangeFontSize, children: [...Array(10).keys()].map((i) => {
                                            const size = 8 + i * 2; // 从9开始，每次增加2得到奇数
                                            return (_jsxs(MenuItem, { value: size, children: [size, " px"] }, size));
                                        }) })] }), _jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                                fontSize: "0.89rem",
                                                fontWeight: 500,
                                            }, children: "Font Family" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-font-family-description") }), _jsxs(Select, { value: getSettings().basic.fontFamily === "Times New Roman" ? 1 : 0, defaultChecked: true, fullWidth: true, size: "small", onChange: handleOnChangeFontFamily, children: [_jsx(MenuItem, { value: 0, children: t("t-default") }), _jsx(MenuItem, { value: 1, children: "Times New Roman" })] })] }), _jsxs(Box, { sx: {
                                    ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                                }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                                fontSize: "0.89rem",
                                                fontWeight: 500,
                                            }, children: "Synchronous Scrolling" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-sync-scroll-description") }), _jsx(SwitchIOS, { checked: getSettings().basic.syncScroll, size: "small", inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeSyncScrollSwitch })] }), _jsxs(Box, { sx: {
                                    ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                                }, children: [_jsx(Box, { className: "FLEX ROW", children: _jsx(Typography, { sx: {
                                                fontSize: "0.89rem",
                                                fontWeight: 500,
                                            }, children: "Editor Auto Wrap" }) }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-auto-wrap-description") }), _jsxs(Select, { value: getSettings().basic.editorAutoWrap ? 1 : 0, defaultChecked: true, fullWidth: true, size: "small", onChange: handleOnChangeEditorAutoWrap, children: [_jsx(MenuItem, { value: 1, children: t("t-on") }), _jsx(MenuItem, { value: 0, children: t("t-off") })] })] })] }), _jsxs(Box, { id: "settings_1_4", sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsx(Typography, { sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Speech To Text" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-speech-language-description") }), _jsx(Select
                            // label={"语言"}
                            , { 
                                // label={"语言"}
                                value: getSettings().basic.speechLanguage ?? "zh-CN", defaultChecked: true, 
                                // value={clearOptions}
                                fullWidth: true, size: "small", onChange: handleSpeechLanguage, children: speechLanguageMap.map((e, i) => {
                                    return (_jsx(MenuItem, { value: e[0], children: e[1] }, i));
                                }) })] }), _jsx(Typography, { id: "settings_2_x", sx: { mt: "20px", fontSize: "30px", fontWeight: "700" }, children: t("t-advanced-settings-title") }), _jsx(Divider, {}), _jsxs(Box, { id: "settings_2_1", sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsx(Typography, { sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Export Settings" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-export-settings-description") }), _jsx(SwitchIOS, { disabled: true, size: "small", inputProps: { "aria-label": "controlled" } })] }), _jsxs(Box, { sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsx(Typography, { id: "settings_2_2", sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Mermaid Theme Configs" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-mermaid-theme-description") }), _jsx(Select, { value: getSettings().advanced.mermaidTheme ?? "default", defaultChecked: true, fullWidth: true, size: "small", 
                                // label="Theme"
                                color: "primary", onChange: handleOnChangeMermaidTheme, children: normalMermaidTheme.map((e, i) => (_jsx(MenuItem, { value: e, children: normalMermaidThemeMap[i] }, i))) })] }), _jsx(SecondaryHeading, { id: "settings_2_3", content: t("t-image-settings-title") }), _jsxs(Box, { sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Typography, { id: "settings_2_3", sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: t("t-image-storage-preference") }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-image-storage-description") }), _jsx(FormControl, { sx: { transition: "inherit" }, children: _jsxs(RadioGroup, { value: getSettings().advanced.imageSettings.modePrefer, onChange: handleOnChangeImagePrefer, children: [_jsx(FormControlLabel, { value: "folder", control: _jsx(Radio, { sx: {
                                                            "& .MuiSvgIcon-root": {
                                                                fontSize: 22,
                                                                color: "#65C466",
                                                            },
                                                        } }), label: t("t-image-storage-folder") }), _jsx(FormControlLabel, { value: "vf", control: _jsx(Radio, { sx: {
                                                            "& .MuiSvgIcon-root": {
                                                                fontSize: 22,
                                                                color: "#65C466",
                                                            },
                                                        } }), label: t("t-image-storage-browser") })] }) })] }), _jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Typography, { id: "settings_2_4", sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: t("t-default-image-style") }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-default-image-style-description") }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "basicStyle", label: t("t-basic-style"), value: getSettings().advanced.imageSettings.basicStyle, onChange: handleOnChangeImageStyle })] }), _jsxs(Box, { sx: { ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }, children: [_jsx(Typography, { id: "settings_2_5", sx: {
                                            fontSize: "0.89rem",
                                            fontWeight: 500,
                                        }, children: t("t-default-stored-path") }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-default-stored-path-description") }), _jsx(TextField, { disabled: getSettings().advanced.imageSettings.modePrefer === "vf"
                                            ? true
                                            : false, fullWidth: true, margin: "none", name: "imgStorePath", label: t("t-image-store-path"), value: getSettings().advanced.imageSettings.imgStorePath, onChange: handleOnChangeImageStorePath })] })] }), _jsx(SecondaryHeading, { id: "settings_2_7", content: t("t-reset-settings-title") }), _jsxs(Box, { id: "settings_2_8", sx: {
                            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
                        }, children: [_jsx(Typography, { sx: {
                                    fontSize: "0.89rem",
                                    fontWeight: 500,
                                }, children: "Reset All Data" }), _jsx(Typography, { sx: ContentDescriptionTextStyle, children: t("t-reset-data-description") }), _jsx(Button, { variant: "contained", color: "error", size: "small", onClick: showResetConfirmDialog, sx: {
                                    mt: 1,
                                    backgroundColor: "#d32f2f",
                                    "&:hover": {
                                        backgroundColor: "#b71c1c",
                                    },
                                }, children: t("t-reset-button") })] })] }), _jsxs(Dialog, { open: confirmDialogOpen, onClose: () => setConfirmDialogOpen(false), "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description", maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { id: "alert-dialog-title", children: t("t-reset-confirm-title") }), _jsxs(DialogContent, { children: [_jsx(Typography, { id: "alert-dialog-description", sx: { mb: 2 }, dangerouslySetInnerHTML: { __html: t("t-reset-confirm-description") } }), _jsx(Typography, { component: "div", sx: { ml: 2, mb: 2 }, dangerouslySetInnerHTML: { __html: t("t-reset-confirm-list") } }), _jsx(Typography, { color: "error", sx: { fontWeight: 500 }, children: t("t-reset-confirm-warning") })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setConfirmDialogOpen(false), color: "primary", children: t("t-cancel") }), _jsx(Button, { onClick: handleConfirmReset, color: "error", variant: "contained", children: t("t-confirm-reset") })] })] })] }));
});
const SecondaryHeading = ({ content, id }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Typography, { id: id, sx: {
                    mt: "5px",
                    fontSize: "22px",
                    fontWeight: 700,
                }, children: content }), _jsx(Divider, {})] }));
};
