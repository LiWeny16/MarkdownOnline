// import { editor } from "monaco-editor";
// import ShowSaveFilePicker from "./external/file"
// import { type loadPyodide } from "pyodide"

type EnObjType = {
  enMainConverter: boolean
  enAboutBox: boolean
  enPdfExport: boolean
  enFastKey: boolean
  enScript: boolean
  enHilightJs: boolean
  enClue: boolean
  enDragFile: boolean
  enPasteEvent: boolean
}
declare module "*.svg" {
  const src: any
  export default src
}
declare module "*.esm.js" {
  const marked: any
  export { marked }
}

declare module "*.md?raw" {
  const md: any
  export default md
}

declare module "*.css?raw" {
  const md: any
  export default md
}

declare module "*.less?raw" {
  const md: any
  export default md
}
declare module "*.mjs" {
  const mjs: any
  export default mjs
}
// declare module "markdown-it-incremental-dom" {
//   const a: any
//   export default a
// }
// declare module "kit" {
//   const kit: any
//   export default kit
// }

declare module "katex" {
  const katex: any
  export default katex
}

declare module "*/highlight.min.js" {
  const hljs: any
  export default hljs
}
declare module "dom-to-image" {
  const domtoimg: any
  export default domtoimg
}
declare module "@cdn-emojilib" {
  const emojilib: any
  export default emojilib
}

declare module "@cdn-axios" {
  const axios: any
  export default axios
  export { AxiosResponse, AxiosRequestConfig, Method }
}
declare module "vconsole" {
  const vconsole
  export default vconsole
}

declare module "@cdn-prettier" {
  const prettier
  export default prettier
}
declare module "@cdn-prettier-plugins-markdown" {
  export default parseMd
}

declare module "@cdn-node-emoji" {
  const emoji: any
  export default emoji
  export { emojify, has }
}
declare module "@cdn-marked" {
  const marked: any
  export { marked }
}
declare module "@cdn-mermaid" {
  const mermaid: any
  export default mermaid
}
declare module "@cdn-kit" {
  const kit: any
  export default kit
}

declare module "@cdn-hljs" {
  const hljs: any
  export default hljs
}

declare module "@cdn-katex" {
  const hljs: any
  export default hljs
}

declare module "@cdn-latex-map" {
  const cdnLatexMap: any
  export default cdnLatexMap
  export {
    accents1,
    delimiters0,
    delimeterSizing0,
    greekLetters0,
    otherLetters0,
    annotation1,
    verticalLayout0,
    verticalLayout1,
    verticalLayout2,
    overlap1,
    spacing0,
    spacing1,
    logicAndSetTheory0,
    logicAndSetTheory1,
    macros0,
    bigOperators0,
    binaryOperators0,
    fractions0,
    fractions2,
    binomialCoefficients0,
    binomialCoefficients2,
    mathOperators0,
    mathOperators1,
    sqrt1,
    relations0,
    negatedRelations0,
    arrows0,
    extensibleArrows1,
    braketNotation1,
    classAssignment1,
    color2,
    font0,
    font1,
    size0,
    style0,
    symbolsAndPunctuation0,
    debugging0,
    envs,
  }
}
// declare module "@Root/js/functions/aboutBox" {
//   const aboutBox: any
//   export default aboutBox
// }

declare module "@cdn-indexedDb-lib" {
  const aboutBox: any
  export default aboutBox
  export {
    openDB,
    getDataByIndex,
    cursorGetDataByIndex,
    addData,
    getDataByKey,
    cursorGetData,
    updateDB,
  }
}

declare module "@cdn-emoji-data" {
  const e: any
  export default e
}
declare module "@Root/js/functions/fastKey" {
  const aboutBox: any
  export default aboutBox
}
declare module "*index.js" {
  const allInit: any
  const fillInRemeText: any
  const kit: any
  const enObj: EnObjType
  const mdConverter: any
  const replaceSelection: (e: any, any, any) => string
  const insertTextAtCursor: any
  export {
    allInit,
    fillInRemeText,
    kit,
    enObj,
    mdConverter,
    replaceSelection,
    insertTextAtCursor,
  }
}

declare interface Window {
  clipboardData: any
  editor: any
  monaco: any
  theme: string
  location: any
  deco: any
  katex: any
  mermaid: any
  loadPyodide:any
  _speechData: {
    processing: Boolean
    speechResult: string
    speech: any
  }
  showOpenFilePicker: Promise<FileSystemDirectoryHandle> | any
  showDirectoryPicker: FileSystemDirectoryHandle
  showSaveFilePicker(
    options?: SaveFilePickerOptions
  ): Promise<FileSystemFileHandle>

  _fileHandle: FileSystemFileHandle
  _temp: any
}
interface a extends ShowSaveFilePicker {}
interface HandleDBListFun {
  (List: string): void
}
declare var webkitSpeechRecognition: any
declare var SpeechRecognition: any
