import { Message, MessageProps } from "@arco-design/web-react"
import kit from "bigonion-kit"

/**
 * @description 使用arco提示
 */
const alertUseArco = (
  msg: string,
  time?: number,
  objConfig?: {
    kind: string
    zIndex?: number
    extraConfig?: Partial<MessageProps>
  }
) => {
  const _zIndex = objConfig?.zIndex ?? 9999
  const _kind = objConfig?.kind ?? "success"
  let arcoAlertEle = document.getElementsByClassName(
    "arco-message-wrapper arco-message-wrapper-top"
  )[0] as HTMLElement
  if (!arcoAlertEle) {
    kit.addStyle(
      `.arco-message-wrapper .arco-message-wrapper-top{z-index:${_zIndex}}`
    )
  } else {
    arcoAlertEle.style.zIndex = String(_zIndex) ?? _zIndex
  }
  // @ts-ignore
  Message[_kind]({
    style: { position: "relative", zIndex: _zIndex },
    content: msg,
    closable: true,
    duration: time ?? 2500,
    position: "top",
    ...objConfig?.extraConfig,
  })
}
export default alertUseArco
