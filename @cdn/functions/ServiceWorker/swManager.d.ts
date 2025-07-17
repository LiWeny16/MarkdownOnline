/**
 * @file swManager.ts
 * @description Service Worker 管理器 - 提供注册、控制和通信功能
 * @version 1.0.0
 */
export interface CacheStatus {
    cacheCount: number;
    dbName: string;
    isRegistered: boolean;
    isControlling: boolean;
}
export interface SWConfig {
    scriptUrl?: string;
    scope?: string;
    updateViaCache?: 'imports' | 'all' | 'none';
}
/**
 * Service Worker 管理器类
 */
export declare class ServiceWorkerManager {
    private static instance;
    private registration;
    private isSupported;
    private config;
    private constructor();
    /**
     * 获取 ServiceWorkerManager 单例实例
     */
    static getInstance(config?: SWConfig): ServiceWorkerManager;
    /**
     * 注册 Service Worker
     */
    register(): Promise<ServiceWorkerRegistration | null>;
    /**
     * 处理 Service Worker 更新
     */
    private handleUpdate;
    /**
     * 处理来自 Service Worker 的消息
     */
    private handleMessage;
    /**
     * 获取缓存状态
     */
    getCacheStatus(): Promise<CacheStatus | null>;
    /**
     * 清空缓存
     */
    clearCache(): Promise<boolean>;
    /**
     * 卸载 Service Worker
     */
    unregister(): Promise<boolean>;
    /**
     * 强制更新 Service Worker
     */
    update(): Promise<void>;
    /**
     * 获取当前状态
     */
    getStatus(): {
        isSupported: boolean;
        isRegistered: boolean;
        isControlling: boolean;
        scope?: string;
    };
    /**
     * 等待 Service Worker 激活
     */
    waitForActivation(): Promise<void>;
    /**
     * 在页面加载时自动初始化
     */
    static autoInit(config?: SWConfig): Promise<ServiceWorkerManager>;
}
export declare const swManager: ServiceWorkerManager;
/**
 * 初始化 Service Worker（便捷函数）
 */
export declare function initServiceWorker(config?: SWConfig): Promise<ServiceWorkerManager>;
/**
 * 显示缓存状态（调试用）
 */
export declare function showCacheStatus(): Promise<void>;
/**
 * 清空所有缓存（调试用）
 */
export declare function clearAllCache(): Promise<void>;
