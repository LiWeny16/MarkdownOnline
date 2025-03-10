import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
const LightTooltip = styled(({ className, ...props }) => (_jsx(Tooltip, { ...props, classes: { popper: className } })))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        color: "#FFFFFF",
        boxShadow: theme.shadows[4],
        fontSize: 18,
    },
}));
let HtmlTooltip = styled(({ className, ...props }) => (_jsx(Tooltip, { ...props, classes: { popper: className } })))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}));
export { HtmlTooltip, LightTooltip };
