// import { useState } from "react";
import React from "react"
import Header from "./SubComponents/Header"

import Body from "./SubComponents/Body"
import { observer } from "mobx-react"
import { kit, allInit } from "@Root/js/index"
// import { Button } from "@mui/material"
const App = observer(() => {
  React.useEffect(() => {
    kit.sleep(20).then(() => {
      allInit()
    })
  }, [])
  return (
    <>
      <Header />
      <Body />
    </>
  )
})

export default App
