import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Typography, Card, Button, Divider, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getTheme } from "@App/config/change";
import ScienceIcon from "@mui/icons-material/Science";
import { deleteDB, fetchAndStoreJSON, openDB, fetchStoredJSON } from "@App/db";
import alertUseArco from "@App/message/alert";

export default function Lab(props: any) {
    const { t } = useTranslation();
    const theme = getTheme();

    const handleCloseAll = (e: any) => {
        props.onClick(e);
        props.closeAll();
    };

    // 记录每个卡片的安装状态、进度和启用状态
    const [installStatus, setInstallStatus] = useState<{ [key: string]: string }>({});
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [enabledStatus, setEnabledStatus] = useState<{ [key: string]: boolean }>({});

    // 组件加载时检查 IndexedDB
    useEffect(() => {
        cardData.forEach(async (card) => {
            const storedData = await fetchStoredJSON(card.id);
            if (storedData) {
                setInstallStatus((prev) => ({ ...prev, [card.id]: "installed" }));
                setEnabledStatus((prev) => ({ ...prev, [card.id]: true })); // 默认启用
            } else {
                setInstallStatus((prev) => ({ ...prev, [card.id]: "not_installed" }));
            }
        });
    }, []);

    // 统一处理点击逻辑
    const handleCardAction = (index: number, action: string) => {
        const card = cardData[index];
        if (!card) return;

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

    const startDownload = (index: number, url: string, id: string) => {
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
                            alertUseArco("成功安装字典！", 2000, { kind: "success" })

                            setInstallStatus((prev) => ({ ...prev, [id]: "installed" }));
                            setEnabledStatus((prev) => ({ ...prev, [id]: true }));
                        }
                    }, minimumTime - elapsedTime);
                } else {
                    // 下载已经超过 2 秒，直接进入“已安装”状态
                    if (!isCancelled) {
                        alertUseArco("成功安装字典！", 2000, { kind: "success" })

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


    const stopDownloadCallbacks: { [key: string]: () => void } = {}; // 存储取消下载的回调函数

    const stopDownload = (id: string) => {
        if (stopDownloadCallbacks[id]) {
            stopDownloadCallbacks[id](); // 调用 `startDownload` 里定义的 `cancelDownload`
            delete stopDownloadCallbacks[id]; // 释放内存
        }
        setInstallStatus((prev) => ({ ...prev, [id]: "not_installed" }));
        setProgress((prev) => ({ ...prev, [id]: 0 }));
    };




    // 卸载功能
    const uninstallData = async (id: string) => {
        const db = await openDB("cache_DB");
        deleteDB(db, "data", id);
        setInstallStatus((prev) => ({ ...prev, [id]: "not_installed" }));
    };

    // 启用/禁用切换
    const toggleEnable = (id: string) => {
        setEnabledStatus((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // 卡片数据
    const cardData = [
        {
            title: "Spelling Association",
            description: "拼写补全(只支持英文),安装会在本地下载词典",
            url: `https://${window._cdn.cdn[0]}/npm/an-array-of-english-words@2.0.0/index.json`,
            id: "spelling_data_json"
        },
        {
            title: "Spelling Check",
            description: "拼写检查,经费不足,咱不用了！",
            url: "https://jsonplaceholder.typicode.com/todos/2",
            id: "check_spell"
        }
    ];

    return (
        <>
            <Dialog
                className="transparent-scrollbar"
                hideBackdrop={false}
                fullScreen={false}
                maxWidth={false}
                open={props.open}
                onClose={handleCloseAll}
                sx={{
                    height: "100svh",
                    width: "100svw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    className="transparent-scrollbar"
                    sx={{
                        overflowX: "hidden",
                        height: "50svh",
                        width: "50svw",
                        display: "flex",
                        flexDirection: "column",
                        background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
                        padding: "24px",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        alignItems: "center",
                    }}
                >
                    {/* 标题部分 */}
                    <Typography fontSize={30} fontWeight="bold" textAlign="center">
                        前端实验室
                    </Typography>
                    <Divider sx={{ width: "100%", my: 2 }} />

                    {/* 卡片区域 */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "24px",
                            width: "100%",
                        }}
                    >
                        {cardData.map((card, index) => {
                            const status = installStatus[card.id] || "not_installed";
                            const isEnabled = enabledStatus[card.id] ?? true;

                            return (
                                <Card
                                    key={index}
                                    sx={{
                                        width: "250px",
                                        height: "220px",
                                        borderRadius: "12px",
                                        boxShadow: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        padding: 2,
                                    }}
                                >
                                    {/* 文字介绍 */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {card.description}
                                        </Typography>
                                    </Box>

                                    {/* 按钮区域 */}
                                    {/* 按钮区域 */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                        {status === "not_installed" && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    flex: 1,
                                                    minWidth: "64px", // 使按钮宽度保持一致
                                                    height: "42px",   // 统一按钮高度
                                                }}
                                                onClick={() => handleCardAction(index, "install")}
                                            >
                                                安装
                                            </Button>
                                        )}

                                        {status === "downloading" && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{
                                                    flex: 1,
                                                    display: "flex",
                                                    minWidth: "64px", // 使按钮宽度保持一致
                                                    height: "42px",   // 统一按钮高度
                                                    alignItems: "center", justifyContent: "center"
                                                }}
                                                onClick={() => handleCardAction(index, "stop")}
                                            >
                                                <CircularProgress size={20} sx={{ color: "white", marginRight: 1 }} />
                                            </Button>
                                        )}

                                        {status === "installed" && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ flex: 1 }}
                                                    onClick={() => handleCardAction(index, "uninstall")}
                                                >
                                                    卸载
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color={isEnabled ? "success" : "warning"}
                                                    sx={{ flex: 1 }}
                                                    onClick={() => handleCardAction(index, "toggleEnable")}
                                                >
                                                    {isEnabled ? "禁用" : "启用"}
                                                </Button>
                                            </>
                                        )}
                                    </Box>

                                </Card>
                            );
                        })}
                    </Box>
                </Box>
            </Dialog>
            <ScienceIcon />
            <Typography>{"前端实验室"}</Typography>
        </>
    );
}
