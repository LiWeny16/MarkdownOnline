import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { pollVariables } from "@App/basic/basic"

pollVariables([
  "markdownitIncrementalDOM",
  "katex",
  "IncrementalDOM",
  "React",
  "ReactDOM",
]).then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>,
  )
})
