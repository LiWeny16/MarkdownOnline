import "react-photo-view/dist/react-photo-view.css"
import { PhotoProvider, PhotoView } from "react-photo-view"
import React from "react"
import { readAllMemoryImg } from "@App/textMemory/memory"
export default function MagicImg(props: any) {
  const [hasHover, setHasHover] = React.useState(false)

  return (
    <>
      {/* <div
        style={{
          // position: "relative",
          // top: "25vh",
          // left: "40vh"
        }}
      >
        X
      </div> */}
      <div className="FLEX JUS-CENTER">
        <PhotoProvider>
          <PhotoView src={props.src}>
            <img
              onMouseEnter={() => {
                setHasHover(true)
              }}
              onMouseLeave={() => {
                setHasHover(false)
              }}
              style={{
                width: "70%",
                transition: " 0.2s ease-in-out",
                borderRadius: "5px",
                transform: hasHover ? "translate(0px, -1vh)" : "",
                boxShadow: hasHover ? "1vh 2vh 21px rgb(79 79 79)" : "rgb(216 216 216) 1vh 2vh 21px"
              }}
              src={props.src}
              alt="error"
            />
          </PhotoView>
        </PhotoProvider>
      </div>
    </>
  )
}
// top: -25vh;
// left: 40vh;
// cursor: pointer;
