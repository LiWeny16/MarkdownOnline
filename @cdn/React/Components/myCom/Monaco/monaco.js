import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import allInit from "@Func/Init/allInit";
import { monacoPasteEvent } from "@Func/Events/pasteEvent";
import { triggerConverterEvent } from "@Func/Events/convert";
import { observer } from "mobx-react";
import monacoKeyEvent from "@Func/Events/key/monacoKey";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { monacoSnippets } from "@Func/Monaco/snippets/snippets";
import monacoFormat from "@Func/Monaco/format/format";
import { getDeviceTyByProportion } from "@App/user/userAgent";
import { getSettings, getTheme } from "@App/config/change";
import monacoMouseEvent from "@Func/Events/mouse/monacoMouse";
import monacoClickEvent from "@Func/Events/click/monacoClick";
import monacoResizeHeightEvent from "@Func/Events/resize/monacoResizeHeight";
import monacoScrollEvent from "@Func/Events/scroll/monacoScroll";
import { pollVariables } from "@App/basic/basic";
import monacoDragEvent from "@Func/Events/drag/drag";
const version = "0.45.0";
loader.config({
    paths: {
        vs: `https://${window._cdn.cdn[0]}/npm/monaco-editor@${version}/dev/vs`,
    },
});
const files = {
    "index.py": {
        name: "index.py",
        language: "python",
        value: "",
    },
    "index.js": {
        name: "index.js",
        language: "javascript",
        value: "nihao",
    },
    "index.md": {
        name: "index.md",
        language: "markdown",
        value: "",
    },
};
export default observer(function MonacoEditor() {
    const monacoEditorRef = React.useRef(null);
    const [resizableWidth, setResizableWidth] = React.useState(640);
    const [resizableHeight, setResizableHeight] = React.useState(800);
    const handleResizeStop = () => {
        // mdConverter(true)
        setTimeout(() => {
            setEditorOptions((pre) => {
                return { ...pre, minimap: { enabled: true } };
            });
        }, 300);
    };
    const [editorOptions, setEditorOptions] = useState({
        fontSize: 16, // 设置字体大小
        wordWrap: getSettings().basic.editorAutoWrap ? "on" : "off",
        formatOnType: true,
        formatOnPaste: false,
        // scrollBeyondLastLine:false,
        // scrollBeyondLastColumn:10,
        fontLigatures: true,
        autoSurround: "quotes",
        autoClosingQuotes: "always",
        // automaticLayout: true,
        smoothScrolling: true,
        codeLens: false,
        pasteAs: { enabled: false, showPasteSelector: "never" },
        peekWidgetDefaultFocus: "tree",
        cursorSmoothCaretAnimation: "explicit",
        colorDecorators: true,
        minimap: { enabled: true },
        unicodeHighlight: { nonBasicASCII: false, ambiguousCharacters: false },
        dragAndDrop: true,
        //   lightbulb: {
        //     enabled: true, // 快速修复功能
        //  },
    });
    const [fileName, setFileName] = useState("index.md");
    // let previousValue = window.editor.getValue();
    // window.setFileName = setFileName
    const file = files[fileName];
    // const editorRef = useRef(null)
    function handleOnChange(e) {
        triggerConverterEvent(4);
    }
    function monacoInit(editor, monaco) {
        getDeviceTyByProportion() == "PC"
            ? setResizableWidth(document.getElementById("editor").clientWidth / 2)
            : 1;
        setResizableHeight(document.getElementById("editor").clientHeight);
        monaco.languages.setLanguageConfiguration("markdown", {
            autoClosingPairs: [
                { open: "{", close: "}" },
                { open: "[", close: "]" },
                { open: "(", close: ")" },
                { open: '"', close: '"' },
                { open: "'", close: "'", notIn: ["string", "comment"] },
                { open: "`", close: "`", notIn: ["string", "comment"] },
                { open: "/*", close: "*/", notIn: ["string"] },
                { open: "？", close: "？", notIn: ["string", "comment"] }, // 添加此行，将字符"？"添加到自动关闭字符对中
            ],
        });
        monaco.languages.setMonarchTokensProvider("markdown", {
            tokenizer: {
                root: [
                    [/\b(function|return|var)\b/, "keyword"],
                    [/\|\|/, "string"], // 为 || 设置一个类别
                    [/>>/, "string"], // 为 >> 设置一个类别
                    [/[{}]/, "delimiter"],
                    [/[a-z_$][\w$]*/, "identifier"],
                    [/"[^"]*"/, "string"],
                    [/\d+/, "number"],
                    [/[$$$$]/, "keyword"],
                ],
            },
        });
    }
    function handleBeforeMount() { }
    /**
     * @description do sth. after mounted.
     */
    function handleEditorDidMount(editor, monaco) {
        // editorRef.current = editor
        // 暴露出去
        window.editor = editor;
        window.monaco = monaco;
        /**
         * @description allInit
         */
        pollVariables([
            "markdownitIncrementalDOM",
            "katex",
            "IncrementalDOM",
            "React",
            "ReactDOM",
        ]).then(() => {
            allInit(editor, monaco);
            monacoInit(editor, monaco);
            monacoPasteEvent(editor, monaco);
            monacoKeyEvent(editor, monaco);
            monacoSnippets(editor, monaco);
            // monacoSnippetsDidInsertEvent(editor,monaco)
            monacoFormat(editor, monaco);
            monacoMouseEvent(editor, monaco);
            monacoClickEvent(editor, monaco);
            monacoScrollEvent(editor, monaco);
            monacoDragEvent(editor, monaco);
            // monacoPalette(editor,monaco)
            // monacoKeyDownEvent()
            // errIntellisense()
            // 动态改变编辑器高度
            monacoResizeHeightEvent(setResizableHeight);
        });
    }
    return (_jsx(_Fragment, { children: _jsx("div", { ref: monacoEditorRef, id: "monaco-editor", style: { width: resizableWidth, height: "100%" }, children: _jsx(ResizableBox, { className: "custom-resizable", width: resizableWidth, height: resizableHeight, draggableOpts: { grid: [5, 15] }, minConstraints: [100, resizableHeight], onResizeStop: handleResizeStop, onResize: (e) => {
                    setEditorOptions((pre) => {
                        // pre.minimap=false
                        return { ...pre, minimap: { enabled: false } };
                    });
                    // if (e.x > document.getElementById("editor")!.clientWidth * 0.3) {
                    // @ts-ignore
                    setResizableWidth(e.x);
                    // }
                    // @ts-ignore
                }, 
                // resizeHandles={(e)=>{}}
                // maxConstraints={[1000, 1800]}
                axis: "x", children: _jsx(Editor, { className: "monaco-editor-inner", height: "100%", width: resizableWidth, theme: getTheme() === "light" ? "vs-light" : "vs-dark", path: file.name, 
                    // language="markdown"
                    defaultLanguage: file.language, defaultValue: file.value, onMount: handleEditorDidMount, onChange: handleOnChange, options: editorOptions, beforeMount: handleBeforeMount }) }) }) }));
});
