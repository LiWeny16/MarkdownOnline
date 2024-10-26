import React from "react"
import Box from "@mui/material/Box"
import { BoxProps } from "@mui/material/Box" // 导入Box的属性类型

// 组件的属性继承自BoxProps，同时包含children
interface ScrollableBoxProps extends BoxProps {
  children: React.ReactNode
}

function ScrollableBox({ children, sx, ...rest }: ScrollableBoxProps) {
  return (
    <Box
      sx={{
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
      }}
      {...rest} // 传递所有剩余的Box属性
    >
      {children}
    </Box>
  )
}

export default ScrollableBox
