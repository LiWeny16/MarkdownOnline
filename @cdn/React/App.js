import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Header from "./SubComponents/Header";
import Body from "./SubComponents/Body";
import { observer } from "mobx-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { green, blue } from "@mui/material/colors";
import { getTheme } from "@App/config/change";
// import Box from "@mui/material/Box"
// import TB from "@Com/myCom/Layout/TB"
const lightTheme = createTheme({
    palette: {
        primary: {
            main: blue[200],
            contrastText: "#fff378",
        },
        secondary: {
            main: green[500],
            contrastText: "pink",
        },
        mode: "light",
    },
});
const darkTheme = createTheme({
    palette: {
        primary: {
            main: blue[400],
            contrastText: "wheat",
        },
        secondary: {
            main: green[700],
            contrastText: "wheat",
        },
        mode: "dark",
    },
});
const App = observer(() => {
    return (_jsx(_Fragment, { children: _jsxs(ThemeProvider, { theme: getTheme() === "light" ? lightTheme : darkTheme, children: [_jsx(CssBaseline, {}), _jsxs("div", { className: "FLEX COL", children: [_jsx(Header, {}), _jsx(Body, {})] })] }) }));
});
export default App;
