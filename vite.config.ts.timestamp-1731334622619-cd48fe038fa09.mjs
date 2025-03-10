// vite.config.ts
import { defineConfig } from "file:///C:/Learning/sample/synchronous%20github/MarkdownOL/node_modules/vite/dist/node/index.js";
import viteCompression from "file:///C:/Learning/sample/synchronous%20github/MarkdownOL/node_modules/vite-plugin-compression/dist/index.mjs";
import react from "file:///C:/Learning/sample/synchronous%20github/MarkdownOL/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { viteExternalsPlugin } from "file:///C:/Learning/sample/synchronous%20github/MarkdownOL/node_modules/vite-plugin-externals/dist/src/index.js";
import { resolve } from "path";

// vite/plugins/cdn.config.ts
import MagicString from "file:///C:/Learning/sample/synchronous%20github/MarkdownOL/node_modules/magic-string/dist/magic-string.es.mjs";
function transformImportPlugin(libMaps) {
  return {
    name: "vite-plugin-transform-import",
    async transform(code, id) {
      if (!id.includes("src/js/functions/Events/error/script.ts") && !id.includes("importModule.ts") && (id.endsWith(".ts") || id.endsWith(".tsx"))) {
        const ast = this.parse(code, {
          sourceType: "module",
          plugins: ["typescript", "jsx"]
        });
        const magicString = new MagicString(code);
        let hasImportModule = false;
        let lastImportEnd = 0;
        for (const node of ast.body) {
          if (node.type === "ImportDeclaration") {
            lastImportEnd = node.end;
            if (node.source.value === "@App/import/importModule") {
              hasImportModule = true;
              break;
            }
          }
        }
        if (!hasImportModule) {
          const importModuleCode = `import importModule from "@App/import/importModule";`;
          magicString.prepend(importModuleCode);
        }
        for (const node of ast.body) {
          if (node.type === "ImportDeclaration" && Object.keys(libMaps).includes(node.source.value)) {
            const specifiers = node.specifiers;
            let transformedCode = "";
            if (specifiers.length) {
              Object.values(specifiers).forEach((specifier, index) => {
                if (specifier.type === "ImportDefaultSpecifier") {
                  const importStart = node.start;
                  const importEnd = node.end;
                  const importName = specifier.local.name;
                  const newCode = `
  const ${importName} = (await importModule("${libMaps[node.source.value]}")).default;`;
                  transformedCode += newCode;
                } else if (specifier.type === "ImportSpecifier") {
                  const importStart = node.start;
                  const importEnd = node.end;
                  const importName = specifier.imported.name;
                  const localName = specifier.local.name;
                  const newCode = `
  const ${localName} = (await importModule("${libMaps[node.source.value]}")).${importName}`;
                  transformedCode += newCode;
                } else if (specifier.type === "ImportNamespaceSpecifier") {
                  const importStart = node.start;
                  const importEnd = node.end;
                  const importName = specifier.local.name;
                  const newCode = `
  const ${importName} = await importModule("${libMaps[node.source.value]}");`;
                  transformedCode += newCode;
                }
                if (index == Object.keys(specifiers).length - 1) {
                  magicString.overwrite(node.start, node.end, transformedCode);
                }
              });
            }
          }
        }
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true })
          // 生成 source map
        };
      }
      return code;
    }
  };
}
var cdn_config_default = transformImportPlugin;

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Learning\\sample\\synchronous github\\MarkdownOL";
var vite_config_default = defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      // 配置rollup的一些构建策略
      external: [
        "react",
        "react-dom"
        // "markdown-it-incremental-dom",
        // "IncrementalDOM",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
          // "markdown-it-incremental-dom": "markdownitIncrementalDOM",
          // "incremental-dom": "IncrementalDOM",
        },
        // 控制输出
        // 在rollup里面, hash代表将你的文件名和文件内容进行组合计算得来的结果
        assetFileNames: "[hash].[name].[ext]",
        manualChunks(id) {
          if (id.includes("style.css")) {
            return "src/style.css";
          }
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    },
    assetsInlineLimit: 4096e3,
    // 4000kb  超过会以base64字符串显示
    outDir: "docs",
    // 输出名称
    assetsDir: "static"
    // 静态资源目录
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  resolve: {
    alias: {
      "@Asset": resolve(__vite_injected_original_dirname, "./src/assets"),
      "@App": resolve(__vite_injected_original_dirname, "./src/js/functions/App/"),
      "@Func": resolve(__vite_injected_original_dirname, "./src/js/functions"),
      "@Root": resolve(__vite_injected_original_dirname, "./src/"),
      "@Com": resolve(__vite_injected_original_dirname, "./src/js/React/Components"),
      "@Mobx": resolve(__vite_injected_original_dirname, "./src/js/React/Mobx"),
      "@Css": resolve(__vite_injected_original_dirname, "./src/css"),
      "@Plugins": resolve(__vite_injected_original_dirname, "./src/js/functions/Plugins")
    }
  },
  server: {
    host: "0.0.0.0"
  },
  plugins: [
    viteCompression({
      threshold: 16e3
      // 对大于 32kb 的文件进行压缩
    }),
    viteExternalsPlugin({
      react: "React",
      "react-dom": "ReactDOM"
      // "markdown-it-incremental-dom": "markdownitIncrementalDOM",
      // "incremental-dom": "IncrementalDOM",
    }),
    [react({ jsxRuntime: "classic" })],
    // dynamicImport(/* options */),
    cdn_config_default({
      // "@monaco-editor/react"
      gsap: "https://cdn.jsdmirror.com/npm/gsap@3.12/+esm",
      "react-photo-view": "https://cdn.jsdmirror.com/npm/react-photo-view-cdn@0.0.1/esm/react-photo-view.module.js",
      "@arco-design/web-react": "https://cdn.jsdmirror.com/npm/@arco-design/web-react@2.62.0/+esm",
      "@cdn-emoji-data": "https://cdn.jsdmirror.com/npm/@emoji-mart/data@1.2.1/+esm",
      "@cdn-Readme": "https://cdn.jsdelivr.net/npm/react-photo-view-cdn@0.0.4/README.md",
      "@cdn-indexedDb-lib": "https://cdn.jsdelivr.net/npm/react-photo-view-cdn@0.0.4/esm/db.min.js",
      "@cdn-latex-map": "https://cdn.jsdelivr.net/npm/react-photo-view-cdn@0.0.4/esm/latex.map.min.js",
      "markdown-it": "https://cdn.jsdmirror.com/npm/markdown-it@8.4.2/+esm",
      "markdown-it-emoji": "https://cdn.jsdmirror.com/npm/markdown-it-emoji@3.0.0/+esm",
      "markdown-it-footnote": "https://cdn.jsdmirror.com/npm/markdown-it-footnote@4.0.0/+esm",
      "markdown-it-multimd-table": "https://cdn.jsdmirror.com/npm/markdown-it-multimd-table@4.2.3/+esm",
      "markdown-it-task-lists": "https://cdn.jsdmirror.com/npm/@hackmd/markdown-it-task-lists@2.1.4/+esm",
      "markdown-it-github-toc": "https://cdn.jsdmirror.com/npm/markdown-it-github-toc@3.2.4/src/index.js/+esm",
      "@emoji-mart/data": "https://cdn.jsdmirror.com/npm/@emoji-mart/data@1.1.2/+esm",
      "emoji-mart": "https://cdn.jsdmirror.com/npm/emoji-mart@5.6.0/+esm",
      "@cdn-emojilib": "https://cdn.jsdmirror.com/npm/emojilib@3.0.11/+esm",
      "@cdn-prettier": "https://cdn.jsdmirror.com/npm/prettier@3.2.4/+esm",
      "@cdn-prettier-plugins-markdown": "https://cdn.jsdmirror.com/npm/prettier@3.2.4/plugins/markdown.js/+esm",
      "string-replace-async": "https://cdn.jsdmirror.com/npm/string-replace-async@3.0.2/index.min.js",
      html2canvas: "https://cdn.jsdmirror.com/npm/html2canvas@1.4.1/+esm",
      mobx: "https://cdn.jsdmirror.com/npm/mobx@6.12.0/+esm",
      axios: "https://cdn.jsdmirror.com/npm/axios@1.6.5/+esm",
      "@cdn-node-emoji": "https://cdn.jsdmirror.com/npm/node-emoji@2.1.3/+esm",
      mermaid: "https://cdn.jsdmirror.com/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-mermaid": "https://cdn.jsdmirror.com/npm/mermaid@10/dist/mermaid.esm.min.mjs",
      "@cdn-kit": "https://cdn.jsdmirror.com/npm/bigonion-kit@0.12.6/esm/kit.min.js",
      "bigonion-kit": "https://cdn.jsdmirror.com/npm/bigonion-kit@0.12.6/esm/kit.min.js",
      "@cdn-hljs": "https://cdn.jsdmirror.com/npm/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js"
      // "@cdn-katex":
      //   "https://cdn.jsdmirror.com/npm/katex@0.16.7/dist/katex.min.js",
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS9wbHVnaW5zL2Nkbi5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxMZWFybmluZ1xcXFxzYW1wbGVcXFxcc3luY2hyb25vdXMgZ2l0aHViXFxcXE1hcmtkb3duT0xcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXExlYXJuaW5nXFxcXHNhbXBsZVxcXFxzeW5jaHJvbm91cyBnaXRodWJcXFxcTWFya2Rvd25PTFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovTGVhcm5pbmcvc2FtcGxlL3N5bmNocm9ub3VzJTIwZ2l0aHViL01hcmtkb3duT0wvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCJcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiXHJcbmltcG9ydCBjZG4gZnJvbSBcInZpdGUtcGx1Z2luLWNkbi1pbXBvcnRcIlxyXG5pbXBvcnQgeyB2aXRlRXh0ZXJuYWxzUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWV4dGVybmFsc1wiXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiXHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcclxuaW1wb3J0IHJldHJ5SW1wb3J0UGx1Z2luIGZyb20gXCIuL3ZpdGUvcGx1Z2lucy9jZG4uY29uZmlnXCJcclxuaW1wb3J0IGR5bmFtaWNJbXBvcnQgZnJvbSBcInZpdGUtcGx1Z2luLWR5bmFtaWMtaW1wb3J0XCJcclxuLy8gXHU3MTM2XHU1NDBFXHU1NzI4XHU0RjYwXHU3Njg0IHZpdGUuY29uZmlnLmpzIFx1NEUyRFx1NUYxNVx1NTE2NVx1OEZEOVx1NEUyQVx1NjNEMlx1NEVGNlxyXG4vLyBpbXBvcnQgaW1wb3J0UmV0cnlQbHVnaW4gZnJvbSBcIi4vdml0ZS9wbHVnaW5zL2Nkbi5jb25maWdcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiBcIi4vXCIsXHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogXCJlc25leHRcIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gXHU5MTREXHU3RjZFcm9sbHVwXHU3Njg0XHU0RTAwXHU0RTlCXHU2Nzg0XHU1RUZBXHU3QjU2XHU3NTY1XHJcbiAgICAgIGV4dGVybmFsOiBbXHJcbiAgICAgICAgXCJyZWFjdFwiLFxyXG4gICAgICAgIFwicmVhY3QtZG9tXCIsXHJcbiAgICAgICAgLy8gXCJtYXJrZG93bi1pdC1pbmNyZW1lbnRhbC1kb21cIixcclxuICAgICAgICAvLyBcIkluY3JlbWVudGFsRE9NXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgICAgICBcInJlYWN0LWRvbVwiOiBcIlJlYWN0RE9NXCIsXHJcbiAgICAgICAgICAvLyBcIm1hcmtkb3duLWl0LWluY3JlbWVudGFsLWRvbVwiOiBcIm1hcmtkb3duaXRJbmNyZW1lbnRhbERPTVwiLFxyXG4gICAgICAgICAgLy8gXCJpbmNyZW1lbnRhbC1kb21cIjogXCJJbmNyZW1lbnRhbERPTVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gXHU2M0E3XHU1MjM2XHU4RjkzXHU1MUZBXHJcbiAgICAgICAgLy8gXHU1NzI4cm9sbHVwXHU5MUNDXHU5NzYyLCBoYXNoXHU0RUUzXHU4ODY4XHU1QzA2XHU0RjYwXHU3Njg0XHU2NTg3XHU0RUY2XHU1NDBEXHU1NDhDXHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5XHU4RkRCXHU4ODRDXHU3RUM0XHU1NDA4XHU4QkExXHU3Qjk3XHU1Rjk3XHU2NzY1XHU3Njg0XHU3RUQzXHU2NzlDXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiW2hhc2hdLltuYW1lXS5bZXh0XVwiLFxyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwic3R5bGUuY3NzXCIpKSB7XHJcbiAgICAgICAgICAgIC8vIFx1OTcwMFx1ODk4MVx1NTM1NVx1NzJFQ1x1NTIwNlx1NTI3Mlx1OTBBM1x1NEU5Qlx1OEQ0NFx1NkU5MCBcdTVDMzFcdTUxOTlcdTUyMjRcdTY1QURcdTkwM0JcdThGOTFcdTVDMzFcdTg4NENcclxuICAgICAgICAgICAgcmV0dXJuIFwic3JjL3N0eWxlLmNzc1wiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyAvLyBcdTY3MDBcdTVDMEZcdTUzMTZcdTYyQzZcdTUyMDZcdTUzMDVcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaWRcclxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAgIC5zcGxpdChcIm5vZGVfbW9kdWxlcy9cIilbMV1cclxuICAgICAgICAgICAgICAuc3BsaXQoXCIvXCIpWzBdXHJcbiAgICAgICAgICAgICAgLnRvU3RyaW5nKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2MDAwLCAvLyA0MDAwa2IgIFx1OEQ4NVx1OEZDN1x1NEYxQVx1NEVFNWJhc2U2NFx1NUI1N1x1N0IyNlx1NEUzMlx1NjYzRVx1NzkzQVxyXG4gICAgb3V0RGlyOiBcImRvY3NcIiwgLy8gXHU4RjkzXHU1MUZBXHU1NDBEXHU3OUYwXHJcbiAgICBhc3NldHNEaXI6IFwic3RhdGljXCIsIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NzZFRVx1NUY1NVxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQEFzc2V0XCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2Fzc2V0c1wiKSxcclxuICAgICAgXCJAQXBwXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2pzL2Z1bmN0aW9ucy9BcHAvXCIpLFxyXG4gICAgICBcIkBGdW5jXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2pzL2Z1bmN0aW9uc1wiKSxcclxuICAgICAgXCJAUm9vdFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9cIiksXHJcbiAgICAgIFwiQENvbVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9qcy9SZWFjdC9Db21wb25lbnRzXCIpLFxyXG4gICAgICBcIkBNb2J4XCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2pzL1JlYWN0L01vYnhcIiksXHJcbiAgICAgIFwiQENzc1wiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9jc3NcIiksXHJcbiAgICAgIFwiQFBsdWdpbnNcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvanMvZnVuY3Rpb25zL1BsdWdpbnNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICB9LFxyXG5cclxuICBwbHVnaW5zOiBbXHJcbiAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICB0aHJlc2hvbGQ6IDE2MDAwLCAvLyBcdTVCRjlcdTU5MjdcdTRFOEUgMzJrYiBcdTc2ODRcdTY1ODdcdTRFRjZcdThGREJcdTg4NENcdTUzOEJcdTdGMjlcclxuICAgIH0pLFxyXG4gICAgdml0ZUV4dGVybmFsc1BsdWdpbih7XHJcbiAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXHJcbiAgICAgIFwicmVhY3QtZG9tXCI6IFwiUmVhY3RET01cIixcclxuICAgICAgLy8gXCJtYXJrZG93bi1pdC1pbmNyZW1lbnRhbC1kb21cIjogXCJtYXJrZG93bml0SW5jcmVtZW50YWxET01cIixcclxuICAgICAgLy8gXCJpbmNyZW1lbnRhbC1kb21cIjogXCJJbmNyZW1lbnRhbERPTVwiLFxyXG4gICAgfSksXHJcbiAgICBbcmVhY3QoeyBqc3hSdW50aW1lOiBcImNsYXNzaWNcIiB9KV0sXHJcbiAgICAvLyBkeW5hbWljSW1wb3J0KC8qIG9wdGlvbnMgKi8pLFxyXG4gICAgcmV0cnlJbXBvcnRQbHVnaW4oe1xyXG4gICAgICAvLyBcIkBtb25hY28tZWRpdG9yL3JlYWN0XCJcclxuICAgICAgZ3NhcDogXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9nc2FwQDMuMTIvK2VzbVwiLFxyXG4gICAgICBcInJlYWN0LXBob3RvLXZpZXdcIjpcclxuICAgICAgICBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL3JlYWN0LXBob3RvLXZpZXctY2RuQDAuMC4xL2VzbS9yZWFjdC1waG90by12aWV3Lm1vZHVsZS5qc1wiLFxyXG4gICAgICBcIkBhcmNvLWRlc2lnbi93ZWItcmVhY3RcIjpcclxuICAgICAgICBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL0BhcmNvLWRlc2lnbi93ZWItcmVhY3RAMi42Mi4wLytlc21cIixcclxuICAgICAgXCJAY2RuLWVtb2ppLWRhdGFcIjpcclxuICAgICAgICBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL0BlbW9qaS1tYXJ0L2RhdGFAMS4yLjEvK2VzbVwiLFxyXG4gICAgICBcIkBjZG4tUmVhZG1lXCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3JlYWN0LXBob3RvLXZpZXctY2RuQDAuMC40L1JFQURNRS5tZFwiLFxyXG4gICAgICBcIkBjZG4taW5kZXhlZERiLWxpYlwiOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9yZWFjdC1waG90by12aWV3LWNkbkAwLjAuNC9lc20vZGIubWluLmpzXCIsXHJcbiAgICAgIFwiQGNkbi1sYXRleC1tYXBcIjpcclxuICAgICAgICBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcmVhY3QtcGhvdG8tdmlldy1jZG5AMC4wLjQvZXNtL2xhdGV4Lm1hcC5taW4uanNcIixcclxuICAgICAgXCJtYXJrZG93bi1pdFwiOiBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL21hcmtkb3duLWl0QDguNC4yLytlc21cIixcclxuICAgICAgXCJtYXJrZG93bi1pdC1lbW9qaVwiOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9jZG4uanNkbWlycm9yLmNvbS9ucG0vbWFya2Rvd24taXQtZW1vamlAMy4wLjAvK2VzbVwiLFxyXG4gICAgICBcIm1hcmtkb3duLWl0LWZvb3Rub3RlXCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9tYXJrZG93bi1pdC1mb290bm90ZUA0LjAuMC8rZXNtXCIsXHJcbiAgICAgIFwibWFya2Rvd24taXQtbXVsdGltZC10YWJsZVwiOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9jZG4uanNkbWlycm9yLmNvbS9ucG0vbWFya2Rvd24taXQtbXVsdGltZC10YWJsZUA0LjIuMy8rZXNtXCIsXHJcbiAgICAgIFwibWFya2Rvd24taXQtdGFzay1saXN0c1wiOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9jZG4uanNkbWlycm9yLmNvbS9ucG0vQGhhY2ttZC9tYXJrZG93bi1pdC10YXNrLWxpc3RzQDIuMS40Lytlc21cIixcclxuICAgICAgXCJtYXJrZG93bi1pdC1naXRodWItdG9jXCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9tYXJrZG93bi1pdC1naXRodWItdG9jQDMuMi40L3NyYy9pbmRleC5qcy8rZXNtXCIsXHJcbiAgICAgIFwiQGVtb2ppLW1hcnQvZGF0YVwiOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9jZG4uanNkbWlycm9yLmNvbS9ucG0vQGVtb2ppLW1hcnQvZGF0YUAxLjEuMi8rZXNtXCIsXHJcbiAgICAgIFwiZW1vamktbWFydFwiOiBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL2Vtb2ppLW1hcnRANS42LjAvK2VzbVwiLFxyXG4gICAgICBcIkBjZG4tZW1vamlsaWJcIjogXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9lbW9qaWxpYkAzLjAuMTEvK2VzbVwiLFxyXG4gICAgICBcIkBjZG4tcHJldHRpZXJcIjogXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9wcmV0dGllckAzLjIuNC8rZXNtXCIsXHJcbiAgICAgIFwiQGNkbi1wcmV0dGllci1wbHVnaW5zLW1hcmtkb3duXCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9wcmV0dGllckAzLjIuNC9wbHVnaW5zL21hcmtkb3duLmpzLytlc21cIixcclxuICAgICAgXCJzdHJpbmctcmVwbGFjZS1hc3luY1wiOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9jZG4uanNkbWlycm9yLmNvbS9ucG0vc3RyaW5nLXJlcGxhY2UtYXN5bmNAMy4wLjIvaW5kZXgubWluLmpzXCIsXHJcbiAgICAgIGh0bWwyY2FudmFzOiBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL2h0bWwyY2FudmFzQDEuNC4xLytlc21cIixcclxuICAgICAgbW9ieDogXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9tb2J4QDYuMTIuMC8rZXNtXCIsXHJcbiAgICAgIGF4aW9zOiBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL2F4aW9zQDEuNi41Lytlc21cIixcclxuICAgICAgXCJAY2RuLW5vZGUtZW1vamlcIjogXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9ub2RlLWVtb2ppQDIuMS4zLytlc21cIixcclxuICAgICAgbWVybWFpZDpcclxuICAgICAgICBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL21lcm1haWRAMTAvZGlzdC9tZXJtYWlkLmVzbS5taW4ubWpzXCIsXHJcbiAgICAgIFwiQGNkbi1tZXJtYWlkXCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9tZXJtYWlkQDEwL2Rpc3QvbWVybWFpZC5lc20ubWluLm1qc1wiLFxyXG4gICAgICBcIkBjZG4ta2l0XCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9iaWdvbmlvbi1raXRAMC4xMi42L2VzbS9raXQubWluLmpzXCIsXHJcbiAgICAgIFwiYmlnb25pb24ta2l0XCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9iaWdvbmlvbi1raXRAMC4xMi42L2VzbS9raXQubWluLmpzXCIsXHJcbiAgICAgIFwiQGNkbi1obGpzXCI6XHJcbiAgICAgICAgXCJodHRwczovL2Nkbi5qc2RtaXJyb3IuY29tL25wbS9AaGlnaGxpZ2h0anMvY2RuLWFzc2V0c0AxMS42LjAvZXMvaGlnaGxpZ2h0Lm1pbi5qc1wiLFxyXG4gICAgICAvLyBcIkBjZG4ta2F0ZXhcIjpcclxuICAgICAgLy8gICBcImh0dHBzOi8vY2RuLmpzZG1pcnJvci5jb20vbnBtL2thdGV4QDAuMTYuNy9kaXN0L2thdGV4Lm1pbi5qc1wiLFxyXG4gICAgfSksXHJcbiAgXSxcclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxMZWFybmluZ1xcXFxzYW1wbGVcXFxcc3luY2hyb25vdXMgZ2l0aHViXFxcXE1hcmtkb3duT0xcXFxcdml0ZVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxMZWFybmluZ1xcXFxzYW1wbGVcXFxcc3luY2hyb25vdXMgZ2l0aHViXFxcXE1hcmtkb3duT0xcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXGNkbi5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0xlYXJuaW5nL3NhbXBsZS9zeW5jaHJvbm91cyUyMGdpdGh1Yi9NYXJrZG93bk9ML3ZpdGUvcGx1Z2lucy9jZG4uY29uZmlnLnRzXCI7aW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gXCJtYWdpYy1zdHJpbmdcIlxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBcdTU5MDRcdTc0MDZpbXBvcnRcdTkxQ0RcdThGN0RcdTc2ODRcdTYzRDJcdTRFRjZcclxuICovXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybUltcG9ydFBsdWdpbihsaWJNYXBzKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IFwidml0ZS1wbHVnaW4tdHJhbnNmb3JtLWltcG9ydFwiLFxyXG4gICAgYXN5bmMgdHJhbnNmb3JtKGNvZGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgIWlkLmluY2x1ZGVzKFwic3JjL2pzL2Z1bmN0aW9ucy9FdmVudHMvZXJyb3Ivc2NyaXB0LnRzXCIpICYmXHJcbiAgICAgICAgIWlkLmluY2x1ZGVzKFwiaW1wb3J0TW9kdWxlLnRzXCIpICYmXHJcbiAgICAgICAgKGlkLmVuZHNXaXRoKFwiLnRzXCIpIHx8IGlkLmVuZHNXaXRoKFwiLnRzeFwiKSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZShjb2RlLCB7XHJcbiAgICAgICAgICBzb3VyY2VUeXBlOiBcIm1vZHVsZVwiLFxyXG4gICAgICAgICAgcGx1Z2luczogW1widHlwZXNjcmlwdFwiLCBcImpzeFwiXSxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCBtYWdpY1N0cmluZyA9IG5ldyBNYWdpY1N0cmluZyhjb2RlKVxyXG5cclxuICAgICAgICBsZXQgaGFzSW1wb3J0TW9kdWxlID0gZmFsc2VcclxuICAgICAgICBsZXQgbGFzdEltcG9ydEVuZCA9IDBcclxuXHJcbiAgICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1REYyXHU3RUNGXHU1QkZDXHU1MTY1XHU0RTg2IGltcG9ydE1vZHVsZVxyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBhc3QuYm9keSkge1xyXG4gICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJJbXBvcnREZWNsYXJhdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGxhc3RJbXBvcnRFbmQgPSBub2RlLmVuZFxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlLnNvdXJjZS52YWx1ZSlcclxuICAgICAgICAgICAgaWYgKG5vZGUuc291cmNlLnZhbHVlID09PSBcIkBBcHAvaW1wb3J0L2ltcG9ydE1vZHVsZVwiKSB7XHJcbiAgICAgICAgICAgICAgaGFzSW1wb3J0TW9kdWxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMCBpbXBvcnRNb2R1bGUgXHU1QkZDXHU1MTY1XHU4QkVEXHU1M0U1XHVGRjA4XHU1OTgyXHU2NzlDXHU0RTBEXHU1QjU4XHU1NzI4XHVGRjA5XHJcbiAgICAgICAgaWYgKCFoYXNJbXBvcnRNb2R1bGUpIHtcclxuICAgICAgICAgIGNvbnN0IGltcG9ydE1vZHVsZUNvZGUgPSBgaW1wb3J0IGltcG9ydE1vZHVsZSBmcm9tIFwiQEFwcC9pbXBvcnQvaW1wb3J0TW9kdWxlXCI7YFxyXG4gICAgICAgICAgbWFnaWNTdHJpbmcucHJlcGVuZChpbXBvcnRNb2R1bGVDb2RlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU1MTc2XHU0RUQ2XHU1QkZDXHU1MTY1XHU4QkVEXHU1M0U1XHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGFzdC5ib2R5KSB7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIG5vZGUudHlwZSA9PT0gXCJJbXBvcnREZWNsYXJhdGlvblwiICYmXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGxpYk1hcHMpLmluY2x1ZGVzKG5vZGUuc291cmNlLnZhbHVlKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwZWNpZmllcnMgPSBub2RlLnNwZWNpZmllcnNcclxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkQ29kZSA9IFwiXCJcclxuXHJcbiAgICAgICAgICAgIGlmIChzcGVjaWZpZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIE9iamVjdC52YWx1ZXMoc3BlY2lmaWVycykuZm9yRWFjaCgoc3BlY2lmaWVyOiBhbnksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3BlY2lmaWVyLnR5cGUgPT09IFwiSW1wb3J0RGVmYXVsdFNwZWNpZmllclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIFx1NTkwNFx1NzQwNlx1OUVEOFx1OEJBNFx1NUJGQ1x1NTE2NVxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnRTdGFydCA9IG5vZGUuc3RhcnRcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0RW5kID0gbm9kZS5lbmRcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0TmFtZSA9IHNwZWNpZmllci5sb2NhbC5uYW1lXHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXdDb2RlID0gYFxyXG4gIGNvbnN0ICR7aW1wb3J0TmFtZX0gPSAoYXdhaXQgaW1wb3J0TW9kdWxlKFwiJHtsaWJNYXBzW25vZGUuc291cmNlLnZhbHVlXX1cIikpLmRlZmF1bHQ7YFxyXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZENvZGUgKz0gbmV3Q29kZVxyXG4gICAgICAgICAgICAgICAgICAvLyBtYWdpY1N0cmluZy5vdmVyd3JpdGUoaW1wb3J0U3RhcnQsIGltcG9ydEVuZCwgbmV3Q29kZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlY2lmaWVyLnR5cGUgPT09IFwiSW1wb3J0U3BlY2lmaWVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gXHU1OTA0XHU3NDA2XHU1NDdEXHU1NDBEXHU1QkZDXHU1MTY1XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGltcG9ydFN0YXJ0ID0gbm9kZS5zdGFydFxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnRFbmQgPSBub2RlLmVuZFxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gc3BlY2lmaWVyLmltcG9ydGVkLm5hbWVcclxuICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxOYW1lID0gc3BlY2lmaWVyLmxvY2FsLm5hbWVcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvZGUgPSBgXHJcbiAgY29uc3QgJHtsb2NhbE5hbWV9ID0gKGF3YWl0IGltcG9ydE1vZHVsZShcIiR7bGliTWFwc1tub2RlLnNvdXJjZS52YWx1ZV19XCIpKS4ke2ltcG9ydE5hbWV9YFxyXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZENvZGUgKz0gbmV3Q29kZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gXCJJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXJcIikge1xyXG4gICAgICAgICAgICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTU0N0RcdTU0MERcdTdBN0FcdTk1RjRcdTVCRkNcdTUxNjVcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0U3RhcnQgPSBub2RlLnN0YXJ0XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGltcG9ydEVuZCA9IG5vZGUuZW5kXHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBzcGVjaWZpZXIubG9jYWwubmFtZVxyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Q29kZSA9IGBcclxuICBjb25zdCAke2ltcG9ydE5hbWV9ID0gYXdhaXQgaW1wb3J0TW9kdWxlKFwiJHtsaWJNYXBzW25vZGUuc291cmNlLnZhbHVlXX1cIik7YFxyXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZENvZGUgKz0gbmV3Q29kZVxyXG4gICAgICAgICAgICAgICAgICAvLyBtYWdpY1N0cmluZy5vdmVyd3JpdGUoaW1wb3J0U3RhcnQsIGltcG9ydEVuZCwgbmV3Q29kZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBPYmplY3Qua2V5cyhzcGVjaWZpZXJzKS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hZ2ljU3RyaW5nLm92ZXJ3cml0ZShub2RlLnN0YXJ0LCBub2RlLmVuZCwgdHJhbnNmb3JtZWRDb2RlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiBtYWdpY1N0cmluZy50b1N0cmluZygpLFxyXG4gICAgICAgICAgbWFwOiBtYWdpY1N0cmluZy5nZW5lcmF0ZU1hcCh7IGhpcmVzOiB0cnVlIH0pLCAvLyBcdTc1MUZcdTYyMTAgc291cmNlIG1hcFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29kZVxyXG4gICAgfSxcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRyYW5zZm9ybUltcG9ydFBsdWdpblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThVLFNBQVMsb0JBQW9CO0FBQzNXLE9BQU8scUJBQXFC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
