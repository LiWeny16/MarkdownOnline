import { Message, MessageProps, Notification } from "@arco-design/web-react"
/**
 * @description 使用arco提示
 */
const noteUseArco = (
  title: string,
  content: string,
  objConfig?: {
    kind?: string
    position?: string
    extraConfig?: Partial<MessageProps>
  }
) => {
  const _kint = objConfig?.kind ?? "success"
  const _position = objConfig?.position ?? "bottomRight"
  // @ts-ignore
  Notification[_kint]({
    title: title,
    content: content,
    position: _position,
  })
}
export default noteUseArco


