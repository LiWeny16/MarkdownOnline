import * as React from "react"
import clsx from "clsx"
import { styled, alpha } from "@mui/material/styles"
import { TransitionProps } from "@mui/material/transitions"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import Typography from "@mui/material/Typography"
import ArticleIcon from "@mui/icons-material/Article"
import DeleteIcon from "@mui/icons-material/Delete"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import FolderRounded from "@mui/icons-material/FolderRounded"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack"
import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { treeItemClasses } from "@mui/x-tree-view/TreeItem"
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2"
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2"
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon"
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider"
import { TreeViewBaseItem } from "@mui/x-tree-view/models"
import { mdConverter } from "@Root/js"

type FileType =
  | "image"
  | "pdf"
  | "doc"
  | "video"
  | "folder"
  | "pinned"
  | "trash"

export type ExtendedTreeItemProps = {
  fileType?: FileType
  id: string
  label: string
}

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: "1",
    label: "Documents",
    children: [
      {
        id: "1.1",
        label: "Company",
        children: [
          { id: "1.1.1", label: "Invoice", fileType: "pdf" },
          { id: "1.1.4", label: "Equipment", fileType: "pdf" },
          { id: "1.1.5", label: "Video conference", fileType: "video" },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Bookmarked",
    children: [
      { id: "2.1", label: "Learning materials", fileType: "folder" },
      { id: "2.2", label: "News", fileType: "folder" },
    ],
  },
  {
    id: "3",
    label: "Bookmarked",
    children: [],
    fileType: "folder",
  },
]

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "70%",
        bgcolor: "warning.main",
        display: "inline-block",
        verticalAlign: "middle",
        zIndex: 1,
        mx: 1,
      }}
    />
  )
}
declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string
    "--tree-view-bg-color"?: string
  }
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color:
    theme.palette.mode === "light"
      ? theme.palette.grey[800]
      : theme.palette.grey[400],
  position: "relative",
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
})) as unknown as typeof TreeItem2Root

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
    "&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon":
      {
        color:
          theme.palette.mode === "light"
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
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
    },
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color:
      theme.palette.mode === "light" ? theme.palette.primary.main : "white",
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}))

function TransitionComponent(props: TransitionProps) {
  return <Collapse {...props} />
}

const StyledTreeItemLabelText = styled(Typography)({
  color: "inherit",
  fontFamily: "General Sans",
  fontWeight: 500,
}) as unknown as typeof Typography

interface CustomLabelProps {
  children: React.ReactNode
  icon?: React.ElementType
  expandable?: boolean
}

function CustomLabel({
  icon: Icon,
  expandable,
  children,
  ...other
}: CustomLabelProps) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: "1.2rem" }}
        />
      )}

      <StyledTreeItemLabelText variant="body2">
        {children}
      </StyledTreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItem2Label>
  )
}

const isExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable)
  }
  return Boolean(reactChildren)
}

const getIconFromFileType = (fileType: FileType) => {
  switch (fileType) {
    case "image":
      return ImageIcon
    case "pdf":
      return PictureAsPdfIcon
    case "doc":
      return ArticleIcon
    case "video":
      return VideoCameraBackIcon
    case "folder":
      return FolderRounded
    case "pinned":
      return FolderOpenIcon
    case "trash":
      return DeleteIcon
    default:
      return ArticleIcon
  }
}

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {
  folderManager: any
  fillText: any
}

const CustomTreeItem = React.forwardRef<HTMLLIElement, CustomTreeItemProps>(
  function CustomTreeItem(props, ref) {
    const {
      fillText,
      folderManager,
      id,
      itemId,
      label,
      disabled,
      children,
      ...other
    } = props
    const {
      getRootProps,
      getContentProps,
      getIconContainerProps,
      getLabelProps,
      getGroupTransitionProps,
      status,
      publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref })

    let item = publicAPI.getItem(itemId)
    const expandable = isExpandable(children)
    let icon
    if (expandable) {
      icon = FolderRounded
    } else if (item.fileType) {
      icon = getIconFromFileType(item.fileType)
    }

    // Function to handle click events on folder/file
    const handleClickFolderFile = async (
      _event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (item.fileType === "file" && folderManager.fileState === 1) {
        try {
          let content = await folderManager.readFileContent(
            folderManager.getTopDirectoryHandle(),
            item.path
          )
          fillText(content, item.label)
          await mdConverter(false)
        } catch (error) {
          console.error("Error reading file content:", error)
        }
      }
    }

    return (
      <TreeItem2Provider itemId={itemId}>
        <StyledTreeItemRoot {...getRootProps(other)}>
          <CustomTreeItemContent
            {...getContentProps({
              className: clsx("content", {
                "Mui-expanded": status.expanded,
                "Mui-selected": status.selected,
                "Mui-focused": status.focused,
                "Mui-disabled": status.disabled,
              }),
            })}
          >
            <TreeItem2IconContainer {...getIconContainerProps()}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>

            <CustomLabel
              // @ts-ignore
              onClick={handleClickFolderFile}
              {...getLabelProps({
                icon,
                expandable: expandable && status.expanded,
              })}
            />
          </CustomTreeItemContent>
          {children && <TransitionComponent {...getGroupTransitionProps()} />}
        </StyledTreeItemRoot>
      </TreeItem2Provider>
    )
  }
)

export default function FileExplorer(props: {
  fileDirectoryArr: any
  folderManager: any
  fillText: Function
}) {
  // 使用函数来传递 folderManager 到 CustomTreeItem
  const WrappedCustomTreeItem = (itemProps: any) => (
    <CustomTreeItem
      {...itemProps}
      fillText={props.fillText}
      folderManager={props.folderManager}
    />
  )
  return (
    <RichTreeView
      items={props.fileDirectoryArr ?? ITEMS}
      aria-label="file explorer"
      defaultExpandedItems={["1", "1.1"]}
      defaultSelectedItems="1.1"
      sx={{
        height: "fit-content",
        flexGrow: 1,
        userSelect: "none",
        maxWidth: 400,
        overflowY: "auto",
      }}
      slots={{ item: WrappedCustomTreeItem }}
    />
  )
}
