import React, { useRef, useState } from "react"
import ReactDOM from "react-dom"
import { loader, Monaco } from "@monaco-editor/react"
import Editor from "@monaco-editor/react"
import DraggableBox from "@Com/myCom/DragBox"
import { getMdTextFromMonaco } from "@App/text/getMdText"
import * as monaco from "monaco-editor"
import allInit from "@Func/Init/allInit"
import { monacoPasteEvent } from "@Func/Events/pasteEvent"
import { editor } from "monaco-editor"
import { triggerConverterEvent } from "@Func/Events/convert"
import { transform } from "html2canvas/dist/types/css/property-descriptors/transform"
// loader.config({ monaco });
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
export default function MonacoEditor() {
  const editorOptions = {
    fontSize: 18  // 设置字体大小
  };
  const [fileName, setFileName] = useState("index.md")
  // let previousValue = window.editor.getValue();
  const file = files[fileName]
  // const editorRef = useRef(null)

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    // editorRef.current = editor
    // 暴露出去
    window.editor = editor
    window.monaco = monaco
    monacoPasteEvent()
    allInit()
  }
  return (
    <>
      {/* <DraggableBox> */}
      <div
        style={{ transform: "translateY(1vh)", padding: "10px 0px 0px 0px" }}
        id="monaco-editor"
      >
        <Editor
          height="90vh"
          width="50vw"
          theme="vs-light"
          path={file.name}
          defaultLanguage={file.language}
          defaultValue={file.value}
          onMount={handleEditorDidMount}
          onChange={triggerConverterEvent}
          options={editorOptions}
        />
      </div>
      {/* </DraggableBox> */}
    </>
  )
}
