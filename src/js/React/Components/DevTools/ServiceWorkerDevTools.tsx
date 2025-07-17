/**
 * @file ServiceWorkerDevTools.tsx
 * @description Service Worker 开发者工具组件
 */

import React, { useState, useEffect } from 'react';
import { swManager, CacheStatus, showCacheStatus, clearAllCache } from '@Func/ServiceWorker/swManager';

interface Props {
    className?: string;
    visible?: boolean;
}

interface DevInfo {
    config: any;
    timestamp: number;
    url: string;
}

const ServiceWorkerDevTools: React.FC<Props> = ({ className, visible = false }) => {
    const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
    const [swStatus, setSWStatus] = useState(swManager.getStatus());
    const [devInfo, setDevInfo] = useState<DevInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(visible);
    const [logs, setLogs] = useState<string[]>([]);
    const [showLogs, setShowLogs] = useState(false);

    const isDevelopment = process.env.NODE_ENV === 'development';

    // 拦截控制台日志
    useEffect(() => {
        if (!isDevelopment) return;

        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            
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
                navigator.serviceWorker.controller.postMessage(
                    { type: 'DEV_INFO' },
                    [channel.port2]
                );
            }
        } catch (error) {
            console.error('更新状态失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 清空缓存
    const handleClearCache = async () => {
        if (!confirm('确定要清空所有缓存吗？')) return;
        
        setIsLoading(true);
        try {
            const success = await swManager.clearCache();
            if (success) {
                alert('缓存已清空');
                await updateStatus();
            } else {
                alert('清空缓存失败');
            }
        } catch (error) {
            console.error('清空缓存出错:', error);
            alert('清空缓存出错');
        } finally {
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
        } catch (error) {
            console.error('更新 SW 出错:', error);
            alert('更新 Service Worker 失败');
        } finally {
            setIsLoading(false);
        }
    };

    // 卸载 SW
    const handleUnregisterSW = async () => {
        if (!confirm('确定要卸载 Service Worker 吗？这将禁用离线功能。')) return;
        
        setIsLoading(true);
        try {
            const success = await swManager.unregister();
            if (success) {
                alert('Service Worker 已卸载');
                await updateStatus();
            } else {
                alert('卸载失败');
            }
        } catch (error) {
            console.error('卸载 SW 出错:', error);
            alert('卸载 Service Worker 失败');
        } finally {
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
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'S') {
                event.preventDefault();
                toggleVisibility();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isVisible) {
        return (
            <div 
                className={`sw-dev-tools-toggle ${className || ''}`}
                style={{
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
                }}
                onClick={toggleVisibility}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                title={`点击打开 Service Worker 开发工具 (Ctrl+Shift+S)\n状态: ${swStatus.isControlling ? '激活' : '未激活'}`}
            >
                SW {isDevelopment ? 'DEV' : '工具'}
                {swStatus.isControlling && <span style={{ marginLeft: '4px' }}>●</span>}
            </div>
        );
    }

    return (
        <div 
            className={`sw-dev-tools ${className || ''}`}
            style={{
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
            }}
        >
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid #eee',
                paddingBottom: '8px'
            }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>
                    SW 开发工具 {isDevelopment && <span style={{ color: '#4CAF50' }}>(DEV)</span>}
                </h3>
                <button
                    onClick={toggleVisibility}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0 4px'
                    }}
                    title="关闭 (Ctrl+Shift+S)"
                >
                    ×
                </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Service Worker 状态</h4>
                <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    <div>支持: <span style={{ color: swStatus.isSupported ? 'green' : 'red' }}>
                        {swStatus.isSupported ? '是' : '否'}
                    </span></div>
                    <div>已注册: <span style={{ color: swStatus.isRegistered ? 'green' : 'red' }}>
                        {swStatus.isRegistered ? '是' : '否'}
                    </span></div>
                    <div>已激活: <span style={{ color: swStatus.isControlling ? 'green' : 'red' }}>
                        {swStatus.isControlling ? '是' : '否'}
                    </span></div>
                    {swStatus.scope && <div>作用域: {swStatus.scope}</div>}
                    <div>环境: <span style={{ color: isDevelopment ? '#4CAF50' : '#2196F3' }}>
                        {isDevelopment ? '开发' : '生产'}
                    </span></div>
                </div>
            </div>

            {cacheStatus && (
                <div style={{ marginBottom: '12px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>缓存状态</h4>
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        <div>缓存项目: {cacheStatus.cacheCount}</div>
                        <div>数据库: {cacheStatus.dbName}</div>
                        {(cacheStatus as any).environment && <div>SW环境: {(cacheStatus as any).environment}</div>}
                        {(cacheStatus as any).cacheName && <div>缓存名: {(cacheStatus as any).cacheName}</div>}
                    </div>
                </div>
            )}

            {isDevelopment && devInfo && (
                <div style={{ marginBottom: '12px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>开发信息</h4>
                    <div style={{ fontSize: '10px', lineHeight: '1.3', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                        <div>缓存时长: {Math.round(devInfo.config.maxCacheAge / 60000)}分钟</div>
                        <div>短缓存: {Math.round(devInfo.config.development?.shortCacheAge / 60000)}分钟</div>
                        <div>跳过HTML: {devInfo.config.development?.bypassCacheForHtml ? '是' : '否'}</div>
                    </div>
                </div>
            )}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '12px'
            }}>
                <button
                    onClick={updateStatus}
                    disabled={isLoading}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: isLoading ? 0.6 : 1
                    }}
                >
                    刷新状态
                </button>
                
                <button
                    onClick={handleClearCache}
                    disabled={isLoading || !swStatus.isControlling}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (isLoading || !swStatus.isControlling) ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: (isLoading || !swStatus.isControlling) ? 0.6 : 1
                    }}
                >
                    清空缓存
                </button>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: isDevelopment ? '12px' : '0'
            }}>
                <button
                    onClick={handleUpdateSW}
                    disabled={isLoading || !swStatus.isRegistered}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (isLoading || !swStatus.isRegistered) ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: (isLoading || !swStatus.isRegistered) ? 0.6 : 1
                    }}
                >
                    更新 SW
                </button>
                
                <button
                    onClick={handleUnregisterSW}
                    disabled={isLoading || !swStatus.isRegistered}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (isLoading || !swStatus.isRegistered) ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: (isLoading || !swStatus.isRegistered) ? 0.6 : 1
                    }}
                >
                    卸载 SW
                </button>
            </div>

            {isDevelopment && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#666' }}>实时日志</h4>
                        <div>
                            <button
                                onClick={() => setShowLogs(!showLogs)}
                                style={{
                                    padding: '2px 8px',
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    fontSize: '10px',
                                    marginRight: '4px'
                                }}
                            >
                                {showLogs ? '隐藏' : '显示'}
                            </button>
                            <button
                                onClick={clearLogs}
                                style={{
                                    padding: '2px 8px',
                                    backgroundColor: '#ffc107',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '3px',
                                    fontSize: '10px'
                                }}
                            >
                                清空
                            </button>
                        </div>
                    </div>
                    
                    {showLogs && (
                        <div style={{
                            backgroundColor: '#000',
                            color: '#0f0',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'Consolas, monospace',
                            maxHeight: '200px',
                            overflow: 'auto',
                            lineHeight: '1.2'
                        }}>
                            {logs.length === 0 ? (
                                <div style={{ color: '#666' }}>暂无日志...</div>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} style={{ marginBottom: '2px' }}>
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            <div style={{ 
                fontSize: '10px', 
                color: '#666', 
                textAlign: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '8px'
            }}>
                快捷键: Ctrl+Shift+S
                {isDevelopment && <div>开发模式已启用 - 缓存时间较短</div>}
            </div>
        </div>
    );
};

export default ServiceWorkerDevTools; 