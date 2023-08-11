import { defineConfig } from "vite"
import viteCompression from "vite-plugin-compression"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
export default defineConfig({
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
      mermaid: "https://npm.elemecdn.com/mermaid@10/dist/mermaid.esm.min.mjs",
      "@Asset": resolve(__dirname, "./source/assets")
    }
  },
  plugins: [
    // ...
    viteCompression({
      threshold: 1024000 // 对大于 1mb 的文件进行压缩
    }),
    [react()]
  ],
})
