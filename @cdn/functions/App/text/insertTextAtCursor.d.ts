import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/react";
/**
 * @description 插入文本
 */
export default function insertTextAtCursor(textElement: any, textToInsert: any): void;
export declare function insertTextMonacoAtCursor(textToInsert: string, forceMove: boolean, editor?: editor.IStandaloneCodeEditor, monaco?: Monaco): void;
export declare function insertQuotationInMonaco(editor?: editor.IStandaloneCodeEditor): void;
