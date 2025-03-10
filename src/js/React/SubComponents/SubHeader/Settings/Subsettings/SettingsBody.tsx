import {
  changeSettings,
  changeStatesMemorable,
  changeTheme,
  getSettings,
  getTheme,
} from "@App/config/change"
import SwitchTheme from "@Root/js/React/Components/myCom/Switches/SwitchTheme"
import SwitchIOS from "@Root/js/React/Components/myCom/Switches/SwitchIOS"
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import React from "react"
import { observer } from "mobx-react"
import { speechLanguageMap } from "@App/voice/speech"
import { normalMermaidTheme, normalMermaidThemeMap } from "@Func/Init/allInit"
import mermaid from "mermaid"
import { mdConverter } from "@Root/js"
import kit from "@cdn-kit"
import { useTranslation } from "react-i18next"
export const settingsBodyContentBoxStyle = {
  transition: "background-color 0.4s ease, box-shadow 0.4s ease",
  position: "relative",
  padding: "5px",
  borderRadius: "3px",
  display: "flex",
  flexDirection: "column",
  mt: "10px",
  mb: "5px",
  ml: "0px",
  pl: "25px",
  willChange: "background-color, box-shadow",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 4,
    backgroundColor: "transparent",
    transition: "background-color 0.2s cubic-bezier(0.5, 0.05, 1, 0.5)",
  },

}
const settingsBodyContentBoxStyleFromTheme = (theme: string) => ({
  "&:hover::before": {
    backgroundColor: getTheme() === "light" ? "#840084" : "#d2d2d2",
  },
  "&:hover": {
    backgroundColor: getTheme() === "light" ? "#EAEAEA" : "#393939",
    boxShadow: "0px 4px 12px rgba(20, 15, 15, 0.1)", // 增加细微阴影增强效果
  },
});
export default observer(function SettingsBody() {
  const { t, i18n } = useTranslation()
  const theme = getTheme()
  const muiTheme = useTheme()

  const secondSettingsBodyContentBoxStyle = {
    ...settingsBodyContentBoxStyle,
    transition: "background-color 2s ease, box-shadow 0.4s ease",
    "&::before": {
      ...settingsBodyContentBoxStyle["&::before"],
      transition: "background-color 0.24s ease 0.1s",
    },
  }

  const ContentDescriptionTextStyle = {
    color: muiTheme.palette.info.contrastText ?? "#8B8A8A",
    fontSize: "0.79rem",
    fontWeight: 500,
    mb: "5px",
  }
  const [themeState, setThemeState] = React.useState<boolean>(false)

  const handleOnChangeImagePrefer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    changeSettings({
      advanced: {
        imageSettings: {
          ...getSettings().advanced.imageSettings,
          modePrefer: event.target.value === "folder" ? "folder" : "vf",
        },
      },
    })
  }
  const handleOnChangeImageStyle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    changeSettings({
      advanced: {
        imageSettings: {
          ...getSettings().advanced.imageSettings,
          basicStyle: event.target.value,
        },
      },
    })
  }
  const handleOnChangeImageStorePath = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    changeSettings({
      advanced: {
        imageSettings: {
          ...getSettings().advanced.imageSettings,
          imgStorePath: event.target.value,
        },
      },
    })
  }
  function handleOnChangeThemeSwitch(e: any, b: any) {
    const markdownBodyElement = document.querySelector(
      ".markdown-body"
    ) as HTMLElement
    if (b) {
      changeTheme("dark")
      setThemeState(e.target.checked)
      markdownBodyElement.style.cssText = ""
    } else {
      changeTheme("light")
      setThemeState(e.target.checked)
    }
  }
  function handleOnChangeSyncScrollSwitch(_e: any, b: any) {
    if (b) {
      // 开
      changeSettings({
        basic: { syncScroll: true },
      })
    } else {
      changeSettings({
        basic: { syncScroll: false },
      })
    }
  }
  function handleSpeechLanguage(e: any) {
    changeSettings({
      basic: { speechLanguage: e.target.value },
    })
  }
  function handleOnChangeFontSize(e: any) {
    // console.log(getSettings().basic.fontSize)
    changeSettings({
      basic: { fontSize: e.target.value },
    })
    if (document.getElementsByClassName("fontSizeStyle")) {
      kit.removeAddedStyle("fontSizeStyle")
      kit.addStyle(
        `
      .markdown-body p,
      .markdown-body ol,
      .markdown-body li,
      .markdown-body div {
          font-size: ${getSettings().basic.fontSize}px;
      }
        `,
        "fontSizeStyle"
      )
    }
  }
  function handleOnChangeEditorAutoWrap(e: any) {
    // console.log(getSettings().basic.fontSize)
    changeSettings({
      basic: { editorAutoWrap: e.target.value === 1 ? true : false },
    })
    window.editor.updateOptions({
      wordWrap: getSettings().basic.editorAutoWrap ? "on" : "off",
    })
  }
  function handleOnChangeFontFamily(e: any) {
    changeSettings({
      basic: { fontFamily: e.target.value === 1 ? "Times New Roman" : `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"` },
    })
  }
  function handleOnChangeLanguage(e: any) {
    let lang = e.target.value
    i18n.changeLanguage(e.target.value)
    document.documentElement.lang = e.target.value
    changeStatesMemorable({ memorable: { languageChanged: true } })
    changeSettings({ basic: { language: lang } })
  }
  function handleOnChangeMermaidTheme(e: any) {
    changeSettings({
      advanced: { mermaidTheme: e.target.value },
    })
    mermaid.init({
      theme: e.target.value,
    })
    mdConverter()
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
        {/* *************************基础设置****************************** */}
        <Typography
          id="settings_1_x"
          sx={{ fontSize: "30px", fontWeight: "700" }}
        >
          基础设置
        </Typography>

        <Divider></Divider>
        <Box id="settings_1_1" sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
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
            size="small"
            inputProps={{ "aria-label": "controlled" }}
            onChange={handleOnChangeThemeSwitch}
          ></SwitchTheme>
        </Box>
        <Box id="settings_1_2" sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
          <Typography
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Language
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            更改编辑器的语言
          </Typography>
          <Select
            value={getSettings().basic.language ?? "zh"}
            defaultChecked={true}
            size="small"
            color="primary"
            onChange={handleOnChangeLanguage}
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </Box>
        <SecondaryHeading
          id="settings_1_3"
          content="编辑器设置"
        ></SecondaryHeading>
        <Box sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }} id="settings_1_2">
          <Box sx={{ ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }}>
            <Box className="FLEX ROW">
              <Typography
                sx={{
                  fontSize: "0.89rem",
                  fontWeight: 500,
                }}
              >
                Font Size
              </Typography>
            </Box>
            <Typography sx={ContentDescriptionTextStyle}>
              更改渲染后文字字体大小
            </Typography>
            <Select
              value={getSettings().basic.fontSize}
              defaultChecked={true}
              fullWidth
              size="small"
              onChange={handleOnChangeFontSize}
            >
              {[...Array(10).keys()].map((i) => {
                const size = 8 + i * 2 // 从9开始，每次增加2得到奇数
                return (
                  <MenuItem key={size} value={size}>
                    {size} px
                  </MenuItem>
                )
              })}
            </Select>
          </Box>
          <Box sx={{ ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }}>
            <Box className="FLEX ROW">
              <Typography
                sx={{
                  fontSize: "0.89rem",
                  fontWeight: 500,
                }}
              >
                Font Family
              </Typography>
            </Box>
            <Typography sx={ContentDescriptionTextStyle}>
              更改渲染后文字字体
            </Typography>
            <Select
              value={getSettings().basic.fontFamily === "Times New Roman" ? 1 : 0}
              defaultChecked={true}
              fullWidth
              size="small"
              onChange={handleOnChangeFontFamily}
            >
              <MenuItem value={0}>Defualt</MenuItem>
              <MenuItem value={1}>Times New Roman</MenuItem>
            </Select>
          </Box>
          <Box sx={{
            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
          }}>
            <Box className="FLEX ROW">
              <Typography
                sx={{
                  fontSize: "0.89rem",
                  fontWeight: 500,
                }}
              >
                Synchronous Scrolling
              </Typography>
            </Box>
            <Typography sx={ContentDescriptionTextStyle}>
              同步滚动左边编辑区和预览区域。
            </Typography>
            <SwitchIOS
              checked={getSettings().basic.syncScroll}
              size="small"
              inputProps={{ "aria-label": "controlled" }}
              onChange={handleOnChangeSyncScrollSwitch}
            ></SwitchIOS>
          </Box>
          <Box sx={{
            ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
          }}>
            <Box className="FLEX ROW">
              <Typography
                sx={{
                  fontSize: "0.89rem",
                  fontWeight: 500,
                }}
              >
                Editor Auto Wrap
              </Typography>
            </Box>
            <Typography sx={ContentDescriptionTextStyle}>
              是否开启编辑器自动换行
            </Typography>
            <Select
              value={getSettings().basic.editorAutoWrap ? 1 : 0}
              defaultChecked={true}
              fullWidth
              size="small"
              onChange={handleOnChangeEditorAutoWrap}
            >
              <MenuItem value={1}>On</MenuItem>
              <MenuItem value={0}>OFF</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box id="settings_1_4" sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
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
            value={getSettings().basic.speechLanguage ?? "zh-CN"}
            defaultChecked={true}
            // value={clearOptions}
            fullWidth
            size="small"
            onChange={handleSpeechLanguage}
          >
            {speechLanguageMap.map((e, i) => {
              return (
                <MenuItem key={i} value={e[0]}>
                  {e[1]}
                </MenuItem>
              )
            })}
          </Select>
        </Box>
        {/* *************************高级设置****************************** */}
        <Typography
          id="settings_2_x"
          sx={{ mt: "20px", fontSize: "30px", fontWeight: "700" }}
        >
          高级设置（施工中）
        </Typography>
        <Divider></Divider>

        <Box id="settings_2_1" sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
          <Typography
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Export Settings
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            更改导出设置(施工中)
          </Typography>
          <SwitchIOS
            disabled
            size="small"
            inputProps={{ "aria-label": "controlled" }}
          ></SwitchIOS>
        </Box>

        <Box sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
          <Typography
            id="settings_2_2"
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Mermaid Theme Configs
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            Mermaid流程图主题
          </Typography>
          <Select
            value={getSettings().advanced.mermaidTheme ?? "default"}
            defaultChecked={true}
            fullWidth
            size="small"
            // label="Theme"
            color="primary"
            onChange={handleOnChangeMermaidTheme}
          >
            {normalMermaidTheme.map((e, i) => (
              <MenuItem key={i} value={e}>
                {normalMermaidThemeMap[i]}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <SecondaryHeading
          id="settings_2_3"
          content="图片设置"
        ></SecondaryHeading>
        <Box sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
          <Box sx={{ ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }}>
            <Typography
              id="settings_2_3"
              sx={{
                fontSize: "0.89rem",
                fontWeight: 500,
              }}
            >
              Image Storage Mode Preference (Pasting)
            </Typography>
            <Typography sx={ContentDescriptionTextStyle}>
              选择粘贴图片优先存储在浏览器/文件夹
            </Typography>
            <FormControl sx={{ transition: "inherit" }}>
              <RadioGroup
                value={getSettings().advanced.imageSettings.modePrefer}
                onChange={handleOnChangeImagePrefer}
              >
                <FormControlLabel
                  value="folder"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                          color: "#65C466",
                        },
                      }}
                    />
                  }
                  label="本地文件夹 (Prefer In Local Folder)"
                />
                <FormControlLabel
                  value="vf"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                          color: "#65C466",
                        },
                      }}
                    />
                  }
                  label="浏览器 (Prefer In Browser)"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }}>
            <Typography
              id="settings_2_4"
              sx={{
                fontSize: "0.89rem",
                fontWeight: 500,
              }}
            >
              Default Image Style
            </Typography>
            <Typography sx={ContentDescriptionTextStyle}>
              默认填充的图片样式，大小，位置等,w表示大小, c表示center,
              s表示shadow
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              name="basicStyle"
              label="基本样式"
              value={getSettings().advanced.imageSettings.basicStyle}
              onChange={handleOnChangeImageStyle}
            />
          </Box>
          <Box sx={{ ...secondSettingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme()) }}>
            <Typography
              id="settings_2_5"
              sx={{
                fontSize: "0.89rem",
                fontWeight: 500,
              }}
            >
              Default Stored Path
            </Typography>
            <Typography sx={ContentDescriptionTextStyle}>
              默认粘贴图片上传的路径，如设置为"images"，则图片会上传到名根目录的一个为"images"的文件夹下，如该项为空，则保持默认的"images"文件夹
            </Typography>
            <TextField
              disabled={
                getSettings().advanced.imageSettings.modePrefer === "vf"
                  ? true
                  : false
              }
              fullWidth
              margin="none"
              name="imgStorePath"
              label="图片存储路径"
              value={getSettings().advanced.imageSettings.imgStorePath}
              onChange={handleOnChangeImageStorePath}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
})

interface SecondaryHeadingProps {
  content: string
  id: string
}

const SecondaryHeading = ({ content, id }: SecondaryHeadingProps) => {
  return (
    <>
      <Typography
        id={id}
        sx={{
          mt: "5px",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        {content}
      </Typography>
      <Divider />
    </>
  )
}
