import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeFileManagerState, changeSettings, getFileManagerState, getSettings, } from "@App/config/change";
import { FileFolderManager, FileManager } from "@App/fileSystem/file";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import { replaceMonacoAll } from "@App/text/replaceText";
import { mdConverter } from "@Root/js";
import { Backdrop, Box, Button, Stack, Tooltip, Typography, } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { observer } from "mobx-react";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
import alertUseArco from "@App/message/alert";
import FileExplorer from "./SubFile.tsx/FileManager";
import FolderIcon from "@mui/icons-material/Folder";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Zoom from "@mui/material/Zoom";
import ScrollableBox from "@Root/js/React/Components/myCom/Layout/ScrollBox";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PushPin as PushPinIcon, PushPinOutlined as PushPinOutlinedIcon, } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
const fileManager = new FileManager();
const folderManager = new FileFolderManager();
let _t;
const FileDrawer = observer(function FileDrawer() {
    const { t } = useTranslation();
    const [fileDirectoryArr, setFileDirectoryArr] = React.useState([]);
    const [editingFileName, setEditingFileName] = React.useState("");
    const [currentEditingFilePath, setCurrentEditingFilePath] = React.useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    window._setIsDragging = setIsDragging;
    const theme = useTheme();
    const debouncedRefreshRef = React.useRef();
    const fillText = (content, fileName) => {
        // 使用 Monaco 编辑器显示文件内容
        replaceMonacoAll(window.monaco, window.editor, content);
        alertUseArco(`${t("t-file-manager-open-success")}${fileName}！😀`);
    };
    const toggleDrawer = (newOpen) => () => {
        if (!isPinned) {
            changeFileManagerState(newOpen);
        }
        else {
        }
    };
    const handleOnChangeFileEditLocalSwitch = (_e, i) => {
        changeSettings({
            basic: { fileEditLocal: i },
        });
    };
    /**
     * @description 打开单个文件
     */
    const onClickOpenSingleFile = async () => {
        try {
            // 调用 openSingleFile 方法从文件管理器中打开单个文件
            const fileHandle = await fileManager.openSingleFile();
            if (!fileHandle) {
                // 如果没有文件被选中，显示错误提示消息
                alertUseArco(t("t-no-file-selected"), 2500, {
                    kind: "warning",
                });
                return;
            }
            setEditingFileName(fileHandle.name);
            setCurrentEditingFilePath(fileHandle.name);
            setFileDirectoryArr([
                {
                    id: "1." + fileHandle.name,
                    label: fileHandle.name,
                    path: fileHandle.name,
                    fileType: fileHandle.kind,
                },
            ]);
            // 显示正在打开文件的提示
            alertUseArco(t("t-opening-file"));
            // 读取文件内容
            const content = await fileManager.readFile(fileHandle);
            fillText(content, fileHandle.name);
        }
        catch (error) {
            // 错误处理
            console.error("Error opening file:", error);
            alertUseArco(t("t-error-opening-file"), 2000, { kind: "error" });
        }
    };
    // 优化的 onClickOpenFolder 函数 - 添加懒加载和性能优化
    const onClickOpenFolder = async () => {
        try {
            setIsLoading(true);
            let fileFolderManager = folderManager;
            // 先停止旧文件夹的监控（如果存在）
            fileFolderManager.stopWatching();
            const directoryHandle = await fileFolderManager.openDirectory();
            if (directoryHandle) {
                // 显示加载提示
                alertUseArco(t("t-file-manager-loading"), 1000, { kind: "info" });
                // 使用优化的懒加载方法读取目录
                let folderTopStackArray = await fileFolderManager.readDirectoryAsArrayOptimized(directoryHandle, true, 1 // 只加载第一层，后续懒加载
                );
                // 启动优化的文件夹监控 - 增加监控间隔，减少性能开销
                fileFolderManager.watchDirectory(async () => {
                    // 清除之前的防抖定时器
                    if (debouncedRefreshRef.current) {
                        clearTimeout(debouncedRefreshRef.current);
                    }
                    // 防抖刷新，避免频繁更新
                    debouncedRefreshRef.current = setTimeout(async () => {
                        try {
                            let folderTopStackArray = await fileFolderManager.readDirectoryAsArrayOptimized(directoryHandle, true, 1 // 保持懒加载模式
                            );
                            fileFolderManager.topDirectoryArray = folderTopStackArray;
                            setFileDirectoryArr(folderTopStackArray);
                        }
                        catch (error) {
                            console.error("Error during watch refresh:", error);
                        }
                    }, 500); // 500ms防抖延迟
                }, 3000); // 增加监控间隔到3秒，减少性能开销
                fileFolderManager.topDirectoryArray = folderTopStackArray;
                setFileDirectoryArr(folderTopStackArray);
                // 检查是否为空文件夹
                if (!folderTopStackArray || folderTopStackArray.length === 0) {
                    alertUseArco(t("t-file-manager-empty-folder"), 2000, { kind: "info" });
                }
                // 异步重新渲染markdown，避免阻塞UI
                setTimeout(async () => {
                    try {
                        await mdConverter(false);
                        console.log('Markdown re-rendered after opening folder');
                    }
                    catch (error) {
                        console.error('Error re-rendering markdown:', error);
                    }
                }, 100);
            }
        }
        catch (error) {
            console.error("Error opening folder:", error);
            alertUseArco(t("t-error-opening-folder"), 2000, { kind: "error" });
        }
        finally {
            setIsLoading(false);
        }
    };
    // 优化的刷新文件目录函数
    const refreshDirectory = async () => {
        const directoryHandle = folderManager.getTopDirectoryHandle();
        if (directoryHandle) {
            try {
                setIsLoading(true);
                // 使用优化的方法刷新，只刷新当前展开的层级
                let folderTopStackArray = await folderManager.readDirectoryAsArrayOptimized(directoryHandle, true, 1 // 保持懒加载模式
                );
                folderManager.topDirectoryArray = folderTopStackArray;
                setFileDirectoryArr(folderTopStackArray);
                // 如果当前编辑的文件不存在于新的文件树中，清空选中状态
                if (currentEditingFilePath) {
                    const fileExists = checkFileExistsInTree(folderTopStackArray, currentEditingFilePath);
                    if (!fileExists) {
                        console.log(`Current editing file '${currentEditingFilePath}' no longer exists, clearing selection`);
                        setCurrentEditingFilePath("");
                    }
                }
            }
            catch (error) {
                console.error("Error refreshing directory:", error);
                // 发生错误时也清空选中状态，确保不显示已不存在的文件
                if (currentEditingFilePath) {
                    console.log("Error occurred during refresh, clearing file selection");
                    setCurrentEditingFilePath("");
                }
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    // 辅助函数：递归检查文件是否存在于文件树中
    const checkFileExistsInTree = (tree, filePath) => {
        if (!tree || tree.length === 0)
            return false;
        for (const item of tree) {
            // 直接匹配路径
            if (item.path === filePath) {
                return true;
            }
            // 递归检查子项
            if (item.children && Array.isArray(item.children)) {
                if (checkFileExistsInTree(item.children, filePath)) {
                    return true;
                }
            }
        }
        return false;
    };
    // 清理防抖定时器
    React.useEffect(() => {
        return () => {
            if (debouncedRefreshRef.current) {
                clearTimeout(debouncedRefreshRef.current);
            }
        };
    }, []);
    const startButtonStyle = { width: "53%", height: "6svh", mb: "10px" };
    const TransparentBackdrop = styled(Backdrop)({
        backgroundColor: "transparent",
        // pointerEvents: "none", // 使点击事件穿透
    });
    // 文件选中回调函数
    const handleFileSelect = React.useCallback((filePath) => {
        setCurrentEditingFilePath(filePath);
        console.log('Current editing file set to:', filePath);
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        ` }), _jsx(Drawer, { PaperProps: {
                    style: {
                        pointerEvents: "all",
                        zIndex: 99999,
                    },
                }, keepMounted: true, ModalProps: {
                    disableEnforceFocus: true,
                    disableAutoFocus: true,
                    disableRestoreFocus: true,
                    style: {
                        pointerEvents: isPinned || isDragging ? "none" : "all",
                    },
                    BackdropComponent: (props) => (_jsx(TransparentBackdrop, { onDrop: () => {
                            setTimeout(() => {
                                window._setIsDragging(false);
                            }, 30);
                        }, ...props, className: "pointed-through-backdrop" })),
                }, anchor: "right", autoFocus: false, open: getFileManagerState(), onClose: toggleDrawer(false), children: _jsxs(Box, { sx: {
                        overflow: "hidden",
                        background: theme.palette.mode === "light" ? "#F9F9F9" : "dark",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                        height: "100svh",
                    }, children: [_jsx(Box, { sx: {
                                width: "4.6svw",
                                height: "100svh",
                                display: "flex",
                                background: theme.palette.mode === "light" ? "#eeeeee" : "#414141",
                                alignItems: "center",
                                justifyContent: "center",
                            }, children: _jsxs(Stack, { sx: {
                                    width: 60, // 调整宽度以适应你的设计
                                    height: "100vh", // 满屏高度
                                    alignItems: "center", // 中心对齐图标
                                    paddingTop: 2, // 顶部间隔
                                }, children: [_jsx(SquareClickIconButton, { icon: _jsx(ArrowForwardIosIcon, {}), onClick: () => changeFileManagerState(false) }), _jsx(SquareClickIconButton, { icon: isPinned ? (_jsx(PushPinIcon, { sx: { transform: "rotate(45deg)" } })) : (_jsx(PushPinOutlinedIcon, { sx: { transform: "rotate(45deg)" } })), onClick: () => setIsPinned(!isPinned), 
                                        // 固定
                                        tooltipText: "🧷" + t("t-file-manager-pinned") }), _jsx(SquareClickIconButton, { icon: _jsx(FileCopyIcon, {}), onClick: onClickOpenSingleFile, tooltipText: "📁" + t("t-file-manager-open-file") }), _jsx(SquareClickIconButton, { tooltipText: "📁" + t("t-file-manager-open-folder"), icon: _jsx(FolderIcon, {}), onClick: onClickOpenFolder }), _jsx(SquareClickIconButton, { tooltipText: "📑" + t("t-file-manager-saveAs"), icon: _jsx(SaveAltIcon, {}), onClick: () => fileManager.saveAsFile(getMdTextFromMonaco()) })] }) }), _jsxs(Box, { sx: {
                                width: "23svw",
                                height: "100svh",
                                display: "flex",
                                flexDirection: "column",
                            }, children: [_jsxs(Box, { sx: {
                                        width: "23svw",
                                        height: "10svh",
                                        alignItems: "center",
                                        mt: "4px",
                                        justifyContent: "center",
                                    }, className: "FLEX COW ALI-CEN JUS-CEN", children: [_jsx(Typography, { sx: { mr: "10px", fontSize: "17px" }, color: theme.palette.info.contrastText, children: t("t-file-manager-syncLocal") }), _jsx(SwitchIOS, { checked: getSettings().basic.fileEditLocal, size: "small", 
                                            // value={getSettings().basic.syncScroll}
                                            inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeFileEditLocalSwitch })] }), _jsx(Box, { className: "FLEX ALI-CEN JUS-CEN", sx: {
                                        display: "flex",
                                        height: "98%",
                                        alignContent: "center",
                                        justifyContent: "center",
                                        marginBottom: "20svh",
                                    }, children: fileDirectoryArr.length != 0 ? (_jsx(_Fragment, { children: _jsx(ScrollableBox, { sx: { width: "100%", height: "100%" }, children: _jsx(FileExplorer, { folderManager: folderManager, fillText: fillText, setIsDragging: setIsDragging, fileDirectoryArr: fileDirectoryArr, onRefresh: refreshDirectory, currentEditingFile: currentEditingFilePath, onFileSelect: handleFileSelect }) }) })) : (_jsx(_Fragment, { children: _jsxs(Box, { className: "FLEX COL ALI-CEN JUS-CEN", sx: {
                                                width: "100%",
                                            }, children: [isLoading && (_jsxs(Box, { sx: { mb: 2, display: "flex", alignItems: "center", gap: 1 }, children: [_jsx("div", { style: {
                                                                animation: 'spin 1s linear infinite',
                                                                fontSize: '1.2rem',
                                                                color: theme.palette.primary.main
                                                            }, children: "\u27F3" }), _jsx(Typography, { variant: "body2", color: "primary", children: t("t-file-manager-loading") })] })), _jsx(Typography, { children: getSettings().basic.fileEditLocal ? editingFileName : "" }), _jsx(Button, { sx: startButtonStyle, onClick: onClickOpenSingleFile, variant: "contained", color: "primary", disabled: isLoading, children: t("t-file-manager-open-file") }), _jsx(Button, { sx: startButtonStyle, variant: "contained", color: "primary", onClick: onClickOpenFolder, disabled: isLoading, children: t("t-file-manager-open-folder") }), _jsx(Button, { sx: startButtonStyle, variant: "contained", onClick: () => {
                                                        fileManager.saveAsFile(getMdTextFromMonaco());
                                                    }, disabled: isLoading, children: t("t-file-manager-saveAs") })] }) })) })] })] }) })] }));
});
export default FileDrawer;
function SquareClickIconButton({ icon, onClick, tooltipText, }) {
    const theme = useTheme(); // 使用主题钩子获取当前主题
    // 创建Button组件
    const button = (_jsx(Button, { sx: {
            width: "4.6svw", // 设置按钮的固定宽度
            height: "4.6svw", // 设置按钮的固定高度
            backgroundColor: "transparent", // 初始背景颜色
            "&:hover": {
                backgroundColor: theme.palette.action.hover, // 悬浮时背景色
                borderRadius: "0", // 按钮圆角
            },
            "& .MuiTouchRipple-rippleVisible": {
                animation: "MuiTouchRipple-keyframes-enter 550ms cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "scale(3)", // 放大波纹效果
            },
            "& .MuiTouchRipple-child": {
                backgroundColor: theme.palette.primary.main, // 自定义波纹颜色
            },
        }, onClick: onClick, color: "inherit", children: icon }));
    // 根据tooltipText的值决定是否使用Tooltip
    return tooltipText ? (_jsx(Tooltip, { sx: { whiteSpace: "normal" }, TransitionComponent: Zoom, enterDelay: 200, placement: "left", title: tooltipText, children: button })) : (button);
}
