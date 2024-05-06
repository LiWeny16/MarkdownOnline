import hljs from "@cdn-hljs";
import { marked } from "@cdn-marked";
// import { marked } from "marked"
import mermaid from "mermaid";
// import mermaid from "mermaid"
import blankTextInit from "./blankTextInit";
import { mdConverter } from "@Root/js";
import markdownIt from "markdown-it";
// import Token from "https://jsd.onmicrosoft.cn/npm/markdown-it@14.0.0/lib/token.mjs"
// @ts-ignore
import MarkdownItIncrementalDOM from "markdown-it-incremental-dom";
// import MarkdownItIncrementalDOM from "/@cdn/lib/markdown-it-incremental-dom/markdown-it-incremental-dom.esm.js"
import mdItMultimdTable from "markdown-it-multimd-table";
import * as IncrementalDOM from "incremental-dom";
// @ts-ignore
import markdownItGithubToc from "markdown-it-github-toc";
// @ts-ignore
import { full as markdownItEmoji } from "markdown-it-emoji";
// console.log(markdownItGithubToc);
// import markdownItGithubToc from "markdown-it-github-toc"
import { Notification } from "@arco-design/web-react";
import kit from "@cdn-kit";
import { markItExtension, importUrlExtension, imgExtension, emojiExtension, } from "@Func/Parser/renderer";
// import { changeTheme } from "@App/config/change"
import operateLocalStorage from "@App/localStorage/localStorage";
import { ConfigStore, } from "@Root/js/React/Mobx/Config";
import { markdownitLineNumber } from "@Func/Parser/mdItPlugin/lineNumber";
import markdownitFootNote from "markdown-it-footnote";
import { myPlugin } from "@Func/Parser/mdItPlugin/alertBlock";
import { imagePlugin } from "@Func/Parser/mdItPlugin/image";
import { codePlugin } from "@Func/Parser/mdItPlugin/code";
import { cluePlugin } from "@Func/Parser/mdItPlugin/clueParser";
import preViewClickEvent from "@Func/Events/click/preClick";
import markdownItLatex from "@Func/Parser/mdItPlugin/latex";
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
        .use(markdownItEmoji)
        .use(markdownItLatex)
        .use(MarkdownItIncrementalDOM, IncrementalDOM);
    // .use(markdownItCodeCopy)
    // .use(figure)
    return markdownItParser;
}
/**
 * @description other libs init
 */
class settingsClass {
    constructor() { }
    markedInit() {
        marked.use({
            mangle: false,
            headerIds: false,
            strict: false,
            extensions: [],
            async: true,
            lineNumber: true,
        }, importUrlExtension, imgExtension, markItExtension, emojiExtension);
        // marked.use({ renderer })
    }
    mermaidInit() {
        mermaid.parseError = (e) => { };
        mermaid.initialize({
            // er:()=>{},
            securityLevel: "loose",
            logLevel: 4,
            startOnLoad: false,
            theme: "base",
            // gantt: { topPadding:0 , useMaxWidth: false},
            // darkMode:true
        });
        mermaid.mermaidAPI.initialize({ startOnLoad: false });
    }
    hljsInit() {
        hljs.configure({
            ignoreUnescapedHTML: true,
        });
        // hljs.registerLanguage('mermaid', window.hljsDefineMermaid);
    }
    settingsAllInit() {
        this.markedInit();
        this.mermaidInit();
        this.hljsInit();
    }
    static newSettings() {
        return new this();
    }
}
/**
 * @description 初始化配置和事件初始化
 * @returns {void}
 */
export default function allInit(editor = window.editor, monaco = window.monaco) {
    /**@description Settings Init*/
    const settings = new settingsClass();
    settings.settingsAllInit();
    /**@description Input Area Init*/
    blankTextInit().then(() => {
        mdConverter();
        kit.sleep(110).then(() => {
            Notification.success({
                title: "已更新到最新版本",
                content: `当前版本:v2.1.1`,
                position: "bottomRight",
            });
            kit.sleep(780).then(() => {
                Notification.info({
                    title: "版本新增特性",
                    content: `1. 修复溢出滚动条bug 2.新增语音识别`,
                    position: "bottomRight",
                });
            });
        });
    }); //初始化输入区域
    /**
     * @description 全局变量初始化
     */
    window.deco = editor.createDecorationsCollection();
    preViewClickEvent(editor, monaco, window.deco);
    window._speechData = {
        processing: false,
        speechResult: "",
        speech: null,
    };
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
const normalConfigArr = ["on", "off", "light", "dark"];
const defaultConfig = {
    themeState: "light",
    emojiPickerState: "off",
    contextMenuClickPosition: { posx: 20, posy: 20 },
    settingsConfig: {
        basic: { syncScroll: true, speechLanguage: "zh-CN" },
        advanced: {},
    },
};
/**
 * @description 对设置进行初始化
 * @param defaultConfig 默认设置
 */
export function configInit(defaultConfig) {
    function storeDefaultSettings(key) {
        if (typeof _defaultConfig[key] === "object") {
            opLocalStorage.setItem(key, JSON.stringify(_defaultConfig[key]));
        }
        else {
            opLocalStorage.setItem(key, _defaultConfig[key]);
        }
    }
    let _defaultConfig = defaultConfig;
    // 操作localStorage
    let opLocalStorage = new operateLocalStorage();
    // 循环遍历默认设置
    for (let key in _defaultConfig) {
        // 如果默认设置的键值在LocalStorage有存
        if (opLocalStorage.getItem(key)) {
            // 判断内容是否是正常的设置内容,并且哪些内容需要记忆
            if (key == "themeState" ||
                key == "emojiPickerState" ||
                key == "settingsConfig"
            // @ts-ignore 这里他妈为什么会报错？？？？不合理啊？？？
            // normalConfigArr.includes(opLocalStorage.getItem(key).toString())
            ) {
                try {
                    if (typeof _defaultConfig[key] === "object") {
                        _defaultConfig[key] = JSON.parse(opLocalStorage.getItem(key).toString());
                    }
                    else {
                        _defaultConfig[key] = opLocalStorage
                            .getItem(key)
                            .toString();
                    }
                }
                catch (err) {
                    storeDefaultSettings(key);
                }
            }
            else {
                // 否则进行设置存储初始化
                storeDefaultSettings(key);
            }
        }
        // 如果完全没存，则存储默认设置
        else {
            storeDefaultSettings(key);
        }
    }
    return _defaultConfig;
}
const configStore = new ConfigStore(configInit(defaultConfig));
export const useConfig = () => configStore;
// #endregion
