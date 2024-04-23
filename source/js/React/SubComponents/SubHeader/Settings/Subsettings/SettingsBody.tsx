import { changeTheme, getTheme } from "@App/config/change"
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme"
import { LightTooltip } from "@Root/js/React/Components/myCom/Tooltips"
import { Box, Typography } from "@mui/material"
import React from "react"

export default function SettingsBody() {
  const [themeState, setThemeState] = React.useState<boolean>(
    // getTheme() === "dark" ? true : false
    false
  )
  function handleOnChangeSwitch(e: any, b: any) {
    if (b) {
      changeTheme("dark")
      setThemeState(e.target.checked)
    } else {
      changeTheme("light")
      setThemeState(e.target.checked)
    }
  }
  /**
   * @description 初始化设置
   */
  React.useEffect(() => {
    setThemeState(getTheme() === "dark" ? true : false)
  }, [getTheme()])
  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "cow" }}>
          <LightTooltip title="编辑器主题" placement="bottom">
            <Typography>主题切换</Typography>
          </LightTooltip>
          <SwitchTheme
            checked={themeState}
            // defaultChecked={getTheme() === "dark" ? true : false}
            // checked={}
            inputProps={{ "aria-label": "controlled" }}
            onChange={handleOnChangeSwitch}
          ></SwitchTheme>
        </Box>
      </Box>
    </>
  )
}
