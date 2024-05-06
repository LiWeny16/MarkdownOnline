// import { useState } from "react";
import React from "react"
import Header from "./SubComponents/Header"

import Body from "./SubComponents/Body"
import { observer } from "mobx-react"

import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { orange, green, grey, common, blue, pink } from "@mui/material/colors"
import { getTheme } from "@App/config/change"
// import Box from "@mui/material/Box"
// import TB from "@Com/myCom/Layout/TB"
const lightTheme = createTheme({
  palette: {
    primary: {
      main: blue[200],
      contrastText: "#fff378",
    },
    secondary: {
      main: green[500],
      contrastText: "pink",
    },
    mode: "light",
  },
})

const darkTheme = createTheme({
  palette: {
    primary: {
      main: blue[400],
      contrastText: "wheat",
    },
    secondary: {
      main: green[700],
      contrastText: "wheat",
    },
    mode: "dark",
  },
})
const App: any = observer(() => {
  return (
    <>
      <ThemeProvider theme={getTheme() === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <div className="FLEX COL">
          <Header />
          <Body />
        </div>
      </ThemeProvider>
    </>
  )
})

export default App
