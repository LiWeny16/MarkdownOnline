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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import React from "react"
import { observer } from "mobx-react"
import { speechLanguageMap } from "@App/voice/speech"
import { normalMermaidTheme, normalMermaidThemeMap } from "@Func/Init/allInit"
import mermaid from "mermaid"
import { mdConverter } from "@Root/js"
import kit from "bigonion-kit"
import { useTranslation } from "react-i18next"
import alertUseArco from "@App/message/alert"
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
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(false)

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
      kit.removeAddedStyle()
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

  /**
   * @description 重置所有数据 - 清除localStorage、cookies、indexedDB和service worker缓存
   */
  const handleResetAllData = async () => {
    try {
      // 清除localStorage
      localStorage.clear()
      
      // 清除sessionStorage
      sessionStorage.clear()
      
      // 清除所有cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
        if (name) {
          // 尝试多种路径和域名清除
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
        }
      })
      
      // 清除indexedDB - 使用更安全的方法
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases()
          
          // 首先尝试关闭所有数据库连接
          for (const dbInfo of databases) {
            if (dbInfo.name) {
              try {
                // 先尝试打开然后立即关闭，强制断开连接
                const openReq = indexedDB.open(dbInfo.name)
                openReq.onsuccess = () => {
                  openReq.result.close()
                }
              } catch (e) {
                console.log(`无法关闭数据库 ${dbInfo.name}:`, e)
              }
            }
          }
          
          // 等待一下让连接关闭
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // 然后删除数据库
          for (const dbInfo of databases) {
            if (dbInfo.name) {
              try {
                await new Promise<void>((resolve, reject) => {
                  const deleteReq = indexedDB.deleteDatabase(dbInfo.name!)
                  let resolved = false
                  
                  const timeout = setTimeout(() => {
                    if (!resolved) {
                      resolved = true
                      console.warn(`删除数据库 ${dbInfo.name} 超时，但继续处理`)
                      resolve()
                    }
                  }, 3000) // 3秒超时
                  
                  deleteReq.onsuccess = () => {
                    if (!resolved) {
                      resolved = true
                      clearTimeout(timeout)
                      console.log(`成功删除数据库: ${dbInfo.name}`)
                      resolve()
                    }
                  }
                  
                  deleteReq.onerror = () => {
                    if (!resolved) {
                      resolved = true
                      clearTimeout(timeout)
                      console.warn(`删除数据库 ${dbInfo.name} 失败，但继续处理:`, deleteReq.error)
                      resolve() // 继续而不是失败
                    }
                  }
                  
                  deleteReq.onblocked = () => {
                    console.warn(`数据库 ${dbInfo.name} 删除被阻塞，将在页面刷新后清除`)
                    if (!resolved) {
                      resolved = true
                      clearTimeout(timeout)
                      resolve() // 继续而不是失败
                    }
                  }
                })
              } catch (e) {
                console.warn(`删除数据库 ${dbInfo.name} 时出错:`, e)
                // 继续处理其他数据库
              }
            }
          }
        } catch (e) {
          console.warn('清除IndexedDB时出错，但继续处理其他数据:', e)
        }
      }
      
      // 清除service worker缓存
      if ('serviceWorker' in navigator && 'caches' in window) {
        try {
          const cacheNames = await caches.keys()
          await Promise.allSettled(
            cacheNames.map(cacheName => caches.delete(cacheName))
          )
          
          // 注销所有service workers
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.allSettled(
            registrations.map(registration => registration.unregister())
          )
        } catch (e) {
          console.warn('清除Service Worker缓存时出错:', e)
        }
      }
      
      alertUseArco(t("t-reset-success"), 3000, { kind: "success" })
      
      // 3秒后强制刷新页面
      setTimeout(() => {
        // 使用更强力的刷新方式
        window.location.href = window.location.href
      }, 3000)
      
    } catch (error) {
      console.error('重置数据时出错:', error)
      alertUseArco(t("t-reset-warning"), 3000, { kind: "warning" })
      
      // 即使出错也刷新页面
      setTimeout(() => {
        window.location.href = window.location.href
      }, 3000)
    }
  }

  /**
   * @description 显示重置确认对话框
   */
  const showResetConfirmDialog = () => {
    setConfirmDialogOpen(true)
  }

  /**
   * @description 确认重置操作
   */
  const handleConfirmReset = () => {
    setConfirmDialogOpen(false)
    handleResetAllData()
  }
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
          {t("t-basic-settings-title")}
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
            {t("t-theme-description")}
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
            {t("t-language-description")}
          </Typography>
          <Select
            value={getSettings().basic.language ?? "zh"}
            defaultChecked={true}
            size="small"
            color="primary"
            onChange={handleOnChangeLanguage}
          >
            <MenuItem value="zh">{t("t-chinese")}</MenuItem>
            <MenuItem value="en">{t("t-english")}</MenuItem>
          </Select>
        </Box>
        <SecondaryHeading
          id="settings_1_3"
          content={t("t-editor-settings-title")}
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
              {t("t-font-size-description")}
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
              {t("t-font-family-description")}
            </Typography>
            <Select
              value={getSettings().basic.fontFamily === "Times New Roman" ? 1 : 0}
              defaultChecked={true}
              fullWidth
              size="small"
              onChange={handleOnChangeFontFamily}
            >
              <MenuItem value={0}>{t("t-default")}</MenuItem>
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
              {t("t-sync-scroll-description")}
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
              {t("t-auto-wrap-description")}
            </Typography>
            <Select
              value={getSettings().basic.editorAutoWrap ? 1 : 0}
              defaultChecked={true}
              fullWidth
              size="small"
              onChange={handleOnChangeEditorAutoWrap}
            >
              <MenuItem value={1}>{t("t-on")}</MenuItem>
              <MenuItem value={0}>{t("t-off")}</MenuItem>
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
            {t("t-speech-language-description")}
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
          {t("t-advanced-settings-title")}
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
            {t("t-export-settings-description")}
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
            {t("t-mermaid-theme-description")}
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
          content={t("t-image-settings-title")}
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
              {t("t-image-storage-preference")}
            </Typography>
            <Typography sx={ContentDescriptionTextStyle}>
              {t("t-image-storage-description")}
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
                  label={t("t-image-storage-folder")}
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
                  label={t("t-image-storage-browser")}
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
              {t("t-default-image-style")}
            </Typography>
            <Typography sx={ContentDescriptionTextStyle}>
              {t("t-default-image-style-description")}
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              name="basicStyle"
              label={t("t-basic-style")}
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
              {t("t-default-stored-path")}
            </Typography>
            <Typography sx={ContentDescriptionTextStyle}>
              {t("t-default-stored-path-description")}
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
              label={t("t-image-store-path")}
              value={getSettings().advanced.imageSettings.imgStorePath}
              onChange={handleOnChangeImageStorePath}
            />
          </Box>
        </Box>
        
        {/* 数据管理设置 */}
        <SecondaryHeading
          id="settings_2_7"
          content={t("t-reset-settings-title")}
        ></SecondaryHeading>
        <Box id="settings_2_8" sx={{
          ...settingsBodyContentBoxStyle, ...settingsBodyContentBoxStyleFromTheme(getTheme())
        }}>
          <Typography
            sx={{
              fontSize: "0.89rem",
              fontWeight: 500,
            }}
          >
            Reset All Data
          </Typography>
          <Typography sx={ContentDescriptionTextStyle}>
            {t("t-reset-data-description")}
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={showResetConfirmDialog}
            sx={{
              mt: 1,
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            {t("t-reset-button")}
          </Button>
        </Box>
      </Box>
      
      {/* 确认重置对话框 */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t("t-reset-confirm-title")}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description" sx={{ mb: 2 }} dangerouslySetInnerHTML={{ __html: t("t-reset-confirm-description") }}>
          </Typography>
          <Typography component="div" sx={{ ml: 2, mb: 2 }} dangerouslySetInnerHTML={{ __html: t("t-reset-confirm-list") }}>
          </Typography>
          <Typography color="error" sx={{ fontWeight: 500 }}>
            {t("t-reset-confirm-warning")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            {t("t-cancel")}
          </Button>
          <Button onClick={handleConfirmReset} color="error" variant="contained">
            {t("t-confirm-reset")}
          </Button>
        </DialogActions>
      </Dialog>
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
