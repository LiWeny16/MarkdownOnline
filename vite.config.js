import { defineConfig } from "vite"
import viteCompression from "vite-plugin-compression"
import react from "@vitejs/plugin-react"

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
      // "react":"https://esm.sh/react",
      // "uslug":"https://cdn.jsdelivr.net/npm/uslug@1.0.4/+esm",
      "markdown-it-emoji":
        "https://jsd.onmicrosoft.cn/npm/markdown-it-emoji@3.0.0/+esm",
      "markdown-it-footnote":
        "https://jsd.onmicrosoft.cn/npm/markdown-it-footnote@4.0.0/+esm",
      "markdown-it-multimd-table":
        "https://jsd.onmicrosoft.cn/npm/markdown-it-multimd-table@4.2.3/+esm",
      "incremental-dom":
        "https://jsd.onmicrosoft.cn/npm/incremental-dom@0.7.0/+esm",
      "markdown-it-github-toc":
        "https://jsd.onmicrosoft.cn/npm/markdown-it-github-toc@3.2.4/src/index.js/+esm",
      // "markdown-it":"https://jsd.onmicrosoft.cn/npm/markdown-it@14.0.0/+esm",
      // "@gsap/react":"https://cdn.jsdelivr.net/npm/@gsap/react@2.1.0/+esm",
      "@emoji-mart/data":
        "https://jsd.onmicrosoft.cn/npm/@emoji-mart/data@1.1.2/+esm",
      gsap: "https://jsd.onmicrosoft.cn/npm/gsap@3.12.5/+esm",
      "@cdn-emojilib": "https://jsd.onmicrosoft.cn/npm/emojilib@3.0.11/+esm",
      "@cdn-prettier": "https://jsd.onmicrosoft.cn/npm/prettier@3.2.4/+esm",
      "@cdn-prettier-plugins-markdown":
        "https://jsd.onmicrosoft.cn/npm/prettier@3.2.4/plugins/markdown.js/+esm",
      vconsole: "https://jsd.onmicrosoft.cn/npm/vconsole@3.15.1/+esm",
      "string-replace-async":
        "https://jsd.onmicrosoft.cn/npm/string-replace-async@3.0.2/index.min.js",
      html2canvas: "https://jsd.onmicrosoft.cn/npm/html2canvas@1.4.1/+esm",
      mobx: "https://jsd.onmicrosoft.cn/npm/mobx@6.12.0/+esm",
      axios: "https://jsd.onmicrosoft.cn/npm/axios@1.6.5/+esm",
      "@cdn-node-emoji": "https://jsd.onmicrosoft.cn/npm/node-emoji@2.1.3/+esm",
      "@cdn-marked": "https://npm.elemecdn.com/marked/lib/marked.esm.js",
      mermaid:
        "https://jsd.onmicrosoft.cn/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-mermaid":
        "https://jsd.onmicrosoft.cn/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-kit":
        "https://jsd.onmicrosoft.cn/npm/bigonion-kit@0.12.3/esm/kit.min.js",
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
