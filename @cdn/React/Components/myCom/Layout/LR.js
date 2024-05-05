import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
export default function LR(props) {
    //   children内容长度
    const childrenNum = React.Children.toArray(props.children).length;
    let _className = "LR ";
    let _style = {
        display: "flex",
        flexDirection: "row",
        justifyContent: props.jus ?? "center",
        alignItems: props.ali ?? "center",
        width: "100%",
        height: "100%"
        // marginBottom: "20px"
    };
    // 合并props
    let [mergeProps, _NU_1] = React.useState({
        style: props.style ? { ...props.style, ..._style } : _style,
        className: _className + (props.className ?? ""),
        // 自有属性
        space: props.space ?? undefined,
        order: []
    });
    // 循环盒子样式
    let [bothStyle, setBothStyle] = React.useState({
        marginRight: "5px",
        width: "100%",
        height: "100%",
    });
    return (_jsx(_Fragment, { children: _jsx("div", { ...mergeProps, ...props, className: mergeProps.className, style: mergeProps.style, children: React.Children.map(props.children, (children, index) => {
                if (index == childrenNum - 1) {
                    // 最后一轮
                    return (_jsx("div", { style: {
                            ...bothStyle,
                            flex: mergeProps.space ? "auto" : undefined
                        }, children: children }));
                }
                return (_jsx("div", { style: {
                        ...bothStyle,
                        order: `${mergeProps.order[index]}`,
                        flex: `0 0 ${mergeProps.space ? mergeProps.space[index] : undefined}%`
                    }, children: children }));
            }) }) }));
}
