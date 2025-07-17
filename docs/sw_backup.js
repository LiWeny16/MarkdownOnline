/**
 * @file sw.js
 * @description 可扩展的、配置驱动的 Service Worker - 专为 MarkdownOL 项目优化
 * @version 1.0.0
 */

// --- 0. 环境检测 ---
const isDevelopment = self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1' ||
    self.location.hostname.includes('localhost') ||
    self.location.protocol === 'http:';

// --- 1. 配置中心 (Configuration) ---
const config = {
    // IndexedDB 配置
    dbName: 'markdownol-cache-db',
    dbVersion: 1,
    objectStoreName: 'resources',

    // 缓存策略配置
    cacheName: `markdownol-v1${isDevelopment ? '-dev' : ''}`,
    maxCacheAge: isDevelopment ? 40 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 开发环境30分钟，生产环境7天

    // 开发环境配置
    development: {
        enableDetailedLogging: true,
        bypassCacheForHtml: true, // 开发环境下跳过HTML缓存
        shortCacheAge: 5 * 60 * 1000, // 5分钟短缓存
    },

    // 需要缓存的资源模式
    cachePatterns: {
        // Monaco Editor 相关资源
        monaco: [
            /cdn\.jsdmirror\.com.*monaco-editor/,
            /cdn\.jsdelivr\.net.*monaco-editor/,
            /unpkg\.com.*monaco-editor/,
        ],
        // CSS 资源
        styles: [
            /\.css$/,
            /cdn\.jsdmirror\.com.*\.css/,
            /cdn\.jsdelivr\.net.*\.css/,
        ],
        // JavaScript 库
        scripts: [
            /cdn\.jsdmirror\.com.*katex/,
            /cdn\.jsdmirror\.com.*incremental-dom/,
            /cdn\.jsdmirror\.com.*markdown-it/,
            /cdn\.jsdmirror\.com.*highlight\.js/,
            /cdn\.jsdelivr\.net.*katex/,
        ],
        // 字体文件
        fonts: [
            /\.(woff|woff2|ttf|eot)$/,
        ],
        // 其他静态资源
        assets: [
            /\.(png|jpg|jpeg|gif|svg|ico)$/,
        ]
    }
};

// 开发环境专用日志函数
function devLog(message, ...args) {
    if (isDevelopment && config.development.enableDetailedLogging) {
        console.log(`[SW-DEV] ${message}`, ...args);
    }
}

console.log(`[SW] Service Worker 初始化中... (${isDevelopment ? '开发' : '生产'}环境)`);
if (isDevelopment) {
    console.log('[SW] 开发环境配置:', {
        cacheName: config.cacheName,
        maxCacheAge: config.maxCacheAge,
        shortCacheAge: config.development.shortCacheAge
    });
}

// --- 2. IndexedDB 辅助函数 (Helpers) ---
let dbPromise;

/**
 * 打开或创建 IndexedDB 数据库
 * @returns {Promise<IDBDatabase>}
 */
function getDB() {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(config.dbName, config.dbVersion);

            request.onerror = (event) => {
                console.error('[SW] IndexedDB 错误:', event.target.errorCode);
                reject(event.target.errorCode);
            };

            request.onsuccess = (event) => {
                devLog('IndexedDB 连接成功');
                resolve(event.target.result);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(config.objectStoreName)) {
                    const store = db.createObjectStore(config.objectStoreName, { keyPath: 'url' });
                    // 创建索引以便按时间戳查询
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    devLog(`对象存储空间 "${config.objectStoreName}" 已创建`);
                }
            };
        });
    }
    return dbPromise;
}

/**
 * 从 IndexedDB 获取缓存数据
 * @param {string} key - 资源URL
 * @returns {Promise<any | undefined>}
 */
async function getFromDB(key) {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([config.objectStoreName], 'readonly');
            const store = transaction.objectStore(config.objectStoreName);
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result;
                resolve(result);
            };

            request.onerror = (event) => {
                console.warn('[SW] 从IndexedDB读取失败:', event.target.error);
                resolve(undefined); // 读取失败时返回undefined，继续网络请求
            };
        });
    } catch (error) {
        console.warn('[SW] IndexedDB 访问错误:', error);
        return undefined;
    }
}

/**
 * 将数据存入 IndexedDB
 * @param {object} data - 要存储的数据对象
 * @returns {Promise<void>}
 */
async function setToDB(data) {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([config.objectStoreName], 'readwrite');
            const store = transaction.objectStore(config.objectStoreName);
            const request = store.put({
                ...data,
                timestamp: Date.now()
            });

            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.warn('[SW] 存储到IndexedDB失败:', event.target.error);
                resolve(); // 存储失败不应阻塞主流程
            };
        });
    } catch (error) {
        console.warn('[SW] IndexedDB 存储错误:', error);
    }
}

/**
 * 从 IndexedDB 删除数据
 * @param {string} key - 要删除的资源URL
 * @returns {Promise<void>}
 */
async function deleteFromDB(key) {
    try {
        const db = await getDB();
        return new Promise((resolve) => {
            const transaction = db.transaction([config.objectStoreName], 'readwrite');
            const store = transaction.objectStore(config.objectStoreName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => resolve(); // 删除失败也不阻塞
        });
    } catch (error) {
        console.warn('[SW] IndexedDB 删除错误:', error);
    }
}

// --- 3. URL 匹配函数 ---
/**
 * 检查URL是否匹配缓存模式
 * @param {string} url - 要检查的URL
 * @returns {string|null} - 匹配的资源类型或null
 */
function getResourceType(url) {
    // 开发环境下跳过某些资源类型
    if (isDevelopment && config.development.bypassCacheForHtml) {
        if (url.includes('.html') || url.endsWith('/') || !url.includes('.')) {
            devLog('跳过HTML类型资源:', url);
            return null;
        }
    }

    for (const [type, patterns] of Object.entries(config.cachePatterns)) {
        for (const pattern of patterns) {
            if (pattern.test(url)) {
                devLog(`匹配资源类型: ${type}`, url);
                return type;
            }
        }
    }
    return null;
}

// --- 4. 缓存策略 (Caching Strategies) ---

/**
 * 缓存优先策略 - 使用 IndexedDB 进行持久化存储
 * @param {Request} request - 网络请求对象
 * @param {string} resourceType - 资源类型
 * @returns {Promise<Response>}
 */
async function cacheFirstWithIndexedDB(request, resourceType) {
    const url = request.url;
    const startTime = Date.now();

    // 尝试从 IndexedDB 获取缓存
    const cachedData = await getFromDB(url);

    if (cachedData) {
        const age = Date.now() - cachedData.timestamp;
        const maxAge = isDevelopment ? config.development.shortCacheAge : config.maxCacheAge;

        // 开发环境使用更短的缓存时间
        if (age < maxAge) {
            devLog(`缓存命中 (${resourceType}), 年龄: ${Math.round(age / 1000)}s:`, url);
            try {
                // 从缓存构建响应
                const response = new Response(cachedData.body, {
                    status: cachedData.status || 200,
                    statusText: cachedData.statusText || 'OK',
                    headers: new Headers({
                        ...cachedData.headers,
                        'X-SW-Cache': 'HIT',
                        'X-SW-Cache-Age': Math.round(age / 1000).toString()
                    })
                });

                if (isDevelopment) {
                    const responseTime = Date.now() - startTime;
                    devLog(`缓存响应时间: ${responseTime}ms`);
                }

                return response;
            } catch (error) {
                console.warn('[SW] 缓存数据损坏，尝试网络请求:', error);
                // 删除损坏的缓存
                deleteFromDB(url);
            }
        } else {
            devLog(`缓存过期 (${resourceType}), 年龄: ${Math.round(age / 1000)}s:`, url);
            deleteFromDB(url);
        }
    }

    devLog(`缓存未命中 (${resourceType}):`, url);

    // 从网络获取资源
    try {
        const networkStart = Date.now();
        // const response = await fetch(request);
        const networkTime = Date.now() - networkStart;
        let fetchRequest = request; // 默认使用原始请求

        // 如果是 monaco 相关的资源，并且原始请求是 no-cors 模式
        // 我们强制将其转换为 cors 模式，以获取可缓存的响应
        if (resourceType === 'monaco' && request.mode === 'no-cors') {
            devLog(`强制转换请求为 CORS 模式:`, request.url);

            // 创建一个新的 Request 对象，并覆盖 mode 属性
            // new Request(request, { ... }) 是一个便捷的克隆并修改的构造函数
            fetchRequest = new Request(request, {
                mode: 'cors',
                credentials: 'omit' // 对于CDN资源，通常建议设置为 'omit'，不发送 cookies 等凭证
            });
        }
        const response = await fetch(fetchRequest); 
        // --- 在这里添加诊断日志 ---
        console.log('[SW-DEBUG] Fetched Response Status:', response.status);
        console.log('[SW-DEBUG] Fetched Response OK:', response.ok);
        console.log('[SW-DEBUG] Fetched Response Type:', response.type);
        // -------------------------

        devLog(`网络请求时间: ${networkTime}ms`);

        if (response && response.ok) {
            // 克隆响应用于缓存
            const responseToCache = response.clone();

            // 只缓存成功的响应
            if (response.status === 200) {
                try {
                    const body = await responseToCache.blob();
                    const headers = {};

                    // 将 Headers 转换为普通对象
                    for (const [key, value] of responseToCache.headers.entries()) {
                        headers[key] = value;
                    }

                    // 异步存储到 IndexedDB（不阻塞响应）
                    setToDB({
                        url: url,
                        body: body,
                        headers: headers,
                        status: response.status,
                        statusText: response.statusText,
                        resourceType: resourceType
                    }).then(() => {
                        devLog(`已缓存新资源 (${resourceType}):`, url);
                    }).catch(error => {
                        console.warn('[SW] 缓存存储失败:', error);
                    });
                } catch (cacheError) {
                    console.warn('[SW] 处理缓存数据时出错:', cacheError);
                }
            }

            // 添加响应头标识
            const modifiedResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: new Headers({
                    ...Object.fromEntries(response.headers.entries()),
                    'X-SW-Cache': 'MISS',
                    'X-SW-Network-Time': networkTime.toString()
                })
            });

            return modifiedResponse;
        }

        return response;

    } catch (error) {
        console.error(`[SW] 网络请求失败: ${url}`, error);

        // 如果网络失败且没有缓存，返回离线响应
        return new Response(
            JSON.stringify({
                error: '网络请求失败，且无可用缓存',
                url: url,
                message: '请检查网络连接',
                timestamp: new Date().toISOString(),
                environment: isDevelopment ? 'development' : 'production'
            }),
            {
                status: 408,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Offline': 'true',
                    'X-SW-Error': 'network-failed'
                }
            }
        );
    }
}

/**
 * 网络优先策略 - 适用于API请求等
 * @param {Request} request - 网络请求对象
 * @returns {Promise<Response>}
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch (error) {
        devLog('网络失败，尝试缓存...');

        const cachedData = await getFromDB(request.url);
        if (cachedData) {
            return new Response(cachedData.body, {
                headers: new Headers(cachedData.headers)
            });
        }

        throw error;
    }
}

// --- 5. 缓存清理函数 ---
/**
 * 清理过期缓存
 */
async function cleanExpiredCache() {
    try {
        const db = await getDB();
        const transaction = db.transaction([config.objectStoreName], 'readwrite');
        const store = transaction.objectStore(config.objectStoreName);
        const index = store.index('timestamp');

        const cutoffTime = Date.now() - config.maxCacheAge;
        const range = IDBKeyRange.upperBound(cutoffTime);

        let deletedCount = 0;
        index.openCursor(range).onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                store.delete(cursor.primaryKey);
                deletedCount++;
                cursor.continue();
            } else {
                if (deletedCount > 0) {
                    devLog(`已清理 ${deletedCount} 个过期缓存项`);
                }
            }
        };
    } catch (error) {
        console.warn('[SW] 清理缓存时出错:', error);
    }
}

// --- 6. 事件监听器 ---

// Service Worker 安装事件
self.addEventListener('install', (event) => {
    devLog('Service Worker 安装中...');

    event.waitUntil(
        Promise.all([
            self.skipWaiting(), // 强制激活新的 SW
            // 预缓存关键资源（可选）
            caches.open(config.cacheName).then(cache => {
                devLog('缓存已初始化');
            })
        ])
    );
});

// Service Worker 激活事件
self.addEventListener('activate', (event) => {
    devLog('Service Worker 激活中...');

    event.waitUntil(
        Promise.all([
            self.clients.claim(), // 立即控制所有页面
            cleanExpiredCache(), // 清理过期缓存
            // 清理旧版本缓存
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== config.cacheName) {
                            devLog('删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Service Worker fetch 事件 - 核心拦截逻辑
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // 只处理 GET 请求
    if (request.method !== 'GET') {
        return;
    }

    // 跳过非 HTTP(S) 请求
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 开发环境特殊处理
    if (isDevelopment) {
        // 跳过开发服务器的热更新请求
        if (url.pathname.includes('__vite') ||
            url.pathname.includes('hot-update') ||
            url.pathname.includes('websocket') ||
            url.searchParams.has('t')) { // Vite的时间戳参数
            devLog('跳过开发服务器请求:', url.pathname);
            return;
        }
    }

    // --- 路由逻辑 ---
    const resourceType = getResourceType(url.href);

    if (resourceType) {
        devLog(`拦截资源请求 (${resourceType}):`, url.pathname);

        // 根据资源类型应用不同策略
        if (resourceType === 'monaco' || resourceType === 'scripts' || resourceType === 'styles' || resourceType === 'fonts') {
            // Monaco Editor 和静态资源使用缓存优先策略
            event.respondWith(cacheFirstWithIndexedDB(request, resourceType));
        } else {
            // 其他资源也使用缓存优先
            event.respondWith(cacheFirstWithIndexedDB(request, resourceType));
        }
    } else if (url.pathname.startsWith('/api/')) {
        // API 请求使用网络优先策略
        devLog('API请求使用网络优先:', url.pathname);
        event.respondWith(networkFirst(request));
    }

    // 其他请求不做处理，正常通过
});

// 错误处理
self.addEventListener('error', (event) => {
    console.error('[SW] Service Worker 错误:', event.error);
});

// 处理未捕获的Promise拒绝
self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] 未处理的Promise拒绝:', event.reason);
});

// 消息处理 - 用于与主线程通信
self.addEventListener('message', (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'CACHE_STATUS':
            // 返回缓存状态
            getDB().then(db => {
                const transaction = db.transaction([config.objectStoreName], 'readonly');
                const store = transaction.objectStore(config.objectStoreName);
                const countRequest = store.count();

                countRequest.onsuccess = () => {
                    event.ports[0].postMessage({
                        type: 'CACHE_STATUS_RESPONSE',
                        data: {
                            cacheCount: countRequest.result,
                            dbName: config.dbName,
                            environment: isDevelopment ? 'development' : 'production',
                            cacheName: config.cacheName,
                            maxCacheAge: config.maxCacheAge
                        }
                    });
                };
            });
            break;

        case 'CLEAR_CACHE':
            // 清空缓存
            getDB().then(db => {
                const transaction = db.transaction([config.objectStoreName], 'readwrite');
                const store = transaction.objectStore(config.objectStoreName);
                store.clear().onsuccess = () => {
                    devLog('缓存已清空');
                    event.ports[0].postMessage({
                        type: 'CLEAR_CACHE_RESPONSE',
                        data: { success: true }
                    });
                };
            });
            break;

        case 'DEV_INFO':
            // 开发环境信息查询
            if (isDevelopment) {
                event.ports[0].postMessage({
                    type: 'DEV_INFO_RESPONSE',
                    data: {
                        config: config,
                        timestamp: Date.now(),
                        url: self.location.href
                    }
                });
            }
            break;

        default:
            console.warn('[SW] 未知消息类型:', type);
    }
});

console.log(`[SW] Service Worker 脚本加载完成 (${isDevelopment ? '开发' : '生产'}环境)`); 