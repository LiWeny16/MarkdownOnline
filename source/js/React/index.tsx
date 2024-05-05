import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
// import "@Root/js/index.ts"
// 我希望在import  "@Root/js/index.ts" 的时候执行
//  而不是在 import {kit} from "@Root/js/index.ts" 的时候执行
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
)

