import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import Collapse from "@mui/material/Collapse";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import SettingsIcon from "@mui/icons-material/Settings";
import { TreeItem, treeItemClasses, } from "@mui/x-tree-view/TreeItem";
import ContrastIcon from "@mui/icons-material/Contrast";
import EditIcon from "@mui/icons-material/Edit";
import MicIcon from "@mui/icons-material/Mic";
import { styled, alpha } from "@mui/material/styles";
import { Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import RestoreIcon from "@mui/icons-material/Restore";
import { useTranslation } from "react-i18next";
function TransitionComponent(props) {
    return (
    // 这里太大了，不用了！
    _jsx(Collapse, { ...props }));
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
export { CustomTreeItem };
export default function SettingsRoute() {
    // 在组件中使用 useTranslation 钩子
    const { t } = useTranslation();
    function linkToView(id) {
        let targetElement = document.getElementById(id);
        targetElement.scrollIntoView();
    }
    return (_jsx(_Fragment, { children: _jsx(Box, { className: "transparent-scrollbar", sx: {
                overflow: "scroll",
                flex: "0 0 30%",
                minHeight: 20,
                overflowX: "hidden",
                borderRight: "solid rgba(0, 0, 0, 0.12)",
            }, children: _jsxs(SimpleTreeView, { "aria-label": "customized", defaultExpandedItems: ["1_x", "2_x"], slots: {
                    endIcon: SettingsIcon,
                }, sx: {
                    userSelect: "none",
                    minHeight: 270,
                    maxWidth: 300,
                }, children: [_jsxs(CustomTreeItem, { slots: {
                            endIcon: EditIcon,
                        }, onClick: () => {
                            linkToView("settings_1_x");
                        }, itemId: "1_x", label: t("t-basic-settings"), children: [_jsx(CustomTreeItem, { slots: {
                                    endIcon: ContrastIcon,
                                }, onClick: () => {
                                    linkToView("settings_1_1");
                                }, itemId: "1_1", label: t("t-theme-settings") }), _jsx(CustomTreeItem, { slots: {
                                    endIcon: GTranslateIcon,
                                }, onClick: () => {
                                    linkToView("settings_1_2");
                                }, itemId: "1_2", label: t("t-language-settings") }), _jsx(CustomTreeItem, { slots: {
                                    endIcon: EditIcon,
                                }, onClick: () => {
                                    linkToView("settings_1_3");
                                }, itemId: "1_3", label: t("t-editor-settings") }), _jsx(CustomTreeItem, { slots: {
                                    endIcon: MicIcon,
                                }, onClick: () => {
                                    let targetElement = document.getElementById("settings_1_4");
                                    targetElement.scrollIntoView();
                                }, itemId: "1_4", label: t("t-speech-to-text") })] }), _jsxs(CustomTreeItem, { onClick: () => {
                            linkToView("settings_2_x");
                        }, itemId: "2_x", label: t("t-advanced-settings"), children: [_jsx(CustomTreeItem, { onClick: () => {
                                    linkToView("settings_2_1");
                                }, itemId: "2_1", label: t("t-export-settings") }), _jsx(CustomTreeItem, { onClick: () => {
                                    linkToView("settings_2_2");
                                }, itemId: "2_2", label: t("t-mermaid-settings") }), _jsx(CustomTreeItem, { slots: {
                                    endIcon: ImageIcon,
                                }, onClick: () => {
                                    linkToView("settings_2_3");
                                }, itemId: "2_3", label: t("t-image-settings") }), _jsx(CustomTreeItem, { slots: {
                                    endIcon: RestoreIcon,
                                }, onClick: () => {
                                    linkToView("settings_2_7");
                                }, itemId: "2_7", label: t("t-reset-initialization") })] })] }) }) }));
}
