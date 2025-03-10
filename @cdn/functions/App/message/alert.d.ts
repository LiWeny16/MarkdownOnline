import { MessageProps } from "@arco-design/web-react";
/**
 * @description 使用arco提示
 */
declare const alertUseArco: (msg: string, time?: number, objConfig?: {
    kind: string;
    zIndex?: number;
    extraConfig?: Partial<MessageProps>;
}) => void;
export default alertUseArco;
