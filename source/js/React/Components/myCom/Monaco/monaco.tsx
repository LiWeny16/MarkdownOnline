import React, { useRef, useState } from "react"
import ReactDOM from "react-dom"
import { loader, Monaco } from "@monaco-editor/react"
import Editor from "@monaco-editor/react"
import DraggableBox from "@Com/myCom/DragBox"
import { getMdTextFromMonaco } from "@App/text/getMdText"
// import * as monaco from "monaco-editor"
import allInit from "@Func/Init/allInit"
import { monacoPasteEvent } from "@Func/Events/pasteEvent"
import { editor } from "monaco-editor"
import { triggerConverterEvent } from "@Func/Events/convert"
// import { transform } from "html2canvas/dist/types/css/property-descriptors/transform"
// loader.config({ monaco });
import { useTheme } from "@Root/js/React/Mobx/Theme"
import { observer } from "mobx-react"
import changeTheme from "@App/theme/change"
import monacoKeyDownEvent from "@Func/Events/key/monacoKey"
import monacoKeyEvent from "@Func/Events/key/monacoKey"
loader.config({
  paths: {
    vs: "https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/monaco-editor/0.33.0-dev.20220228/min/vs/",
  },
})

const files: any = {
  "script.js": {
    name: "script.js",
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
  let theme = useTheme().themeState
  const editorOptions = {
    fontSize: 16, // 设置字体大小
  }
  const [fileName, setFileName] = useState("index.md")
  // let previousValue = window.editor.getValue();
  const file = files[fileName]
  // const editorRef = useRef(null)
  function handleOnChange() {
    triggerConverterEvent(4)
  }
  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    // editorRef.current = editor
    // 暴露出去
    window.editor = editor
    window.monaco = monaco
    monacoPasteEvent()
    monacoKeyEvent()
    // monacoKeyDownEvent()
    allInit()
 
  }
  return (
    <>
      {/* <DraggableBox> */}
      <div id="monaco-editor">
        {/* <button
          onClick={() => {
            changeTheme()
          }}
        >
          change theme
        </button> */}
        <Editor
          className="monaco-editor-inner"
          height="90vh"
          width="50vw"
          theme={theme == "light" ? "vs-light" : "vs-dark"}
          path={file.name}
          // language="markdown"
          defaultLanguage={file.language}
          defaultValue={file.value}
          onMount={handleEditorDidMount}
          onChange={handleOnChange}
          options={editorOptions}
        />
      </div>
      {/* </DraggableBox> */}
    </>
  )
})
