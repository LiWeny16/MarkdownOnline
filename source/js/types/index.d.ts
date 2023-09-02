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
declare module "*.mjs" {
  const mjs: any
  export default mjs
}
declare module "kit" {
  const kit: any
  export default kit
}

declare module "@App/myPrint" {
  const myPrint :any
  export default myPrint
}

declare module "@Root/js/functions/aboutBox" {
  const aboutBox :any
  export default aboutBox
}
declare module "*index.js" {
  const allInit: any
  const fillInRemeText: any
  const kit: any
  const enObj: any
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
    insertTextAtCursor
  }
}

declare interface Window {
  clipboardData: any
}

interface Window {
  theme: string
  location:any
}
