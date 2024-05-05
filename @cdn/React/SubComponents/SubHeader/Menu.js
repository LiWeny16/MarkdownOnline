import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MyButton from "../../Components/myCom/CustomButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import save, { isSaved } from "@App/save";
import { useImage } from "@Mobx/Image";
import { observer } from "mobx-react";
import StyledMenu from "@Com/myCom/StyleMenu";
import Share from "./Share/Share";
import Export from "./Export/Export";
import Settings from "./Settings/Settings";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, } from "@mui/material";
import myPrint from "@App/export/myPrint";
// import domtoimg from "@App/export/domToImg"
const CustomizedMenus = observer(() => {
    const image = useImage();
    // 1本menu anchor
    const [anchorEl, setAnchorEl] = React.useState(null);
    // 2分享 anchor
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    // 3导出 anchor
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    // 4设置 anchor
    const [anchorEl4, setAnchorEl4] = React.useState(null);
    // 保存提示
    const [modalState, setModalState] = React.useState(false);
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);
    const open4 = Boolean(anchorEl4);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
        event.stopPropagation();
    };
    const handleClick3 = async (event) => {
        if (await isSaved()) {
            //@ts-ignore
            setAnchorEl3(event.target);
            event.stopPropagation();
        }
        else {
            event.stopPropagation();
            handleCloseMenu();
            setModalState(true);
        }
    };
    const handleClick4 = (event) => {
        setAnchorEl4(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleCloseShare = (e) => {
        setAnchorEl2(null);
        e.stopPropagation();
    };
    const handleCloseExport = (e) => {
        setAnchorEl3(null);
        e.stopPropagation();
    };
    const handleCloseSettings = (e) => {
        setAnchorEl4(null);
        e.stopPropagation();
    };
    const handleImageManager = () => {
        // console.log(image.displayState)
        image.display();
        handleCloseMenu();
        // 点击这个的时候 传递一个信号给另一个抽屉组件
    };
    return (_jsxs("div", { children: [_jsxs(Dialog, { open: modalState, onClose: () => {
                    setModalState(false);
                }, children: [_jsx(DialogTitle, { children: _jsx(Typography, { variant: "h6", gutterBottom: true, children: "Ready To Export? You Have Not Saved Yet!" }) }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: _jsx(Typography, { variant: "body1", gutterBottom: true, children: "Once you have clicked the \"yes\" button, your text will be saved." }) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setModalState(false);
                                    save();
                                    myPrint();
                                }, children: "YES" }), _jsx(Button, { onClick: () => {
                                    setModalState(false);
                                }, autoFocus: true, children: "NO" })] })] }), _jsx(MyButton, { open: open, endIcon: _jsx(MoreVertIcon, {}), onClick: handleClick, children: "更多" }), _jsxs(StyledMenu, { id: "demo-customized-menu", MenuListProps: {
                    "aria-labelledby": "demo-customized-button",
                }, elevation: 24, anchorEl: anchorEl, open: open, onClose: handleCloseMenu, children: [_jsxs(MenuItem, { onClick: handleImageManager, disableRipple: true, children: [_jsx(EditIcon, {}), "\u56FE\u7247\u7BA1\u7406\u5668"] }), _jsx(MenuItem, { onClick: (e) => {
                            handleClick3(e);
                            // handleCloseMenu()s
                        }, disableRipple: true, children: _jsx(Export, { anchorEl: anchorEl3, open: open3, closeMenu: handleCloseMenu, closeExportMenu: handleCloseExport }) }), _jsx(Divider, { sx: { my: 0.5 } }), _jsx(MenuItem, { onClick: (e) => {
                            handleClick2(e);
                            // handleCloseMenu()
                        }, disableRipple: true, children: _jsx(Share, { closAll: handleCloseMenu, anchorEl: anchorEl2, open: open2, onClick: handleCloseShare }) }), _jsx(MenuItem, { onClick: (e) => {
                            handleClick4(e);
                            // handleCloseMenu()
                        }, disableRipple: true, children: _jsx(Settings, { closeAll: handleCloseMenu, anchorEl: anchorEl4, open: open4, onClick: handleCloseSettings }) }), _jsxs(MenuItem, { onClick: () => {
                            handleCloseMenu();
                        }, disableRipple: true, children: [_jsx(MoreHorizIcon, {}), "\u66F4\u591A(\u656C\u8BF7\u671F\u5F85)"] })] })] }));
});
export default CustomizedMenus;
