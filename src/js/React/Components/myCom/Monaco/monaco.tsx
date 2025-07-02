import React, { useRef, useState } from "react"
import ReactDOM from "react-dom"
import Editor, { loader, Monaco } from "@monaco-editor/react"
import allInit, { waitForVariable } from "@Func/Init/allInit"
import { monacoPasteEvent } from "@Func/Events/pasteEvent"
import { editor } from "monaco-editor"
import { triggerConverterEvent } from "@Func/Events/convert"
import { observer } from "mobx-react"
import monacoKeyEvent from "@Func/Events/key/monacoKey"
import { ResizableBox, ResizeCallbackData } from "react-resizable"
import "react-resizable/css/styles.css"
import { monacoSnippets } from "@Func/Monaco/snippets/snippets"
import monacoFormat from "@Func/Monaco/format/format"
import { getDeviceTyByProportion } from "@App/user/userAgent"
import { getSettings, getStates, getTheme } from "@App/config/change"
import monacoMouseEvent from "@Func/Events/mouse/monacoMouse"
import monacoClickEvent from "@Func/Events/click/monacoClick"
import monacoResizeHeightEvent from "@Func/Events/resize/monacoResizeHeight"
import monacoScrollEvent from "@Func/Events/scroll/monacoScroll"
import { pollVariables } from "@App/basic/basic"
import monacoDragEvent from "@Func/Events/drag/drag"
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { Backdrop, debounce } from "@mui/material"
import { isCurrentlyWritingToMonaco, handleMonacoContentChange } from "@App/text/tableEditor"
const version = "0.45.0"
loader.config({
  paths: {
    vs: `https://${window._cdn.cdn[0]}/npm/monaco-editor@0.45.0/min/vs`,
  },
  // @ts-ignore
  'vs/editor/editor.main': `https://${window._cdn.cdn[0]}/npm/monaco-editor@0.45.0/min/vs/editor/editor.main.js`,
});
loader.init().then((monaco) => {
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === "html") {
        return `https://${window._cdn.cdn[0]}/npm/monaco-editor@0.45.0/min/vs/language/html/html.worker.js`;
      }
      if (label === "typescript" || label === "javascript") {
        return `https://${window._cdn.cdn[0]}/npm/monaco-editor@0.45.0/min/vs/language/typescript/ts.worker.js`;
      }
      return `https://${window._cdn.cdn[0]}/npm/monaco-editor@0.45.0/min/vs/editor/editor.worker.js`;
    },
  };
});


const files: any = {
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
}

const MonacoEditor = observer(function MonacoEditor({
  setMarkdownViewerWidth,
}: any) {
  const monacoEditorRef = React.useRef(null)
  const [fileName, setFileName] = useState("index.md")
  const file = files[fileName]
  const [resizableWidth, setResizableWidth] = React.useState(640)
  const [resizableHeight, setResizableHeight] = React.useState(800)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [editorOptions, setEditorOptions] =
    useState<editor.IStandaloneEditorConstructionOptions>({
      fontSize: 16, // 设置字体大小
      wordWrap: getSettings().basic.editorAutoWrap ? "on" : "off",
      formatOnType: true,
      formatOnPaste: false,
      stickyScroll: {
        enabled: true,
        defaultModel: 'outlineModel', 
        maxLineCount: 5
      },
      // scrollBeyondLastLine:false,
      // scrollBeyondLastColumn:10,
      quickSuggestions: true, // 禁用快速建议
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
    })
  // 禁用选择样式
  const disableTextSelection = () => {
    document.body.style.userSelect = "none" // 禁用文本选择
    document.body.style.cursor = "col-resize" // 更改光标样式
  }

  // 恢复选择样式
  const enableTextSelection = () => {
    document.body.style.userSelect = "auto" // 恢复文本选择
    document.body.style.cursor = "default" // 恢复光标样式
  }
  const handleOnChange = (e: any) => {
    // triggerConverterEvent(4) // 注释掉，避免与onDidChangeModelContent重复触发
  }
  const handleResizeStart = () => {
    setOpenBackdrop(true) // 开始拖拽时显示遮罩
    disableTextSelection()
      ; (
        document.getElementsByClassName(
          "react-resizable-handle"
        )[0] as HTMLElement
      ).style.backgroundColor = "#90caf9"
  }
  const handleResizeStop = () => {
    setOpenBackdrop(false)
    enableTextSelection()
      ; (
        document.getElementsByClassName(
          "react-resizable-handle"
        )[0] as HTMLElement
      ).style.backgroundColor = ""
    setTimeout(() => {
      setEditorOptions((pre) => {
        return { ...pre, minimap: { enabled: true } }
      })
    }, 300)
  }
  const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const pdfDivs = document.getElementsByClassName("pdf-preview")
    const editor = document.getElementById("editor") as HTMLElement
    const newWidth = editor.clientWidth - data.size.width - 20 + "px"

    // 遍历每一个具有 pdf-preview 类的元素并设置新宽度
    Array.from(pdfDivs).forEach((pdfDiv) => {
      ; (pdfDiv as HTMLElement).style.width = newWidth
    })

    setEditorOptions((pre) => {
      return { ...pre, minimap: { enabled: false } }
    })
    // @ts-ignore
    setResizableWidth(e.x)
  }
  function monacoInit(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    getDeviceTyByProportion() == "PC"
      ? setResizableWidth(document.getElementById("editor")!.clientWidth / 2)
      : 1
    setResizableHeight(document.getElementById("editor")!.clientHeight)
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
    })
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
    })
    monaco.languages.registerFoldingRangeProvider('markdown', {
      provideFoldingRanges(model, context, token) {
        const lineCount = model.getLineCount();
        const headings: { level: number, line: number }[] = [];
        let inCodeBlock = false;  // 是否在代码块内

        // 1. 遍历文档，查找标题并忽略代码块内的 #
        for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
          const lineContent = model.getLineContent(lineNumber).trim();

          // 检测代码块开始/结束
          if (/^```/.test(lineContent)) {
            inCodeBlock = !inCodeBlock; // 切换代码块状态
            continue; // 跳过代码块行
          }

          if (!inCodeBlock) { // 只有在代码块外才处理标题
            const match = /^(#{1,6})\s+/.exec(lineContent);
            if (match) {
              const level = match[1].length; // 获取标题级别
              headings.push({ level, line: lineNumber });
            }
          }
        }

        // 2. 计算折叠区域
        const ranges = [];
        for (let i = 0; i < headings.length; i++) {
          const { level, line: startLine } = headings[i];
          let endLine = lineCount;  // 默认折叠到文档末尾

          for (let j = i + 1; j < headings.length; j++) {
            if (headings[j].level <= level) {
              endLine = headings[j].line - 1;
              break;
            }
          }

          // 处理空行，避免露出多余空行
          while (endLine > startLine && model.getLineContent(endLine).trim() === '') {
            endLine--;
          }

          if (endLine > startLine) {
            ranges.push({ start: startLine, end: endLine });
          }
        }
        return ranges;
      }
    });

  }
  function handleBeforeMount() { }
  /**
   * @description do sth. after mounted.
   */
  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    // editorRef.current = editor
    // 暴露出去
    window.editor = editor
    window.monaco = monaco
    
    // 添加内容变化监听器，用于左右同步 - 使用新的同步机制
    editor.onDidChangeModelContent((event) => {
      // 检查是否正在写入Monaco，避免循环触发
      if (isCurrentlyWritingToMonaco()) {
        console.log('跳过变化事件 - 正在写入Monaco');
        return;
      }
      
      console.log('Monaco内容变化，准备触发同步');
      
      // 防抖处理，避免过于频繁的更新
      const debounceSync = debounce(() => {
        console.log('执行Monaco内容变化同步');
        
        // 🚀 新的双向同步机制：
        // 1. 处理表格数据变化同步（Monaco → React）
        handleMonacoContentChange();
        
        // 2. 触发markdown解析和其他组件更新
        triggerConverterEvent(2);
      }, 150); // 增加延迟到150ms，确保表格同步完成后再进行全局更新
      
      debounceSync();
    });
    
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
      allInit(editor, monaco)
      monacoInit(editor, monaco)
      monacoPasteEvent(editor, monaco)
      monacoKeyEvent(editor, monaco)
      monacoSnippets(editor, monaco)
      // monacoSnippetsDidInsertEvent(editor,monaco)
      monacoFormat(editor, monaco)
      monacoMouseEvent(editor, monaco)
      monacoClickEvent(editor, monaco)
      monacoScrollEvent(editor, monaco)
      monacoDragEvent(editor, monaco)
      // monacoPalette(editor,monaco)
      // monacoKeyDownEvent()
      // errIntellisense()
      // 动态改变编辑器高度
      monacoResizeHeightEvent(setResizableHeight)
    })
  }
  React.useEffect(() => {
    // const resizeObserver = new ResizeObserver((entries) => {
    //   for (let entry of entries) {
    //     const { width, height } = entry.contentRect
    //     setResizableWidth(width)
    //     setResizableHeight(height)
    //   }
    // })

    // if (monacoEditorRef.current) {
    //   resizeObserver.observe(monacoEditorRef.current)
    // }

    // return () => {
    //   if (monacoEditorRef.current) {
    //     resizeObserver.unobserve(monacoEditorRef.current)
    //   }
    // }
  }, [])

  return (
    <>
      <div
        ref={monacoEditorRef}
        id="monaco-editor"
        style={{ width: resizableWidth, height: "100%" }}
      >
        <Backdrop
          sx={{ backgroundColor: "transparent", color: "#fff", zIndex: 9999 }}
          open={openBackdrop}
        />
        <ResizableBox
          className="custom-resizable"
          width={resizableWidth}
          height={resizableHeight}
          draggableOpts={{ grid: [2, 5] }}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          onResize={handleResize}
          axis="x"
        >
          <Editor
            className="monaco-editor-inner"
            height="100%"
            width={resizableWidth}
            theme={getTheme() === "light" ? "vs-light" : "vs-dark"}
            path={file.name}
            // language="markdown"
            defaultLanguage={file.language}
            defaultValue={file.value}
            onMount={handleEditorDidMount}
            onChange={handleOnChange}
            options={editorOptions}
            beforeMount={handleBeforeMount}
          />
        </ResizableBox>
      </div>
    </>
  )
})
export default MonacoEditor
