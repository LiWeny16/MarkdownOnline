import { jsx as _jsx } from "react/jsx-runtime";
// ScrollableBox.tsx
import React from 'react';
import { Box } from '@mui/material';
const ScrollableBox = React.forwardRef(({ children, sx, ...rest }, ref) => {
    return (_jsx(Box, { ref: ref, sx: {
            display: "flex",
            flexDirection: "column", // 确保内容垂直排列
            width: 500, // 默认宽度
            height: 200, // 默认高度
            overflow: "auto", // 启用滚动
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
});
export default ScrollableBox;
