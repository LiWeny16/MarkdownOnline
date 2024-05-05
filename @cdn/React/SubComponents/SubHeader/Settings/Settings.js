import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
// import mailCss from "@Css/mail.css?raw"
// import katexCss from "@Css/katex.min.css?raw"
// import hljsCss from "@Css/hljs.css?raw"
// dialog
// import Button from "@mui/material/Button"
// import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions"
// import DialogContent from "@mui/material/DialogContent"
// import DialogContentText from "@mui/material/DialogContentText"
// import DialogTitle from "@mui/material/DialogTitle"
// import SettingsIcon from '@mui/icons-material/Settings';
// import ketaxCss from "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.css?raw"
// import CloudMail from "@App/share/CloudMail"
// import { getRenderHTML } from "@App/text/getMdText"
// import { Message } from "@arco-design/web-react"
// import { Notification } from "@arco-design/web-react"
import { useTheme } from "@mui/material/styles";
// import SettingsRight from "./Subsettings/SettingsRight"
import SettingsRoute from "./Subsettings/SettingsRoute";
import { Box, Divider } from "@mui/material";
import IconBreadcrumbs from "./Subsettings/SettingsBread";
import SettingsBody from "./Subsettings/SettingsBody";
import { getTheme } from "@App/config/change";
export default function Settings(props) {
    const palette = useTheme().palette;
    const theme = getTheme();
    let mailOptionsRef = React.useRef();
    let [mailSharePanelState, setMailSharePanelState] = React.useState(false);
    let [settingsRouter, setSettingsRouter] = React.useState("");
    let handleCloseAll = (e) => {
        setMailSharePanelState(() => {
            return false;
        });
        props.onClick(e);
        props.closeAll();
    };
    React.useEffect(() => {
        // console.log(theme)
    });
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { fullScreen: false, maxWidth: false, open: props.open, onClose: handleCloseAll, sx: {
                    height: "100vh",
                }, children: _jsxs(Box, { sx: {
                        background: theme === "light" ? "#F8FAFB" : "",
                        padding: "1rem",
                        height: "58vh",
                        width: "60vw",
                    }, children: [_jsx(IconBreadcrumbs, {}), _jsx(Divider, { sx: { my: 0.5 } }), _jsxs(Box, { sx: {
                                height: "48vh",
                                display: "flex",
                                background: theme === "light" ? "#F8FAFB" : "",
                                padding: "5px",
                                flexDirection: "row",
                                borderRradius: "50px",
                                // background: "#ffffff",
                                // boxShadow: theme === "light" ? "20px 20px 60px #d9d9d9,-20px -20px 60px #ffffff": "" ,
                                borderRadius: "5px",
                            }, children: [_jsx(SettingsRoute, {}), _jsx(SettingsBody, {})] })] }) }), _jsx(SettingsIcon, {}), "\u8BBE\u7F6E"] }));
}
