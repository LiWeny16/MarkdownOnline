import cdnInit, { loadScripts, preload, testCdns } from "@App/user/cdn";
/**
 * 更新加载进度文本
 * @param zhMessage 中文进度消息
 * @param enMessage 英文进度消息
 */
function updateLoadingProgress(zhMessage, enMessage) {
    // 使用全局函数更新双语进度
    const updateFn = window.updateLoadingProgress;
    if (typeof updateFn === 'function') {
        updateFn(zhMessage, enMessage);
    }
    else {
        // 兜底方案：直接更新中文进度
        const progressElement = document.getElementById('loading-progress');
        if (progressElement) {
            progressElement.textContent = zhMessage;
        }
    }
}
const languageInit = () => {
    const preferredLanguage = localStorage.getItem("i18nextLng") || "zh-CN";
    document.documentElement.lang = preferredLanguage;
};
(async function preInit() {
    try {
        updateLoadingProgress('正在初始化语言设置...', 'Initializing language settings...');
        languageInit();
        updateLoadingProgress('正在初始化CDN配置...', 'Initializing CDN configuration...');
        await cdnInit();
        updateLoadingProgress('正在测试CDN连接...', 'Testing CDN connections...');
        await testCdns();
        updateLoadingProgress('正在加载核心脚本...', 'Loading core scripts...');
        await loadScripts();
        updateLoadingProgress('正在预加载资源...', 'Preloading resources...');
        await preload();
        updateLoadingProgress('初始化完成，正在启动应用...', 'Initialization complete, starting app...');
    }
    catch (error) {
        console.error('[PreInit] 初始化过程中发生错误:', error);
        updateLoadingProgress('初始化遇到问题，正在尝试继续...', 'Encountered issues during initialization, trying to continue...');
    }
})();
