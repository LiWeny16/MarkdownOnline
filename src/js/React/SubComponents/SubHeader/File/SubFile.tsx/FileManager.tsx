import * as React from "react"
import clsx from "clsx"
import { styled, alpha, useTheme } from "@mui/material/styles"
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
import EditIcon from "@mui/icons-material/Edit"
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder"
import NoteAddIcon from "@mui/icons-material/NoteAdd"
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
import sortFileDirectoryArr from "@App/fileSystem/sort"
import {
  changeStates,
  getSettings,
  getStatesMemorable,
} from "@App/config/change"
import {
  FileFolderManager,
  supportedImageExtensions,
} from "@App/fileSystem/file"
import { Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Divider } from "@mui/material"
import { useTranslation } from "react-i18next"
import alertUseArco from "@App/message/alert"
import { createPortal } from "react-dom"

// 懒加载配置常量
const MAX_EAGER_DEPTH = 3 // 超过此深度的目录将使用懒加载

// 路径标准化工具函数 (与File.tsx保持一致)
const normalizePath = (path: string): string => {
  if (!path) return ""
  
  // 移除多余的斜杠并标准化路径分隔符
  return path
    .replace(/[\/\\]+/g, '/')  // 将多个斜杠或反斜杠替换为单个正斜杠
    .replace(/^\/+|\/+$/g, '') // 移除开头和结尾的斜杠
    .trim()
}

// 生成基于路径的稳定ID
const generateStableId = (path: string, fileType: string): string => {
  const normalizedPath = normalizePath(path)
  return `${fileType}:${normalizedPath}` // 使用文件类型和路径作为稳定ID
}

// 计算路径深度
const getPathDepth = (path: string): number => {
  const normalizedPath = normalizePath(path)
  if (!normalizedPath) return 0
  return normalizedPath.split('/').length
}

// 检查是否应该懒加载
const shouldLazyLoad = (path: string, fileType: string): boolean => {
  if (fileType !== 'folder') return false
  const depth = getPathDepth(path)
  return depth >= MAX_EAGER_DEPTH
}

// 添加样式支持懒加载动画
const GlobalStyles = styled('div')`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .lazy-placeholder {
    opacity: 0.7;
    font-style: italic;
    
    &.loading {
      opacity: 0.5;
    }
  }
  
  .lazy-placeholder:hover {
    opacity: 1;
    background-color: ${alpha('#1976d2', 0.08)};
  }
`

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
  },
  {
    id: "2",
    label: "Bookmarked",
    children: [{ id: "2.1", label: "Learning materials", fileType: "folder" }],
  },
]

function DotIcon() {
  return (
    <Box
      sx={{
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
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2.5),
    borderLeft: `1px dashed ${theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700]}`,
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
  // 移除拖拽样式，不显示移动图标
  "&[draggable='true']": {
    cursor: "default", // 改为默认光标
    "&:active": {
      opacity: 1, // 移除透明度变化
    },
  },
  // 拖拽悬停目标样式
  "&.drag-over": {
    backgroundColor: alpha(theme.palette.success.main, 0.2),
    border: `2px dashed ${theme.palette.success.main}`,
  },
}))

function TransitionComponent(props: TransitionProps & { className?: string }) {
  return (
    <Collapse 
      {...props} 
      className={clsx(props.className, treeItemClasses.groupTransition)}
    />
  )
}
interface CustomLabelProps {
  children: React.ReactNode
  icon?: React.ElementType
  expandable?: boolean
  draggable: boolean
  // onClick: React.MouseEventHandler<HTMLDivElement>
}
const CustomLabel: React.FC<CustomLabelProps> = ({
  icon: Icon,
  expandable = false,
  children,
  draggable = false,
  // onClick,
}) => {
  return (
    <>
      <TreeItem2Label draggable={draggable}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
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

          <Typography
            sx={{
              color: "inherit",
              fontFamily: "General Sans",
              fontWeight: 500,
            }}
            variant="body2"
          >
            {children}
          </Typography>
          {expandable && <DotIcon />}
        </Box>
      </TreeItem2Label>
    </>
  )
}

const isExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable)
  }
  return Boolean(reactChildren)
}

// 右键菜单组件（使用 Portal 渲染到 body）
function ContextMenu({
  visible,
  x,
  y,
  onClose,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
  isFile = false,
  isRoot = false // 新增：是否为根目录菜单
}: {
  visible: boolean
  x: number
  y: number
  onClose: () => void
  onNewFile: () => void
  onNewFolder: () => void
  onRename: () => void
  onDelete: () => void
  isFile?: boolean
  isRoot?: boolean // 新增
}) {
  const { t } = useTranslation()
  const menuRef = React.useRef<HTMLDivElement>(null)

  // 全局点击关闭菜单
  React.useEffect(() => {
    if (!visible) return

    console.log('Setting up global click listener for context menu')

    const handleGlobalClick = (event: MouseEvent) => {
      // 过滤掉右键点击事件
      if (event.button === 2) {
        return
      }

      // 如果点击的是菜单内部，不关闭
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        console.log('Click inside menu, keeping open')
        return
      }

      console.log('Click outside menu, closing')
      onClose()
    }

    const handleGlobalContextMenu = (event: MouseEvent) => {
      // 阻止其他右键菜单
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log('Right click outside menu, closing')
        onClose()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed, closing menu')
        onClose()
      }
    }

    // 延迟添加事件监听器，避免立即触发
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleGlobalClick) // 使用 mousedown 代替 click
      document.addEventListener('contextmenu', handleGlobalContextMenu)
      document.addEventListener('keydown', handleEscapeKey)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleGlobalClick)
      document.removeEventListener('contextmenu', handleGlobalContextMenu)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [visible, onClose])

  if (!visible) return null

  // 调整菜单位置，确保不超出屏幕
  const adjustedX = Math.min(x, window.innerWidth - 220)
  const adjustedY = Math.min(y, window.innerHeight - 240)

  console.log('Rendering context menu at:', adjustedX, adjustedY, isRoot ? '(Root menu)' : '')

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: adjustedY,
    left: adjustedX,
    zIndex: 999999, // 非常高的 z-index
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    minWidth: 200,
    padding: 4,
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    userSelect: 'none',
    // 确保菜单始终可见
    pointerEvents: 'auto',
    // 防止被其他元素覆盖
    isolation: 'isolate',
  }

  const menuItemStyle: React.CSSProperties = {
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'background-color 0.1s',
  }

  return createPortal(
    <div
      ref={menuRef}
      style={menuStyle}
      onClick={(e) => e.stopPropagation()} // 阻止点击冒泡
      onContextMenu={(e) => e.preventDefault()} // 阻止右键菜单
    >
      {/* 根目录或文件夹：显示新建文件和新建文件夹选项 */}
      {(isRoot || !isFile) && (
        <>
          <div
            style={menuItemStyle}
            onClick={(e) => {
              e.stopPropagation()
              onNewFile()
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>📄</span>
            <span>{t("t-file-manager-new-file")}</span>
          </div>

          <div
            style={menuItemStyle}
            onClick={(e) => {
              e.stopPropagation()
              onNewFolder()
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>📁</span>
            <span>{t("t-file-manager-new-folder")}</span>
          </div>

          {/* 只有非根目录才显示分隔线和其他选项 */}
          {!isRoot && <div style={{ height: 1, backgroundColor: '#eee', margin: '4px 0' }} />}
        </>
      )}

      {/* 重命名和删除选项：只有非根目录的文件和文件夹才有 */}
      {!isRoot && (
        <>
          <div
            style={menuItemStyle}
            onClick={(e) => {
              e.stopPropagation()
              onRename()
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>✏️</span>
            <span>{t("t-file-manager-rename")}</span>
          </div>

          <div
            style={{
              ...menuItemStyle,
              color: '#ff4d4f',
            }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff2f0'
              e.currentTarget.style.color = '#ff4d4f'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#ff4d4f'
            }}
          >
            <span>🗑️</span>
            <span>{t("t-file-manager-delete")}</span>
          </div>
        </>
      )}
    </div>,
    document.body // 渲染到 body
  )
}

// 空文件夹提示组件
function EmptyFolderPlaceholder({ onCreateFile, onCreateFolder }: {
  onCreateFile: () => void
  onCreateFolder: () => void
}) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 200,
        padding: "24px 16px",
        textAlign: "center",
        margin: "8px 4px", // 与文件树的 padding 保持一致
      }}
    >
      <FolderOpenIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.6 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: "1rem", fontWeight: 500 }}>
        {t("t-file-manager-empty-folder")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, opacity: 0.7, maxWidth: 280 }}>
        {t("t-file-manager-empty-folder-desc")}
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<NoteAddIcon />}
          onClick={onCreateFile}
          sx={{ 
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.875rem"
          }}
        >
          {t("t-file-manager-new-file")}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CreateNewFolderIcon />}
          onClick={onCreateFolder}
          sx={{ 
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.875rem"
          }}
        >
          {t("t-file-manager-new-folder")}
        </Button>
      </Box>
    </Box>
  )
}

// 输入对话框组件
function InputDialog({
  open,
  title,
  label,
  onClose,
  onConfirm,
  defaultValue = ""
}: {
  open: boolean
  title: string
  label: string
  onClose: () => void
  onConfirm: (value: string) => void
  defaultValue?: string
}) {
  const { t } = useTranslation()
  const [value, setValue] = React.useState(defaultValue)

  React.useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue, open])

  // 调试
  React.useEffect(() => {
    console.log('InputDialog state changed:', { open, title, label, defaultValue })
  }, [open, title, label, defaultValue])

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim())
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          zIndex: 999999, // 提高z-index，确保在FileManager之上
        },
      }}
      style={{
        zIndex: 999999, // 同时设置Modal容器的z-index
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleConfirm()
            }
          }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("t-image-manager-confirm-no")}</Button>
        <Button onClick={handleConfirm} variant="contained">{t("t-image-manager-confirm-yes")}</Button>
      </DialogActions>
    </Dialog>
  )
}

// 确认删除对话框组件
function ConfirmDeleteDialog({
  open,
  title,
  message,
  onClose,
  onConfirm
}: {
  open: boolean
  title: string
  message: string
  onClose: () => void
  onConfirm: () => void
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose}
      PaperProps={{
        style: {
          zIndex: 999999, // 提高z-index，确保在FileManager之上
        },
      }}
      style={{
        zIndex: 999999, // 同时设置Modal容器的z-index
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("t-image-manager-confirm-no")}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">{t("t-image-manager-confirm-yes")}</Button>
      </DialogActions>
    </Dialog>
  )
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

// 添加当前正在编辑的文件状态管理
interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {
  folderManager: FileFolderManager
  fillText: any
  setExpandedFolderState: Function
  setIsDragging: Function
  onRefresh: () => void
  onManualRefresh?: (operationType?: string) => Promise<void> // 手动操作刷新回调 - 支持操作类型参数
  // 右键菜单相关
  contextMenuState: { mouseX: number; mouseY: number; itemId: string } | null
  onShowContextMenu: (event: React.MouseEvent, itemId: string) => void
  onCloseContextMenu: () => void
  // 对话框相关
  inputDialog: {
    open: boolean
    type: 'newFile' | 'newFolder' | 'rename'
    title: string
    label: string
    defaultValue: string
    itemId: string
  }
  confirmDialog: {
    open: boolean
    title: string
    message: string
    action: () => void
    itemId: string
  }
  onShowInputDialog: (dialog: Omit<CustomTreeItemProps['inputDialog'], 'open'> & { open: true }) => void
  onShowConfirmDialog: (dialog: Omit<CustomTreeItemProps['confirmDialog'], 'open'> & { open: true }) => void
  onCloseInputDialog: () => void
  onCloseConfirmDialog: () => void
  onConfirmInput: (value: string) => void
  onConfirmDelete: () => void
  // 添加懒加载支持
  onLoadLazily?: (itemId: string, folderPath: string) => Promise<void>
  // 添加当前编辑文件状态
  currentEditingFile?: string // 当前正在编辑的文件路径
  onFileSelect?: (filePath: string) => void // 文件选中回调
}

const CustomTreeItem = React.forwardRef<HTMLLIElement, CustomTreeItemProps>(
  function CustomTreeItem(props, ref) {
    const {
      setIsDragging,
      fillText,
      folderManager,
      setExpandedFolderState,
      onRefresh,
      onManualRefresh,
      contextMenuState,
      onShowContextMenu,
      onCloseContextMenu,
      inputDialog,
      confirmDialog,
      onShowInputDialog,
      onShowConfirmDialog,
      onCloseInputDialog,
      onCloseConfirmDialog,
      onConfirmInput,
      onConfirmDelete,
      onLoadLazily,
      currentEditingFile,
      onFileSelect,
      id,
      itemId,
      label,
      disabled,
      children,
      ...other
    } = props

    const { t } = useTranslation()
    const theme = useTheme()
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false) // 添加加载状态

    // 检查当前项是否有活动的右键菜单
    const hasActiveContextMenu = contextMenuState?.itemId === itemId

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
    
    // 检查当前文件是否为正在编辑的文件
    const isCurrentlyEditing = currentEditingFile && item.path === currentEditingFile && item.fileType === 'file'
    
    // 处理懒加载占位符
    if (item.fileType === 'lazy-placeholder') {
      // 使用字符串图标作为占位符
      icon = undefined
    } else if (expandable) {
      icon = FolderRounded
    } else if (item.fileType) {
      icon = getIconFromFileType(item.fileType)
    }

    // 处理懒加载点击
    const handleLazyLoad = async () => {
      if (item.fileType === 'lazy-placeholder' && onLoadLazily) {
        setIsLoading(true)
        try {
          // 标准化路径并获取父文件夹路径：从懒加载占位符路径中去掉 '/[lazy-placeholder]'
          const parentPath = normalizePath(item.path.replace('/[lazy-placeholder]', ''))
          console.log('Lazy loading triggered for:', parentPath, 'from placeholder:', item.path)
          await onLoadLazily(itemId, parentPath)
        } catch (error) {
          console.error('Error loading lazily:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    // 右键菜单处理
    const handleContextMenu = (event: React.MouseEvent) => {
      // 懒加载占位符不显示右键菜单
      if (item.fileType === 'lazy-placeholder') {
        return
      }
      
      event.preventDefault()
      event.stopPropagation()

      console.log('Right click detected on:', item.label)
      console.log('Event coordinates:', event.clientX, event.clientY)

      onShowContextMenu(event, itemId)
    }

    // 阻止右键点击时的默认行为（包括选中状态变化）
    const handleRootContextMenu = (event: React.MouseEvent) => {
      handleContextMenu(event)
      // 阻止事件传播到 TreeView，防止选中状态变化
      event.nativeEvent.stopImmediatePropagation?.()
    }

    const handleCloseContextMenu = () => {
      console.log('Closing context menu')
      onCloseContextMenu()
    }

    // 文件操作函数
    const handleNewFile = () => {
      console.log('handleNewFile called for item:', item.label, 'path:', item.path) // 调试
      onShowInputDialog({
        open: true,
        type: 'newFile',
        title: t("t-file-manager-new-file"),
        label: t("t-file-manager-new-file-name"),
        defaultValue: '',
        itemId
      })
      console.log('InputDialog state set, closing context menu') // 调试
      handleCloseContextMenu()
    }

    const handleNewFolder = () => {
      console.log('handleNewFolder called for item:', item.label, 'path:', item.path) // 调试
      onShowInputDialog({
        open: true,
        type: 'newFolder',
        title: t("t-file-manager-new-folder"),
        label: t("t-file-manager-new-folder-name"),
        defaultValue: '',
        itemId
      })
      console.log('InputDialog state set, closing context menu') // 调试
      handleCloseContextMenu()
    }

    const handleRename = () => {
      console.log('handleRename called for item:', item.label, 'path:', item.path) // 调试
      onShowInputDialog({
        open: true,
        type: 'rename',
        title: t("t-file-manager-rename"),
        label: t("t-file-manager-rename-name"),
        defaultValue: item.label,
        itemId
      })
      handleCloseContextMenu()
    }

    const handleDelete = () => {
      console.log('handleDelete called for item:', item.label, 'path:', item.path) // 调试
      const isFolder = item.fileType === 'folder'
      const message = isFolder
        ? t("t-file-manager-confirm-delete-folder", { name: item.label })
        : t("t-file-manager-confirm-delete-file", { name: item.label })

      onShowConfirmDialog({
        open: true,
        title: t("t-file-manager-confirm-delete"),
        message,
        action: async () => {
          try {
            const topDirHandle = folderManager.getTopDirectoryHandle()
            if (!topDirHandle) return

            // 检查是否删除的是当前正在编辑的文件或包含该文件的文件夹
            const isCurrentlyEditingThisItem = currentEditingFile === item.path
            const isCurrentlyEditingInThisFolder = isFolder && currentEditingFile && currentEditingFile.startsWith(item.path + '/')

            if (isFolder) {
              await folderManager.deleteFolderAtPath(topDirHandle, item.path)
            } else {
              await folderManager.deleteFileAtPath(topDirHandle, item.path)
            }

            // 如果删除的是当前正在编辑的文件或其所在文件夹，清空高亮状态
            if (isCurrentlyEditingThisItem || isCurrentlyEditingInThisFolder) {
              console.log('Deleted currently editing file/folder, clearing selection')
              onFileSelect?.('')
            }

            alertUseArco(t("t-file-manager-delete-success"), 2000, { kind: "success" })
            onRefresh()
            // 删除成功后关闭确认对话框
            onCloseConfirmDialog()
          } catch (error) {
            console.error("Delete error:", error)
            alertUseArco(t("t-file-manager-operation-failed"), 2000, { kind: "error" })
            // 即使出错也关闭对话框
            onCloseConfirmDialog()
          }
        },
        itemId
      })
      handleCloseContextMenu()
    }

    // 添加文件格式支持检查函数
    const isSupportedFile = (item: { label: string }) => {
      const fileName = item.label.toLowerCase()
      const lastDotIndex = fileName.lastIndexOf('.')
      
      if (lastDotIndex === -1) return false // 没有扩展名
      
      const extensionName = fileName.substring(lastDotIndex + 1)
      
      // 检查是否为支持的图片格式
      if (supportedImageExtensions.includes(extensionName)) {
        return true
      }
      
      // 检查是否为PDF格式
      if (extensionName === 'pdf') {
        return true
      }
      
      // 检查是否为支持的文本文件格式
      const supportFileTypes = [
        "md", "txt", "go", "java", "kt", "py", "js", "ts", "html", "css", 
        "c", "cpp", "json", "mjs", "jsx", "tsx", "ps1", "cmd", "xsl", 
        "toml", "ipynb", "makefile", "yml"
      ]
      
      return supportFileTypes.includes(extensionName)
    }

    // 添加PDF检查函数
    const isPDF = (item: { label: string }) => {
      return item.label.toLowerCase().endsWith('.pdf')
    }

    const handleClickFolderFile = async (
      _event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
      // 处理懒加载占位符点击
      if (item.fileType === 'lazy-placeholder') {
        await handleLazyLoad()
        return
      }

      if (item.fileType === "file" && folderManager.fileState === 1) {
        try {
          // 检查文件是否支持，如果不支持则提前返回，不改变高亮状态
          if (!isSupportedFile(item)) {
            const fileName = item.label.toLowerCase()
            const lastDotIndex = fileName.lastIndexOf('.')
            const extensionName = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : '未知'
            
            alertUseArco(t("t-file-format-not-supported", { extension: extensionName }), 2000, { kind: "warning" })
            return // 直接返回，不执行后续操作，保持原有高亮状态
          }

          changeStates({ unmemorable: { previewMode: true } })

          if (isImage(item)) {
            let content = `![${getSettings().advanced.imageSettings.basicStyle}](./${item.path})`
            fillText(content, item.label)
            // 只有成功处理图片后才更新高亮状态
            onFileSelect?.(item.path)
          } else if (isPDF(item)) {
            // @[import](path/to/file.ext)
            let content = `@[import](./${item.path})`
            fillText(content, item.label)
            // 只有成功处理PDF后才更新高亮状态
            onFileSelect?.(item.path)
          } else {
            changeStates({ unmemorable: { previewMode: false } })
            let content = await folderManager.readFileContent(
              folderManager.getTopDirectoryHandle()!,
              item.path
            )
            fillText(content, item.label)
            await mdConverter(false)
            // 只有成功读取文本文件后才更新高亮状态
            onFileSelect?.(item.path)
          }
        } catch (error) {
          console.error("Error reading file content:", error)
          // 发生错误时不更新高亮状态，保持原有状态
          alertUseArco(t("t-error-opening-file"), 2000, { kind: "error" })
        }
      }
    }

    // 拖拽处理函数
    const handleDragStart = (e: React.DragEvent) => {
      // 懒加载占位符不允许拖拽
      if (item.fileType === 'lazy-placeholder') {
        e.preventDefault()
        return
      }

      console.log('Drag start:', item.label, 'path:', item.path)
      
      // 对于图片文件，允许复制和移动两种操作
      if (isImage(item)) {
        e.dataTransfer.effectAllowed = "copyMove" // 允许复制和移动
        setTimeout(() => {
          setIsDragging(true)
        }, 400)
        e.dataTransfer.setData(
          "text/html",
          `![${getSettings().advanced.imageSettings.basicStyle}](./${item.path})`
        )
      } else {
        e.dataTransfer.effectAllowed = "move" // 其他文件只允许移动
      }
      
      // 所有文件都设置 text/plain 数据用于文件移动
      e.dataTransfer.setData("text/plain", JSON.stringify({
        itemId: itemId,
        label: item.label,
        path: item.path,
        fileType: item.fileType
      }))
    }

    const handleDragOver = (e: React.DragEvent) => {
      // 懒加载占位符不接受拖拽
      if (item.fileType === 'lazy-placeholder') {
        return
      }

      // 对于文件夹，允许文件移动操作
      if (item.fileType === 'folder') {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        setIsDragOver(true)
      }
      // 对于文件，不阻止默认行为，允许拖拽到编辑器
      // 但是如果是在文件管理器内部拖拽，文件夹会处理接收
    }

    const handleDragLeave = (e: React.DragEvent) => {
      // 检查是否真的离开了元素（避免子元素触发）
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false)
      }
    }

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      
      // 懒加载占位符和普通文件不接受拖拽
      if (item.fileType !== 'folder') return

      try {
        const dragData = JSON.parse(e.dataTransfer.getData("text/plain"))
        const { itemId: draggedItemId, label: draggedLabel, path: draggedPath, fileType: draggedFileType } = dragData

        // 防止拖拽到自身
        if (draggedItemId === itemId) return

        // 防止拖拽父文件夹到子文件夹
        if (draggedFileType === 'folder' && item.path.startsWith(draggedPath)) {
          alertUseArco(t("t-file-manager-invalid-move"), 2000, { kind: "warning" })
          return
        }

        // 检查是否已经在目标文件夹中（避免无意义的移动）
        const draggedParentPath = draggedPath.includes('/') ? draggedPath.substring(0, draggedPath.lastIndexOf('/')) : ''
        if (draggedParentPath === item.path) {
          // 文件已经在目标文件夹中，不需要移动
          return
        }

        const topDirHandle = folderManager.getTopDirectoryHandle()
        if (!topDirHandle) return

        console.log(`Moving ${draggedLabel} from "${draggedParentPath}" to "${item.path}"`)

        // 检查是否移动的是当前正在编辑的文件或包含该文件的文件夹
        const isMovingCurrentlyEditingFile = currentEditingFile === draggedPath
        const isMovingCurrentlyEditingFolder = draggedFileType === 'folder' && currentEditingFile && currentEditingFile.startsWith(draggedPath + '/')

        let actualUsedName = draggedLabel // 默认使用原始名称
        
        if (draggedFileType === 'folder') {
          actualUsedName = await folderManager.moveFolder(topDirHandle, draggedPath, item.path)
        } else {
          actualUsedName = await folderManager.moveFileByPath(topDirHandle, draggedPath, item.path)
        }

        // 如果移动的是当前正在编辑的文件或其所在文件夹，更新或清理状态
        if (isMovingCurrentlyEditingFile) {
          if (actualUsedName !== draggedLabel) {
            // 文件被重命名了，清除当前编辑状态（因为文件名已变）
            console.log(`Moved currently editing file was renamed from '${draggedLabel}' to '${actualUsedName}', clearing editing state`)
            onFileSelect?.('') // 清空当前编辑文件状态
          } else {
            // 文件名未变，更新路径
            const newPath = item.path ? `${item.path}/${actualUsedName}` : actualUsedName
            console.log(`Moved currently editing file, updating path from '${draggedPath}' to '${newPath}'`)
            onFileSelect?.(newPath)
          }
        } else if (isMovingCurrentlyEditingFolder && currentEditingFile) {
          if (actualUsedName !== draggedLabel) {
            // 文件夹被重命名了，清除当前编辑状态
            console.log(`Moved folder containing currently editing file was renamed from '${draggedLabel}' to '${actualUsedName}', clearing editing state`)
            onFileSelect?.('') // 清空当前编辑文件状态
          } else {
            // 文件夹名未变，更新文件夹内文件的路径
            const relativePath = currentEditingFile.substring(draggedPath.length + 1)
            const newPath = item.path ? `${item.path}/${actualUsedName}/${relativePath}` : `${actualUsedName}/${relativePath}`
            console.log(`Moved folder containing currently editing file, updating path from '${currentEditingFile}' to '${newPath}'`)
            onFileSelect?.(newPath)
          }
        }

        // 显示移动成功消息，包含实际使用的名称信息
        if (actualUsedName !== draggedLabel) {
          alertUseArco(`${t("t-file-manager-move-success")} (${draggedLabel} → ${actualUsedName})`, 3000, { kind: "success" })
        } else {
          alertUseArco(t("t-file-manager-move-success"), 2000, { kind: "success" })
        }
        
        // 强制立即刷新UI - 添加小延迟确保文件系统操作完全完成
        setTimeout(async () => {
          console.log('Executing immediate refresh after file move')
          if (props.onManualRefresh) {
            await props.onManualRefresh('file_move')
          } else {
            onRefresh()
          }
        }, 50) // 50ms延迟确保操作完成
      } catch (error) {
        console.error("Move error:", error)
        alertUseArco(t("t-file-manager-operation-failed"), 2000, { kind: "error" })
      }
    }

    // 渲染懒加载占位符
    if (item.fileType === 'lazy-placeholder') {
      return (
        <div style={{ position: 'relative' }}>
          <TreeItem2Provider itemId={itemId}>
            <StyledTreeItemRoot
              onClick={handleLazyLoad}
              {...getRootProps(other)}
              style={{ 
                position: 'relative',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'wait' : 'pointer'
              }}
            >
              <CustomTreeItemContent
                {...getContentProps({
                  className: clsx("content", "lazy-placeholder", {
                    "loading": isLoading
                  }),
                })}
              >
                <TreeItem2IconContainer {...getIconContainerProps()}>
                  {isLoading ? (
                    <div style={{ animation: 'spin 1s linear infinite', fontSize: '1.2rem' }}>⟳</div>
                  ) : (
                    <TreeItem2Icon status={status} />
                  )}
                </TreeItem2IconContainer>

                <CustomLabel
                  draggable={false}
                  {...getLabelProps({
                    icon: undefined,
                    expandable: false,
                  })}
                >
                  {isLoading ? t("t-file-manager-loading") : t("t-file-manager-load-more")}
                </CustomLabel>
              </CustomTreeItemContent>
            </StyledTreeItemRoot>
          </TreeItem2Provider>
        </div>
      )
    }

    return (
      <div style={{ position: 'relative' }}>
        <TreeItem2Provider itemId={itemId}>
          <StyledTreeItemRoot
            onClick={handleClickFolderFile}
            onContextMenu={handleRootContextMenu}
            draggable={false}
            {...getRootProps(other)}
            style={{ position: 'relative' }}
          >
            <CustomTreeItemContent
              draggable={canItDrag(item)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              {...getContentProps({
                className: clsx("content", {
                  "Mui-expanded": status.expanded,
                  // 移除MUI默认的选中样式，使用自定义逻辑
                  "Mui-selected": false, // 始终为false，不依赖MUI的选中状态
                  "Mui-focused": false,  // 始终为false，不依赖MUI的聚焦状态
                  "Mui-disabled": status.disabled,
                  // 添加自定义的编辑中样式
                  "custom-editing": isCurrentlyEditing,
                }),
                style: {
                  // 自定义样式：只有正在编辑的文件才显示深色背景
                  backgroundColor: isCurrentlyEditing ? 
                    (theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.primary.dark) : 
                    'transparent',
                  color: isCurrentlyEditing ? 
                    theme.palette.primary.contrastText : 
                    'inherit',
                }
              })}
            >
              <TreeItem2IconContainer {...getIconContainerProps()}>
                <TreeItem2Icon status={status} />
              </TreeItem2IconContainer>

              <CustomLabel
                draggable={false}
                {...getLabelProps({
                  icon,
                  expandable: expandable && status.expanded,
                })}
              />
            </CustomTreeItemContent>
            {children && <TransitionComponent {...getGroupTransitionProps()} />}
          </StyledTreeItemRoot>
        </TreeItem2Provider>

        {/* 使用新的 ContextMenu 组件 */}
        <ContextMenu
          visible={hasActiveContextMenu}
          x={contextMenuState?.mouseX || 0}
          y={contextMenuState?.mouseY || 0}
          onClose={handleCloseContextMenu}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
          onRename={handleRename}
          onDelete={handleDelete}
          isFile={item.fileType === 'file'}
          isRoot={false}
        />

      </div>
    )
  }
)

export default function FileExplorer(props: {
  fileDirectoryArr: any
  folderManager: FileFolderManager
  setIsDragging: Function
  fillText: Function
  onRefresh?: () => void // 普通刷新回调
  onManualRefresh?: (operationType?: string) => Promise<void> // 手动操作刷新回调（立即执行）- 支持操作类型参数
  currentEditingFile?: string // 当前正在编辑的文件路径  
  onFileSelect?: (filePath: string) => void // 文件选中回调
  onLoadLazily?: (itemId: string, folderPath: string) => Promise<void> // 懒加载回调
}) {
  const { t } = useTranslation()
  let sortedFileDirectoryArr = sortFileDirectoryArr(props.fileDirectoryArr)

  // 右键菜单状态管理
  const [contextMenuState, setContextMenuState] = React.useState<{
    mouseX: number
    mouseY: number
    itemId: string
  } | null>(null)

  // 输入对话框状态
  const [inputDialog, setInputDialog] = React.useState<{
    open: boolean
    type: 'newFile' | 'newFolder' | 'rename'
    title: string
    label: string
    defaultValue: string
    itemId: string
  }>({
    open: false,
    type: 'newFile',
    title: '',
    label: '',
    defaultValue: '',
    itemId: ''
  })

  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean
    title: string
    message: string
    action: () => void
    itemId: string
  }>({
    open: false,
    title: '',
    message: '',
    action: () => { },
    itemId: ''
  })

  // 添加根目录拖拽状态
  const [isRootDragOver, setIsRootDragOver] = React.useState(false)
  
  // 添加懒加载状态管理
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set())

  // 懒加载处理函数
  const handleLoadLazily = React.useCallback(async (itemId: string, folderPath: string) => {
    // 如果父组件提供了懒加载回调，优先使用父组件的
    if (props.onLoadLazily) {
      return props.onLoadLazily(itemId, folderPath)
    }
    
    // 否则使用内部实现（保持向后兼容）
    try {
      const topDirHandle = props.folderManager.getTopDirectoryHandle()
      if (!topDirHandle) return

      // 修复路径：移除懒加载占位符部分
      const actualFolderPath = normalizePath(folderPath.replace('/[lazy-placeholder]', ''))
      console.log('Loading folder lazily:', actualFolderPath, 'from placeholder:', folderPath)
      
      // 使用懒加载方法获取子内容
      const children = await props.folderManager.loadFolderLazily(topDirHandle, actualFolderPath)
      
      if (!children || children.length === 0) {
        console.log('No children found for:', actualFolderPath)
        return
      }
      
      // 处理子项，为每个项目分配稳定ID和正确的懒加载状态
      const processedChildren = children.map((child: any) => {
        const childPath = normalizePath(child.path || `${actualFolderPath}/${child.label}`)
        const childId = generateStableId(childPath, child.fileType)
        
        if (child.fileType === 'folder') {
          // 根据深度决定是否添加懒加载占位符
          const needsLazyLoading = shouldLazyLoad(childPath, 'folder')
          return {
            ...child,
            id: childId,
            path: childPath,
            children: needsLazyLoading ? [{
              id: generateStableId(`${childPath}/[lazy-placeholder]`, 'lazy-placeholder'),
              label: "...",
              fileType: "lazy-placeholder",
              path: `${childPath}/[lazy-placeholder]`,
            }] : child.children
          }
        } else {
          return {
            ...child,
            id: childId,
            path: childPath
          }
        }
      })
      
      // 更新文件树结构，替换懒加载占位符
      const updateFileTree = (items: any[]): any[] => {
        return items.map(item => {
          // 找到目标文件夹进行更新（基于标准化路径匹配）
          if (normalizePath(item.path) === actualFolderPath && item.fileType === 'folder') {
            console.log('Found target folder, updating children:', item.path)
            
            // 过滤掉懒加载占位符
            const existingChildren = item.children?.filter((child: any) => 
              child.fileType !== 'lazy-placeholder'
            ) || []
            
            // 检查是否有重复的子项（基于标准化路径）
            const existingPaths = new Set(existingChildren.map((child: any) => normalizePath(child.path)))
            const newChildren = processedChildren.filter((child: any) => !existingPaths.has(normalizePath(child.path)))
            
            // 合并现有子项和新子项
            const allChildren = [...existingChildren, ...newChildren]
            
            return {
              ...item,
              children: allChildren.length > 0 ? allChildren : undefined
            }
          }
          
          // 递归处理子项
          if (item.children && Array.isArray(item.children)) {
            return {
              ...item,
              children: updateFileTree(item.children)
            }
          }
          
          return item
        })
      }
      
      // 更新状态，但不触发完整刷新
      // 直接更新 folderManager 的状态
      const currentTree = Array.isArray(props.fileDirectoryArr) ? props.fileDirectoryArr : []
      const updatedTree = updateFileTree(currentTree)
      console.log('File tree updated with lazy loaded content')
      
      // 更新 folderManager 的状态，防止监听器覆盖更改
      props.folderManager.topDirectoryArray = updatedTree
      
      // 触发父组件刷新，这会更新显示的文件树
      if (props.onRefresh) {
        props.onRefresh()
      }
      
      // 标记文件夹为已展开
      setExpandedFolders(prev => new Set([...prev, actualFolderPath]))
      
    } catch (error) {
      console.error('Error loading folder lazily:', error)
    }
  }, [props.folderManager, props.fileDirectoryArr, props.onRefresh, props.onLoadLazily])

  // 根目录右键菜单处理
  const handleRootContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    console.log('Root area context menu triggered at:', event.clientX, event.clientY)
    
    setContextMenuState({
      mouseX: event.clientX,
      mouseY: event.clientY,
      itemId: 'root' // 特殊的根目录标识
    })
  }

  // 根目录菜单操作
  const handleRootNewFile = () => {
    console.log('Root new file called')
    setInputDialog({
      open: true,
      type: 'newFile',
      title: t("t-file-manager-new-file"),
      label: t("t-file-manager-new-file-name"),
      defaultValue: '',
      itemId: 'root'
    })
    handleCloseContextMenu()
  }

  const handleRootNewFolder = () => {
    console.log('Root new folder called')
    setInputDialog({
      open: true,
      type: 'newFolder',
      title: t("t-file-manager-new-folder"),
      label: t("t-file-manager-new-folder-name"),
      defaultValue: '',
      itemId: 'root'
    })
    handleCloseContextMenu()
  }

  const handleShowContextMenu = React.useCallback((event: React.MouseEvent, itemId: string) => {
    setContextMenuState({
      mouseX: event.clientX,
      mouseY: event.clientY,
      itemId
    })
  }, [])

  const handleCloseContextMenu = React.useCallback(() => {
    setContextMenuState(null)
  }, [])

  const handleShowInputDialog = React.useCallback((dialog: Omit<typeof inputDialog, 'open'> & { open: true }) => {
    console.log('handleShowInputDialog called with:', dialog) // 调试
    setInputDialog(dialog)
  }, [])

  const handleShowConfirmDialog = React.useCallback((dialog: Omit<typeof confirmDialog, 'open'> & { open: true }) => {
    setConfirmDialog(dialog)
  }, [])

  const handleCloseInputDialog = React.useCallback(() => {
    console.log('handleCloseInputDialog called') // 调试
    setInputDialog(prev => ({ ...prev, open: false }))
  }, [])

  const handleCloseConfirmDialog = React.useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, open: false }))
  }, [])

  // 优化刷新机制，减少割裂感
  const handleOptimizedRefresh = React.useCallback(async () => {
    // 延迟刷新，让用户看到操作完成的视觉反馈
    await new Promise(resolve => setTimeout(resolve, 150))
    props.onRefresh?.()
  }, [props.onRefresh])

  const handleConfirmInput = React.useCallback(async (value: string) => {
    console.log('handleConfirmInput called with:', value, 'dialog type:', inputDialog.type, 'itemId:', inputDialog.itemId) // 调试
    try {
      const topDirHandle = props.folderManager.getTopDirectoryHandle()
      if (!topDirHandle) return

      // 获取当前操作的项目信息
      const findItemById = (items: any[], id: string): any => {
        for (const item of items) {
          if (item.id === id) return item
          if (item.children) {
            const found = findItemById(item.children, id)
            if (found) return found
          }
        }
        return null
      }

      const currentItem = findItemById(sortedFileDirectoryArr, inputDialog.itemId)
      if (!currentItem && inputDialog.type !== 'newFile' && inputDialog.type !== 'newFolder') {
        console.error("Current item not found")
        return
      }

      let operationType: string = inputDialog.type
      
      switch (inputDialog.type) {
        case 'newFile':
          if (currentItem && currentItem.fileType === 'folder') {
            // 在指定文件夹内创建文件
            await props.folderManager.createNewFileAtPath(topDirHandle, currentItem.path, value)
          } else {
            // 在根目录创建文件
            await props.folderManager.createNewFile(topDirHandle, value)
          }
          alertUseArco(t("t-file-manager-create-success"), 2000, { kind: "success" })
          operationType = 'create_file'
          break

        case 'newFolder':
          if (currentItem && currentItem.fileType === 'folder') {
            // 在指定文件夹内创建文件夹
            await props.folderManager.createNewFolderAtPath(topDirHandle, currentItem.path, value)
          } else {
            // 在根目录创建文件夹
            await props.folderManager.createNewFolder(topDirHandle, value)
          }
          alertUseArco(t("t-file-manager-create-success"), 2000, { kind: "success" })
          operationType = 'create_folder'
          break

        case 'rename':
          if (currentItem) {
            if (currentItem.fileType === 'folder') {
              await props.folderManager.renameFolderAtPath(topDirHandle, currentItem.path, value)
              operationType = 'rename_folder'
            } else {
              await props.folderManager.renameFileAtPath(topDirHandle, currentItem.path, value)
              operationType = 'rename_file'
            }
            alertUseArco(t("t-file-manager-rename-success"), 2000, { kind: "success" })
          }
          break
      }

      // 使用手动刷新确保立即同步UI - 传递具体操作类型
      if (props.onManualRefresh) {
        await props.onManualRefresh(operationType)
      } else {
        handleOptimizedRefresh()
      }
    } catch (error) {
      console.error("Operation error:", error)
      alertUseArco(t("t-file-manager-operation-failed"), 2000, { kind: "error" })
    }
  }, [inputDialog.type, inputDialog.itemId, props.folderManager, handleOptimizedRefresh, t, sortedFileDirectoryArr])

  const handleConfirmDelete = React.useCallback(() => {
    confirmDialog.action()
  }, [confirmDialog.action])

  // 根目录拖拽处理
  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsRootDragOver(true)
  }

  const handleRootDragLeave = (e: React.DragEvent) => {
    // 检查是否真的离开了根容器
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsRootDragOver(false)
    }
  }

  const handleRootDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsRootDragOver(false)
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"))
      const { itemId: draggedItemId, label: draggedLabel, path: draggedPath, fileType: draggedFileType } = dragData

      // 更精确地判断是否已经在根目录
      // 如果路径不包含 '/'，说明已经在根目录
      const isAlreadyInRoot = !draggedPath.includes('/')
      
      if (isAlreadyInRoot) {
        // alertUseArco(t("t-file-manager-already-in-root"), 2000, { kind: "info" })
        return
      }

      const topDirHandle = props.folderManager.getTopDirectoryHandle()
      if (!topDirHandle) return

      console.log(`Moving ${draggedLabel} from "${draggedPath}" to root directory`)

      // 检查是否移动的是当前正在编辑的文件或包含该文件的文件夹
      const isMovingCurrentlyEditingFile = props.currentEditingFile === draggedPath
      const isMovingCurrentlyEditingFolder = draggedFileType === 'folder' && props.currentEditingFile && props.currentEditingFile.startsWith(draggedPath + '/')

      let actualUsedName = draggedLabel // 默认使用原始名称

      if (draggedFileType === 'folder') {
        actualUsedName = await props.folderManager.moveFolder(topDirHandle, draggedPath, '')
      } else {
        actualUsedName = await props.folderManager.moveFileByPath(topDirHandle, draggedPath, '')
      }

      // 如果移动的是当前正在编辑的文件或其所在文件夹，更新或清理状态
      if (isMovingCurrentlyEditingFile) {
        if (actualUsedName !== draggedLabel) {
          // 文件被重命名了，清除当前编辑状态（因为文件名已变）
          console.log(`Moved currently editing file to root was renamed from '${draggedLabel}' to '${actualUsedName}', clearing editing state`)
          props.onFileSelect?.('') // 清空当前编辑文件状态
        } else {
          // 文件名未变，更新为根目录路径
          console.log(`Moved currently editing file to root, updating path from '${draggedPath}' to '${actualUsedName}'`)
          props.onFileSelect?.(actualUsedName)
        }
      } else if (isMovingCurrentlyEditingFolder && props.currentEditingFile) {
        if (actualUsedName !== draggedLabel) {
          // 文件夹被重命名了，清除当前编辑状态
          console.log(`Moved folder containing currently editing file to root was renamed from '${draggedLabel}' to '${actualUsedName}', clearing editing state`)
          props.onFileSelect?.('') // 清空当前编辑文件状态
        } else {
          // 文件夹名未变，更新文件夹内文件的路径
          const relativePath = props.currentEditingFile.substring(draggedPath.length + 1)
          const newPath = `${actualUsedName}/${relativePath}`
          console.log(`Moved folder containing currently editing file to root, updating path from '${props.currentEditingFile}' to '${newPath}'`)
          props.onFileSelect?.(newPath)
        }
      }

      // 显示移动成功消息，包含实际使用的名称信息
      if (actualUsedName !== draggedLabel) {
        alertUseArco(`${t("t-file-manager-move-success")} (${draggedLabel} → ${actualUsedName})`, 3000, { kind: "success" })
      } else {
        alertUseArco(t("t-file-manager-move-success"), 2000, { kind: "success" })
      }
      
      // 强制立即刷新UI - 添加小延迟确保文件系统操作完全完成
      setTimeout(async () => {
        console.log('Executing immediate refresh after move to root')
        if (props.onManualRefresh) {
          await props.onManualRefresh('move_to_root')
        } else {
          handleOptimizedRefresh()
        }
      }, 50) // 50ms延迟确保操作完成
    } catch (error) {
      console.error("Move to root error:", error)
      alertUseArco(t("t-file-manager-operation-failed"), 2000, { kind: "error" })
    }
  }

  // 检查是否为空文件夹
  const isEmpty = !sortedFileDirectoryArr ||
    sortedFileDirectoryArr.length === 0 ||
    (sortedFileDirectoryArr.length === 1 &&
      sortedFileDirectoryArr[0].children &&
      sortedFileDirectoryArr[0].children.length === 0)

  // 处理空文件夹创建操作
  const handleCreateFile = async () => {
    const topDirHandle = props.folderManager.getTopDirectoryHandle()
    if (topDirHandle) {
      try {
        const fileName = `新建文件${Date.now()}.md` // 添加时间戳避免重名
        await props.folderManager.createNewFile(topDirHandle, fileName)
        alertUseArco(t("t-file-manager-create-success"), 2000, { kind: "success" })
        // 传递操作类型
        if (props.onManualRefresh) {
          await props.onManualRefresh('empty_folder_create_file')
        } else {
          handleOptimizedRefresh()
        }
      } catch (error) {
        console.error("Create file error:", error)
        alertUseArco(t("t-file-manager-operation-failed"), 2000, { kind: "error" })
      }
    }
  }

  const handleCreateFolder = async () => {
    const topDirHandle = props.folderManager.getTopDirectoryHandle()
    if (topDirHandle) {
      try {
        const folderName = `新建文件夹${Date.now()}` // 添加时间戳避免重名
        await props.folderManager.createNewFolder(topDirHandle, folderName)
        alertUseArco(t("t-file-manager-create-success"), 2000, { kind: "success" })
        // 传递操作类型
        if (props.onManualRefresh) {
          await props.onManualRefresh('empty_folder_create_folder')
        } else {
          handleOptimizedRefresh()
        }
      } catch (error) {
        console.error("Create folder error:", error)
        alertUseArco(t("t-file-manager-operation-failed"), 2000, { kind: "error" })
      }
    }
  }

  // 如果是空文件夹，显示空状态提示
  if (isEmpty) {
    return (
      <Box 
        sx={{ 
          width: "100%", 
          height: "100vh", // 改为占满全屏高度
          display: "flex",
          flexDirection: "column",
          overflow: "hidden" // 防止外层容器出现滚动条
        }} 
        onDragOver={handleRootDragOver}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
        onContextMenu={handleRootContextMenu}
        style={{
          backgroundColor: isRootDragOver ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
          border: isRootDragOver ? '2px dashed #2e7d32' : '2px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <EmptyFolderPlaceholder
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
        />
        
        {/* 根目录右键菜单 */}
        <ContextMenu
          visible={contextMenuState?.itemId === 'root'}
          x={contextMenuState?.mouseX || 0}
          y={contextMenuState?.mouseY || 0}
          onClose={handleCloseContextMenu}
          onNewFile={handleRootNewFile}
          onNewFolder={handleRootNewFolder}
          onRename={() => {}} // 根目录不支持重命名
          onDelete={() => {}} // 根目录不支持删除
          isFile={false} // 根目录按文件夹处理
          isRoot={true}
        />

        {/* 全局输入对话框 */}
        <InputDialog
          open={inputDialog.open}
          title={inputDialog.title}
          label={inputDialog.label}
          defaultValue={inputDialog.defaultValue}
          onClose={handleCloseInputDialog}
          onConfirm={handleConfirmInput}
        />

        {/* 全局确认删除对话框 */}
        <ConfirmDeleteDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onClose={handleCloseConfirmDialog}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    )
  }

  // 使用 useCallback 来稳定 WrappedCustomTreeItem 函数
  const WrappedCustomTreeItem = React.useCallback((itemProps: any) => (
    <CustomTreeItem
      {...itemProps}
      fillText={props.fillText}
      setIsDragging={props.setIsDragging}
      setExpandedFolderState={() => { }} // 添加空函数
      folderManager={props.folderManager}
      onRefresh={handleOptimizedRefresh} // 使用优化的刷新函数
      onManualRefresh={props.onManualRefresh}
      contextMenuState={contextMenuState}
      onShowContextMenu={handleShowContextMenu}
      onCloseContextMenu={handleCloseContextMenu}
      inputDialog={inputDialog}
      confirmDialog={confirmDialog}
      onShowInputDialog={handleShowInputDialog}
      onShowConfirmDialog={handleShowConfirmDialog}
      onCloseInputDialog={handleCloseInputDialog}
      onCloseConfirmDialog={handleCloseConfirmDialog}
      onConfirmInput={handleConfirmInput}
      onConfirmDelete={handleConfirmDelete}
      onLoadLazily={handleLoadLazily}
      currentEditingFile={props.currentEditingFile}
      onFileSelect={props.onFileSelect}
    />
  ), [
    props.fillText,
    props.setIsDragging,
    props.folderManager,
    props.currentEditingFile,
    props.onFileSelect,
    handleOptimizedRefresh, // 更新依赖
    contextMenuState,
    handleShowContextMenu,
    handleCloseContextMenu,
    inputDialog,
    confirmDialog,
    handleShowInputDialog,
    handleShowConfirmDialog,
    handleCloseInputDialog,
    handleCloseConfirmDialog,
    handleConfirmInput,
    handleConfirmDelete,
    handleLoadLazily,
    props.onManualRefresh
  ])

  return (
    <Box 
      sx={{ 
        width: "100%", 
        height: "100vh", // 改为占满全屏高度
        display: "flex", 
        flexDirection: "column",
        overflow: "hidden" // 防止外层容器出现滚动条
      }} 
      onDragOver={handleRootDragOver}
      onDragLeave={handleRootDragLeave}
      onDrop={handleRootDrop}
      onContextMenu={handleRootContextMenu}
      style={{
        backgroundColor: isRootDragOver ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
        border: isRootDragOver ? '2px dashed #2e7d32' : '2px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      <RichTreeView
        items={sortedFileDirectoryArr ?? ITEMS}
        aria-label="file explorer"
        className="uniform-scroller"
        sx={{
          height: "100%",
          flexGrow: 1,
          userSelect: "none",
          maxWidth: 400,
          overflowY: "auto", // 只在这里允许滚动
          flex: 1,
          // 优化布局 - 右侧无 padding 让滚动条紧贴边缘
          padding: "8px 0 8px 4px", // 上 右 下 左：上下8px，左4px，右0px
          "& .MuiTreeView-root": {
            padding: 0,
          },
          // 确保内容不会贴边
          "& > ul": {
            padding: "4px 0",
          },
        }}
        slots={{ item: WrappedCustomTreeItem }}
      />

      {/* 根目录右键菜单 */}
      <ContextMenu
        visible={contextMenuState?.itemId === 'root'}
        x={contextMenuState?.mouseX || 0}
        y={contextMenuState?.mouseY || 0}
        onClose={handleCloseContextMenu}
        onNewFile={handleRootNewFile}
        onNewFolder={handleRootNewFolder}
        onRename={() => {}} // 根目录不支持重命名
        onDelete={() => {}} // 根目录不支持删除
        isFile={false} // 根目录按文件夹处理
        isRoot={true}
      />

      {/* 全局输入对话框 */}
      <InputDialog
        open={inputDialog.open}
        title={inputDialog.title}
        label={inputDialog.label}
        defaultValue={inputDialog.defaultValue}
        onClose={handleCloseInputDialog}
        onConfirm={handleConfirmInput}
      />

      {/* 全局确认删除对话框 */}
      <ConfirmDeleteDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}

function canItDrag(item: { label: string; fileType?: string }) {
  // 所有文件和文件夹都可以拖拽移动
  return true
}

function isImage(item: { label: string }) {
  // 正确提取文件扩展名（去掉点号）
  const fileName = item.label.toLowerCase()
  const lastDotIndex = fileName.lastIndexOf('.')
  
  if (lastDotIndex === -1) return false // 没有扩展名
  
  const extensionName = fileName.substring(lastDotIndex + 1)
  return supportedImageExtensions.includes(extensionName)
}
