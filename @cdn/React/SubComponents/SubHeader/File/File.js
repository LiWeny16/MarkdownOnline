import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeFileManagerState, changeSettings, getFileManagerState, getSettings, } from "@App/config/change";
import { FileFolderManager, FileManager } from "@App/fileSystem/file";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import { replaceMonacoAll } from "@App/text/replaceText";
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
import { PushPin as PushPinIcon, PushPinOutlined as PushPinOutlinedIcon, } from "@mui/icons-material";
const fileManager = new FileManager();
const folderManager = new FileFolderManager();
let _t;
const FileDrawer = observer(function FileDrawer() {
    const [fileDirectoryArr, setFileDirectoryArr] = React.useState([]);
    const [editingFileName, setEditingFileName] = React.useState("");
    const [isPinned, setIsPinned] = useState(false);
    const theme = useTheme();
    const fillText = (content, fileName) => {
        // 使用 Monaco 编辑器显示文件内容
        replaceMonacoAll(window.monaco, window.editor, content);
        alertUseArco(`打开${fileName}成功！😀`);
    };
    const toggleDrawer = (newOpen) => () => {
        // const backDropEle = document.getElementsByClassName(
        //   "pointed-through-backdrop"
        // )
        // const parentEle = backDropEle[0].parentElement
        if (!isPinned) {
            changeFileManagerState(newOpen);
        }
        else {
            // parentEle?.style.setProperty("pointer-events", "none")
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
                alertUseArco("左顾右盼，活在梦幻?", 2500, {
                    kind: "warning",
                });
                return;
            }
            setEditingFileName(fileHandle.name);
            setFileDirectoryArr([
                {
                    id: "1." + fileHandle.name,
                    label: fileHandle.name,
                    fileType: fileHandle.kind,
                },
            ]);
            // 显示正在打开文件的提示
            alertUseArco("正在打开本地文件，别急，你给我等会😅");
            // 读取文件内容
            const content = await fileManager.readFile(fileHandle);
            fillText(content, fileHandle.name);
        }
        catch (error) {
            // 错误处理
            console.error("Error opening file:", error);
            alertUseArco("尼玛的报错乐🤣", 2000, { kind: "error" });
        }
    };
    const onClickOpenFolder = async () => {
        let fileFolderManager = folderManager;
        const directoryHandle = await fileFolderManager.openDirectory();
        if (directoryHandle) {
            let folderTopStackArray = await fileFolderManager.readDirectoryAsArray(directoryHandle, true);
            fileFolderManager.watchDirectory(async () => {
                let folderTopStackArray = await fileFolderManager.readDirectoryAsArray(directoryHandle, true);
                fileFolderManager.topDirectoryArray = folderTopStackArray;
                setFileDirectoryArr(folderTopStackArray);
            }, 1700);
            fileFolderManager.topDirectoryArray = folderTopStackArray;
            setFileDirectoryArr(folderTopStackArray);
            // fileFolderManager.setTopDirectoryArray(folderTopStackArray)
            // fileFolderManager.createNewFolder(directoryHandle, "test2")
        }
    };
    const startButtonStyle = { width: "53%", height: "6svh", mb: "10px" };
    const TransparentBackdrop = styled(Backdrop)({
        backgroundColor: "transparent",
        // pointerEvents: "none", // 使点击事件穿透
    });
    return (_jsx(_Fragment, { children: _jsx(Drawer, { PaperProps: {
                style: {
                    pointerEvents: "all",
                    zIndex: 99999,
                },
            }, ModalProps: {
                disableEnforceFocus: true,
                disableAutoFocus: true,
                disableRestoreFocus: true,
                style: {
                    pointerEvents: isPinned ? "none" : "all",
                },
                BackdropComponent: (props) => (_jsx(TransparentBackdrop, { ...props, className: "pointed-through-backdrop" })),
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
                            }, children: [_jsx(SquareClickIconButton, { icon: isPinned ? (_jsx(PushPinIcon, { sx: { transform: "rotate(45deg)" } })) : (_jsx(PushPinOutlinedIcon, { sx: { transform: "rotate(45deg)" } })), onClick: () => setIsPinned(!isPinned), tooltipText: "\u56FA\u5B9A\uFF01\uD83E\uDDF7" }), _jsx(SquareClickIconButton, { icon: _jsx(FileCopyIcon, {}), onClick: onClickOpenSingleFile, tooltipText: "\u6253\u5F00\u6587\u4EF6 \uD83D\uDCC1" }), _jsx(SquareClickIconButton, { tooltipText: "\u6253\u5F00\u6587\u4EF6\u5939 \uD83D\uDCC2", icon: _jsx(FolderIcon, {}), onClick: onClickOpenFolder }), _jsx(SquareClickIconButton, { tooltipText: "\u53E6\u5B58\u4E3A \uD83D\uDCD1", icon: _jsx(SaveAltIcon, {}), onClick: () => fileManager.saveAsFile(getMdTextFromMonaco()) })] }) }), _jsxs(Box, { sx: {
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
                                }, className: "FLEX COW ALI-CEN JUS-CEN", children: [_jsx(Typography, { sx: { mr: "10px", fontSize: "17px" }, color: theme.palette.info.contrastText, children: "\u540C\u6B65\u672C\u5730\u7F16\u8F91" }), _jsx(SwitchIOS, { checked: getSettings().basic.fileEditLocal, size: "small", 
                                        // value={getSettings().basic.syncScroll}
                                        inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeFileEditLocalSwitch })] }), _jsx(Box, { className: "FLEX ALI-CEN JUS-CEN", sx: {
                                    display: "flex",
                                    height: "98%",
                                    alignContent: "center",
                                    justifyContent: "center",
                                    marginBottom: "20svh",
                                }, children: fileDirectoryArr.length != 0 ? (_jsx(_Fragment, { children: _jsx(ScrollableBox, { sx: { width: "100%", height: "100%" }, children: _jsx(FileExplorer, { folderManager: folderManager, fillText: fillText, fileDirectoryArr: fileDirectoryArr }) }) })) : (_jsx(_Fragment, { children: _jsxs(Box, { className: "FLEX COL ALI-CEN JUS-CEN", sx: {
                                            width: "100%",
                                        }, children: [_jsx(Typography, { children: getSettings().basic.fileEditLocal ? editingFileName : "" }), _jsx(Button, { sx: startButtonStyle, onClick: onClickOpenSingleFile, variant: "contained", color: "primary", children: "\u6253\u5F00\u6587\u4EF6" }), _jsx(Button, { sx: startButtonStyle, variant: "contained", color: "primary", onClick: onClickOpenFolder, children: "\u6253\u5F00\u6587\u4EF6\u5939" }), _jsx(Button, { sx: startButtonStyle, variant: "contained", onClick: () => {
                                                    fileManager.saveAsFile(getMdTextFromMonaco());
                                                }, children: "\u53E6\u5B58\u4E3A" })] }) })) })] })] }) }) }));
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
