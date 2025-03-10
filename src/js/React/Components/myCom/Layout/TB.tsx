import React from "react"

export default function TB(props: LayoutOptions) {
  //   children内容长度
  const childrenNum = React.Children.toArray(props.children).length

  let _className = "TB "
  let _style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: props.jus ?? "center",
    alignItems: props.ali ?? "center",
    width: "100%",
    height: "100%",
    // marginBottom: "20px"
  }

  // 合并props
  let [mergeProps, _NU_1] = React.useState<LayoutOptions>({
    style: props.style ? { ...props.style, ..._style } : _style,
    className: _className + (props.className ?? ""),
    // 自有属性
    space: props.space ?? undefined,
    order: props.order ?? [],
    margin: props.margin ?? "",
  })

  // 循环盒子样式
  let [bothStyle, setBothStyle] = React.useState<React.CSSProperties>({
    marginTop: "5px",
    width: "100%",
    height: "100%",
    margin: mergeProps.margin,
  })

  return (
    <>
      <div
        {...mergeProps}
        {...props}
        className={mergeProps.className}
        style={mergeProps.style}
      >
        {React.Children.map(props.children, (children, index) => {
          if (index == childrenNum - 1) {
            // 最后一轮
            return (
              <div
                style={{
                  ...bothStyle,
                  order: `${mergeProps.order![index]}`,
                  flex: mergeProps.space ? "auto" : undefined,
                }}
              >
                {children}
              </div>
            )
          }
          return (
            <div
              style={{
                ...bothStyle,
                order: `${mergeProps.order![index]}`,
                flex: `0 0 ${
                  mergeProps.space ? mergeProps.space[index] : undefined
                }%`,
              }}
            >
              {children}
            </div>
          )
        })}
        {/* {console.log(props.children)} */}
      </div>
    </>
  )
}
