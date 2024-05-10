import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
const ColorButton = styled(Button)(({ theme }) => ({
    // color: "black",
    color: theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : "#FFFFFF",
    marginLeft: 10,
    fontFamily: ["electronicFont"].join(","),
    backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "",
    "&:hover": {
        backgroundColor: theme.palette.mode === "light" ? grey[300] : "",
    },
}));
export default function CustomizedButtons(props) {
    return (
    // <BootstrapButton variant="contained" disableRipple>
    //   Bootstrap
    // </BootstrapButton>
    _jsx(ColorButton, { id: "demo-customized-button", href: props.href ? props.href : undefined, "aria-controls": props.open ? "demo-customized-menu" : undefined, "aria-haspopup": "true", "aria-expanded": props.open ? "true" : undefined, disableElevation: true, 
        // style={{ background: "white", color: "black" }}
        onClick: props.onClick, onMouseOver: props.onHover, endIcon: props.endIcon, startIcon: props.startIcon ? props.startIcon : undefined, variant: "contained", children: props.children }));
}
