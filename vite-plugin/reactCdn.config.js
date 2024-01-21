// vite-plugin-react-cdn/index.js
function vitePluginReactCdn() {
  return {
    name: "vite-plugin-react-cdn",
    enforce: "pre",
    config(config) {
      const { build } = config
      if (build) {
        // 设置 React 和 ReactDOM 为 external，不打包到最终的代码中
        build.rollupOptions = {
          ...build.rollupOptions,
          external: ["react", "react-dom"],
        }
      }
    },
    transformIndexHtml: {
      enforce: "post",
      transform(html) {
        // 在 index.html 的 head 中插入 React 和 ReactDOM 的 CDN 链接
        return html.replace(
          "</head>",
          `
            <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
            </head>
          `
        )
      },
    },
  }
}

export { vitePluginReactCdn }
