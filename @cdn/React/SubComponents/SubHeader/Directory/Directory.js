import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import { Box, } from "@mui/material";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
import DirectoryRoute from "./SubDirectory/DirectoryRoute";
import DirectoryBody from "./SubDirectory/DirectoryBody";
export default function Settings(props) {
    const [activeId, setActiveId] = React.useState(["0_1"]);
    const { t } = useTranslation();
    const theme = getTheme();
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { fullScreen: false, maxWidth: false, open: props.open, onClose: props.onClose, sx: {
                    height: "100vh",
                }, children: _jsx(Box, { className: "transparent-scrollbar", sx: {
                        background: theme === "light" ? "#F8FAFB" : "",
                        padding: "1rem",
                        height: "58vh",
                        width: "58vw",
                    }, children: _jsxs(Box, { className: "transparent-scrollbar", sx: {
                            height: "53vh",
                            display: "flex",
                            background: theme === "light" ? "#F8FAFB" : "",
                            padding: "5px",
                            flexDirection: "row",
                            borderRradius: "50px",
                            borderRadius: "5px",
                            overflow: "hidden"
                        }, children: [_jsx(DirectoryRoute, { setActiveId: setActiveId }), _jsx(DirectoryBody, { activeId: activeId })] }) }) }), _jsx(SettingsIcon, {})] }));
}
