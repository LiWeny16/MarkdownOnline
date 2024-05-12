// import { useState } from "react";
import React from "react"
import Header from "./SubComponents/Header"

import Body from "./SubComponents/Body"
import { observer } from "mobx-react"

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { orange, green, grey, common, blue, pink } from "@mui/material/colors"
import { getTheme } from "@App/config/change"
import { Backdrop, Box, CircularProgress } from "@mui/material"
import kit from "bigonion-kit"
// import Box from "@mui/material/Box"
// import TB from "@Com/myCom/Layout/TB"
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
      main: green[500],
      contrastText: "pink",
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
      contrastText: "wheat",
    },
    secondary: {
      main: green[700],
      contrastText: "wheat",
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
    kit.addStyle(`
    ::selection {
      border-radius: 5px;
      background-color: ${getTheme() === "light" ? "#add6ff" : "#636363"};
    }
    `)
    // handleCloseLoading()
  }, [])
  return (
    <>
      <ThemeProvider theme={getTheme() === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <Box className="FLEX COL App-top">
          <Header />
          <Body />
        </Box>
      </ThemeProvider>
    </>
  )
})

export default App
