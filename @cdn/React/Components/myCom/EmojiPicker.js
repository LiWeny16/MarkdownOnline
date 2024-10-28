import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Backdrop, Box } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { gsap } from "gsap";
import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor";
import { changeEmojiPickerState, getContextMenuClickPosition, } from "@App/config/change";
export default observer(function EmojiPicker(props) {
    const pickerHeight = 435;
    const pickerWidth = 352;
    const _position = handleOverflowPosition();
    const container = React.useRef();
    // const [targetNow, setTargetNow] = React.useState<boolean>(false)
    const [showState, setShowState] = React.useState(false);
    const [delayShowState, setDelayShowState] = React.useState(false);
    function handleOverflowPosition() {
        let _position = getContextMenuClickPosition();
        // console.log(
        //   _position.posy + pickerHeight > window.document.body.clientHeight
        // )
        // 如果超过加起来超过可视范围，则向上翻转
        if (_position.posy + pickerHeight > window.document.body.clientHeight) {
            _position.posy = window.document.body.clientHeight - pickerHeight;
            return _position;
        }
        return _position;
    }
    function handleOnEmojiSelected(e) {
        // @ts-ignore
        insertTextMonacoAtCursor(e.native, true);
    }
    React.useEffect(() => {
        setShowState(props.open);
        if (!props.open) {
            // 关闭
            gsap.to(".emojiPicker", {
                // x: "0",
                // y: "+=-40",
                opacity: 0,
                duration: 0.4,
                onComplete: function () {
                    setDelayShowState(showState);
                    // this.targets()[0].style.display = "none" // make it not to occupy space after animation completes
                },
            });
        }
        else {
            // console.log(getEmojiPickerState());
            setDelayShowState(props.open);
            // container.current.style.display = "block"
            gsap.fromTo(".emojiPicker", { x: 0 }, {
                x: 20,
                opacity: 1,
                duration: 0.6,
            });
        }
        // let emojiDomNode = document.querySelector("em-emoji-picker") as HTMLElement
        // emojiDomNode.style.transition = "1s"
    }, [props.open]);
    return (_jsx(_Fragment, { children: _jsx(Backdrop, { invisible: true, ref: container, transitionDuration: { appear: 500, enter: 500, exit: 1000 }, 
            // TransitionComponent={Zoom}
            sx: {
                // color: "transparent",
                // transition:"none",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                // @important 这里非常重要，因为过场动画的缘故需要背景板持续展示，但是又不希望阻止用户点击
                pointerEvents: showState ? "" : "none",
            }, open: showState, onContextMenu: (e) => {
                // @ts-ignore
                if (e.target.tagName != "EM-EMOJI-PICKER") {
                    changeEmojiPickerState("off");
                    e.preventDefault();
                }
            }, onMouseUp: (e) => {
                if (e.button == 2) {
                }
                else if (e.button == 0) {
                    // @ts-ignore
                    if (e.target.tagName != "EM-EMOJI-PICKER") {
                        changeEmojiPickerState("off");
                    }
                }
            }, children: _jsx(Box, { sx: {
                    position: "absolute",
                    top: _position.posy - window.document.body.clientHeight * 0.1,
                    left: _position.posx + window.document.body.clientWidth * 0.02,
                }, className: "MIN emojiPicker", children: _jsx(Picker, { data: data, onEmojiSelect: handleOnEmojiSelected }) }) }) }));
});
