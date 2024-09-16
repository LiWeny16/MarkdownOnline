import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import App from "./App";
import { pollVariables } from "@App/basic/basic";
pollVariables([
    "markdownitIncrementalDOM",
    "katex",
    "IncrementalDOM",
    "React",
    "ReactDOM",
]).then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    _jsx(App, {})
    // </React.StrictMode>,
    );
});
