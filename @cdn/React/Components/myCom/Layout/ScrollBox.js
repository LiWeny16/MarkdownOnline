import { jsx as _jsx } from "react/jsx-runtime";
import Box from "@mui/material/Box";
function ScrollableBox({ children, sx, ...rest }) {
    return (_jsx(Box, { sx: {
            display: "flex",
            width: 300, // 默认宽度
            height: 200, // 默认高度
            overflow: "auto", // 默认启用滚动
            padding: "10px", // 默认内边距
            "&::-webkit-scrollbar": {
                width: "10px",
            },
            "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 5px grey",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "darkgrey",
                borderRadius: "10px",
            },
            ...sx, // 允许外部样式覆盖默认样式
        }, ...rest, children: children }));
}
export default ScrollableBox;
