import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
export declare function monacoSnippets(editor: editor.IStandaloneCodeEditor, monaco: Monaco): void;
/**
 * @description 判断是否需要启用LaTex提示
 * @param textUntilPosition string
 */
export declare function isNeedToUseLatexIntellisense(textUntilPosition: string): boolean;
export declare function isInLatexBlock(textUntilPosition: string): boolean;
export declare function isNeedToUseClueIntellisense(textUntilPosition: string): boolean;
