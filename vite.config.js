import { defineConfig } from "vite"
import viteCompression from "vite-plugin-compression"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
export default defineConfig({
  base:"./",
  build: {
    rollupOptions: {
      // 配置rollup的一些构建策略
      output: {
        // 控制输出
        // 在rollup里面, hash代表将你的文件名和文件内容进行组合计算得来的结果
        assetFileNames: "[hash].[name].[ext]"
      }
    },
    assetsInlineLimit: 4096000, // 4000kb  超过会以base64字符串显示
    outDir: "docs", // 输出名称
    assetsDir: "static" // 静态资源目录
  },
  resolve: {
    alias: {
      // mermaid: "https://npm.elemecdn.com/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-marked":"https://npm.elemecdn.com/marked/lib/marked.esm.js",
      "@cdn-mermaid":"https://jsd.onmicrosoft.cn/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-kit":"https://npm.elemecdn.com/bigonion-kit@0.11.0/esm/esm-kit.mjs",
      "@cdn-hljs":"https://npm.elemecdn.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js",
      "@cdn-katex":"https://npm.elemecdn.com/katex@0.16.7/dist/katex.min.js",
      "@Asset": resolve(__dirname, "./source/assets"),
      "@App":resolve(__dirname,"./source/js/functions/App/"),
      "@Func":resolve(__dirname,"./source/js/functions"),
      "@Root":resolve(__dirname,"./source/"),
      "@Com":resolve(__dirname,"./source/js/React/Components"),
      "@Mobx":resolve(__dirname,"./source/js/React/Mobx"),
      "@Css":resolve(__dirname,"./source/css"),
    }
  },
  server:{
    host:"0.0.0.0",
    port:"823"
  },
  
  plugins: [
    // ...
    viteCompression({
      threshold: 1024000 // 对大于 1mb 的文件进行压缩
    }),
    [react()]
  ],
})
