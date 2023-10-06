import React from "react"

export default function Box(props: LayoutOptions) {
  let _className = "Box "
  let _style: React.CSSProperties = {
    display: "flex",
    flexDirection: props.dir ?? "row",
    justifyContent: props.jus ?? "center",
    alignItems: props.ali ?? "center",
    width: props.min == 1 ? "fitContent" : "100%",
    height: props.min == 1 ? "fitContent" : "100%",
    transform: props.move
      ? `translate(${props.move?.x ?? 0}, ${props.move?.y ?? 0})`
      : undefined
  }
  let [mergeProps, _NU_1] = React.useState<LayoutOptions>({
    style: props.style ? { ...props.style, ..._style } : _style,
    className: _className + (props.className ?? ""),
    // 自有属性
    space: props.space ?? undefined,
    order: []
  })

  return (
    <>
      <div
        {...mergeProps}
        {...props}
        className={mergeProps.className}
        style={mergeProps.style}
      >
        {props.children}
      </div>
    </>
  )
}
