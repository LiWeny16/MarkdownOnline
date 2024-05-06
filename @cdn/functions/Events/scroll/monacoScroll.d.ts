import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
/**
 * 监听页面高度变化, 自适应设置编辑器高度
 * */
export default function monacoScrollEvent(editor: editor.IStandaloneCodeEditor, monaco: Monaco): void;
/**
 * @description 同步滚动主函数，负责传递editor的line
 */
declare function syncScrollOnce(editor: editor.IStandaloneCodeEditor, monaco?: Monaco): void;
export { syncScrollOnce };
