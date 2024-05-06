import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"

export default {
  input: "node_modules/react-photo-view/dist/react-photo-view.module.js", // 源文件
  output: {
    file: "@cdn/lib/react-photo-view.esm.js", // 输出文件
    format: "esm", // UMD 格式
    name: "ReactPhotoView", // 全局变量名称
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
  external: ["react", "react-dom"],
  plugins: [
    resolve(), // 解析 node_modules 中的模块
    commonjs(), // 转换 CJS 模块到 ESM
    terser() // 压缩输出代码
  ],
}
