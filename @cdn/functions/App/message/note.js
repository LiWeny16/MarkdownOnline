import { Notification } from "@arco-design/web-react";
/**
 * @description 使用arco提示
 */
const noteUseArco = (title, content, objConfig) => {
    const _kint = objConfig?.kind ?? "success";
    const _position = objConfig?.position ?? "bottomRight";
    // @ts-ignore
    Notification[_kint]({
        title: title,
        content: content,
        position: _position,
    });
};
export default noteUseArco;
