import "react-photo-view/dist/react-photo-view.css"
import { PhotoProvider, PhotoView } from "react-photo-view"
import React from "react"
import { readAllMemoryImg } from "@App/textMemory/memory"
import Zoom from "@mui/material/Zoom"
import Tooltip from "@mui/material/Tooltip"
const _MagicImg = React.forwardRef(MagicImg)
function MagicImg(props: MagicImgOptions, ref: any) {
  let _className = "FLEX JUS-CENTER "
  let _style: React.CSSProperties = { width: "fitContent" }
  const [hasHover, setHasHover] = React.useState(false)
  let [mergeProps, _NU] = React.useState<MagicImgOptions>({
    src: props.src,
    magic: props.magic == 0 ? false : true,
    className: _className + (props.className ?? ""),
    style: props.style ? { ...props.style, ..._style } : _style
  })

  function basicImg() {
    return (
      <>
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
            boxShadow: hasHover
              ? "1vh 2vh 21px rgb(79 79 79)"
              : "rgb(216 216 216) 1vh 2vh 21px"
          }}
          src={mergeProps.src}
          alt="error"
        />
      </>
    )
  }
  return (
    <>
      <div
        {...mergeProps}
        {...props}
        ref={ref}
        className={mergeProps.className}
        style={mergeProps.style}
      >
        {mergeProps.magic ? (
          <PhotoProvider>
            <PhotoView src={mergeProps.src}>
              <Tooltip placement="right" TransitionComponent={Zoom} arrow title="点击插入">
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
                    boxShadow: hasHover
                      ? "1vh 2vh 21px rgb(79 79 79)"
                      : "rgb(216 216 216) 1vh 2vh 21px"
                  }}
                  src={mergeProps.src}
                  alt="error"
                />
              </Tooltip>
            </PhotoView>
          </PhotoProvider>
        ) : (
          <Tooltip placement="right" TransitionComponent={Zoom} arrow title="按住Ctrl点击插入">
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
              boxShadow: hasHover
                ? "1vh 2vh 21px rgb(79 79 79)"
                : "rgb(216 216 216) 1vh 2vh 21px"
            }}
            src={mergeProps.src}
            alt="error"
          />
          </Tooltip>
        )}
      </div>
    </>
  )
}

const basicImg = () => {}
// top: -25vh;
// left: 40vh;
// cursor: pointer;
export default _MagicImg
