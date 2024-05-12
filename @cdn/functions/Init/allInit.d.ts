import markdownIt from "markdown-it";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { ConfigStore, IConfig } from "@Root/js/React/Mobx/Config";
/**
 * @description markdownParser init plugin && settings
 */
export declare function markdownParser(): markdownIt;
/**
 * @description 初始化配置和事件初始化
 * @returns {void}
 */
export default function allInit(editor?: editor.IStandaloneCodeEditor, monaco?: Monaco, handleCloseLoading?: any): void;
export declare const normalMermaidTheme: string[];
export declare const normalMermaidThemeMap: string[];
/**
 * @description 对设置进行初始化
 * @param defaultConfig 默认设置
 */
export declare function configInit(defaultConfig: IConfig): IConfig;
export declare const useConfig: () => ConfigStore;
