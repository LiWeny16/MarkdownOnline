import { editor } from "monaco-editor";
/**
 * @description 替换选中文本
 * @param e HTMLelement
 * @param leftStr String
 * @param rightStr String
 * @deprecated
 */
export default function replaceSelection(e: any, leftStr: any, rightStr: any): "" | undefined;
/**
 * @description 替换选择的内容
 */
export declare function replaceMonacoSelection(newText?: string): void;
/**
 * @description 范围替换文本
*/
export declare function replaceMonacoInRange(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, newText: string): void;
export declare function replaceMonacoAll(model: editor.ITextModel, editor: editor.IStandaloneCodeEditor, newText?: string): void;
