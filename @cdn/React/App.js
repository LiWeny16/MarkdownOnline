import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import Header from "./SubComponents/Header";
import Body from "./SubComponents/Body";
import { observer } from "mobx-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { green, blue } from "@mui/material/colors";
import { changeStates, getStates, getTheme } from "@App/config/change";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { aheadInit } from "@Func/Init/aheadInit";
const bothStyle = {
    zIndex: { drawer: 1300, modal: 1200, appBar: 1200 },
};
const lightTheme = createTheme({
    ...bothStyle,
    palette: {
        primary: {
            main: blue[200],
            contrastText: "#fff378",
        },
        secondary: {
            main: "#EEEEEE",
            contrastText: "pink",
        },
        info: {
            main: blue[200],
            contrastText: "#8B8A8A",
        },
        mode: "light",
    },
});
const darkTheme = createTheme({
    ...bothStyle,
    palette: {
        primary: {
            main: blue[400],
            contrastText: "wheat",
        },
        secondary: {
            main: green[700],
            contrastText: "wheat",
        },
        info: {
            main: green[600],
            contrastText: "#8B8A8A",
        },
        mode: "dark",
    },
});
const App = observer(() => {
    React.useEffect(() => {
        aheadInit();
    }, []);
    return (_jsx(_Fragment, { children: _jsxs(ThemeProvider, { theme: getTheme() === "light" ? lightTheme : darkTheme, children: [_jsx(CssBaseline, {}), _jsxs(Box, { className: "FLEX COL App-top", children: [_jsx(Header, {}), _jsx(Body, {}), _jsx(Backdrop, { sx: { color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }, open: getStates().unmemorable.loading, onClick: () => {
                                changeStates({ unmemorable: { loading: false } });
                            }, children: _jsx(CircularProgress, { color: "inherit" }) })] })] }) }));
});
export default App;
