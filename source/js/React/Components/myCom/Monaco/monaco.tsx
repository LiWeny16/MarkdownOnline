import React, { useRef, useState } from "react"
import ReactDOM from "react-dom"
import Editor, { loader, Monaco } from "@monaco-editor/react"
import DraggableBox from "@Com/myCom/DragBox"
import { getMdTextFromMonaco } from "@App/text/getMdText"
// import * as monaco from "monaco-editor"
import allInit from "@Func/Init/allInit"
import {
  monacoPasteEvent,
  monacoPasteEventNative,
} from "@Func/Events/pasteEvent"
import { editor } from "monaco-editor"
import { triggerConverterEvent } from "@Func/Events/convert"
// import { transform } from "html2canvas/dist/types/css/property-descriptors/transform"
// loader.config({ monaco });
import { useTheme } from "@Root/js/React/Mobx/Theme"
import { observer } from "mobx-react"
import changeTheme from "@App/theme/change"
import monacoKeyDownEvent from "@Func/Events/key/monacoKey"
import monacoKeyEvent from "@Func/Events/key/monacoKey"
import { ResizableBox } from "react-resizable"
import "react-resizable/css/styles.css"
import { mdConverter } from "@Root/js"
import DragHandleIcon from "@mui/icons-material/DragHandle"
import { monacoSnippets } from "@Func/Monaco/snippets/snippets"
import monacoFormat from "@Func/Monaco/format/format"
import errIntellisense from "@Func/Monaco/intellisense/error"
// import monacoPalette from "@Func/Monaco/palette/palette"
loader.config({
  paths: {
    vs: "https://jsd.onmicrosoft.cn/npm/monaco-editor@0.33.0/dev/vs",
  },
})

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
  const [resizableWidth, setResizableWidth] = React.useState(640)
  const handleResizeStop = () => {
    mdConverter()
  }

  let theme = useTheme().themeState
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize: 16, // 设置字体大小
    wordBreak: "keepAll",
    formatOnType: true,
    formatOnPaste: true,
    autoSurround: "quotes",
    autoClosingQuotes: "always",
    automaticLayout: true,
    smoothScrolling: true,
    codeLens: false,
    pasteAs: { enabled: false },
    cursorSmoothCaretAnimation: "explicit",
    //   lightbulb: {
    //     enabled: true, // 快速修复功能
    //  },
  }
  const [fileName, setFileName] = useState("index.md")
  // let previousValue = window.editor.getValue();
  const file = files[fileName]
  // const editorRef = useRef(null)
  function handleOnChange(e: any) {
    triggerConverterEvent(4)
  }
  function handleBeforeMount() {
    // monacoPasteEvent()
  }
  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    // editorRef.current = editor
    // 暴露出去
    window.editor = editor
    window.monaco = monaco
    setResizableWidth(document.getElementById("editor")!.clientWidth / 2)
    // monacoPasteEventNative(editor, monaco)
    monacoPasteEvent()
    monacoKeyEvent(editor, monaco)
    monacoSnippets(editor, monaco)
    monacoFormat(editor, monaco)
    // monacoPalette(editor,monaco)
    // monacoKeyDownEvent()
    allInit()
    // errIntellisense()

  }
  return (
    <>
      {/* <DraggableBox> */}
      <div id="monaco-editor">
        <ResizableBox
          className="custom-resizable"
          //   handle={
          //  <MyHandle />
          //   }
          width={resizableWidth}
          height={700}
          draggableOpts={{ grid: [5, 15] }}
          minConstraints={[100, 1800]}
          onResizeStop={handleResizeStop}
          // maxConstraints={[3000, 1800]}
          axis="x"
        >
          <Editor
            className="monaco-editor-inner"
            height="100vh"
            width="100%"
            theme={theme == "light" ? "vs-light" : "vs-dark"}
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
        {/* <div style={{width:size.width}}>2323</div> */}
      </div>
      {/* </DraggableBox> */}
    </>
  )
})
