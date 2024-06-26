import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
export default function Box(props) {
    let _className = "Box ";
    let _style = {
        display: "flex",
        flexDirection: props.dir ?? "row",
        justifyContent: props.jus ?? "center",
        alignItems: props.ali ?? "center",
        width: props.min == 1 ? "fitContent" : "100%",
        height: props.min == 1 ? "fitContent" : "100%",
        transform: props.move
            ? `translate(${props.move?.x ?? 0}, ${props.move?.y ?? 0})`
            : undefined
    };
    let [mergeProps, _NU_1] = React.useState({
        style: props.style ? { ...props.style, ..._style } : _style,
        className: _className + (props.className ?? ""),
        // 自有属性
        space: props.space ?? undefined,
        order: []
    });
    return (_jsx(_Fragment, { children: _jsx("div", { ...mergeProps, ...props, className: mergeProps.className, style: mergeProps.style, children: props.children }) }));
}
