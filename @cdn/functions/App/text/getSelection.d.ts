import { editor } from "monaco-editor";
/**
 * @description 获取选中的文本
*/
export default function getSelectionText(editor?: editor.IStandaloneCodeEditor): string;
/**
 * @description 判断selection是否为空
*/
export declare function selectionIsNull(editor?: editor.IStandaloneCodeEditor): boolean;
