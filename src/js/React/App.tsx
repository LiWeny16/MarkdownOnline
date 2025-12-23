import React from "react"
import Header from "./SubComponents/Header"
import Body from "./SubComponents/Body"
import AIMeetingDialog from "./SubComponents/AIMeeting/AIMeetingDialog"
import MeetingHistory from "./SubComponents/AIMeeting/MeetingHistory"
import { observer } from "mobx-react"

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { green, blue } from "@mui/material/colors"
import { changeStates, getStates, getTheme } from "@App/config/change"
import { Backdrop, Box, CircularProgress } from "@mui/material"
import { aheadInit } from "@Func/Init/aheadInit"
// import ServiceWorkerDevTools from "./Components/DevTools/ServiceWorkerDevTools"
const bothStyle: ThemeOptions = {
  zIndex: { drawer: 1300, modal: 1200, appBar: 1200 },
}
const lightTheme = createTheme({
  ...bothStyle,
  palette: {
    primary: {
      main: blue[200],
      contrastText: "#fff378",
    },
    secondary: {
      main: "#EEEEEE",
      contrastText: "#ffc0cb",
    },
    info: {
      main: blue[200],
      contrastText: "#8B8A8A",
    },
    mode: "light",
  },
})

const darkTheme = createTheme({
  ...bothStyle,
  palette: {
    primary: {
      main: blue[400],
      contrastText: "#f5deb3",
    },
    secondary: {
      main: green[700],
      contrastText: "#f5deb3",
    },
    info: {
      main: green[600],
      contrastText: "#8B8A8A",
    },
    mode: "dark",
  },
})

const App: any = observer(() => {
  React.useEffect(() => {
    aheadInit()
  }, [])

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <>
      <ThemeProvider theme={getTheme() === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <Box className="FLEX COL App-top">
          <Header />
          <Body />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={getStates().unmemorable.loading}
            onClick={() => {
              changeStates({ unmemorable: { loading: false } })
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
        {/* AI 会议助手 */}
        <AIMeetingDialog />
        <MeetingHistory />
        {/* Service Worker 开发者工具 - 开发环境显示，生产环境可通过快捷键开启 */}
        {/* <ServiceWorkerDevTools visible={isDevelopment} /> */}
      </ThemeProvider>
    </>
  )
})

export default App
