// import { useState } from "react";
import React from "react"
import Header from "./SubComponents/Header"

import Body from "./SubComponents/Body"
import { observer } from "mobx-react"

import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { orange, green } from "@mui/material/colors"
import { getTheme } from "@App/theme/change"
const lightTheme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: green[500],
    },
    mode: "light",
  },
})

const darkTheme = createTheme({
  palette: {
    primary: {
      main: orange[700],
    },
    secondary: {
      main: green[700],
    },
    mode: "dark",
  },
})
const App: any = observer(() => {
  return (
    <>
      <ThemeProvider theme={getTheme() == "light" ? lightTheme : lightTheme}>
        <CssBaseline />
        <Header />
        <Body />
      </ThemeProvider>
    </>
  )
})

export default App
