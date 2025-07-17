// import { Message, MessageProps, Notification } from "@arco-design/web-react"
import noteUseMui from "./note-mui"
/**
 * @description 使用arco提示
 */
const noteUseArco = (
  title: string,
  content: string,
  objConfig?: {
    kind?: string
    position?: string
    extraConfig?: any
  }
) => {
  // const _kint = objConfig?.kind ?? "success"
  // const _position = objConfig?.position ?? "bottomRight"
  // // @ts-ignore
  // Notification[_kint]({
  //   title: title,
  //   content: content,
  //   position: _position,
  // })
  noteUseMui(title, content, objConfig)
}
export default noteUseArco


