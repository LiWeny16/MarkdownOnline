import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useTranslation } from "react-i18next";
import { CustomTreeItem } from "../../Settings/Subsettings/SettingsRoute"; // 自定义树形节点组件
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { directoryStructure } from "./DirectoryContent";
// 动态渲染树形组件
function renderTreeItems(items, setActiveId, t) {
    return items.map((item) => (_jsx(CustomTreeItem, { itemId: item.id, label: t(item.labelKey), slots: { endIcon: item.children ? undefined : HelpOutlineIcon }, onClick: () => {
            if (item.id.slice(-1) !== "x") {
                setActiveId([item.id]);
            }
        }, children: item.children && renderTreeItems(item.children, setActiveId, t) }, item.id)));
}
export default function DirectoryRoute(props) {
    const { t } = useTranslation();
    // const linkToView = (id: string) => {
    //     let targetElement = document.getElementById(id) as HTMLElement;
    //     if (targetElement) targetElement.scrollIntoView();
    // };
    return (_jsx(Box, { className: "transparent-scrollbar", sx: {
            overflow: "scroll",
            flex: "0 0 35%",
            minHeight: 20,
            overflowX: "hidden",
            borderRight: "solid rgba(0, 0, 0, 0.12)",
        }, children: _jsx(SimpleTreeView, { "aria-label": "customized", defaultExpandedItems: ["1_x"], slots: {
                endIcon: HelpOutlineIcon,
            }, sx: {
                userSelect: "none",
                minHeight: 270,
                maxWidth: 300,
            }, children: renderTreeItems(directoryStructure, props.setActiveId, t) }) }));
}
