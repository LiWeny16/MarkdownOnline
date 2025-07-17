import { AlertColor } from '@mui/material'
import { gsap } from 'gsap'
import { getTheme } from '@App/config/change'

/**
 * @description 使用 MUI 替代 arco 提示
 */

// 全局容器管理
let alertContainer: HTMLElement | null = null
let alertCount = 0

// 获取或创建容器
const getAlertContainer = () => {
  if (!alertContainer) {
    alertContainer = document.createElement('div')
    alertContainer.className = 'mui-alert-wrapper'
    alertContainer.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `
    document.body.appendChild(alertContainer)
  }
  return alertContainer
}

// 获取主题相关颜色
const getThemeColors = () => {
  const isDark = getTheme() === 'dark'
  
  const colors = {
    // 背景和边框
    light: {
      backgroundColor: '#ffffff',
      borderColor: '#d9d9d9',
      textColor: '#000000d9',
      shadowColor: 'rgba(0,0,0,.12)'
    },
    dark: {
      backgroundColor: '#2f2f2f',
      borderColor: '#424242',
      textColor: '#ffffffd9', 
      shadowColor: 'rgba(0,0,0,.25)'
    }
  }
  
  const currentTheme = isDark ? 'dark' : 'light'
  
  return {
    ...colors,
    current: currentTheme,
    currentColors: colors[currentTheme]
  }
}

// 创建 MUI Alert 样式
const createAlertStyles = (severity: AlertColor) => {
  const themeColors = getThemeColors()
  const currentTheme = themeColors.currentColors
  
  const baseStyles = {
    minWidth: '280px',
    maxWidth: '400px',
    border: '1px solid',
    borderRadius: '6px',
    boxShadow: `0 3px 6px -4px ${currentTheme.shadowColor}, 0 6px 16px 0 ${currentTheme.shadowColor}, 0 9px 28px 8px ${currentTheme.shadowColor}`,
    fontSize: '14px',
    fontWeight: 400,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    pointerEvents: 'auto' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    lineHeight: '1.5715',
    backgroundColor: currentTheme.backgroundColor,
    borderColor: currentTheme.borderColor,
    color: currentTheme.textColor
  }

  // 根据严重性调整边框颜色（保持微妙的颜色提示）
  const severityBorderColors = {
    success: themeColors.current === 'dark' ? '#52c41a40' : '#ffffff',
    error: themeColors.current === 'dark' ? '#ff4d4f40' : '#ffffff',
    warning: themeColors.current === 'dark' ? '#faad1440' : '#ffffff',
    info: themeColors.current === 'dark' ? '#1890ff40' : '#ffffff'
  }

  return {
    ...baseStyles,
    borderColor: severityBorderColors[severity]
  }
}

// 创建图标（使用更接近 arco 的图标）
const createIcon = (severity: AlertColor) => {
  const iconElement = document.createElement('span')
  iconElement.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
  `
  
  const icons = {
    success: {
      html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 6.1L7.1 10.4c-.2.2-.4.3-.7.3s-.5-.1-.7-.3L3.5 8.2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0L6.4 8.3l3.7-3.7c.4-.4 1-.4 1.4 0s.4 1 0 1.5z"/>
      </svg>`,
      color: '#52c41a'
    },
    error: {
      html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3s-.5-.1-.7-.3L8 9.4l-2.1 2.1c-.2.2-.4.3-.7.3s-.5-.1-.7-.3c-.4-.4-.4-1 0-1.4L6.6 8 4.5 5.9c-.4-.4-.4-1 0-1.4s1-.4 1.4 0L8 6.6l2.1-2.1c.4-.4 1-.4 1.4 0s.4 1 0 1.4L9.4 8l2.1 2.1z"/>
      </svg>`,
      color: '#ff4d4f'
    },
    warning: {
      html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.7.1c-.4-.2-.9-.2-1.3 0-.2.1-.4.2-.5.4L.2 13.2c-.2.4-.2.8 0 1.2.1.2.3.3.5.4.2.1.4.1.6.1h13.4c.2 0 .4 0 .6-.1.2-.1.4-.2.5-.4.2-.4.2-.8 0-1.2L8.2.5c-.1-.2-.3-.3-.5-.4zM9 12H7v-2h2v2zm0-3H7V5h2v4z"/>
      </svg>`,
      color: '#faad14'
    },
    info: {
      html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
      </svg>`,
      color: '#1890ff'
    }
  }

  const iconConfig = icons[severity] || icons.success
  iconElement.innerHTML = iconConfig.html
  iconElement.style.color = iconConfig.color
  
  return iconElement
}

// 创建关闭按钮（样式更接近 arco）
const createCloseButton = () => {
  const themeColors = getThemeColors()
  const isDark = themeColors.current === 'dark'
  
  const closeBtn = document.createElement('span')
  closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6.8 6l4.6-4.6c.2-.2.2-.5 0-.7s-.5-.2-.7 0L6 5.3 1.4.7c-.2-.2-.5-.2-.7 0s-.2.5 0 .7L5.3 6 .7 10.6c-.2.2-.2.5 0 .7.1.1.2.1.4.1s.3 0 .4-.1L6 6.8l4.6 4.6c.1.1.2.1.4.1s.3 0 .4-.1c.2-.2.2-.5 0-.7L6.8 6z"/>
  </svg>`
  closeBtn.style.cssText = `
    margin-left: auto;
    cursor: pointer;
    opacity: 0.45;
    padding: 4px;
    border-radius: 2px;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${isDark ? '#ffffff73' : '#00000073'};
  `
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.opacity = '0.75'
  })
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.opacity = '0.45'
  })
  return closeBtn
}

const alertUseMui = (
  msg: string,
  time?: number,
  objConfig?: {
    kind?: string
    zIndex?: number
    extraConfig?: any
  }
) => {
  const _zIndex = objConfig?.zIndex ?? 9999
  const _kind = objConfig?.kind ?? "success"
  const _duration = time ?? 2500

  // 映射 arco 类型到 MUI 严重性
  const severityMap: { [key: string]: AlertColor } = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }

  const severity = severityMap[_kind] || 'success'

  // 获取容器
  const container = getAlertContainer()
  container.style.zIndex = String(_zIndex)

  // 创建 alert 元素
  const alertElement = document.createElement('div')
  alertElement.className = 'mui-alert-item'
  alertElement.setAttribute('data-alert-id', String(++alertCount))
  
  const styles = createAlertStyles(severity)
  Object.assign(alertElement.style, styles)

  // 添加图标
  const iconElement = createIcon(severity)
  
  // 添加消息文本
  const messageSpan = document.createElement('span')
  messageSpan.textContent = msg
  messageSpan.style.cssText = `
    flex: 1;
    word-break: break-word;
  `

  // 添加关闭按钮
  const closeButton = createCloseButton()

  alertElement.appendChild(iconElement)
  alertElement.appendChild(messageSpan)
  alertElement.appendChild(closeButton)

  // 添加到容器
  container.appendChild(alertElement)

  // GSAP 入场动画
  gsap.fromTo(alertElement, 
    {
      y: -30,
      opacity: 0,
      scale: 0.9
    },
    {
      duration: 0.3,
      y: 0,
      opacity: 1,
      scale: 1,
      ease: 'back.out(1.2)'
    }
  )

  // 关闭函数
  const handleClose = () => {
    gsap.to(alertElement, {
      duration: 0.25,
      y: -20,
      opacity: 0,
      scale: 0.9,
      ease: 'power2.in',
      onComplete: () => {
        if (alertElement.parentNode) {
          container.removeChild(alertElement)
          
          // 如果容器为空，移除容器
          if (container.children.length === 0) {
            document.body.removeChild(container)
            alertContainer = null
          }
        }
      }
    })
  }

  // 点击关闭按钮
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation()
    handleClose()
  })

  // 自动关闭
  if (_duration > 0) {
    setTimeout(handleClose, _duration)
  }
}

export default alertUseMui 