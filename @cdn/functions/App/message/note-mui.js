import { gsap } from 'gsap';
import { getTheme } from '@App/config/change';
/**
 * @description 使用 MUI 替代 arco 通知
 */
// 全局容器管理（按位置分组）
const notificationContainers = {};
let notificationCount = 0;
// 获取或创建容器
const getNotificationContainer = (position) => {
    if (!notificationContainers[position]) {
        const container = document.createElement('div');
        container.className = `mui-notification-wrapper-${position}`;
        container.style.cssText = `
      position: fixed;
      z-index: 10000;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 320px;
    `;
        // 根据位置设置样式
        const positionStyles = getPositionStyles(position);
        Object.assign(container.style, positionStyles);
        document.body.appendChild(container);
        notificationContainers[position] = container;
    }
    return notificationContainers[position];
};
// 获取位置样式
const getPositionStyles = (position) => {
    const positions = {
        topLeft: { top: '24px', left: '24px' },
        topRight: { top: '24px', right: '24px' },
        bottomLeft: { bottom: '24px', left: '24px' },
        bottomRight: { bottom: '24px', right: '24px' },
        top: { top: '24px', left: '50%', transform: 'translateX(-50%)' },
        bottom: { bottom: '24px', left: '50%', transform: 'translateX(-50%)' }
    };
    return positions[position] || positions.bottomRight;
};
// 获取主题相关颜色
const getThemeColors = () => {
    const isDark = getTheme() === 'dark';
    const colors = {
        light: {
            backgroundColor: '#ffffff',
            borderColor: '#d9d9d9',
            textColor: '#000000d9',
            secondaryTextColor: '#00000073',
            shadowColor: 'rgba(0,0,0,.15)'
        },
        dark: {
            backgroundColor: '#2f2f2f',
            borderColor: '#424242',
            textColor: '#ffffffd9',
            secondaryTextColor: '#ffffff73',
            shadowColor: 'rgba(0,0,0,.3)'
        }
    };
    const currentTheme = isDark ? 'dark' : 'light';
    return {
        ...colors,
        current: currentTheme,
        currentColors: colors[currentTheme]
    };
};
// 创建通知样式
const createNotificationStyles = (severity) => {
    const themeColors = getThemeColors();
    const currentTheme = themeColors.currentColors;
    const baseStyles = {
        width: '320px',
        border: '1px solid',
        borderRadius: '6px',
        boxShadow: `0 4px 12px ${currentTheme.shadowColor}`,
        padding: '16px 24px 16px 16px',
        fontSize: '14px',
        fontWeight: 400,
        position: 'relative',
        cursor: 'pointer',
        pointerEvents: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        lineHeight: '1.5715',
        backgroundColor: currentTheme.backgroundColor,
        color: currentTheme.textColor
    };
    // 根据严重性调整边框颜色（保持微妙的颜色提示）
    const severityBorderColors = {
        success: themeColors.current === 'dark' ? '#52c41a40' : '#ffffff',
        error: themeColors.current === 'dark' ? '#ff4d4f40' : '#ffffff',
        warning: themeColors.current === 'dark' ? '#faad1440' : '#ffffff',
        info: themeColors.current === 'dark' ? '#1890ff40' : '#ffffff'
    };
    return {
        ...baseStyles,
        borderColor: severityBorderColors[severity]
    };
};
// 创建图标（使用更接近 arco 的图标）
const createIcon = (severity) => {
    const iconElement = document.createElement('span');
    iconElement.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-right: 12px;
    flex-shrink: 0;
  `;
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
    };
    const iconConfig = icons[severity] || icons.success;
    iconElement.innerHTML = iconConfig.html;
    iconElement.style.color = iconConfig.color;
    return iconElement;
};
// 创建关闭按钮（样式更接近 arco）
const createCloseButton = () => {
    const themeColors = getThemeColors();
    const currentTheme = themeColors.currentColors;
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6.8 6l4.6-4.6c.2-.2.2-.5 0-.7s-.5-.2-.7 0L6 5.3 1.4.7c-.2-.2-.5-.2-.7 0s-.2.5 0 .7L5.3 6 .7 10.6c-.2.2-.2.5 0 .7.1.1.2.1.4.1s.3 0 .4-.1L6 6.8l4.6 4.6c.1.1.2.1.4.1s.3 0 .4-.1c.2-.2.2-.5 0-.7L6.8 6z"/>
  </svg>`;
    closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    opacity: 0.45;
    padding: 4px;
    border-radius: 2px;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${currentTheme.secondaryTextColor};
  `;
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '0.75';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.45';
    });
    return closeBtn;
};
// 获取动画配置
const getAnimationConfig = (position) => {
    const configs = {
        topLeft: { from: { x: -100, opacity: 0 }, to: { x: 0, opacity: 1 } },
        topRight: { from: { x: 100, opacity: 0 }, to: { x: 0, opacity: 1 } },
        bottomLeft: { from: { x: -100, opacity: 0 }, to: { x: 0, opacity: 1 } },
        bottomRight: { from: { x: 100, opacity: 0 }, to: { x: 0, opacity: 1 } },
        top: { from: { y: -50, opacity: 0 }, to: { y: 0, opacity: 1 } },
        bottom: { from: { y: 50, opacity: 0 }, to: { y: 0, opacity: 1 } }
    };
    return configs[position] || configs.bottomRight;
};
const noteUseMui = (title, content, objConfig) => {
    const _kind = objConfig?.kind ?? "success";
    const _position = objConfig?.position ?? "bottomRight";
    // 映射 arco 类型到 MUI 严重性
    const severityMap = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    const severity = severityMap[_kind] || 'success';
    // 获取容器
    const container = getNotificationContainer(_position);
    // 获取主题颜色
    const themeColors = getThemeColors();
    const currentTheme = themeColors.currentColors;
    // 创建通知元素
    const notificationElement = document.createElement('div');
    notificationElement.className = 'mui-notification-item';
    notificationElement.setAttribute('data-notification-id', String(++notificationCount));
    const styles = createNotificationStyles(severity);
    Object.assign(notificationElement.style, styles);
    // 添加主要内容容器
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 0;
  `;
    // 添加图标
    const iconElement = createIcon(severity);
    // 添加文本内容容器
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
    flex: 1;
    min-width: 0;
  `;
    // 添加标题
    const titleElement = document.createElement('div');
    titleElement.textContent = title;
    titleElement.style.cssText = `
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: ${currentTheme.textColor};
  `;
    // 添加内容
    const contentElement = document.createElement('div');
    contentElement.textContent = content;
    contentElement.style.cssText = `
    font-size: 14px;
    color: ${currentTheme.secondaryTextColor};
    line-height: 1.5715;
  `;
    textContainer.appendChild(titleElement);
    textContainer.appendChild(contentElement);
    contentContainer.appendChild(iconElement);
    contentContainer.appendChild(textContainer);
    // 添加关闭按钮
    const closeButton = createCloseButton();
    notificationElement.appendChild(contentContainer);
    notificationElement.appendChild(closeButton);
    // 添加到容器
    container.appendChild(notificationElement);
    // 获取动画配置
    const animConfig = getAnimationConfig(_position);
    // GSAP 入场动画
    gsap.fromTo(notificationElement, {
        ...animConfig.from,
        scale: 0.9
    }, {
        duration: 0.4,
        ...animConfig.to,
        scale: 1,
        ease: 'back.out(1.2)'
    });
    // 关闭函数
    const handleClose = () => {
        const exitConfig = {
            duration: 0.3,
            opacity: 0,
            scale: 0.9,
            ease: 'power2.in'
        };
        // 根据位置添加特定的退场动画
        if (_position.includes('Right')) {
            exitConfig.x = 100;
        }
        else if (_position.includes('Left')) {
            exitConfig.x = -100;
        }
        else if (_position.includes('top')) {
            exitConfig.y = -50;
        }
        else {
            exitConfig.y = 50;
        }
        gsap.to(notificationElement, {
            ...exitConfig,
            onComplete: () => {
                if (notificationElement.parentNode) {
                    container.removeChild(notificationElement);
                    // 如果容器为空，移除容器
                    if (container.children.length === 0) {
                        document.body.removeChild(container);
                        delete notificationContainers[_position];
                    }
                }
            }
        });
    };
    // 点击关闭按钮
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        handleClose();
    });
    // 自动关闭（4.5秒后，与 arco 保持一致）
    setTimeout(handleClose, 4500);
};
export default noteUseMui;
