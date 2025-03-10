import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import SettingsRoute from "./Subsettings/SettingsRoute";
import { Box, Divider, } from "@mui/material";
import IconBreadcrumbs from "./Subsettings/SettingsBread";
import SettingsBody from "./Subsettings/SettingsBody";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
export default function Settings(props) {
    const { t } = useTranslation();
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
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { fullScreen: false, maxWidth: false, open: props.open, onClose: handleCloseAll, sx: {
                    height: "100vh",
                }, children: _jsxs(Box, { sx: {
                        background: theme === "light" ? "#F8FAFB" : "",
                        padding: "1rem",
                        height: "68vh",
                        width: "70vw",
                    }, children: [_jsx(IconBreadcrumbs, {}), _jsx(Divider, { sx: { my: 0.5 } }), _jsxs(Box, { sx: {
                                height: "58vh",
                                display: "flex",
                                background: theme === "light" ? "#F8FAFB" : "",
                                padding: "5px",
                                flexDirection: "row",
                                borderRradius: "50px",
                                borderRadius: "5px",
                            }, children: [_jsx(SettingsRoute, {}), _jsx(SettingsBody, {})] })] }) }), _jsx(SettingsIcon, {}), t("t-settings")] }));
}
