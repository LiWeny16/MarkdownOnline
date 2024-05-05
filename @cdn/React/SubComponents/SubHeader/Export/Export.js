import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import StyledMenu from "@Com/myCom/StyleMenu";
import MenuItem from "@mui/material/MenuItem";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ShortTextIcon from "@mui/icons-material/ShortText";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import exportAsImage from "@App/export/domToImg";
import exportAsMd from "@App/export/exportAsMd";
import myPrint from "@App/export/myPrint";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { Notification } from "@arco-design/web-react";
export default function Export(props) {
    let closeExportMenu = props.closeExportMenu;
    let closeMenu = props.closeMenu;
    let [openExportAsImgSettings, setOpenExportAsImgSettings] = React.useState(false);
    let handleCloseExportImageSetting = (e) => {
        console.log(e);
        closeExportMenu(e);
        setOpenExportAsImgSettings(() => {
            return false;
        });
    };
    let exportPicInputRef = React.useRef();
    const [clearOptions, setClearOptions] = React.useState(3);
    const handleChange = (event) => {
        event.stopPropagation();
        setClearOptions(event.target.value);
    };
    /**
     * @description 导出出口函数
     */
    let handleExportAsImageConfirm = (e) => {
        handleCloseExportImageSetting(e);
        let name = exportPicInputRef.current.value;
        let clear = clearOptions;
        exportAsImage(clear ?? 4, name ?? "md_snapshot.png");
        props.closeMenu(e);
        Notification.success({
            title: "导出成功！",
            content: `Beta版本,请勿重复尝试`,
            position: "topRight",
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { className: "avoid", onClose: handleCloseExportImageSetting, open: openExportAsImgSettings, 
                // fullScreen={false}
                fullWidth: true, maxWidth: "sm", children: _jsxs("div", { onClick: (e) => {
                        e.stopPropagation();
                    }, children: [_jsx(DialogTitle, { children: "\u5BFC\u51FA\u8BBE\u7F6E" }), _jsxs(DialogContent, { children: [_jsx(DialogContentText, { children: "\u8BF7\u9009\u62E9\u56FE\u7247\u6E05\u6670\u5EA6" }), _jsx("br", {}), _jsxs(FormControl, { fullWidth: true, children: [_jsxs(Box, { children: [_jsx(InputLabel, { id: "demo-simple-select-label", children: "\u56FE\u7247\u6E05\u6670\u5EA6" }), _jsxs(Select, { label: "图片清晰度", defaultValue: "4", defaultChecked: true, 
                                                    // defaultChecked={true}
                                                    // value={clearOptions}
                                                    fullWidth: true, onChange: handleChange, children: [_jsx(MenuItem, { value: "1", children: "1 (\u6BD4\u8F83\u6A21\u7CCA,\u4F53\u79EF\u8F7B\u5DE7)" }), _jsx(MenuItem, { value: "2", children: "2 (\u6709\u4E9B\u6A21\u7CCA)" }), _jsx(MenuItem, { value: "4", children: "3 (\u9ED8\u8BA4,\u9002\u4E2D,\u63A8\u8350)" }), _jsx(MenuItem, { value: "6", children: "4 (\u6BD4\u8F83\u6E05\u6670,\u4F53\u79EF\u7A0D\u5927)" }), _jsx(MenuItem, { value: "10", children: "5 (\u8D85\u9E21\u65E0\u654C\u9739\u96F3\u9738\u6E05\u6670,\u4F53\u79EF\u8F83\u5927)" })] })] }), _jsx(Box, { marginX: "8px", children: _jsx(TextField, { inputRef: exportPicInputRef, margin: "dense", id: "export_img_name", defaultValue: "md_snapshot.png", label: "\u5BFC\u51FA\u7684\u6587\u4EF6\u540D", type: "text", fullWidth: true, variant: "standard", placeholder: "md_snapshot.png" }) })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseExportImageSetting, children: "\u53D6\u6D88" }), _jsx(Button, { onClick: handleExportAsImageConfirm, children: "\u786E\u8BA4\u5BFC\u51FA" })] })] }) }), _jsx(FileCopyIcon, {}), "\u5BFC\u51FA", _jsxs(StyledMenu, { style: { width: "fitContent" }, anchorOrigin: {
                    vertical: -5,
                    horizontal: 12,
                }, id: "demo-customized-menu", MenuListProps: {
                    "aria-labelledby": "demo-customized-button",
                }, elevation: 24, anchorEl: props.anchorEl, open: props.open, onClick: (e) => {
                    closeExportMenu(e);
                }, children: [_jsxs(MenuItem, { onClick: () => {
                            myPrint();
                        }, disableRipple: true, children: [_jsx(PictureAsPdfIcon, {}), "\u5BFC\u51FA\u4E3APDF"] }), _jsxs(MenuItem, { onClick: (e) => {
                            // handleClose()
                            // exportAsImage()
                            setOpenExportAsImgSettings(true);
                            // closeMenu()
                            closeExportMenu(e);
                        }, disableRipple: true, children: [_jsx(AddPhotoAlternateIcon, {}), "\u5BFC\u51FA\u4E3A\u56FE\u7247(Beta1.0)"] }), _jsxs(MenuItem, { onClick: () => {
                            exportAsMd();
                        }, disableRipple: true, children: [_jsx(ShortTextIcon, {}), "\u5BFC\u51FA\u4E3AMarkdown"] })] })] }));
}
