import hljs from "@cdn-hljs"
import { marked } from "@cdn-marked"
// import { marked } from "marked"
import mermaid from "mermaid"

// import mermaid from "mermaid"
import blankTextInit from "./blankTextInit"
import { enObj, mdConverter } from "@Root/js"
import markdownIt from "markdown-it"
// import Token from "https://jsd.onmicrosoft.cn/npm/markdown-it@14.0.0/lib/token.mjs"
// @ts-ignore
import MarkdownItIncrementalDOM from "markdown-it-incremental-dom"
import mdItMultimdTable from "markdown-it-multimd-table"
import * as IncrementalDOM from "incremental-dom"
// @ts-ignore
import markdownItGithubToc from "markdown-it-github-toc"
// @ts-ignore
import { full as markdownItEmoji } from "markdown-it-emoji"
// console.log(markdownItGithubToc);
// import markdownItGithubToc from "markdown-it-github-toc"
import { Notification } from "@arco-design/web-react"
import kit from "@cdn-kit"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import {
  markItExtension,
  importUrlExtension,
  newRenderer,
  imgExtension,
  emojiExtension,
} from "@Func/Parser/renderer"
// import { changeTheme } from "@App/config/change"
import operateLocalStorage from "@App/localStorage/localStorage"
import {
  ConfigStore,
  IConfig,
  NormalConfigArr,
} from "@Root/js/React/Mobx/Config"
import { markdownitLineNumber } from "@Func/Parser/mdItPlugin/lineNumber"
import markdownitFootNote from "markdown-it-footnote"
import { myPlugin } from "@Func/Parser/mdItPlugin/alertBlock"
import { imagePlugin } from "@Func/Parser/mdItPlugin/image"
import { codePlugin } from "@Func/Parser/mdItPlugin/code"
import { cluePlugin } from "@Func/Parser/mdItPlugin/clueParser"
import preViewClickEvent from "@Func/Events/click/preClick"
import markdownItLatex from "@Func/Parser/mdItPlugin/latex"
// @ts-ignore
// import markdownItCodeCopy from "markdown-it-code-copy"

/**
 * @description markdownParser init plugin && settings
 */
export function markdownParser() {
  let markdownItParser = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  })
    .use(markdownitLineNumber)
    .use(myPlugin)
    .use(imagePlugin)
    .use(mdItMultimdTable, {
      multiline: true,
      rowspan: true,
      headerless: true,
      multibody: true,
      aotolabel: true,
    })
    .use(codePlugin)
    .use(cluePlugin)
    .use(markdownitFootNote)
    .use(markdownItGithubToc, {
      anchorLinkSymbol: "",
    })
    .use(MarkdownItIncrementalDOM, IncrementalDOM)
    .use(markdownItEmoji)
    .use(markdownItLatex)
  // .use(markdownItCodeCopy)
  // .use(figure)

  return markdownItParser
}

/**
 * @description other libs init
 */
class settingsClass {
  constructor() {}
  markedInit() {
    marked.use(
      {
        mangle: false,
        headerIds: false,
        strict: false,
        extensions: [],
        async: true,
        lineNumber: true,
      },
      importUrlExtension,
      imgExtension,
      markItExtension,
      emojiExtension
    )

    // marked.use({ renderer })
  }
  mermaidInit() {
    mermaid.parseError = (e) => {}
    mermaid.initialize({
      // er:()=>{},
      securityLevel: "loose",
      logLevel: 4,
      startOnLoad: false,
      theme: "base",
      // gantt: { topPadding:0 , useMaxWidth: false},
      // darkMode:true
    })
    mermaid.mermaidAPI.initialize({ startOnLoad: false })
  }
  hljsInit() {
    hljs.configure({
      ignoreUnescapedHTML: true,
    })
    // hljs.registerLanguage('mermaid', window.hljsDefineMermaid);
  }
  settingsAllInit() {
    this.markedInit()
    this.mermaidInit()
    this.hljsInit()
  }
  static newSettings() {
    return new this()
  }
}

/**
 * @description 初始化配置和事件初始化
 * @returns {void}
 */
export default function allInit(
  editor: editor.IStandaloneCodeEditor = window.editor,
  monaco: Monaco = window.monaco
): void {
  /**@description Settings Init*/
  const settings = new settingsClass()
  settings.settingsAllInit()

  /**@description Input Area Init*/
  blankTextInit().then(() => {
    mdConverter()
  }) //初始化输入区域
  Notification.success({
    title: "已更新到最新版本",
    content: `当前版本:v2.0.0`,
    position: "bottomRight",
  })
  kit.sleep(250).then(() => {
    Notification.info({
      title: "版本新增特性",
      content: `1. 更新引擎为markdown-it 2. 更新双击右侧定位`,
      position: "bottomRight",
    })
    kit.sleep(250).then(() => {
      Notification.info({
        title: "版本新增特性",
        content: `3. 更新TOC、脚注 4. 局部diff渲染`,
        position: "bottomRight",
      })
    })
  })

  /***@description All Events */
  preViewClickEvent(editor, monaco, window.deco)
  // 禁止滚动

  /**
   * @description 全局变量初始化
   */
  window.deco = editor.createDecorationsCollection()
  window._speechData = {
    processing: false,
    speechResult: "",
    speech:null
  }
  // enObj.enMainConverter
  //   ? triggerConverterEvent()
  //   : console.log("converter if off") //按下写字板触发事件
  // enObj.enPdfExport ? exportToPdfEvent() : console.log("pdf export is off") //导出PDF
  // enObj.enDragFile ? dragFileEvent() : console.log("dragFile is off") //开启拖拽事件
  // enObj.enAboutBox ? aboutBox() : console.log("aboutBox is off")
  // enObj.enFastKey ? enableFastKeyEvent() : console.log("fastKey is off") //开启快捷键事件
  // enObj.enPasteEvent ? pasteEvent() : console.log("Paste Event is off") //开启快捷键事件
}

// #region ********************config region***************************
const normalConfigArr: NormalConfigArr = ["on", "off", "light", "dark"]
const defaultConfig: IConfig = {
  themeState: "light",
  emojiPickerState: "off",
  contextMenuClickPosition: { posx: 20, posy: 20 },
}
/**
 * @description 对设置进行初始化
 */
export function configInit(defaultConfig: IConfig) {
  let _defaultConfig: IConfig = defaultConfig
  // 操作localStorage
  let opLocalStorage = new operateLocalStorage()

  // 循环遍历默认设置
  for (let key in defaultConfig) {
    // 如果默认设置的键值在lStorage有存
    if (opLocalStorage.getItem(key)) {
      // 判断内容是否是正常的设置情况
      if (
        (key == "themeState" || key == "emojiPickerState") &&
        // @ts-ignore 这里他妈为什么会报错？？？？不合理啊？？？
        normalConfigArr.includes(opLocalStorage.getItem(key).toString())
      ) {
        _defaultConfig[key as string] = opLocalStorage.getItem(key).toString()
      } else {
        // 否则进行设置存储初始化
        opLocalStorage.setItem(key, defaultConfig[key])
      }
    } else {
      opLocalStorage.setItem(key, defaultConfig[key])
    }
  }
  return _defaultConfig
}
const configStore = new ConfigStore(configInit(defaultConfig))
export const useConfig = () => configStore
// #endregion
