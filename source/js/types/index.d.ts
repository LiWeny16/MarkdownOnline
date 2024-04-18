// import { editor } from "monaco-editor";

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

// declare module "@Root/js/functions/aboutBox" {
//   const aboutBox: any
//   export default aboutBox
// }
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
  _speechData: {
    processing: Boolean
    speechResult: string
    speech:any
  }
}

interface HandleDBListFun {
  (List: string): void
}
