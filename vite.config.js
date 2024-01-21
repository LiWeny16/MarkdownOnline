import { defineConfig } from "vite"
import viteCompression from "vite-plugin-compression"
import react from "@vitejs/plugin-react"
import importToCDN from "vite-plugin-cdn-import"
import {vitePluginReactCdn} from "./vite-plugin/reactCdn.config"
import { resolve } from "path"
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      // 配置rollup的一些构建策略
      // external:["react","react-dom"],
      output: {
        // 控制输出
        // 在rollup里面, hash代表将你的文件名和文件内容进行组合计算得来的结果
        assetFileNames: "[hash].[name].[ext]",
        // external: ["react", "react-dom"],
      },
    },
    assetsInlineLimit: 4096000, // 4000kb  超过会以base64字符串显示
    outDir: "docs", // 输出名称
    assetsDir: "static", // 静态资源目录
  },
  resolve: {
    alias: {
      // "react-photo-view":
      // "react":"https://cdn.jsdelivr.net/npm/react@18.2.0/+esm?raw",
      //   "https://jsd.onmicrosoft.cn/npm/react-photo-view@1.2.4/+esm?raw",
      "string-replace-async":
        "https://jsd.onmicrosoft.cn/npm/string-replace-async@3.0.2/index.min.js",
      // "react-resizable":
      //   "https://jsd.onmicrosoft.cn/npm/react-resizable@3.0.5/+esm?raw",
      // "dom-to-image":"https://jsd.onmicrosoft.cn/npm/dom-to-image@2.6.0/+esm",
      html2canvas: "https://jsd.onmicrosoft.cn/npm/html2canvas@1.4.1/+esm",
      mobx: "https://jsd.onmicrosoft.cn/npm/mobx@6.12.0/+esm",
      axios: "https://jsd.onmicrosoft.cn/npm/axios@1.6.5/+esm",
      "@cdn-node-emoji": "https://jsd.onmicrosoft.cn/npm/node-emoji@2.1.3/+esm",
      "@cdn-marked": "https://npm.elemecdn.com/marked/lib/marked.esm.js",
      "@cdn-mermaid":
        "https://jsd.onmicrosoft.cn/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-kit":
        "https://npm.elemecdn.com/bigonion-kit@0.11.0/esm/esm-kit.mjs",
      "@cdn-hljs":
        "https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js",
      "@cdn-katex": "https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.js",
      // "@cdn-axios":"https://jsd.onmicrosoft.cn/npm/axios@1.6.5/index.min.js",
      // "@cdn-katexCss":"https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.css",
      "@Asset": resolve(__dirname, "./source/assets"),
      "@App": resolve(__dirname, "./source/js/functions/App/"),
      "@Func": resolve(__dirname, "./source/js/functions"),
      "@Root": resolve(__dirname, "./source/"),
      "@Com": resolve(__dirname, "./source/js/React/Components"),
      "@Mobx": resolve(__dirname, "./source/js/React/Mobx"),
      "@Css": resolve(__dirname, "./source/css"),
      // "@arco-design/web-react":"https://jsd.onmicrosoft.cn/npm/@arco-design/web-react@2.59.0/dist/arco.min.js"
      // "mobx":"https://jsd.onmicrosoft.cn/npm/mobx-react@9.1.0/dist/mobxreact.esm.js"
    },
  },
  server: {
    host: "0.0.0.0",
  },

  plugins: [
    viteCompression({
      threshold: 256000, // 对大于 256kb 的文件进行压缩
    }),
    [react()],
    // [vitePluginReactCdn()]
    // importToCDN({
    //   modules: [
    //     {
    //       name: "react",
    //       var: "React",
    //       path: `https://jsd.onmicrosoft.cn/npm/react@18.2.0/umd/react.production.min.js`,
    //     },
    //     // {
    //     //   name: "react-dom",
    //     //   var: "ReactDOM",
    //     //   path: `umd/react-dom.production.min.js`,
    //     // },
    //   ],
    // }),
  ],
})
