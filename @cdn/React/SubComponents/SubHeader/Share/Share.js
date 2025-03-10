import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import StyledMenu from "@Com/myCom/StyleMenu";
import MenuItem from "@mui/material/MenuItem";
// import mailCss from "@Css/mail.css?raw"
// import katexCss from "@Css/katex.min.css?raw"
// import hljsCss from "@Css/hljs.css?raw"
// dialog
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ShareIcon from "@mui/icons-material/Share";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import ChatIcon from "@mui/icons-material/Chat";
// import { getMdFromFireDB, uploadMdToFireDB } from "@App/share/firebase"
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
// import FormDialog from "@Com/myCom/Dialog"
export default function Share(props) {
    const { t } = useTranslation();
    let mailOptionsRef = React.useRef();
    let [mailSharePanelState, setMailSharePanelState] = React.useState(false);
    const [sharedLink, setSharedLink] = React.useState("https://bigonion.cn");
    const [copied, setCopied] = React.useState(false);
    let handleCloseAll = (e) => {
        setMailSharePanelState(() => {
            return false;
        });
        props.onClick(e);
        // console.log()
    };
    let handleCreateShareLink = async (e) => {
        const shareContent = getMdTextFromMonaco();
        // await uploadMdToFireDB(shareContent)
        // await getMdFromFireDB().then((res) => {
        //   setSharedLink(res)
        // })
    };
    const handleAppClick = (urlScheme) => (e) => {
        e.stopPropagation();
        window.location.href = urlScheme;
        // setMailSharePanelState(true)
    };
    const handleCopy = () => {
        navigator.clipboard
            .writeText(sharedLink)
            .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2秒后恢复默认状态
        })
            .catch((err) => {
            console.error("Failed to copy URL:", err);
        });
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Dialog, { fullWidth: true, maxWidth: "sm", open: mailSharePanelState, onClose: handleCloseAll, children: [_jsx(DialogTitle, { children: "\u771F\u00B7\u5206\u4EAB" }), _jsx(DialogContent, { children: _jsx(Tooltip, { title: copied ? "已复制!" : "点击复制", children: _jsx(TextField, { value: sharedLink, variant: "outlined", fullWidth: true, InputProps: {
                                    readOnly: true,
                                }, onClick: handleCopy }) }) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: handleCreateShareLink, children: "\u521B\u5EFA\u5206\u4EAB\u94FE\u63A5" }) })] }), _jsx(ShareIcon, {}), t("t-share"), _jsxs(StyledMenu, { style: { width: "fitContent" }, anchorOrigin: {
                    vertical: -5,
                    horizontal: 12,
                }, id: "demo-customized-menu", MenuListProps: {
                    "aria-labelledby": "demo-customized-button",
                }, elevation: 24, anchorEl: props.anchorEl, open: props.open, onClick: props.onClick, children: [_jsxs(MenuItem, { onClick: (e) => {
                            e.stopPropagation();
                            setMailSharePanelState(true);
                        }, disabled: true, disableRipple: true, children: [_jsx(ShareIcon, {}), "\u771F\u00B7\u5206\u4EAB"] }), _jsxs(MenuItem, { onClick: handleAppClick("weixin://dl/scan"), disableRipple: true, children: [_jsx(ChatIcon, {}), "WeChat"] }), _jsxs(MenuItem, { onClick: handleAppClick("tg://"), disableRipple: true, children: [_jsx(ChatIcon, {}), "Telegram"] }), _jsxs(MenuItem, { onClick: handleAppClick("mailto:bigonion@bigonion.cn?subject=你的主题&body=你的邮件内容"), disableRipple: true, children: [_jsx(AttachEmailIcon, {}), "Email"] })] })] }));
}
