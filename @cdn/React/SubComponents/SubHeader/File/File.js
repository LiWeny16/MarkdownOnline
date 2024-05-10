import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { changeFileManagerState, changeSettings, getFileManagerState, getSettings, } from "@App/config/change";
import { FileManager } from "@App/fileSystem/file";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import { replaceMonacoAll } from "@App/text/replaceText";
import { Box, Button, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { observer } from "mobx-react";
import { useTheme } from "@mui/material/styles";
import React from "react";
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS";
const fileManager = new FileManager();
let _t;
const FileDrawer = observer(function FileDrawer() {
    const [editingFileName, setEditingFileName] = React.useState("");
    const theme = useTheme();
    const toggleDrawer = (newOpen) => () => {
        changeFileManagerState(newOpen);
    };
    const handleOnChangeFileEditLocalSwitch = (_e, i) => {
        changeSettings({
            basic: { fileEditLocal: i },
        });
        if (i) {
            // 监听本地文件改动
            _t = setInterval(async () => {
                const content = await fileManager.readFile();
            }, 1000);
        }
        else {
            _t = null;
        }
    };
    return (_jsx(_Fragment, { children: _jsx(Drawer, { sx: {
                "& .MuiBackdrop-root": {
                    backgroundColor: "transparent", // 设置背景为透明
                },
            }, anchor: "right", open: getFileManagerState(), onClose: toggleDrawer(false), children: _jsx(Box, { sx: {
                    padding: "20px",
                    width: "26svw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100svh",
                    flexDirection: "column",
                }, children: _jsxs(Box, { className: "FLEX COL", children: [_jsx(Typography, { children: getSettings().basic.fileEditLocal ? editingFileName : "" }), _jsx(Button, { sx: { mb: "10px" }, onClick: async () => {
                                setEditingFileName((await fileManager.openSingleFile())?.name ?? "");
                                const content = await fileManager.readFile();
                                if (content) {
                                    replaceMonacoAll(window.monaco, window.editor, content);
                                }
                            }, variant: "contained", color: "primary", children: "\u6253\u5F00\u6587\u4EF6" }), _jsx(Button, { sx: { mb: "10px" }, variant: "contained", onClick: () => {
                                fileManager.saveAsFile(getMdTextFromMonaco());
                            }, children: "\u53E6\u5B58\u4E3A" }), _jsxs(Box, { className: "FLEX COW ALI-CEN", children: [_jsx(Typography, { sx: { mr: "10px", fontSize: "17px" }, color: theme.palette.info.contrastText, children: "\u540C\u6B65\u672C\u5730\u7F16\u8F91" }), _jsx(SwitchIOS, { checked: getSettings().basic.fileEditLocal, size: "small", 
                                    // value={getSettings().basic.syncScroll}
                                    inputProps: { "aria-label": "controlled" }, onChange: handleOnChangeFileEditLocalSwitch })] })] }) }) }) }));
});
export default FileDrawer;
