import React, { useState, useRef } from "react";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropFreeIcon from "@mui/icons-material/CropFree";
import { getTheme } from "@App/config/change";
import { useTranslation } from "react-i18next";

export default function Settings(props: any) {
  const { t } = useTranslation();
  const theme = getTheme();
  // 固定手机比例：宽度约为高度的9:16比例
  const [windowSize, setWindowSize] = useState({ width: 400, height: 700 });
  const [windowPosition, setWindowPosition] = useState({ x: 200, y: 50 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  const handleCloseAll = (e: React.MouseEvent<HTMLElement>) => {
    props.onClick(e);
    props.closeAll();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      offsetX: e.clientX - windowPosition.x,
      offsetY: e.clientY - windowPosition.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // 计算边界限制
    const maxX = window.innerWidth - windowSize.width;
    const maxY = window.innerHeight - windowSize.height;
    
    const newX = Math.max(0, Math.min(maxX, e.clientX - dragRef.current.offsetX));
    const newY = Math.max(0, Math.min(maxY, e.clientY - dragRef.current.offsetY));
    
    setWindowPosition({
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, windowSize]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <>
      <Dialog
        hideBackdrop={true}
        fullScreen={false}
        maxWidth={false}
        open={props.open}
        onClose={handleCloseAll}
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
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            transition: (isDragging || isResizing) ? 'none' : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', // 拖动或调整大小时禁用动画
          }
        }}
      >
        {/* Window Title Bar */}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            height: '40px',
            background: theme === "light" ? "#F8FAFB" : "#2B2B2B",
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            cursor: isDragging ? 'grabbing' : 'grab',
            borderBottom: `1px solid ${theme === "light" ? "#e0e0e0" : "#404040"}`,
            userSelect: 'none',
            transition: (isDragging || isResizing) ? 'none' : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', // 拖动或调整大小时禁用动画
          }}
        >
          <Typography variant="body2" sx={{ color: theme === "light" ? "#666" : "#ccc" }}>
            LetShare - 协作分享
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={toggleMaximize}>
              <CropFreeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCloseAll}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Content Area - matching inner page style */}
        <Box
          sx={{
            height: isMaximized ? 'calc(100vh - 40px)' : windowSize.height - 40,
            width: '100%',
            background: '#F8FAFB', // Match the inner page background
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Match inner page shadow
            overflow: 'hidden',
            position: 'relative',
            transition: (isDragging || isResizing) ? 'none' : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', // 拖动或调整大小时禁用动画
          }}
        >
          <iframe
            src="https://letshare.fun"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '0 0 8px 8px',
              background: 'transparent',
            }}
            title="Let's Share"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          />
          
          {/* Drag overlay - prevents mouse events from going to iframe during drag */}
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
          
          {/* Resize handles */}
          {!isMaximized && (
            <>
              {/* Left edge */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -8,
                  top: 0,
                  width: 16,
                  height: '100%',
                  cursor: 'ew-resize',
                  zIndex: 1000,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  const startX = e.clientX;
                  const startWidth = windowSize.width;
                  const startLeft = windowPosition.x;
                  const handleResize = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX;
                    const newWidth = Math.max(300, Math.min(window.innerWidth, startWidth - deltaX));
                    const actualDelta = startWidth - newWidth;
                    const newLeft = Math.max(0, Math.min(window.innerWidth - newWidth, startLeft + actualDelta));
                    
                    setWindowSize(prev => ({ ...prev, width: newWidth }));
                    setWindowPosition(prev => ({ ...prev, x: newLeft }));
                  };
                  const handleStop = () => {
                    setIsResizing(false);
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleStop);
                  };
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener('mouseup', handleStop);
                }}
              />
              
              {/* Right edge */}
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
                  e.preventDefault();
                  setIsResizing(true);
                  const startX = e.clientX;
                  const startWidth = windowSize.width;
                  const handleResize = (e: MouseEvent) => {
                    const newWidth = Math.max(300, Math.min(window.innerWidth, startWidth + (e.clientX - startX)));
                    setWindowSize(prev => ({ ...prev, width: newWidth }));
                  };
                  const handleStop = () => {
                    setIsResizing(false);
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleStop);
                  };
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener('mouseup', handleStop);
                }}
              />
              
              {/* Bottom edge */}
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
                  e.preventDefault();
                  setIsResizing(true);
                  const startY = e.clientY;
                  const startHeight = windowSize.height;
                  const handleResize = (e: MouseEvent) => {
                    const newHeight = Math.max(600, Math.min(window.innerHeight, startHeight + (e.clientY - startY)));
                    setWindowSize(prev => ({ ...prev, height: newHeight }));
                  };
                  const handleStop = () => {
                    setIsResizing(false);
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleStop);
                  };
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener('mouseup', handleStop);
                }}
              />
              
              {/* Bottom-left corner */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  left: -8,
                  width: 20,
                  height: 20,
                  cursor: 'ne-resize',
                  zIndex: 1001,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startWidth = windowSize.width;
                  const startHeight = windowSize.height;
                  const startLeft = windowPosition.x;
                  const handleResize = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX;
                    const newWidth = Math.max(300, Math.min(window.innerWidth, startWidth - deltaX));
                    const newHeight = Math.max(600, Math.min(window.innerHeight, startHeight + (e.clientY - startY)));
                    const actualDelta = startWidth - newWidth;
                    const newLeft = Math.max(0, Math.min(window.innerWidth - newWidth, startLeft + actualDelta));
                    
                    setWindowSize({
                      width: newWidth,
                      height: newHeight,
                    });
                    setWindowPosition(prev => ({ ...prev, x: newLeft }));
                  };
                  const handleStop = () => {
                    setIsResizing(false);
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleStop);
                  };
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener('mouseup', handleStop);
                }}
              />
              
              {/* Bottom-right corner */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  width: 20,
                  height: 20,
                  cursor: 'nw-resize',
                  zIndex: 1001,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startWidth = windowSize.width;
                  const startHeight = windowSize.height;
                  const handleResize = (e: MouseEvent) => {
                    const newWidth = Math.max(300, Math.min(window.innerWidth, startWidth + (e.clientX - startX)));
                    const newHeight = Math.max(600, Math.min(window.innerHeight, startHeight + (e.clientY - startY)));
                    setWindowSize({
                      width: newWidth,
                      height: newHeight,
                    });
                  };
                  const handleStop = () => {
                    setIsResizing(false);
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleStop);
                  };
                  document.addEventListener('mousemove', handleResize);
                  document.addEventListener('mouseup', handleStop);
                }}
              />
            </>
          )}
        </Box>
      </Dialog>

      <ScreenShareIcon />
      <Typography>{t("t-collaborative-office")}</Typography>
    </>
  );
}
