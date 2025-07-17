/**
 * @description 使用arco提示
 */
declare const alertUseArco: (msg: string, time?: number, objConfig?: {
    kind: string;
    zIndex?: number;
    extraConfig?: any;
}) => void;
export default alertUseArco;
