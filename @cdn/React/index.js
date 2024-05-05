import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "@Root/js/index.ts"
// 我希望在import  "@Root/js/index.ts" 的时候执行
//  而不是在 import {kit} from "@Root/js/index.ts" 的时候执行
ReactDOM.createRoot(document.getElementById("root")).render(
// <React.StrictMode>
_jsx(App, {})
// </React.StrictMode>,
);
