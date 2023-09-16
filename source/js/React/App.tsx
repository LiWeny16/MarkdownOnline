// import { useState } from "react";
// import "./App.less"
import Menu from "./SubComponents/SubHeader/Menu"
import Image from "./Components/Arco/Image"
import Gridv2 from "./Components/Mui/Gridv2"
import Header from "./SubComponents/Header"
// import DragBox from "./Components/myCom/DragBox"
import "@arco-design/web-react/dist/css/arco.css"
import Body from "./SubComponents/Body"
import { observer } from "mobx-react"
import { useImage } from './Store/Image'
// import { Button } from "@mui/material"
const App = observer(() => {
  const image = useImage()
  console.log(image.displayState)
  return (
    <>
      <Header/>
      <Body/>
      {/* 放到这里作为顶层 */}
    </>
  )
})

export default App
