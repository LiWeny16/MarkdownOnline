import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { pollVariables } from "@App/basic/basic";
import initI18N from "@Func/I18N/i18n";
initI18N();
// 使用 pollVariables 函数等待核心依赖加载完成
pollVariables([
    "markdownitIncrementalDOM",
    "katex",
    "IncrementalDOM",
]).then(() => {
    // 获取关键元素
    const rootElement = document.getElementById("root");
    const loadingElement = document.getElementById('app-loading');
    if (!rootElement || !loadingElement) {
        console.error("Fatal Error: #root or #app-loading element not found.");
        return;
    }
    const root = ReactDOM.createRoot(rootElement);
    // 1. 渲染 React 应用。此时 #root 的 opacity 为 0，所以用户看不到它。
    root.render(_jsx(Suspense, { fallback: _jsx("div", { children: "Loading..." }), children: _jsx(App, {}) }));
    // 2. 使用一个微小的延迟来确保React完成了首次绘制。
    //    这可以保证动画的流畅性。
    setTimeout(() => {
        // 3. 开始让 React 应用渐变出现
        rootElement.style.opacity = '1';
        // 4. 同时让骨架屏渐变消失
        loadingElement.classList.add('hidden');
        // 5. [优化] 在骨架屏的CSS过渡动画结束后，再将其从DOM中彻底移除，
        //    这样更干净，性能也更好。
        loadingElement.addEventListener('transitionend', () => {
            // 清理进度文本的定时器
            const windowWithInterval = window;
            if (typeof windowWithInterval.clearLoadingInterval === 'function') {
                windowWithInterval.clearLoadingInterval();
            }
            loadingElement.remove(); // 使用 .remove() 更现代
        }, { once: true }); // { once: true } 保证事件只触发一次
    }, 150); // 稍微增加延迟，确保布局稳定
});
