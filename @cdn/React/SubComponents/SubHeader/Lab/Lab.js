import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Typography, Card, Button, Divider, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getTheme } from "@App/config/change";
import ScienceIcon from "@mui/icons-material/Science";
import { deleteDB, fetchAndStoreJSON, openDB, fetchStoredJSON } from "@App/db";
import alertUseArco from "@App/message/alert";
export default function Lab(props) {
    const { t } = useTranslation();
    const theme = getTheme();
    const handleCloseAll = (e) => {
        props.onClick(e);
        props.closeAll();
    };
    // 记录每个卡片的安装状态、进度和启用状态
    const [installStatus, setInstallStatus] = useState({});
    const [progress, setProgress] = useState({});
    const [enabledStatus, setEnabledStatus] = useState({});
    // 组件加载时检查 IndexedDB
    useEffect(() => {
        cardData.forEach(async (card) => {
            const storedData = await fetchStoredJSON(card.id);
            if (storedData) {
                setInstallStatus((prev) => ({ ...prev, [card.id]: "installed" }));
                setEnabledStatus((prev) => ({ ...prev, [card.id]: true })); // 默认启用
            }
            else {
                setInstallStatus((prev) => ({ ...prev, [card.id]: "not_installed" }));
            }
        });
    }, []);
    // 统一处理点击逻辑
    const handleCardAction = (index, action) => {
        const card = cardData[index];
        if (!card)
            return;
        const { url, id } = card;
        switch (action) {
            case "install":
                startDownload(index, url, id);
                break;
            case "stop":
                stopDownload(id);
                break;
            case "uninstall":
                uninstallData(id);
                break;
            case "toggleEnable":
                toggleEnable(id);
                break;
            default:
                break;
        }
    };
    const startDownload = (index, url, id) => {
        const minimumTime = 2500; // 2 秒反悔时间
        let isCancelled = false;
        let forceCancel = false; // 判断是否是 2 秒内取消
        setInstallStatus((prev) => ({ ...prev, [id]: "downloading" }));
        setProgress((prev) => ({ ...prev, [id]: 0 }));
        const startTime = Date.now();
        fetchAndStoreJSON(url, id, (progress) => {
            if (progress >= 0) {
                setProgress((prev) => ({ ...prev, [id]: progress }));
            }
            if (progress === 100) {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < minimumTime) {
                    // 还没到 2 秒，等待剩余时间
                    setTimeout(() => {
                        if (!isCancelled) {
                            alertUseArco(t("t-lab-install-success"), 2000, { kind: "success" });
                            setInstallStatus((prev) => ({ ...prev, [id]: "installed" }));
                            setEnabledStatus((prev) => ({ ...prev, [id]: true }));
                        }
                    }, minimumTime - elapsedTime);
                }
                else {
                    // 下载已经超过 2 秒，直接进入“已安装”状态
                    if (!isCancelled) {
                        alertUseArco(t("t-lab-install-success"), 2000, { kind: "success" });
                        setInstallStatus((prev) => ({ ...prev, [id]: "installed" }));
                        setEnabledStatus((prev) => ({ ...prev, [id]: true }));
                    }
                }
            }
        });
        // 提前定义取消下载的方法，确保能在 2 秒内取消
        const cancelDownload = () => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < minimumTime) {
                forceCancel = true; // 记录是强制取消
            }
            isCancelled = true;
            stopDownload(id);
        };
        stopDownloadCallbacks[id] = cancelDownload;
    };
    const stopDownloadCallbacks = {}; // 存储取消下载的回调函数
    const stopDownload = (id) => {
        if (stopDownloadCallbacks[id]) {
            stopDownloadCallbacks[id](); // 调用 `startDownload` 里定义的 `cancelDownload`
            delete stopDownloadCallbacks[id]; // 释放内存
        }
        setInstallStatus((prev) => ({ ...prev, [id]: "not_installed" }));
        setProgress((prev) => ({ ...prev, [id]: 0 }));
    };
    // 卸载功能
    const uninstallData = async (id) => {
        const db = await openDB("cache_DB");
        deleteDB(db, "data", id);
        setInstallStatus((prev) => ({ ...prev, [id]: "not_installed" }));
    };
    // 启用/禁用切换
    const toggleEnable = (id) => {
        setEnabledStatus((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    // 卡片数据
    const cardData = [
        {
            title: t("t-lab-card-spelling-association-title"),
            description: t("t-lab-card-spelling-association-desc"),
            url: `https://${window._cdn.cdn[0]}/npm/an-array-of-english-words@2.0.0/index.json`,
            id: "spelling_data_json"
        },
        {
            title: t("t-lab-card-spelling-check-title"),
            description: t("t-lab-card-spelling-check-desc"),
            url: "https://jsonplaceholder.typicode.com/todos/2",
            id: "check_spell"
        }
    ];
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { className: "transparent-scrollbar", hideBackdrop: false, fullScreen: false, maxWidth: false, open: props.open, onClose: handleCloseAll, sx: {
                    height: "100svh",
                    width: "100svw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }, children: _jsxs(Box, { className: "transparent-scrollbar", sx: {
                        overflowX: "hidden",
                        height: "50svh",
                        width: "50svw",
                        display: "flex",
                        flexDirection: "column",
                        background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
                        padding: "24px",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        alignItems: "center",
                    }, children: [_jsx(Typography, { fontSize: 30, fontWeight: "bold", textAlign: "center", children: t("t-lab-title") }), _jsx(Divider, { sx: { width: "100%", my: 2 } }), _jsx(Box, { sx: {
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "24px",
                                width: "100%",
                            }, children: cardData.map((card, index) => {
                                const status = installStatus[card.id] || "not_installed";
                                const isEnabled = enabledStatus[card.id] ?? true;
                                return (_jsxs(Card, { sx: {
                                        width: "250px",
                                        height: "220px",
                                        borderRadius: "12px",
                                        boxShadow: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        padding: 2,
                                    }, children: [_jsxs(Box, { sx: { flex: 1 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: "bold" }, children: card.title }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: card.description })] }), _jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", gap: 1 }, children: [status === "not_installed" && (_jsx(Button, { variant: "contained", color: "primary", sx: {
                                                        flex: 1,
                                                        minWidth: "64px", // 使按钮宽度保持一致
                                                        height: "42px", // 统一按钮高度
                                                    }, onClick: () => handleCardAction(index, "install"), children: t("t-lab-button-install") })), status === "downloading" && (_jsx(Button, { variant: "contained", color: "error", sx: {
                                                        flex: 1,
                                                        display: "flex",
                                                        minWidth: "64px", // 使按钮宽度保持一致
                                                        height: "42px", // 统一按钮高度
                                                        alignItems: "center", justifyContent: "center"
                                                    }, onClick: () => handleCardAction(index, "stop"), children: _jsx(CircularProgress, { size: 20, sx: { color: "white", marginRight: 1 } }) })), status === "installed" && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: "secondary", sx: { flex: 1 }, onClick: () => handleCardAction(index, "uninstall"), children: t("t-lab-button-uninstall") }), _jsx(Button, { variant: "contained", color: isEnabled ? "success" : "warning", sx: { flex: 1 }, onClick: () => handleCardAction(index, "toggleEnable"), children: isEnabled ? t("t-lab-button-disable") : t("t-lab-button-enable") })] }))] })] }, index));
                            }) })] }) }), _jsx(ScienceIcon, {}), _jsx(Typography, { children: t("t-lab-title") })] }));
}
