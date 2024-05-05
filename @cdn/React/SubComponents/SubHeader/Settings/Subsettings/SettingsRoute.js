import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import Collapse from "@mui/material/Collapse";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import SettingsIcon from "@mui/icons-material/Settings";
import { TreeItem, treeItemClasses, } from "@mui/x-tree-view/TreeItem";
import { useSpring } from "@react-spring/web";
// import AddBoxIcon from "@mui/icons-material/AddBox"
// import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox"
import ContrastIcon from "@mui/icons-material/Contrast";
import EditIcon from "@mui/icons-material/Edit";
import { styled, alpha } from "@mui/material/styles";
import { Box } from "@mui/material";
function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
        },
    });
    return (
    // 这里太大了，不用了！
    // <animated.div style={style}>
    _jsx(Collapse, { ...props })
    // </animated.div>
    );
}
const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.mode === "light"
        ? theme.palette.grey[800]
        : theme.palette.grey[200],
    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
        [`& .${treeItemClasses.label}`]: {
            fontSize: "0.89rem",
            fontWeight: 500,
        },
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        borderRadius: "80%",
        backgroundColor: theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.45)
            : theme.palette.primary.dark,
        color: theme.palette.mode === "dark" && theme.palette.primary.contrastText,
        padding: theme.spacing(0, 1.2),
    },
}));
const CustomTreeItem = React.forwardRef((props, ref) => (
// @ts-ignore
_jsx(StyledTreeItem, { ...props, slots: { groupTransition: TransitionComponent, ...props.slots }, ref: ref })));
export default function SettingsRoute() {
    return (_jsx(_Fragment, { children: _jsx(Box, { className: "transparent-scrollbar", sx: {
                overflow: "scroll",
                flex: "0 0 30%",
                minHeight: 20,
                overflowX: "hidden",
                borderRight: "solid rgba(0, 0, 0, 0.12)",
            }, children: _jsxs(SimpleTreeView, { "aria-label": "customized", defaultExpandedItems: ["1_x"], slots: {
                    // expandIcon: AddBoxIcon,
                    // collapseIcon: IndeterminateCheckBoxIcon,
                    endIcon: SettingsIcon,
                }, sx: {
                    userSelect: "none",
                    minHeight: 270,
                    maxWidth: 300,
                }, children: [_jsxs(CustomTreeItem, { slots: {
                            // expandIcon: AddBoxIcon,
                            // collapseIcon: IndeterminateCheckBoxIcon,
                            endIcon: EditIcon,
                        }, onClick: () => {
                            let targetElement = document.getElementById("settings_1_x");
                            targetElement.scrollIntoView();
                        }, itemId: "1_x", label: "\u57FA\u7840\u8BBE\u7F6E", children: [_jsx(CustomTreeItem, { slots: {
                                    endIcon: ContrastIcon,
                                }, onClick: () => {
                                    let targetElement = document.getElementById("settings_1_1");
                                    targetElement.scrollIntoView();
                                }, itemId: "1_2", label: "\u4E3B\u9898\u8BBE\u7F6E" }), _jsx(CustomTreeItem, { slots: {
                                    endIcon: EditIcon,
                                }, onClick: () => {
                                    let targetElement = document.getElementById("settings_1_2");
                                    targetElement.scrollIntoView();
                                }, itemId: "1_3", label: "\u7F16\u8F91\u5668\u8BBE\u7F6E" })] }), _jsxs(CustomTreeItem, { itemId: "2_x", label: "\u9AD8\u7EA7\u8BBE\u7F6E", children: [_jsx(CustomTreeItem, { itemId: "2_2", label: "\u5BFC\u51FA\u8BBE\u7F6E" }), _jsx(CustomTreeItem, { itemId: "2_3", label: "Mermaid\u8BBE\u7F6E" })] })] }) }) }));
}
