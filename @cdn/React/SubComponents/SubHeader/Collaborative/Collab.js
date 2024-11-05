import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import { Box, Divider } from "@mui/material";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";
export default function Settings(props) {
    const { t } = useTranslation();
    const palette = useTheme().palette;
    const theme = getTheme();
    let [mailSharePanelState, setMailSharePanelState] = React.useState(false);
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
                    }, children: [_jsx(ScreenShareIcon, {}), _jsx(Divider, { sx: { my: 0.5 } }), _jsx(Box, { sx: {
                                height: "48vh",
                                display: "flex",
                                background: theme === "light" ? "#F8FAFB" : "",
                                padding: "5px",
                                flexDirection: "row",
                                borderRradius: "50px",
                                borderRadius: "5px",
                            } })] }) }), _jsx(ScreenShareIcon, {}), t("t-collaborative-office")] }));
}
