/**
 * @file swConfig.ts
 * @description Service Worker 配置文件 - 可扩展的缓存策略配置
 * @version 1.0.0
 */
/**
 * Service Worker 全局配置
 */
export interface ServiceWorkerConfig {
    database: {
        name: string;
        version: number;
        storeName: string;
        maxCacheAge: number;
    };
    cachePatterns: {
        [key: string]: {
            patterns: RegExp[];
            strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
            enabled: boolean;
        };
    };
    performance: {
        enableLogging: boolean;
        maxConcurrentRequests: number;
        requestTimeout: number;
    };
    features: {
        autoCleanup: boolean;
        offlineSupport: boolean;
        updateNotification: boolean;
    };
}
/**
 * 默认配置
 */
export declare const defaultSWConfig: ServiceWorkerConfig;
/**
 * 配置管理器
 */
export declare class ServiceWorkerConfigManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): ServiceWorkerConfigManager;
    /**
     * 加载配置（从 localStorage 或使用默认配置）
     */
    private loadConfig;
    /**
     * 深度合并配置对象
     */
    private mergeConfig;
    /**
     * 获取当前配置
     */
    getConfig(): ServiceWorkerConfig;
    /**
     * 更新配置
     */
    updateConfig(updates: Partial<ServiceWorkerConfig>): void;
    /**
     * 保存配置到 localStorage
     */
    private saveConfig;
    /**
     * 重置为默认配置
     */
    resetConfig(): void;
    /**
     * 获取特定资源类型的配置
     */
    getPatternConfig(resourceType: string): {
        patterns: RegExp[];
        strategy: "cache-first" | "network-first" | "stale-while-revalidate";
        enabled: boolean;
    };
    /**
     * 启用/禁用特定资源类型的缓存
     */
    setPatternEnabled(resourceType: string, enabled: boolean): void;
    /**
     * 添加新的缓存模式
     */
    addCachePattern(name: string, patterns: RegExp[], strategy?: 'cache-first' | 'network-first' | 'stale-while-revalidate'): void;
    /**
     * 移除缓存模式
     */
    removeCachePattern(name: string): void;
    /**
     * 检查URL是否匹配某个缓存模式
     */
    matchUrl(url: string): {
        type: string;
        config: any;
    } | null;
    /**
     * 导出配置（用于备份）
     */
    exportConfig(): string;
    /**
     * 导入配置（从备份恢复）
     */
    importConfig(configJson: string): boolean;
}
export declare const swConfig: ServiceWorkerConfigManager;
/**
 * 便捷函数：获取当前配置
 */
export declare function getSWConfig(): ServiceWorkerConfig;
/**
 * 便捷函数：检查URL是否应该被缓存
 */
export declare function shouldCacheUrl(url: string): {
    shouldCache: boolean;
    type?: string;
    strategy?: string;
};
