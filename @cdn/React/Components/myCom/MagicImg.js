import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import { writeClipboard } from "@App/text/clipboard";
// 必须要转换forwarRef 不然MUI不接收
const _MagicImg = React.forwardRef(MagicImg);
function MagicImg(props, ref) {
    let _className = "FLEX JUS-CENTER ";
    let _style = { width: "fitContent" };
    const [hasHover, setHasHover] = React.useState(false);
    function handleOnClick(e) {
        if (e.altKey) {
            writeClipboard(`![我是图片](/vf/${props.uuid})`);
        }
        if (e.ctrlKey) {
            insertTextMonacoAtCursor(`![我是图片](/vf/${props.uuid})`, true);
        }
    }
    let [mergeProps, _NU] = React.useState({
        src: props.src,
        uuid: props.uuid,
        magic: props.magic == 0 ? false : true,
        className: _className + (props.className ?? ""),
        style: props.style ? { ...props.style, ..._style } : _style,
    });
    function basicImg() {
        return (_jsx(_Fragment, { children: _jsx("img", { onMouseEnter: () => {
                    setHasHover(true);
                }, onMouseLeave: () => {
                    setHasHover(false);
                }, style: {
                    width: "70%",
                    transition: " 0.2s ease-in-out",
                    borderRadius: "5px",
                    transform: hasHover ? "translate(0px, -1vh)" : "",
                    boxShadow: hasHover
                        ? "1vh 2vh 21px rgb(79 79 79)"
                        : "rgb(216 216 216) 1vh 2vh 21px",
                }, src: mergeProps.src, alt: "error" }) }));
    }
    return (_jsx(_Fragment, { children: _jsx("div", { ...mergeProps, ...props, ref: ref, className: mergeProps.className, style: mergeProps.style, children: _jsx(Tooltip, { placement: "right", TransitionComponent: Zoom, arrow: true, title: "\u6309\u4F4FCtrl\u70B9\u51FB\u63D2\u5165", children: _jsx("img", { onMouseEnter: () => {
                        setHasHover(true);
                    }, onMouseLeave: () => {
                        setHasHover(false);
                    }, onClick: (e) => {
                        handleOnClick(e);
                    }, style: {
                        width: "70%",
                        transition: " 0.2s ease-in-out",
                        borderRadius: "5px",
                        transform: hasHover ? "translate(0px, -2px)" : "",
                        boxShadow: hasHover
                            ? "1vh 2vh 21px rgb(79 79 79)"
                            : "rgb(216 216 216) 1vh 2vh 21px",
                    }, src: mergeProps.src, alt: "error" }) }) }) }));
}
const basicImg = () => { };
// top: -25vh;
// left: 40vh;
// cursor: pointer;
export default _MagicImg;
