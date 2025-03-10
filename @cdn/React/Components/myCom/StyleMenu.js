import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
// import { StyledComponent } from "@mui/system";
// @ts-ignore
const StyledMenu = styled((props) => (_jsx(Menu, { elevation: 0, anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
    }, transformOrigin: {
        vertical: "top",
        horizontal: "right",
    }, ...props })))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        // minWidth: 180,
        color: theme.palette.mode === "light"
            ? "rgb(55, 65, 81)"
            : theme.palette.grey[300],
        // boxShadow:
        //   "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 20,
                color: theme.palette.mode === "light"
                    ? "rgb(55, 65, 81)"
                    : theme.palette.grey[300],
                marginRight: theme.spacing(1.5),
            },
        },
    },
}));
export default StyledMenu;
