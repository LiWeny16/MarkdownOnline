import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
}));
export default function BasicGrid() {
    return (_jsx(Box, { sx: { flexGrow: 1 }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { xs: 8, children: _jsx(Item, { children: "xs=8" }) }), _jsx(Grid, { xs: 4, children: _jsx(Item, { children: "xs=4" }) }), _jsx(Grid, { xs: 4, children: _jsx(Item, { children: "xs=4" }) }), _jsx(Grid, { xs: 8, children: _jsx(Item, { children: "xs=8" }) })] }) }));
}
