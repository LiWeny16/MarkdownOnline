import hljs from "@cdn-hljs"
import { marked } from "@cdn-marked"
// import { marked } from "marked"
import mermaid from "@cdn-mermaid"
// import mermaid from "mermaid"
import blankTextInit from "./blankTextInit"
import { enObj, mdConverter } from "@Root/js"
import { Notification } from "@arco-design/web-react"
import kit from "@cdn-kit"
import { triggerConverterEvent } from "@Func/Events/convert"
import {
  markItExtension,
  importUrlExtension,
  newRenderer,
  imgExtension,
  emojiExtension,
} from "@Func/Parser/renderer"
import { changeTheme } from "@App/config/change"
import operateLocalStorage from "@App/localStorage/localStorage"
import {
  ConfigStore,
  IConfig,
  NormalConfigArr,
} from "@Root/js/React/Mobx/Config"

// window.marked = marked
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
        lineNumber:true
      },
      importUrlExtension,
      imgExtension,
      markItExtension,
      emojiExtension
    )

    // marked.use({ renderer })
  }
  mermaidInit() {
    mermaid.initialize({
      securityLevel: "loose",
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
export default function allInit(): void {
  // let opLocalStorage = new operateLocalStorage()
  // changeTheme(opLocalStorage.getItem("ide-theme"))

  /**@description Settings Init*/
  const settings = new settingsClass()
  settings.settingsAllInit()

  /**@description Input Area Init*/
  blankTextInit().then(() => {
    mdConverter()
  }) //初始化输入区域
  Notification.success({
    title: "已更新到最新版本",
    content: `当前版本:v1.5.1`,
    position: "bottomRight",
  })
  kit.sleep(250).then(() => {
    Notification.info({
      title: "版本新增特性",
      content: `1. LaTex公式智能提示 2. hljs性能优化`,
      position: "bottomRight",
    })
  })
  // window.theme = "light"
  /***@description All Events */
  // enObj.enMainConverter
  //   ? triggerConverterEvent()
  //   : console.log("converter if off") //按下写字板触发事件
  // enObj.enPdfExport ? exportToPdfEvent() : console.log("pdf export is off") //导出PDF
  // enObj.enDragFile ? dragFileEvent() : console.log("dragFile is off") //开启拖拽事件
  // enObj.enAboutBox ? aboutBox() : console.log("aboutBox is off")
  // enObj.enFastKey ? enableFastKeyEvent() : console.log("fastKey is off") //开启快捷键事件
  // enObj.enPasteEvent ? pasteEvent() : console.log("Paste Event is off") //开启快捷键事件
}

const normalConfigArr: NormalConfigArr = ["on", "off", "light", "dark"]
const defaultConfig: IConfig = {
  themeState: "light",
  emojiPickerState: "off",
  contextMenuClickPosition: { posx: 0, posy: 0 },
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
