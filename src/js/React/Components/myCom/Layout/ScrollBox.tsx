// ScrollableBox.tsx
import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ScrollableBoxProps extends BoxProps {
  // 您可以根据需要添加其他自定义 props
}

const ScrollableBox = React.forwardRef<HTMLDivElement, ScrollableBoxProps>(
  ({ children, sx, ...rest }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
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
        }}
        {...rest} // 传递所有剩余的Box属性
      >
        {children}
      </Box>
    );
  }
);

export default ScrollableBox;
