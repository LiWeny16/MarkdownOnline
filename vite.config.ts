import { defineConfig } from "vite"
import viteCompression from "vite-plugin-compression"
import react from "@vitejs/plugin-react"
import cdn from "vite-plugin-cdn-import"
import { viteExternalsPlugin } from "vite-plugin-externals"
import { resolve } from "path"
import path from "path"
import { VitePWA } from 'vite-plugin-pwa' // 确保已引入
import retryImportPlugin from "./vite/plugins/cdn.config"
import dynamicImport from "vite-plugin-dynamic-import"
// 然后在你的 vite.config.js 中引入这个插件
// import importRetryPlugin from "./vite/plugins/cdn.config"

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      treeshake: true,
      // 配置rollup的一些构建策略
      external: [
        // "react",
        // "react-dom",
        // "markdown-it-incremental-dom",
        // "IncrementalDOM",
      ],
      output: {
        globals: {
          // react: "React",
          // "react-dom": "ReactDOM",
          // "markdown-it-incremental-dom": "markdownitIncrementalDOM",
          // "incremental-dom": "IncrementalDOM",
        },
        // 控制输出
        // 在rollup里面, hash代表将你的文件名和文件内容进行组合计算得来的结果
        assetFileNames: "[hash].[name].[ext]",
        manualChunks(id) {
          if (id.includes("style.css")) {
            // 需要单独分割那些资源 就写判断逻辑就行
            return "src/style.css"
          }
          // // 最小化拆分包
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString()
          }
        },
      },
    },
    assetsInlineLimit: 4096000, // 4000kb  超过会以base64字符串显示
    outDir: "docs", // 输出名称
    assetsDir: "static", // 静态资源目录
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  resolve: {
    alias: {
      "@Asset": resolve(__dirname, "./src/assets"),
      "@App": resolve(__dirname, "./src/js/functions/App/"),
      "@Func": resolve(__dirname, "./src/js/functions"),
      "@Root": resolve(__dirname, "./src/"),
      "@Com": resolve(__dirname, "./src/js/React/Components"),
      "@Mobx": resolve(__dirname, "./src/js/React/Mobx"),
      "@Css": resolve(__dirname, "./src/css"),
      "@Plugins": resolve(__dirname, "./src/js/functions/Plugins"),
    },
  },
  server: {
    host: "0.0.0.0",
  },

  plugins: [
    viteCompression({
      threshold: 16000, // 对大于 32kb 的文件进行压缩
    }),
    viteExternalsPlugin({
      // react: "React",
      // "react-dom": "ReactDOM",
      // "markdown-it-incremental-dom": "markdownitIncrementalDOM",
      // "incremental-dom": "IncrementalDOM",
    }),
    [react({ jsxRuntime: "classic" })],
    // dynamicImport(/* options */),
    retryImportPlugin({
      // "@monaco-editor/react"
      // gsap: "https://cdn.jsdmirror.com/npm/gsap@3.12/+esm",
      // "react-photo-view":
      //   "https://cdn.jsdmirror.com/npm/react-photo-view-cdn@0.0.1/esm/react-photo-view.module.js",
      // "@arco-design/web-react":
      //   "https://cdn.jsdmirror.com/npm/@arco-design/web-react@2.62.0/+esm",
      // "@cdn-emoji-data":
      //   "https://cdn.jsdmirror.com/npm/@emoji-mart/data@1.2.1/+esm",
      // "@cdn-Readme":
      //   "https://cdn.jsdelivr.net/npm/react-photo-view-cdn@0.0.4/README.md",
      // "@cdn-indexedDb-lib":
      //   "https://cdn.jsdelivr.net/npm/react-photo-view-cdn@0.0.4/esm/db.min.js",
      // "@cdn-latex-map":
      //   "https://cdn.jsdelivr.net/npm/react-photo-view-cdn@0.0.4/esm/latex.map.min.js",
      "markdown-it": "https://cdn.jsdmirror.com/npm/markdown-it@8.4.2/+esm",
      // "markdown-it-emoji":
      //   "https://cdn.jsdmirror.com/npm/markdown-it-emoji@3.0.0/+esm",
      "markdown-it-footnote":
        "https://cdn.jsdmirror.com/npm/markdown-it-footnote@4.0.0/+esm",
      // "markdown-it-multimd-table":
      //   "https://cdn.jsdmirror.com/npm/markdown-it-multimd-table@4.2.3/+esm",
      // "markdown-it-task-lists":
      //   "https://cdn.jsdmirror.com/npm/@hackmd/markdown-it-task-lists@2.1.4/+esm",
      // "markdown-it-github-toc":
      //   "https://cdn.jsdmirror.com/npm/markdown-it-github-toc@3.2.4/src/index.js/+esm",
      // "@emoji-mart/data":
      //   "https://cdn.jsdmirror.com/npm/@emoji-mart/data@1.1.2/+esm",
      // "emoji-mart": "https://cdn.jsdmirror.com/npm/emoji-mart@5.6.0/+esm",
      "prettier": "https://cdn.jsdmirror.com/npm/prettier@3.2.4/+esm",
      // "@cdn-prettier-plugins-markdown":
      //   "https://cdn.jsdmirror.com/npm/prettier@3.2.4/plugins/markdown.js/+esm",
      // "string-replace-async":
      //   "https://cdn.jsdmirror.com/npm/string-replace-async@3.0.2/index.min.js",
      // html2canvas: "https://cdn.jsdmirror.com/npm/html2canvas@1.4.1/+esm",
      // mobx: "https://cdn.jsdmirror.com/npm/mobx@6.12.0/+esm",
      // axios: "https://cdn.jsdmirror.com/npm/axios@1.6.5/+esm",
      // "@cdn-node-emoji": "https://cdn.jsdmirror.com/npm/node-emoji@2.1.3/+esm",
      mermaid:
        "https://cdn.jsdmirror.com/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      // "@cdn-kit":
      //   "https://cdn.jsdmirror.com/npm/bigonion-kit@0.12.6/esm/kit.min.js",
      "bigonion-kit":
        "https://cdn.jsdmirror.com/npm/bigonion-kit@0.12.6/esm/kit.min.js",
      "highlight.js":
        "https://cdn.jsdmirror.com/npm/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js",
      // "@cdn-katex":
      //   "https://cdn.jsdmirror.com/npm/katex@0.16.7/dist/katex.min.js",
    }),
    // ========================================================================
    // ✨ 全新且合理的 VitePWA 配置 ✨
    // ========================================================================
    VitePWA({

      // 1. 注册策略与开发选项
      // --------------------------
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false, // 开发环境禁用 PWA SW，避免缓存干扰热更新
      },

      // 2. PWA Manifest 配置 (应用清单)
      // --------------------------------
      // manifest: {
      //   "name": "Markdown+ Online View",
      //   "short_name": "Md+",
      //   "start_url": "/",
      //   "display": "standalone",
      //   "background_color": "#ffffff",
      //   "theme_color": "#000000",
      //   "description": "A powerful markdown editor and viewer online.",
      //   "icons": [
      //     {
      //       "src": "icons/icon-192x192.png",
      //       "sizes": "192x192",
      //       "type": "image/png"
      //     },
      //     {
      //       "src": "icons/icon-512x512.png",
      //       "sizes": "512x512",
      //       "type": "image/png"
      //     }
      //   ]
      // },


      // 3. Workbox 配置 (核心)
      // -------------------------
      workbox: {
        importScripts: [
          'sw_custom.js',
        ],
        clientsClaim: true,
        // 🚀 增加最大预缓存大小限制
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB (默认2MB)

        // a. 预缓存 (Precaching)：处理您的本地文件
        // ------------------------------------------
        // globPatterns 会匹配您 `build.outDir` (即 'docs') 下的所有相应文件
        // Workbox 会根据文件内容生成哈希，实现"内容监控缓存"。
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,woff,woff2,ttf,eot}',
          '**/*.{ts,tsx,jsx}', // 添加TypeScript和JSX文件
          '**/*.{md,txt,xml}', // 添加文档文件
          '**/*.{webp,avif,gif,jpg,jpeg}', // 添加更多图片格式
        ],
        globIgnores: [
          '**/LICENSES/*.md' // 或者更精确地忽略这个特定文件
        ],

        // b. 运行时缓存 (Runtime Caching)：处理您的 CDN 和其他外部资源
        // -----------------------------------------------------------------
        // 规则顺序很重要，Workbox 会使用第一个匹配的规则。
        // runtimeCaching: [
        //   {
        //     // 规则一: 【高优先级】缓存 Monaco Editor，增加缓存容量和时间
        //     handler: 'CacheFirst',
        //     urlPattern: /(cdn\.jsdelivr\.net|cdn\.jsdmirror\.com|unpkg\.com).*\/monaco-editor\//,
        //     options: {
        //       cacheName: 'monaco-editor-cache-v2',
        //       expiration: {
        //         maxAgeSeconds: 60 * 60 * 24 * 90, // 缓存 90 天 (之前5天)
        //         maxEntries: 100, // 增加到100个条目 (之前20个)
        //       },
        //       cacheableResponse: { statuses: [0, 200] },
        //     },
        //   },
        //   {
        //     // 规则二: 缓存所有CDN JS/CSS库，大幅增加容量
        //     handler: 'StaleWhileRevalidate',
        //     urlPattern: /(cdn\.jsdelivr\.net|cdn\.jsdmirror\.com|fastly\.jsdelivr\.net|npm\.elemecdn\.com)/,
        //     options: {
        //       cacheName: 'cdn-libraries-cache-v2',
        //       expiration: {
        //         maxAgeSeconds: 60 * 60 * 24 * 60, // 缓存 60 天 (之前5天)
        //         maxEntries: 500, // 添加最大条目限制，防止缓存无限增长
        //       },
        //       cacheableResponse: { statuses: [0, 200] },
        //     },
        //   },
        //   {
        //     // 规则三: 缓存图片资源，增加容量
        //     handler: 'CacheFirst',
        //     urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp|avif|ico)$/,
        //     options: {
        //       cacheName: 'image-cache-v2',
        //       expiration: {
        //         maxEntries: 200, // 增加到200个条目 (之前60个)
        //         maxAgeSeconds: 60 * 60 * 24 * 90, // 缓存 90 天 (之前5天)
        //       },
        //     },
        //   },
        //   {
        //     // 规则四: 新增 - 缓存字体文件
        //     handler: 'CacheFirst',
        //     urlPattern: /\.(?:woff|woff2|ttf|eot|otf)$/,
        //     options: {
        //       cacheName: 'fonts-cache-v1',
        //       expiration: {
        //         maxEntries: 50,
        //         maxAgeSeconds: 60 * 60 * 24 * 365, // 字体文件缓存1年
        //       },
        //       cacheableResponse: { statuses: [0, 200] },
        //     },
        //   },
        //   {
        //     // 规则五: 新增 - 缓存API和数据请求
        //     handler: 'NetworkFirst',
        //     urlPattern: /\/api\/|\.json$/,
        //     options: {
        //       cacheName: 'api-cache-v1',
        //       expiration: {
        //         maxEntries: 100,
        //         maxAgeSeconds: 60 * 60 * 24 * 7, // API缓存7天
        //       },
        //       cacheableResponse: { statuses: [0, 200] },
        //       networkTimeoutSeconds: 3, // 3秒超时后使用缓存
        //     },
        //   },
        //   {
        //     // 规则六: 新增 - 缓存其他静态资源
        //     handler: 'StaleWhileRevalidate',
        //     urlPattern: /\.(?:css|js|mjs|esm)$/,
        //     options: {
        //       cacheName: 'static-resources-cache-v1',
        //       expiration: {
        //         maxEntries: 300,
        //         maxAgeSeconds: 60 * 60 * 24 * 30, // 缓存30天
        //       },
        //       cacheableResponse: { statuses: [0, 200] },
        //     },
        //   },
        // ],
      },
    }),
  ],
})
