import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
/**
 * @description 替换选中文本
 * @param e HTMLelement
 * @param leftStr String
 * @param rightStr String
 * @deprecated
 */
declare function replaceSelection(e: any, leftStr: any, rightStr: any): "" | undefined;
/**
 * @description 替换选择的内容
 */
declare function replaceMonacoSelection(newText?: string): void;
/**
 * @description 范围替换文本
 */
declare function replaceMonacoInRange(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, newText: string): void;
/**
 * @description 完全替换内容，不保留历史
 */
declare function replaceMonacoAllForce(editor: editor.IStandaloneCodeEditor, monaco: Monaco, newContent: string): void;
/**
 * @description 替换全部文本，保留历史
 */
declare function replaceMonacoAll(monaco: Monaco, editor: editor.IStandaloneCodeEditor, newContent?: string): void;
export default replaceSelection;
export { replaceMonacoSelection, replaceMonacoInRange, replaceMonacoAllForce, replaceMonacoAll, };
