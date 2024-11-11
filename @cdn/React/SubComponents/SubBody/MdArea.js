import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import MonacoEditor from "@Com/myCom/Monaco/monaco";
export default function MdArea({ setMarkdownViewerWidth }) {
    return (_jsx(_Fragment, { children: _jsx(MonacoEditor, { setMarkdownViewerWidth: setMarkdownViewerWidth }) }));
}
