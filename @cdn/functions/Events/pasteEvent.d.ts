import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
/**
 * @description handle native event
 */
export declare function monacoPasteEventNative(editor: editor.IStandaloneCodeEditor, monaco: Monaco): void;
/**
 * @description monaco粘贴事件处理
 * @author bigonion
 * @param editor
 * @param monaco
 */
export declare function monacoPasteEvent(editor: editor.IStandaloneCodeEditor, monaco: Monaco): void;
