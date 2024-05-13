import React, { useRef, useState } from "react"
import ReactDOM from "react-dom"
import Editor, { loader, Monaco } from "@monaco-editor/react"
// import DraggableBox from "@Com/myCom/DragBox"
// import { getMdTextFromMonaco } from "@App/text/getMdText"
// import * as monaco from "monaco-editor"
import allInit from "@Func/Init/allInit"
import { monacoPasteEvent } from "@Func/Events/pasteEvent"
import { editor } from "monaco-editor"
import { triggerConverterEvent } from "@Func/Events/convert"
// import { transform } from "html2canvas/dist/types/css/property-descriptors/transform"
// loader.config({ monaco });
// import { useTheme } from "@Root/js/React/Mobx/Theme"
import { observer } from "mobx-react"
// import changeTheme from "@App/theme/change"
// import monacoKeyDownEvent from "@Func/Events/key/monacoKey"
import monacoKeyEvent from "@Func/Events/key/monacoKey"
import { ResizableBox } from "react-resizable"
import "react-resizable/css/styles.css"
import { mdConverter } from "@Root/js"
// import DragHandleIcon from "@mui/icons-material/DragHandle"
import { monacoSnippets } from "@Func/Monaco/snippets/snippets"
import monacoFormat from "@Func/Monaco/format/format"
import { getDeviceTyByProportion } from "@App/user/userAgent"
import { getTheme } from "@App/config/change"
import monacoMouseEvent from "@Func/Events/mouse/monacoMouse"
import monacoClickEvent from "@Func/Events/click/monacoClick"
import monacoResizeHeightEvent from "@Func/Events/resize/monacoResizeHeight"
import monacoScrollEvent from "@Func/Events/scroll/monacoScroll"
import { Backdrop, CircularProgress } from "@mui/material"
// import errIntellisense from "@Func/Monaco/intellisense/error"
// import monacoPalette from "@Func/Monaco/palette/palette"
// let ResizableBox = reactResize.ResizableBox
const version = "0.45.0"
const cdnDomain = {
  unpkg: ["npm.onmicrosoft.cn", "unpkg.com"],
  jsDelivr: ["jsd.onmicrosoft.cn", "www.jsdelivr.com", "jsd.haorwen.tk"],
}
const cdnLinks = {
  unpkg: {
    cdn: `https://${cdnDomain.unpkg[0]}/monaco-editor@${version}/dev/vs`,
  },
  jsDelivr: {
    cdn: `https://${cdnDomain.jsDelivr[0]}/npm/monaco-editor@${version}/dev/vs`,
  },
}
try {
  loader.config({
    paths: {
      vs: cdnLinks.unpkg.cdn,
    },
  })
} catch (error) {
  loader.config({
    paths: {
      vs: cdnLinks.jsDelivr.cdn,
    },
  })
}

const files: any = {
  "index.js": {
    name: "index.js",
    language: "javascript",
    value: "nihao",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: "nihao",
  },
  "index.md": {
    name: "index.md",
    language: "markdown",
    value: "",
  },
}

export default observer(function MonacoEditor() {
  const monacoEditorRef = React.useRef(null)
  const [loading, setLoading] = React.useState(true)
  const handleCloseLoading = () => {
    setLoading(false)
  }

  const [resizableWidth, setResizableWidth] = React.useState(640)
  const [resizableHeight, setResizableHeight] = React.useState(800)
  const handleResizeStop = () => {
    mdConverter(true)
    setTimeout(() => {
      setEditorOptions((pre) => {
        return { ...pre, minimap: { enabled: true } }
      })
    }, 300)
  }

  const [editorOptions, setEditorOptions] =
    useState<editor.IStandaloneEditorConstructionOptions>({
      fontSize: 16, // 设置字体大小
      wordWrap: "on",
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
      // dragAndDrop: true,
      //   lightbulb: {
      //     enabled: true, // 快速修复功能
      //  },
    })
  const [fileName, setFileName] = useState("index.md")
  // let previousValue = window.editor.getValue();
  const file = files[fileName]
  // const editorRef = useRef(null)
  function handleOnChange(e: any) {
    triggerConverterEvent(4)
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
  }
  function handleBeforeMount() {}
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
    /**
     * @description allInit
     */
    allInit(editor, monaco, handleCloseLoading)

    monacoInit(editor, monaco)
    monacoPasteEvent(editor, monaco)
    monacoKeyEvent(editor, monaco)
    monacoSnippets(editor, monaco)
    // monacoSnippetsDidInsertEvent(editor,monaco)
    monacoFormat(editor, monaco)
    monacoMouseEvent(editor, monaco)
    monacoClickEvent(editor, monaco)
    monacoScrollEvent(editor, monaco)
    // monacoPalette(editor,monaco)
    // monacoKeyDownEvent()
    // errIntellisense()
    // 动态改变编辑器高度
    monacoResizeHeightEvent(setResizableHeight)
  }
  return (
    <>
      {/* <DraggableBox> */}
      <div
        ref={monacoEditorRef}
        id="monaco-editor"
        style={{ width: resizableWidth, height: "100%" }}
      >
        <ResizableBox
          className="custom-resizable"
          width={resizableWidth}
          height={resizableHeight}
          draggableOpts={{ grid: [5, 15] }}
          minConstraints={[100, resizableHeight]}
          onResizeStop={handleResizeStop}
          onResize={(e) => {
            setEditorOptions((pre) => {
              // pre.minimap=false
              return { ...pre, minimap: { enabled: false } }
            })
            // if (e.x > document.getElementById("editor")!.clientWidth * 0.3) {
            // @ts-ignore
            setResizableWidth(e.x)
            // }
            // @ts-ignore
          }}
          // resizeHandles={(e)=>{}}
          // maxConstraints={[1000, 1800]}
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleCloseLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* <div style={{width:size.width}}>2323</div> */}
      </div>
      {/* </DraggableBox> */}
    </>
  )
})
