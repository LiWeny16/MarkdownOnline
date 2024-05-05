import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactDOMServer from "react-dom/server";
// React 组件转换为字符串
const ButtonComponent = ReactDOMServer.renderToString(_jsx(CircularLoadingButton, {}));
function CircularLoadingButton() {
    const [loading, setLoading] = useState(false);
    const fabSize = "small"; // 设置按钮大小为小尺寸
    const handleClick = () => {
        // todo: 实际操作
        setLoading(true);
        // 示例的异步操作
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };
    return (_jsxs("div", { style: { position: "relative" }, children: [_jsx(Fab, { color: "primary", onClick: handleClick, disabled: loading, style: { background: loading ? "transparent" : "" }, size: fabSize, children: loading ? (_jsx("span", { style: { display: "none" }, children: _jsx(PlayArrowIcon, {}) })) : (_jsx(PlayArrowIcon, {})) }), loading && (_jsx(CircularProgress, { size: fabSize === "small" ? 48 : 68, style: {
                    color: "secondary",
                    position: "absolute",
                    top: -6,
                    left: -6,
                    zIndex: 1,
                } }))] }));
}
export default CircularLoadingButton;
export { ButtonComponent };
