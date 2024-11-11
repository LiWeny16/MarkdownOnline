import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import clsx from "clsx";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderRounded from "@mui/icons-material/FolderRounded";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { unstable_useTreeItem2 as useTreeItem2, } from "@mui/x-tree-view/useTreeItem2";
import { TreeItem2Content, TreeItem2IconContainer, TreeItem2Label, TreeItem2Root, } from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { mdConverter } from "@Root/js";
import sortFileDirectoryArr from "@App/fileSystem/sort";
import { changeStates, getSettings, } from "@App/config/change";
import { supportedImageExtensions, } from "@App/fileSystem/file";
const ITEMS = [
    {
        id: "1",
        label: "Documents",
    },
    {
        id: "2",
        label: "Bookmarked",
        children: [{ id: "2.1", label: "Learning materials", fileType: "folder" }],
    },
];
function DotIcon() {
    return (_jsx(Box, { sx: {
            width: 8,
            height: 8,
            borderRadius: "100%",
            bgcolor: "warning.main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            verticalAlign: "middle",
            zIndex: 1,
            mx: 1,
        } }));
}
const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color: theme.palette.mode === "light"
        ? theme.palette.grey[800]
        : theme.palette.grey[400],
    position: "relative",
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
    },
}));
const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    flexDirection: "row-reverse",
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontWeight: 500,
    [`& .${treeItemClasses.iconContainer}`]: {
        marginRight: theme.spacing(2),
    },
    [`&.Mui-expanded `]: {
        "&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon": {
            color: theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
        },
        "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            left: "16px",
            top: "44px",
            height: "calc(100% - 48px)",
            width: "1.5px",
            backgroundColor: theme.palette.mode === "light"
                ? theme.palette.grey[300]
                : theme.palette.grey[700],
        },
    },
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.mode === "light" ? theme.palette.primary.main : "white",
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
        backgroundColor: theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}));
function TransitionComponent(props) {
    return _jsx(Collapse, { ...props });
}
const CustomLabel = ({ icon: Icon, expandable = false, children, draggable = false,
// onClick,
 }) => {
    return (_jsx(_Fragment, { children: _jsx(TreeItem2Label, { draggable: draggable, children: _jsxs(Box, { sx: {
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                }, children: [Icon && (_jsx(Box, { component: Icon, className: "labelIcon", color: "inherit", sx: { mr: 1, fontSize: "1.2rem" } })), _jsx(Typography, { sx: {
                            color: "inherit",
                            fontFamily: "General Sans",
                            fontWeight: 500,
                        }, variant: "body2", children: children }), expandable && _jsx(DotIcon, {})] }) }) }));
};
const isExpandable = (reactChildren) => {
    if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
};
const getIconFromFileType = (fileType) => {
    switch (fileType) {
        case "image":
            return ImageIcon;
        case "pdf":
            return PictureAsPdfIcon;
        case "doc":
            return ArticleIcon;
        case "video":
            return VideoCameraBackIcon;
        case "folder":
            return FolderRounded;
        case "pinned":
            return FolderOpenIcon;
        case "trash":
            return DeleteIcon;
        default:
            return ArticleIcon;
    }
};
const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    const { setIsDragging, fillText, folderManager, setExpandedFolderState, id, itemId, label, disabled, children, ...other } = props;
    const { getRootProps, getContentProps, getIconContainerProps, getLabelProps, getGroupTransitionProps, status, publicAPI, } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });
    let item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    let icon;
    if (expandable) {
        icon = FolderRounded;
    }
    else if (item.fileType) {
        icon = getIconFromFileType(item.fileType);
    }
    const handleClickFolderFile = async (_event) => {
        if (item.fileType === "file" && folderManager.fileState === 1) {
            try {
                changeStates({ unmemorable: { previewMode: true } });
                if (item.fileType &&
                    supportedImageExtensions.includes(item.label.slice(-3))) {
                    let content = `![${getSettings().advanced.imageSettings.basicStyle}](./${item.path})`;
                    fillText(content, item.label);
                }
                else if (item.fileType && item.label.slice(-3) === "pdf") {
                    // @[import](path/to/file.ext)
                    let content = `@[import](./${item.path})`;
                    fillText(content, item.label);
                }
                else {
                    changeStates({ unmemorable: { previewMode: false } });
                    let content = await folderManager.readFileContent(folderManager.getTopDirectoryHandle(), item.path);
                    fillText(content, item.label);
                    await mdConverter(false);
                }
            }
            catch (error) {
                console.error("Error reading file content:", error);
            }
        }
    };
    return (_jsx(_Fragment, { children: _jsx(TreeItem2Provider, { itemId: itemId, children: _jsxs(StyledTreeItemRoot, { onClick: handleClickFolderFile, draggable: false, ...getRootProps(other), children: [_jsxs(CustomTreeItemContent, { draggable: canItDrag(item), onDragStart: (e) => {
                            if (isImage(item)) {
                                setTimeout(() => {
                                    setIsDragging(true);
                                }, 400);
                                e.dataTransfer.effectAllowed = "copy"; // 允许拖拽复制
                                e.dataTransfer.setData("text/plain", `![${getSettings().advanced.imageSettings.basicStyle}](./${item.path})`);
                            }
                        }, ...getContentProps({
                            className: clsx("content", {
                                "Mui-expanded": status.expanded,
                                "Mui-selected": status.selected,
                                "Mui-focused": status.focused,
                                "Mui-disabled": status.disabled,
                            }),
                        }), children: [_jsx(TreeItem2IconContainer, { ...getIconContainerProps(), children: _jsx(TreeItem2Icon, { status: status }) }), _jsx(CustomLabel, { draggable: false, ...getLabelProps({
                                    icon,
                                    expandable: expandable && status.expanded,
                                }) })] }), children && _jsx(TransitionComponent, { ...getGroupTransitionProps() })] }) }) }));
});
export default function FileExplorer(props) {
    let sortedFileDirectoryArr = sortFileDirectoryArr(props.fileDirectoryArr);
    // 使用函数来传递 folderManager 到 CustomTreeItem
    const WrappedCustomTreeItem = (itemProps) => (_jsx(CustomTreeItem, { ...itemProps, fillText: props.fillText, setIsDragging: props.setIsDragging, folderManager: props.folderManager }));
    return (_jsx(RichTreeView, { items: sortedFileDirectoryArr ?? ITEMS, "aria-label": "file explorer", sx: {
            height: "100%",
            flexGrow: 1,
            userSelect: "none",
            maxWidth: 400,
            overflowY: "scroll",
            flex: 1,
        }, slots: { item: WrappedCustomTreeItem } }));
}
function canItDrag(item) {
    const extensionName = item.label.slice(-3);
    if (supportedImageExtensions.includes(extensionName)) {
        return true;
    }
    return false;
}
function isImage(item) {
    const extensionName = item.label.slice(-3);
    if (supportedImageExtensions.includes(extensionName)) {
        return true;
    }
    return false;
}
