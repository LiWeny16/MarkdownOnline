import * as React from "react"
import { observer } from "mobx-react"
import { useAIMeeting } from "@Mobx/AIMeeting"
import {
    Dialog,
    Box,
    IconButton,
    Typography,
    Button,
    Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CropFreeIcon from "@mui/icons-material/CropFree"
import GroupsIcon from '@mui/icons-material/Groups'
import MeetingTranscript from "./MeetingTranscript"
import MeetingAssistant from "./MeetingAssistant"
import MeetingControls from "./MeetingControls"
import { getTheme } from "@App/config/change"
import { useTranslation } from "react-i18next"

const AIMeetingDialog = observer(() => {
    const aiMeeting = useAIMeeting()
    const { t } = useTranslation()
    const [windowSize, setWindowSize] = React.useState({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.9
    })
    const [windowPosition, setWindowPosition] = React.useState({
        x: window.innerWidth * 0.1,
        y: window.innerHeight * 0.05 // 居中：(1 - 0.9) / 2 = 0.05
    })
    const [isMaximized, setIsMaximized] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [isResizing, setIsResizing] = React.useState(false)
    const dragRef = React.useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 })

    const isDark = getTheme() === "dark"

    // 主题样式
    const themeStyles = {
        background: isDark ? "#1e1e1e" : "#ffffff",
        color: isDark ? "#d8d8d8" : "#000000",
        border: isDark ? "1px solid #404040" : "1px solid #e0e0e0",
        headerBg: isDark ? "#2d2d30" : "#f5f5f5",
        divider: isDark ? "#404040" : "#e0e0e0",
    }

    const handleClose = () => {
        aiMeeting.hidden()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized) return
        setIsDragging(true)
        dragRef.current = {
            offsetX: e.clientX - windowPosition.x,
            offsetY: e.clientY - windowPosition.y,
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return

        const maxX = window.innerWidth - windowSize.width
        const maxY = window.innerHeight - windowSize.height

        const newX = Math.max(0, Math.min(maxX, e.clientX - dragRef.current.offsetX))
        const newY = Math.max(0, Math.min(maxY, e.clientY - dragRef.current.offsetY))

        setWindowPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, windowSize])

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized)
    }

    return (
        <Dialog
            hideBackdrop={false}
            fullScreen={false}
            maxWidth={false}
            open={aiMeeting.displayState}
            onClose={handleClose}
            PaperProps={{
                style: {
                    position: 'fixed',
                    left: isMaximized ? 0 : windowPosition.x,
                    top: isMaximized ? 0 : windowPosition.y,
                    width: isMaximized ? '100vw' : windowSize.width,
                    height: isMaximized ? '100vh' : windowSize.height,
                    margin: 0,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    background: themeStyles.background,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    transition: (isDragging || isResizing) ? 'none' : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                }
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: 'relative',
                }}
            >
                {/* 标题栏 */}
                <Box
                    onMouseDown={handleMouseDown}
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: themeStyles.headerBg,
                        borderBottom: `1px solid ${themeStyles.divider}`,
                        cursor: isDragging ? 'grabbing' : (isMaximized ? 'default' : 'grab'),
                    userSelect: 'none',
                }}
            >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupsIcon sx={{ fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {t("t-ai-meeting-title")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, position: 'relative', zIndex: 1000 }}>
                        <IconButton onClick={toggleMaximize} size="small">
                            <CropFreeIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* 控制栏 */}
                <MeetingControls themeStyles={themeStyles} />

                <Divider sx={{ bgcolor: themeStyles.divider }} />

                {/* 主内容区域 */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        overflow: "hidden",
                        gap: 1,
                        p: 2,
                    }}
                >
                    {/* 左侧：转录和翻译区域 (50%) */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            border: `1px solid ${themeStyles.divider}`,
                            borderRadius: 1,
                        }}
                    >
                        <MeetingTranscript themeStyles={themeStyles} />
                    </Box>

                    {/* 右侧：总结和AI提示区域 (50%) */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            border: `1px solid ${themeStyles.divider}`,
                            borderRadius: 1,
                        }}
                    >
                        <MeetingAssistant themeStyles={themeStyles} />
                    </Box>
                </Box>

                {/* 拖拽遮罩层 - 防止拖拽时鼠标事件被内容捕获 */}
                {(isDragging || isResizing) && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 999,
                            cursor: isDragging ? 'grabbing' : 'default',
                            background: 'transparent',
                        }}
                    />
                )}

                {/* 调整大小手柄 */}
                {!isMaximized && (
                    <>
                        {/* 右边缘 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                right: -8,
                                top: 0,
                                width: 16,
                                height: '100%',
                                cursor: 'ew-resize',
                                zIndex: 1000,
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                setIsResizing(true)
                                const startX = e.clientX
                                const startWidth = windowSize.width
                                const handleResize = (e: MouseEvent) => {
                                    const newWidth = Math.max(600, Math.min(window.innerWidth, startWidth + (e.clientX - startX)))
                                    setWindowSize(prev => ({ ...prev, width: newWidth }))
                                }
                                const handleStop = () => {
                                    setIsResizing(false)
                                    document.removeEventListener('mousemove', handleResize)
                                    document.removeEventListener('mouseup', handleStop)
                                }
                                document.addEventListener('mousemove', handleResize)
                                document.addEventListener('mouseup', handleStop)
                            }}
                        />

                        {/* 底边缘 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '100%',
                                height: 16,
                                cursor: 'ns-resize',
                                zIndex: 1000,
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                setIsResizing(true)
                                const startY = e.clientY
                                const startHeight = windowSize.height
                                const handleResize = (e: MouseEvent) => {
                                    const newHeight = Math.max(400, Math.min(window.innerHeight, startHeight + (e.clientY - startY)))
                                    setWindowSize(prev => ({ ...prev, height: newHeight }))
                                }
                                const handleStop = () => {
                                    setIsResizing(false)
                                    document.removeEventListener('mousemove', handleResize)
                                    document.removeEventListener('mouseup', handleStop)
                                }
                                document.addEventListener('mousemove', handleResize)
                                document.addEventListener('mouseup', handleStop)
                            }}
                        />

                        {/* 右下角 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -8,
                                right: -8,
                                width: 20,
                                height: 20,
                                cursor: 'nwse-resize',
                                zIndex: 1001,
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                setIsResizing(true)
                                const startX = e.clientX
                                const startY = e.clientY
                                const startWidth = windowSize.width
                                const startHeight = windowSize.height
                                const handleResize = (e: MouseEvent) => {
                                    const newWidth = Math.max(600, Math.min(window.innerWidth, startWidth + (e.clientX - startX)))
                                    const newHeight = Math.max(400, Math.min(window.innerHeight, startHeight + (e.clientY - startY)))
                                    setWindowSize({ width: newWidth, height: newHeight })
                                }
                                const handleStop = () => {
                                    setIsResizing(false)
                                    document.removeEventListener('mousemove', handleResize)
                                    document.removeEventListener('mouseup', handleStop)
                                }
                                document.addEventListener('mousemove', handleResize)
                                document.addEventListener('mouseup', handleStop)
                            }}
                        />
                    </>
                )}
            </Box>
        </Dialog>
    )
})

export default AIMeetingDialog

