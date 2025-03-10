import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
export default function FormDialog(props) {
    const handleClose = (e) => {
        props.setMailSharePanelState(false);
    };
    return (_jsx("div", { children: _jsxs(Dialog, { open: props.mailSharePanelState, onClose: handleClose, children: [_jsx(DialogTitle, { children: "Subscribe" }), _jsxs(DialogContent, { children: [_jsx(DialogContentText, { children: "To subscribe to this website, please enter your email address here. We will send updates occasionally." }), props.children] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleClose, children: "Cancel" }), _jsx(Button, { onClick: handleClose, children: "Subscribe" })] })] }) }));
}
