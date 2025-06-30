import hljs from "@cdn-hljs"
import mermaid, { MermaidConfig } from "mermaid"
import blankTextInit from "./blankTextInit"
import { mdConverter } from "@Root/js"
import markdownIt from "markdown-it"
import mdItMultimdTable from "markdown-it-multimd-table"
// @ts-ignore
import markdownItGithubToc from "markdown-it-github-toc"
// @ts-ignore
import markdownItTaskLists from "markdown-it-task-lists"
// @ts-ignore
import { full as markdownItEmoji } from "markdown-it-emoji"
import kit from "@cdn-kit"
import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import OperateLocalStorage from "@App/localStorage/localStorage"
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
import {
  cluePlugin,
  customAlignPlugin,
  customAlignPluginHeading,
} from "@Func/Parser/mdItPlugin/clueParser"
import preViewClickEvent from "@Func/Events/click/preClick"
import markdownItLatex from "@Func/Parser/mdItPlugin/latex"
import { changeStates, getSettings } from "@App/config/change"
import noteUseArco from "@App/message/note"
import { mergeObjects } from "@App/basic/basic"
import importFilePlugin from "@Func/Parser/mdItPlugin/file"
import i18n from "i18next"
// import markdownItTOCPlugin from "@Func/Parser/mdItPlugin/TOC"
// import tocPlugin from "@Func/Parser/mdItPlugin/TOC"
import latexFix from "@Func/Parser/mdItPlugin/latexFix"
// import { tablePlugin } from "@Func/Parser/mdItPlugin/table"
// import incrementalDomPlugin from "@Func/Parser/mdItPlugin/incremental"

// import { excelParser } from "@App/fileSystem/excel"
/**
 * @description markdownParser init plugin && settings
 */
export function markdownParser() {
  // console.log(window.katex)
  let markdownItParser = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  })
    .use(markdownitLineNumber)
    .use(markdownItGithubToc, {
      anchorLinkSymbol: "",
      anchorLinkBefore: false,
    })
    // .use(tocPlugin)
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
    .use(customAlignPlugin)
    .use(customAlignPluginHeading)
    .use(markdownItEmoji)
    .use(markdownItTaskLists)
    .use(latexFix)
    .use(markdownItLatex)
    .use(importFilePlugin)
    // .use(tablePlugin)
    .use(window.markdownitIncrementalDOM)
    // .use(incrementalDomPlugin)
  return markdownItParser
}
/**
 * @description other libs init
 */
class settingsClass {
  constructor() { }
  mermaidInit() {
    const mermaidConfig: MermaidConfig = {
      securityLevel: "loose",
      logLevel: 4,
      startOnLoad: false,
      gantt: {
        fontSize: 19,
        sectionFontSize: "16",
        numberSectionStyles: 10,
        useMaxWidth: true,
      },
      theme: getSettings().advanced.mermaidTheme,
    }
    mermaid.parseError = (e) => { }
    mermaid.initialize(mermaidConfig)
    mermaid.mermaidAPI.initialize(mermaidConfig)
  }
  hljsInit() {
    hljs.configure({
      ignoreUnescapedHTML: true,
    })
    // hljs.registerLanguage('mermaid', window.hljsDefineMermaid);
  }
  settingsAllInit() {
    this.mermaidInit()
    this.hljsInit()
  }
  static newSettings() {
    return new this()
  }
}
/**
 * @description 负责查询需要的全局变量从而开始渲染
 */
export function waitForVariable(
  variableName: string,
  callback: () => void | Promise<void>,
  interval = 100
) {
  const intervalId = setInterval(async () => {
    // @ts-ignore
    if (window[variableName]) {
      clearInterval(intervalId)
      try {
        await callback()
      } catch (error) {
        console.error("Error in async callback:", error)
      }
    }
  }, interval)
}

/**
 * @description 初始化配置和事件初始化
 * @returns {void}
 */
export default function allInit(
  editor: editor.IStandaloneCodeEditor = window.editor,
  monaco: Monaco = window.monaco
): void {
  /**@description Third Party Settings Init*/
  const settings = new settingsClass()
  settings.settingsAllInit()

  /**
   * @description Style init
   */
  kit.addStyle(
    `
    .markdown-body p,
    .markdown-body ol,
    .markdown-body li,
    .markdown-body div {
        font-size: ${getSettings().basic.fontSize}px;
    }
      `,
    "fontSizeStyle"
  )
  /**@description Input Area Init*/
  blankTextInit().then(async () => {
    /**
     * @description 这之后全部 md都解析完成到 html
     */
    await mdConverter(false)
    // await excelParser()
    changeStates({ unmemorable: { loading: false } })
    await kit.sleep(110)
    noteUseArco(
      i18n.t("t-updated-to-latest-version"),
      i18n.t("t-current-version", { version: "v3.1.0" })
    )
    await kit.sleep(680)
    noteUseArco(
      i18n.t("t-new-features-current-version"),
      i18n.t("t-file-manager"),
      {
        kind: "info",
      }
    )
  })

  /**
   * @description 全局变量初始化
   */
  window._deco = editor.createDecorationsCollection()
  window._speechData = {
    processing: false,
    speechResult: "",
    speech: null,
  }

  /**
   * @description 全局事件初始化
   */
  preViewClickEvent(editor, monaco, window._deco)
}

// #region ********************config region***************************
const defaultConfig: IConfig = {
  themeState: "light",
  fileManagerState: false,
  emojiPickerState: "off",
  contextMenuClickPosition: { posx: 20, posy: 20 },
  memorableStates: {
    memorable: {
      languageChanged: false,
      welcomeAnimationState: true,
      localLANId: "none"
    },
  },
  states: {
    unmemorable: {
      isDragging: false,
      loading: true,
      previewMode: false,
      aiPanelState: false,
      voicePanelState: false,
      voiceData: "",
      promptPanelState: false,
      mouseUpPos: { posx: 0, posy: 0 },
      selectEndPos: { posx: 0, posy: 0 },
    },
  },
  settingsConfig: {
    basic: {
      language: "zh",
      editorAutoWrap: true,
      fontSize: 16,
      fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
      syncScroll: false,
      speechLanguage: "zh-CN",
      fileEditLocal: true,
    },
    advanced: {
      mermaidTheme: "default",
      imageSettings: {
        modePrefer: "folder",
        basicStyle: "#w70%#c#s",
        imgStorePath: "/images/",
        htmlOrMdStyle: "md",
      },
    },
  },
}

// const normalConfigArr: NormalConfigArr = ["on", "off", "light", "dark"]
const normalSettingsKey = [
  ...Object.keys(defaultConfig.memorableStates.memorable),
  ...Object.keys(defaultConfig.states.unmemorable),
  ...Object.keys(defaultConfig.settingsConfig.basic),
  ...Object.keys(defaultConfig.settingsConfig.advanced),
]
// Object.keys(defaultConfig.settingsConfig.advanced)
export const normalMermaidTheme = ["default", "forest", "dark", "neutral"]
export const normalMermaidThemeMap = [
  `default (默认，才是最美的！)`,
  `forest (说真的，很绿)`,
  `dark (说真的，很黑)`,
  `neutral (清心寡欲，出家必选)`,
]

/**
 * @description 对设置进行初始化
 * @param defaultConfig 默认设置
 */
export function configInit(defaultConfig: IConfig) {
  function storeDefaultSettings(key: string) {
    if (typeof _defaultConfig[key] === "object") {
      opLocalStorage.setItem(key, JSON.stringify(_defaultConfig[key]))
    } else {
      opLocalStorage.setItem(key, _defaultConfig[key])
    }
  }
  let _defaultConfig: IConfig = defaultConfig
  // 操作localStorage
  let opLocalStorage = new OperateLocalStorage()

  // 循环遍历默认设置
  for (let key in _defaultConfig) {
    // 如果默认设置的键值在LocalStorage有存
    if (opLocalStorage.getItem(key)) {
      // 判断内容是否是正常的设置内容,并且哪些内容需要记忆
      if (
        key == "themeState" ||
        key == "emojiPickerState" ||
        key == "settingsConfig" ||
        key == "memorableStates"
        // key == "states"
        // @ts-ignore 这里他妈为什么会报错？？？？不合理啊？？？
        // normalConfigArr.includes(opLocalStorage.getItem(key).toString())
      ) {
        try {
          if (typeof _defaultConfig[key] === "object") {
            // 以下为settingConfig / state的设置内容
            const storedSettings = JSON.parse(
              opLocalStorage.getItem(key).toString()
            )
            for (let i in storedSettings) {
              Object.keys(storedSettings[i]).forEach((e) => {
                if (!normalSettingsKey.includes(e)) {
                  console.warn("abnormal key")
                  storeDefaultSettings(key)
                  return _defaultConfig
                }
              })
            }
            // 如果都是正常的key 融合即可
            opLocalStorage.setItem(
              key,
              JSON.stringify(
                mergeObjects(
                  defaultConfig[key as string],
                  JSON.parse(opLocalStorage.getItem(key).toString())
                )
              )
            )
            _defaultConfig[key as string] = JSON.parse(
              opLocalStorage.getItem(key).toString()
            )
          } else {
            _defaultConfig[key as string] = opLocalStorage
              .getItem(key)
              .toString()
          }
        } catch (err) {
          console.warn("reset settings 1")
          storeDefaultSettings(key)
        }
      } else {
        // 否则进行设置存储初始化
        // console.info("reset settings don't need to save")
        storeDefaultSettings(key)
      }
    }
    // 如果完全没存，则存储默认设置
    else {
      console.warn("reset settings 3")
      storeDefaultSettings(key)
    }
  }
  return _defaultConfig
}

const configStore = new ConfigStore(configInit(defaultConfig))
export const useConfig = () => configStore

// #endregion
