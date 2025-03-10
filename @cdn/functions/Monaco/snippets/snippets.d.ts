import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { type Position } from "monaco-editor/esm/vs/editor/editor.api";
export declare function monacoSnippets(editor: editor.IStandaloneCodeEditor, monaco: Monaco): void;
/**
 * @description 判断是否需要启用LaTex提示
 * @param textUntilPosition string
 */
export declare function isNeedToUseLatexIntellisense(monaco: Monaco, model: editor.ITextModel, textUntilPosition: string, position: Position): boolean;
export declare function isNeedToSuggestImagePath(monaco: Monaco, model: editor.ITextModel, textUntilPosition: string, position: Position): boolean;
export declare function isInLatexBlock(textUntilPosition: string): boolean;
export declare function isInLatexInline(model: editor.ITextModel, position: Position, textUntilPosition: string): boolean;
export declare function isNeedToUseClueIntellisense(textUntilPosition: string): boolean;
export declare function isNeedToUseCodeIntellisense(textUntilPosition: string): boolean;
