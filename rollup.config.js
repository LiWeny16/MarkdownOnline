// import resolve from "@rollup/plugin-node-resolve"
// import commonjs from "@rollup/plugin-commonjs"
// import { terser } from "rollup-plugin-terser"

// const inputArr = [
//   "node_modules/react-photo-view/dist/react-photo-view.module.js",
//   "node_modules/markdown-it-incremental-dom/lib/markdown-it-incremental-dom.js",
// ]
// const outArr = [
//   "react-photo-view/react-photo-view.esm.js",
//   "markdown-it-incremental-dom/markdown-it-incremental-dom.esm.js",
// ]
// export default {
//   input: inputArr[1], // 源文件
//   output: {
//     file: "@cdn/lib/" + outArr[1], // 输出文件
//     format: "esm", // UMD 格式
//     // name: "ReactPhotoView", // 全局变量名称
//     globals: {
//       react: "React", // `import ... from 'react'` 被转换为全局变量 React
//       "react-dom": "ReactDOM", // `import ... from 'react-dom'` 被转换为全局变量 ReactDOM
//     },
//   },
//   external: ["react", "react-dom"],
//   plugins: [
//     resolve(), // 解析 node_modules 中的模块
//     commonjs(), // 转换 CJS 模块到 ESM
//     // terser() // 压缩输出代码
//   ],
// }
