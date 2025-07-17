/**
 * @file swManager.ts
 * @description Service Worker 管理器 - 提供注册、控制和通信功能
 * @version 1.0.0
 */
/**
 * Service Worker 管理器类
 */
export class ServiceWorkerManager {
    constructor(config = {}) {
        Object.defineProperty(this, "registration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isSupported", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = {
            scriptUrl: '/sw.js',
            scope: '/',
            updateViaCache: 'none',
            ...config
        };
        this.isSupported = 'serviceWorker' in navigator;
        if (!this.isSupported) {
            console.warn('[SWManager] Service Worker 不被当前浏览器支持');
        }
    }
    /**
     * 获取 ServiceWorkerManager 单例实例
     */
    static getInstance(config) {
        if (!ServiceWorkerManager.instance) {
            ServiceWorkerManager.instance = new ServiceWorkerManager(config);
        }
        return ServiceWorkerManager.instance;
    }
    /**
     * 注册 Service Worker
     */
    async register() {
        if (!this.isSupported) {
            console.warn('[SWManager] Service Worker 不支持，跳过注册');
            return null;
        }
        try {
            console.log('[SWManager] 开始注册 Service Worker...');
            this.registration = await navigator.serviceWorker.register(this.config.scriptUrl, {
                scope: this.config.scope,
                updateViaCache: this.config.updateViaCache
            });
            console.log('[SWManager] Service Worker 注册成功，作用域:', this.registration.scope);
            // 监听更新
            this.registration.addEventListener('updatefound', () => {
                console.log('[SWManager] 发现 Service Worker 更新');
                this.handleUpdate();
            });
            // 如果有等待中的 Service Worker，提示用户更新
            if (this.registration.waiting) {
                this.handleUpdate();
            }
            // 监听控制器变化
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[SWManager] Service Worker 控制器已更改');
                window.location.reload();
            });
            // 监听来自 Service Worker 的消息
            navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));
            return this.registration;
        }
        catch (error) {
            console.error('[SWManager] Service Worker 注册失败:', error);
            return null;
        }
    }
    /**
     * 处理 Service Worker 更新
     */
    handleUpdate() {
        if (!this.registration?.waiting)
            return;
        const shouldUpdate = confirm('发现新版本的应用程序。是否立即更新？\n\n点击"确定"更新，点击"取消"稍后更新。');
        if (shouldUpdate) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }
    /**
     * 处理来自 Service Worker 的消息
     */
    handleMessage(event) {
        const { type, data } = event.data;
        switch (type) {
            case 'CACHE_STATUS_RESPONSE':
                console.log('[SWManager] 缓存状态:', data);
                break;
            case 'CLEAR_CACHE_RESPONSE':
                console.log('[SWManager] 缓存清理结果:', data);
                break;
            default:
                console.log('[SWManager] 收到未知消息:', event.data);
        }
    }
    /**
     * 获取缓存状态
     */
    async getCacheStatus() {
        if (!this.isSupported || !navigator.serviceWorker.controller) {
            return null;
        }
        const controller = navigator.serviceWorker.controller;
        if (!controller) {
            return null;
        }
        return new Promise((resolve) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (event) => {
                if (event.data.type === 'CACHE_STATUS_RESPONSE') {
                    resolve({
                        ...event.data.data,
                        isRegistered: !!this.registration,
                        isControlling: !!navigator.serviceWorker.controller
                    });
                }
            };
            controller.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
            // 5秒超时
            setTimeout(() => {
                resolve({
                    cacheCount: 0,
                    dbName: 'unknown',
                    isRegistered: !!this.registration,
                    isControlling: !!navigator.serviceWorker.controller
                });
            }, 5000);
        });
    }
    /**
     * 清空缓存
     */
    async clearCache() {
        if (!this.isSupported || !navigator.serviceWorker.controller) {
            console.warn('[SWManager] Service Worker 未激活，无法清空缓存');
            return false;
        }
        const controller = navigator.serviceWorker.controller;
        if (!controller) {
            console.warn('[SWManager] Service Worker 控制器不可用');
            return false;
        }
        return new Promise((resolve) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (event) => {
                if (event.data.type === 'CLEAR_CACHE_RESPONSE') {
                    resolve(event.data.data.success);
                }
            };
            controller.postMessage({ type: 'CLEAR_CACHE' }, [channel.port2]);
            // 10秒超时
            setTimeout(() => {
                resolve(false);
            }, 10000);
        });
    }
    /**
     * 卸载 Service Worker
     */
    async unregister() {
        if (!this.registration) {
            console.warn('[SWManager] 没有已注册的 Service Worker');
            return false;
        }
        try {
            const result = await this.registration.unregister();
            if (result) {
                console.log('[SWManager] Service Worker 已成功卸载');
                this.registration = null;
            }
            return result;
        }
        catch (error) {
            console.error('[SWManager] Service Worker 卸载失败:', error);
            return false;
        }
    }
    /**
     * 强制更新 Service Worker
     */
    async update() {
        if (!this.registration) {
            console.warn('[SWManager] 没有已注册的 Service Worker');
            return;
        }
        try {
            await this.registration.update();
            console.log('[SWManager] Service Worker 更新检查完成');
        }
        catch (error) {
            console.error('[SWManager] Service Worker 更新失败:', error);
        }
    }
    /**
     * 获取当前状态
     */
    getStatus() {
        return {
            isSupported: this.isSupported,
            isRegistered: !!this.registration,
            isControlling: !!navigator.serviceWorker.controller,
            scope: this.registration?.scope
        };
    }
    /**
     * 等待 Service Worker 激活
     */
    async waitForActivation() {
        if (!this.registration) {
            throw new Error('Service Worker 未注册');
        }
        if (this.registration.active) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const checkState = () => {
                if (this.registration.active) {
                    resolve();
                }
                else {
                    setTimeout(checkState, 100);
                }
            };
            checkState();
        });
    }
    /**
     * 在页面加载时自动初始化
     */
    static async autoInit(config) {
        const manager = ServiceWorkerManager.getInstance(config);
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }
        await manager.register();
        return manager;
    }
}
// 导出便捷函数
export const swManager = ServiceWorkerManager.getInstance();
/**
 * 初始化 Service Worker（便捷函数）
 */
export async function initServiceWorker(config) {
    return ServiceWorkerManager.autoInit(config);
}
/**
 * 显示缓存状态（调试用）
 */
export async function showCacheStatus() {
    const status = await swManager.getCacheStatus();
    console.table(status);
    if (status && typeof window !== 'undefined') {
        const message = `
缓存状态:
- 已缓存项目: ${status.cacheCount}
- 数据库: ${status.dbName}
- SW已注册: ${status.isRegistered ? '是' : '否'}
- SW已激活: ${status.isControlling ? '是' : '否'}
        `.trim();
        alert(message);
    }
}
/**
 * 清空所有缓存（调试用）
 */
export async function clearAllCache() {
    const confirmed = confirm('确定要清空所有缓存吗？这将删除所有离线数据。');
    if (!confirmed)
        return;
    const success = await swManager.clearCache();
    if (success) {
        alert('缓存已清空。页面将重新加载。');
        window.location.reload();
    }
    else {
        alert('缓存清空失败。');
    }
}
