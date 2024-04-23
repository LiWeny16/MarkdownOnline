import { changeTheme, getTheme } from "@App/config/change"
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme"
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS"
import { LightTooltip } from "@Root/js/React/Components/myCom/Tooltips"
import { Box, Divider, MenuItem, Select, Typography } from "@mui/material"
import React from "react"

export default function SettingsBody() {
  const theme = getTheme()
  const settingsBodyContentBoxStyle = {
    transition: "0.3s",
    position: "relative", // 添加相对定位
    padding: "5px",
    borderRadius: "3px",
    display: "flex",
    flexDirection: "column",
    mt: "20px",
    ml: "0px",
    pl: "25px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: 4, // 左边框的宽度
      backgroundColor: "transparent",
      transition: "background-color 0.3s", // 添加过渡效果
    },
    "&:hover::before": {
      backgroundColor: theme === "light" ? "#840084" : "#d2d2d2", // 悬停时左边框的颜色
    },
    "&:hover": {
      backgroundColor: theme === "light" ? "#E7E6E5" : "",
      // borderLeft:"solid"
    },
  }
  const ContentDescriptionTextStyle = {
    color: "#8B8A8A",
    fontSize: "0.79rem",
    fontWeight: 500,
    mb: "5px",
  }
  const [themeState, setThemeState] = React.useState<boolean>(
    // getTheme() === "dark" ? true : false
    false
  )
  function handleOnChangeThemeSwitch(e: any, b: any) {
    if (b) {
      changeTheme("dark")
      setThemeState(e.target.checked)
    } else {
      changeTheme("light")
      setThemeState(e.target.checked)
    }
  }
  function handleOnChangeSyncScrollSwitch() {}
  function handleSpeechLanguage() {}
  /**
   * @description 初始化设置
   */
  React.useEffect(() => {
    setThemeState(getTheme() === "dark" ? true : false)
  }, [getTheme()])
  return (
    <>
      <Box
        className="transparent-scrollbar"
        sx={{
          width: "100%",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          fontSize: "0.89rem",
          maxHight: "200px",
          overflowY: "scroll",
        }}
      >
        <Typography sx={{ fontSize: "30px", fontWeight: "700" }}>
          基础设置
        </Typography>
        <Divider></Divider>
        <Box sx={settingsBodyContentBoxStyle}>
          {/* <LightTooltip title="编辑器主题" placement="bottom"> */}
          <Typography
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Theme
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            更改编辑器的主题
          </Typography>
          <SwitchTheme
            checked={themeState}
            // defaultChecked={getTheme() === "dark" ? true : false}
            // checked={}
            size="small"
            inputProps={{ "aria-label": "controlled" }}
            onChange={handleOnChangeThemeSwitch}
          ></SwitchTheme>
        </Box>
        <Box sx={settingsBodyContentBoxStyle}>
          {/* <LightTooltip title="编辑器主题" placement="bottom"> */}
          <Typography
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Synchronous Scrolling
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            同步滚动左边编辑区和预览区域
          </Typography>
          <SwitchIOS
            checked={themeState}
            size="small"
            inputProps={{ "aria-label": "controlled" }}
            onChange={handleOnChangeSyncScrollSwitch}
          ></SwitchIOS>
        </Box>
        <Box sx={settingsBodyContentBoxStyle}>
          <Typography
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Speech To Text
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            选择语音转文字的识别语言
          </Typography>
          <Select
            // label={"语言"}
            defaultValue={"1"}
            defaultChecked={true}
            // defaultChecked={true}
            // value={clearOptions}
            fullWidth
            size="small"
            onChange={handleSpeechLanguage}
          >
            <MenuItem value={"1"}> 中文</MenuItem>
            <MenuItem value={"2"}>English</MenuItem>
          </Select>
        </Box>
      </Box>
    </>
  )
}
