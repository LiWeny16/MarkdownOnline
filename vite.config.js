import { defineConfig } from 'vite'


export default defineConfig({
    build: {
        rollupOptions: { // 配置rollup的一些构建策略
            output: { // 控制输出
                // 在rollup里面, hash代表将你的文件名和文件内容进行组合计算得来的结果
                assetFileNames: "[hash].[name].[ext]"
            }
        },
        assetsInlineLimit: 4096000, // 4000kb  超过会以base64字符串显示
        outDir: "docs", // 输出名称
        assetsDir: "static" // 静态资源目录
    },
})