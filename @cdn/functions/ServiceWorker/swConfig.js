/**
 * @file swConfig.ts
 * @description Service Worker 配置文件 - 可扩展的缓存策略配置
 * @version 1.0.0
 */
/**
 * 默认配置
 */
export const defaultSWConfig = {
    database: {
        name: 'markdownol-cache-db',
        version: 1,
        storeName: 'resources',
        maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7天
    },
    cachePatterns: {
        // Monaco Editor 资源
        monaco: {
            patterns: [
                /cdn\.jsdmirror\.com.*monaco-editor/,
                /cdn\.jsdelivr\.net.*monaco-editor/,
                /unpkg\.com.*monaco-editor/,
            ],
            strategy: 'cache-first',
            enabled: true,
        },
        // CSS 样式文件
        styles: {
            patterns: [
                /\.css$/,
                /cdn\.jsdmirror\.com.*\.css/,
                /cdn\.jsdelivr\.net.*\.css/,
            ],
            strategy: 'cache-first',
            enabled: true,
        },
        // JavaScript 库
        scripts: {
            patterns: [
                /cdn\.jsdmirror\.com.*katex/,
                /cdn\.jsdmirror\.com.*incremental-dom/,
                /cdn\.jsdmirror\.com.*markdown-it/,
                /cdn\.jsdmirror\.com.*highlight\.js/,
                /cdn\.jsdelivr\.net.*katex/,
                /npm\/.*\.js$/,
            ],
            strategy: 'cache-first',
            enabled: true,
        },
        // 字体文件
        fonts: {
            patterns: [
                /\.(woff|woff2|ttf|eot)(\?.*)?$/,
                /fonts\.googleapis\.com/,
                /fonts\.gstatic\.com/,
            ],
            strategy: 'cache-first',
            enabled: true,
        },
        // 图片资源
        images: {
            patterns: [
                /\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/,
            ],
            strategy: 'cache-first',
            enabled: true,
        },
        // API 请求
        api: {
            patterns: [
                /\/api\//,
                /\/graphql/,
            ],
            strategy: 'network-first',
            enabled: false, // 默认不缓存API
        },
        // 静态资源
        assets: {
            patterns: [
                /\/static\//,
                /\/assets\//,
                /\.(json|xml|txt)(\?.*)?$/,
            ],
            strategy: 'cache-first',
            enabled: true,
        },
    },
    performance: {
        enableLogging: process.env.NODE_ENV === 'development',
        maxConcurrentRequests: 6,
        requestTimeout: 10000, // 10秒
    },
    features: {
        autoCleanup: true,
        offlineSupport: true,
        updateNotification: true,
    },
};
/**
 * 用户自定义配置存储键
 */
const SW_CONFIG_STORAGE_KEY = 'markdownol-sw-config';
/**
 * 配置管理器
 */
export class ServiceWorkerConfigManager {
    constructor() {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = this.loadConfig();
    }
    static getInstance() {
        if (!ServiceWorkerConfigManager.instance) {
            ServiceWorkerConfigManager.instance = new ServiceWorkerConfigManager();
        }
        return ServiceWorkerConfigManager.instance;
    }
    /**
     * 加载配置（从 localStorage 或使用默认配置）
     */
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem(SW_CONFIG_STORAGE_KEY);
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                // 合并默认配置和用户配置
                return this.mergeConfig(defaultSWConfig, parsed);
            }
        }
        catch (error) {
            console.warn('[SW Config] 加载用户配置失败，使用默认配置:', error);
        }
        return { ...defaultSWConfig };
    }
    /**
     * 深度合并配置对象
     */
    mergeConfig(defaultConfig, userConfig) {
        const merged = { ...defaultConfig };
        // 合并数据库配置
        if (userConfig.database) {
            merged.database = { ...defaultConfig.database, ...userConfig.database };
        }
        // 合并缓存模式配置
        if (userConfig.cachePatterns) {
            for (const [key, pattern] of Object.entries(userConfig.cachePatterns)) {
                if (merged.cachePatterns[key]) {
                    merged.cachePatterns[key] = {
                        ...merged.cachePatterns[key],
                        ...pattern
                    };
                }
                else {
                    merged.cachePatterns[key] = pattern;
                }
            }
        }
        // 合并性能配置
        if (userConfig.performance) {
            merged.performance = { ...defaultConfig.performance, ...userConfig.performance };
        }
        // 合并功能开关
        if (userConfig.features) {
            merged.features = { ...defaultConfig.features, ...userConfig.features };
        }
        return merged;
    }
    /**
     * 获取当前配置
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * 更新配置
     */
    updateConfig(updates) {
        this.config = this.mergeConfig(this.config, updates);
        this.saveConfig();
    }
    /**
     * 保存配置到 localStorage
     */
    saveConfig() {
        try {
            localStorage.setItem(SW_CONFIG_STORAGE_KEY, JSON.stringify(this.config));
        }
        catch (error) {
            console.warn('[SW Config] 保存配置失败:', error);
        }
    }
    /**
     * 重置为默认配置
     */
    resetConfig() {
        this.config = { ...defaultSWConfig };
        this.saveConfig();
    }
    /**
     * 获取特定资源类型的配置
     */
    getPatternConfig(resourceType) {
        return this.config.cachePatterns[resourceType] || null;
    }
    /**
     * 启用/禁用特定资源类型的缓存
     */
    setPatternEnabled(resourceType, enabled) {
        if (this.config.cachePatterns[resourceType]) {
            this.config.cachePatterns[resourceType].enabled = enabled;
            this.saveConfig();
        }
    }
    /**
     * 添加新的缓存模式
     */
    addCachePattern(name, patterns, strategy = 'cache-first') {
        this.config.cachePatterns[name] = {
            patterns,
            strategy,
            enabled: true,
        };
        this.saveConfig();
    }
    /**
     * 移除缓存模式
     */
    removeCachePattern(name) {
        if (this.config.cachePatterns[name]) {
            delete this.config.cachePatterns[name];
            this.saveConfig();
        }
    }
    /**
     * 检查URL是否匹配某个缓存模式
     */
    matchUrl(url) {
        for (const [type, config] of Object.entries(this.config.cachePatterns)) {
            if (config.enabled) {
                for (const pattern of config.patterns) {
                    if (pattern.test(url)) {
                        return { type, config };
                    }
                }
            }
        }
        return null;
    }
    /**
     * 导出配置（用于备份）
     */
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }
    /**
     * 导入配置（从备份恢复）
     */
    importConfig(configJson) {
        try {
            const config = JSON.parse(configJson);
            this.config = this.mergeConfig(defaultSWConfig, config);
            this.saveConfig();
            return true;
        }
        catch (error) {
            console.error('[SW Config] 导入配置失败:', error);
            return false;
        }
    }
}
// 导出单例实例
export const swConfig = ServiceWorkerConfigManager.getInstance();
/**
 * 便捷函数：获取当前配置
 */
export function getSWConfig() {
    return swConfig.getConfig();
}
/**
 * 便捷函数：检查URL是否应该被缓存
 */
export function shouldCacheUrl(url) {
    const match = swConfig.matchUrl(url);
    if (match) {
        return {
            shouldCache: true,
            type: match.type,
            strategy: match.config.strategy,
        };
    }
    return { shouldCache: false };
}
