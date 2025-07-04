import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { pollVariables } from "@App/basic/basic"
import initI18N from "@Func/I18N/i18n"
initI18N()
pollVariables([
  "markdownitIncrementalDOM",
  "katex",
  "IncrementalDOM",
  // "React",
  // "ReactDOM",
]).then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  )
})
