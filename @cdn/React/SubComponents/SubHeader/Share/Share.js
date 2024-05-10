import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import ArchiveIcon from "@mui/icons-material/Archive";
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
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import ketaxCss from "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.css?raw"
import CloudMail from "@App/share/CloudMail";
import { getRenderHTML } from "@App/text/getMdText";
import { Notification } from "@arco-design/web-react";
// import FormDialog from "@Com/myCom/Dialog"
export default function Share(props) {
    let mailOptionsRef = React.useRef();
    let [mailSharePanelState, setMailSharePanelState] = React.useState(false);
    let handleCloseAll = (e) => {
        setMailSharePanelState(() => {
            return false;
        });
        props.onClick(e);
        // console.log()
    };
    let handleSendMail = (e) => {
        let mailTo = mailOptionsRef.current.value;
        CloudMail("https://service-g12i7wh1-1321514649.sh.apigw.tencentcs.com/release/mail", "post", {
            to: mailTo,
            subject: "Mailed from Markdown Online+",
            html: `<div class="markdown-body">${getRenderHTML()}</div>`,
            // `<style>${mailCss + katexCss + hljsCss}</style>`,
            raw: 0,
        });
        handleCloseAll(e);
        Notification.success({
            title: "邮件发送成功！",
            content: `Beta版本,请勿重复尝试`,
            position: "topRight",
        });
        Notification.info({
            title: "请注意,邮件发送暂时不能完全支持mermaid和Latex",
            content: `Beta版本,请勿重复尝试`,
            position: "topRight",
        });
        props.closAll();
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Dialog, { fullWidth: true, maxWidth: "sm", open: mailSharePanelState, onClose: handleCloseAll, children: [_jsx(DialogTitle, { children: "\u795E\u5947\u90AE\u7BB1" }), _jsxs(DialogContent, { children: [_jsxs(DialogContentText, { children: ["\u8BF7\u8F93\u5165\u4F60\u8981\u53D1\u9001\u5230\u7684\u90AE\u7BB1", _jsx("br", {})] }), _jsx(TextField, { inputRef: mailOptionsRef, autoFocus: true, margin: "dense", id: "name", label: "Email Address", type: "email", fullWidth: true, variant: "standard" })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseAll, children: "\u53D6\u6D88" }), _jsx(Button, { onClick: handleSendMail, children: "\u53D1\u9001" })] })] }), _jsx(ArchiveIcon, {}), "\u5206\u4EAB(\u5F00\u53D1\u4E2D)", _jsx(StyledMenu, { style: { width: "fitContent" }, anchorOrigin: {
                    vertical: -5,
                    horizontal: 12,
                }, id: "demo-customized-menu", MenuListProps: {
                    "aria-labelledby": "demo-customized-button",
                }, elevation: 24, anchorEl: props.anchorEl, open: props.open, onClick: props.onClick, children: _jsxs(MenuItem, { onClick: (e) => {
                        // console.log(mailCss);
                        e.stopPropagation();
                        setMailSharePanelState(true);
                    }, disabled: true, disableRipple: true, children: [_jsx(AttachEmailIcon, {}), "\u90AE\u7BB1\u5206\u4EAB"] }) })] }));
}
