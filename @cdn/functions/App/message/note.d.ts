import { MessageProps } from "@arco-design/web-react";
/**
 * @description 使用arco提示
 */
declare const noteUseArco: (title: string, content: string, objConfig?: {
    kind?: string;
    position?: string;
    extraConfig?: Partial<MessageProps>;
}) => void;
export default noteUseArco;
