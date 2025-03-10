import React, { useState } from "react"
import Fab from "@mui/material/Fab"
import CircularProgress from "@mui/material/CircularProgress"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"

import ReactDOMServer from "react-dom/server"
import Button from "@mui/material/Button"

// React 组件转换为字符串
const ButtonComponent = ReactDOMServer.renderToString(<CircularLoadingButton />)

function CircularLoadingButton() {
  const [loading, setLoading] = useState(false)
  const fabSize = "small" // 设置按钮大小为小尺寸

  const handleClick = () => {
    // todo: 实际操作
    setLoading(true)

    // 示例的异步操作
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  return (
    <div style={{ position: "relative" }}>
      <Fab
        color="primary"
        onClick={handleClick}
        disabled={loading}
        style={{ background: loading ? "transparent" : "" }}
        size={fabSize}
      >
        {loading ? (
          <span style={{ display: "none" }}>
            <PlayArrowIcon />
          </span>
        ) : (
          <PlayArrowIcon />
        )}
      </Fab>
      {loading && (
        <CircularProgress
          size={fabSize === "small" ? 48 : 68} // 根据Fab大小来调整
          style={{
            color: "secondary",
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </div>
  )
}
export default CircularLoadingButton

export { ButtonComponent }
