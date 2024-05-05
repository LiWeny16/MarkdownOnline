import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import { Box } from "@mui/material";
function handleClick(event) {
    event.preventDefault();
    //   console.info("You clicked a breadcrumb.")
    //   console.log(event)
}
export default function IconBreadcrumbs() {
    return (_jsx(Box, { sx: {
            marginBottom: "5px",
        }, role: "presentation", onClick: handleClick, children: _jsxs(Breadcrumbs, { "aria-label": "breadcrumb", children: [_jsxs(Link, { underline: "hover", sx: { display: "flex", alignItems: "center" }, color: "inherit", href: "/", children: [_jsx(HomeIcon, { sx: { mr: 0.5 }, fontSize: "inherit" }), "MUI"] }), _jsxs(Link, { underline: "hover", sx: { display: "flex", alignItems: "center" }, color: "inherit", href: "/material-ui/getting-started/installation/", children: [_jsx(WhatshotIcon, { sx: { mr: 0.5 }, fontSize: "inherit" }), "Core"] }), _jsxs(Typography, { sx: { display: "flex", alignItems: "center" }, color: "text.primary", children: [_jsx(GrainIcon, { sx: { mr: 0.5 }, fontSize: "inherit" }), "Breadcrumb"] })] }) }));
}
