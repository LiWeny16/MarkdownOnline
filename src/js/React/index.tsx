import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { pollVariables } from "@App/basic/basic"
import initI18N from "@Func/I18N/i18n"
// import { initServiceWorker } from "@Func/ServiceWorker/swManager"

initI18N()

// 初始化 Service Worker - 开发和生产环境都启用
// const isProduction = process.env.NODE_ENV === 'production';

// initServiceWorker({
//   scriptUrl: './sw.js', // 相对于public目录
//   scope: './',
//   updateViaCache: isProduction ? 'none' : 'imports' // 开发环境允许更新缓存
// }).then(manager => {
//   console.log(`[App] Service Worker 初始化完成 (${isProduction ? '生产' : '开发'}环境)`);
  
//   // 开发环境下提供更多调试信息
//   if (!isProduction) {
//     console.log('[App] 开发环境下 Service Worker 已启用');
//     console.log('[App] 使用 Ctrl+Shift+S 打开调试工具');
//     console.log('[App] 可在开发者工具的 Application -> Service Workers 查看详细信息');
//   }
// }).catch(error => {
//   console.warn('[App] Service Worker 初始化失败:', error);
//   if (!isProduction) {
//     console.warn('[App] 开发环境调试提示:');
//     console.warn('1. 确保使用 HTTPS 或 localhost');
//     console.warn('2. 检查 public/sw.js 文件是否存在');
//     console.warn('3. 检查浏览器控制台是否有 SW 相关错误');
//   }
// });

pollVariables([
  "markdownitIncrementalDOM",
  "katex",
  "IncrementalDOM",
  // "React",
  // "ReactDOM",
]).then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  )
})
