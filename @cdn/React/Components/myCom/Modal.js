import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { Modal } from "@arco-design/web-react";
export default function App(props) {
    const [visible, setVisible] = React.useState(false);
    return (_jsx("div", { children: _jsx(Modal, { title: "Modal Title", visible: visible, onOk: () => setVisible(false), onCancel: () => setVisible(false), autoFocus: false, focusLock: true, children: _jsx("p", { children: "You can customize modal body text by the current situation. This modal will be closed immediately once you press the OK button." }) }) }));
}
