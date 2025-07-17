import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @file ServiceWorkerDevTools.tsx
 * @description Service Worker 开发者工具组件
 */
import { useState, useEffect } from 'react';
import { swManager } from '@Func/ServiceWorker/swManager';
const ServiceWorkerDevTools = ({ className, visible = false }) => {
    const [cacheStatus, setCacheStatus] = useState(null);
    const [swStatus, setSWStatus] = useState(swManager.getStatus());
    const [devInfo, setDevInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(visible);
    const [logs, setLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);
    const isDevelopment = process.env.NODE_ENV === 'development';
    // 拦截控制台日志
    useEffect(() => {
        if (!isDevelopment)
            return;
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
            if (message.includes('[SW')) {
                setLogs(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`]);
            }
        };
        return () => {
            console.log = originalLog;
        };
    }, [isDevelopment]);
    // 更新状态
    const updateStatus = async () => {
        setIsLoading(true);
        try {
            const [cache, status] = await Promise.all([
                swManager.getCacheStatus(),
                Promise.resolve(swManager.getStatus())
            ]);
            setCacheStatus(cache);
            setSWStatus(status);
            // 获取开发环境信息
            if (isDevelopment && navigator.serviceWorker.controller) {
                const channel = new MessageChannel();
                channel.port1.onmessage = (event) => {
                    if (event.data.type === 'DEV_INFO_RESPONSE') {
                        setDevInfo(event.data.data);
                    }
                };
                navigator.serviceWorker.controller.postMessage({ type: 'DEV_INFO' }, [channel.port2]);
            }
        }
        catch (error) {
            console.error('更新状态失败:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    // 清空缓存
    const handleClearCache = async () => {
        if (!confirm('确定要清空所有缓存吗？'))
            return;
        setIsLoading(true);
        try {
            const success = await swManager.clearCache();
            if (success) {
                alert('缓存已清空');
                await updateStatus();
            }
            else {
                alert('清空缓存失败');
            }
        }
        catch (error) {
            console.error('清空缓存出错:', error);
            alert('清空缓存出错');
        }
        finally {
            setIsLoading(false);
        }
    };
    // 强制更新 SW
    const handleUpdateSW = async () => {
        setIsLoading(true);
        try {
            await swManager.update();
            alert('Service Worker 更新检查完成');
            await updateStatus();
        }
        catch (error) {
            console.error('更新 SW 出错:', error);
            alert('更新 Service Worker 失败');
        }
        finally {
            setIsLoading(false);
        }
    };
    // 卸载 SW
    const handleUnregisterSW = async () => {
        if (!confirm('确定要卸载 Service Worker 吗？这将禁用离线功能。'))
            return;
        setIsLoading(true);
        try {
            const success = await swManager.unregister();
            if (success) {
                alert('Service Worker 已卸载');
                await updateStatus();
            }
            else {
                alert('卸载失败');
            }
        }
        catch (error) {
            console.error('卸载 SW 出错:', error);
            alert('卸载 Service Worker 失败');
        }
        finally {
            setIsLoading(false);
        }
    };
    // 清空日志
    const clearLogs = () => {
        setLogs([]);
    };
    // 切换显示状态
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    // 组件挂载时更新状态
    useEffect(() => {
        if (isVisible) {
            updateStatus();
        }
    }, [isVisible]);
    // 键盘快捷键 Ctrl+Shift+S 切换显示
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'S') {
                event.preventDefault();
                toggleVisibility();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    if (!isVisible) {
        return (_jsxs("div", { className: `sw-dev-tools-toggle ${className || ''}`, style: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: isDevelopment ? '#4CAF50' : '#333',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                zIndex: 9999,
                opacity: 0.7,
                transition: 'opacity 0.2s',
                border: swStatus.isControlling ? '2px solid #4CAF50' : '2px solid #ff9800'
            }, onClick: toggleVisibility, onMouseEnter: (e) => e.currentTarget.style.opacity = '1', onMouseLeave: (e) => e.currentTarget.style.opacity = '0.7', title: `点击打开 Service Worker 开发工具 (Ctrl+Shift+S)\n状态: ${swStatus.isControlling ? '激活' : '未激活'}`, children: ["SW ", isDevelopment ? 'DEV' : '工具', swStatus.isControlling && _jsx("span", { style: { marginLeft: '4px' }, children: "\u25CF" })] }));
    }
    return (_jsxs("div", { className: `sw-dev-tools ${className || ''}`, style: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            maxHeight: '80vh',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontFamily: 'monospace',
            overflow: 'auto'
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '8px'
                }, children: [_jsxs("h3", { style: { margin: 0, fontSize: '16px' }, children: ["SW \u5F00\u53D1\u5DE5\u5177 ", isDevelopment && _jsx("span", { style: { color: '#4CAF50' }, children: "(DEV)" })] }), _jsx("button", { onClick: toggleVisibility, style: {
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            padding: '0 4px'
                        }, title: "\u5173\u95ED (Ctrl+Shift+S)", children: "\u00D7" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', color: '#666' }, children: "Service Worker \u72B6\u6001" }), _jsxs("div", { style: { fontSize: '12px', lineHeight: '1.4' }, children: [_jsxs("div", { children: ["\u652F\u6301: ", _jsx("span", { style: { color: swStatus.isSupported ? 'green' : 'red' }, children: swStatus.isSupported ? '是' : '否' })] }), _jsxs("div", { children: ["\u5DF2\u6CE8\u518C: ", _jsx("span", { style: { color: swStatus.isRegistered ? 'green' : 'red' }, children: swStatus.isRegistered ? '是' : '否' })] }), _jsxs("div", { children: ["\u5DF2\u6FC0\u6D3B: ", _jsx("span", { style: { color: swStatus.isControlling ? 'green' : 'red' }, children: swStatus.isControlling ? '是' : '否' })] }), swStatus.scope && _jsxs("div", { children: ["\u4F5C\u7528\u57DF: ", swStatus.scope] }), _jsxs("div", { children: ["\u73AF\u5883: ", _jsx("span", { style: { color: isDevelopment ? '#4CAF50' : '#2196F3' }, children: isDevelopment ? '开发' : '生产' })] })] })] }), cacheStatus && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', color: '#666' }, children: "\u7F13\u5B58\u72B6\u6001" }), _jsxs("div", { style: { fontSize: '12px', lineHeight: '1.4' }, children: [_jsxs("div", { children: ["\u7F13\u5B58\u9879\u76EE: ", cacheStatus.cacheCount] }), _jsxs("div", { children: ["\u6570\u636E\u5E93: ", cacheStatus.dbName] }), cacheStatus.environment && _jsxs("div", { children: ["SW\u73AF\u5883: ", cacheStatus.environment] }), cacheStatus.cacheName && _jsxs("div", { children: ["\u7F13\u5B58\u540D: ", cacheStatus.cacheName] })] })] })), isDevelopment && devInfo && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', color: '#666' }, children: "\u5F00\u53D1\u4FE1\u606F" }), _jsxs("div", { style: { fontSize: '10px', lineHeight: '1.3', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }, children: [_jsxs("div", { children: ["\u7F13\u5B58\u65F6\u957F: ", Math.round(devInfo.config.maxCacheAge / 60000), "\u5206\u949F"] }), _jsxs("div", { children: ["\u77ED\u7F13\u5B58: ", Math.round(devInfo.config.development?.shortCacheAge / 60000), "\u5206\u949F"] }), _jsxs("div", { children: ["\u8DF3\u8FC7HTML: ", devInfo.config.development?.bypassCacheForHtml ? '是' : '否'] })] })] })), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '12px'
                }, children: [_jsx("button", { onClick: updateStatus, disabled: isLoading, style: {
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            opacity: isLoading ? 0.6 : 1
                        }, children: "\u5237\u65B0\u72B6\u6001" }), _jsx("button", { onClick: handleClearCache, disabled: isLoading || !swStatus.isControlling, style: {
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (isLoading || !swStatus.isControlling) ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            opacity: (isLoading || !swStatus.isControlling) ? 0.6 : 1
                        }, children: "\u6E05\u7A7A\u7F13\u5B58" })] }), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: isDevelopment ? '12px' : '0'
                }, children: [_jsx("button", { onClick: handleUpdateSW, disabled: isLoading || !swStatus.isRegistered, style: {
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (isLoading || !swStatus.isRegistered) ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            opacity: (isLoading || !swStatus.isRegistered) ? 0.6 : 1
                        }, children: "\u66F4\u65B0 SW" }), _jsx("button", { onClick: handleUnregisterSW, disabled: isLoading || !swStatus.isRegistered, style: {
                            padding: '6px 12px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (isLoading || !swStatus.isRegistered) ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            opacity: (isLoading || !swStatus.isRegistered) ? 0.6 : 1
                        }, children: "\u5378\u8F7D SW" })] }), isDevelopment && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("h4", { style: { margin: 0, fontSize: '14px', color: '#666' }, children: "\u5B9E\u65F6\u65E5\u5FD7" }), _jsxs("div", { children: [_jsx("button", { onClick: () => setShowLogs(!showLogs), style: {
                                            padding: '2px 8px',
                                            backgroundColor: '#17a2b8',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            fontSize: '10px',
                                            marginRight: '4px'
                                        }, children: showLogs ? '隐藏' : '显示' }), _jsx("button", { onClick: clearLogs, style: {
                                            padding: '2px 8px',
                                            backgroundColor: '#ffc107',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '3px',
                                            fontSize: '10px'
                                        }, children: "\u6E05\u7A7A" })] })] }), showLogs && (_jsx("div", { style: {
                            backgroundColor: '#000',
                            color: '#0f0',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'Consolas, monospace',
                            maxHeight: '200px',
                            overflow: 'auto',
                            lineHeight: '1.2'
                        }, children: logs.length === 0 ? (_jsx("div", { style: { color: '#666' }, children: "\u6682\u65E0\u65E5\u5FD7..." })) : (logs.map((log, index) => (_jsx("div", { style: { marginBottom: '2px' }, children: log }, index)))) }))] })), _jsxs("div", { style: {
                    fontSize: '10px',
                    color: '#666',
                    textAlign: 'center',
                    borderTop: '1px solid #eee',
                    paddingTop: '8px'
                }, children: ["\u5FEB\u6377\u952E: Ctrl+Shift+S", isDevelopment && _jsx("div", { children: "\u5F00\u53D1\u6A21\u5F0F\u5DF2\u542F\u7528 - \u7F13\u5B58\u65F6\u95F4\u8F83\u77ED" })] })] }));
};
export default ServiceWorkerDevTools;
