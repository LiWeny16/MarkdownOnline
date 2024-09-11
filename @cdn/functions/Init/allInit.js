import hljs from "@cdn-hljs";
import mermaid from "mermaid";
import blankTextInit from "./blankTextInit";
import { mdConverter } from "@Root/js";
import markdownIt from "markdown-it";
// @ts-ignore
import markdownItIncrementalDOM from "markdown-it-incremental-dom"; //from CDN
import mdItMultimdTable from "markdown-it-multimd-table";
// @ts-ignore
import markdownItGithubToc from "markdown-it-github-toc";
// @ts-ignore
import markdownItTaskLists from "markdown-it-task-lists";
// @ts-ignore
import { full as markdownItEmoji } from "markdown-it-emoji";
import kit from "@cdn-kit";
import OperateLocalStorage from "@App/localStorage/localStorage";
import { ConfigStore, } from "@Root/js/React/Mobx/Config";
import { markdownitLineNumber } from "@Func/Parser/mdItPlugin/lineNumber";
import markdownitFootNote from "markdown-it-footnote";
import { myPlugin } from "@Func/Parser/mdItPlugin/alertBlock";
import { imagePlugin } from "@Func/Parser/mdItPlugin/image";
import { codePlugin } from "@Func/Parser/mdItPlugin/code";
import { cluePlugin, customAlignPlugin, customAlignPluginHeading, } from "@Func/Parser/mdItPlugin/clueParser";
import preViewClickEvent from "@Func/Events/click/preClick";
import markdownItLatex from "@Func/Parser/mdItPlugin/latex";
import { getSettings } from "@App/config/change";
import noteUseArco from "@App/message/note";
import { mergeObjects } from "@App/basic/basic";
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
        .use(markdownItGithubToc, {
        anchorLinkSymbol: "",
        anchorLinkBefore: false,
    })
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
        .use(markdownItLatex)
        .use(markdownItTaskLists)
        .use(markdownItIncrementalDOM);
    // .use(markdownItIncrementalDOM, IncrementalDOM)
    // .use(markdownItCodeCopy)
    // .use(figure)
    return markdownItParser;
}
/**
 * @description other libs init
 */
class settingsClass {
    constructor() { }
    mermaidInit() {
        const mermaidConfig = {
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
        };
        mermaid.parseError = (e) => { };
        mermaid.initialize(mermaidConfig);
        mermaid.mermaidAPI.initialize(mermaidConfig);
    }
    hljsInit() {
        hljs.configure({
            ignoreUnescapedHTML: true,
        });
        // hljs.registerLanguage('mermaid', window.hljsDefineMermaid);
    }
    settingsAllInit() {
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
export default function allInit(editor = window.editor, monaco = window.monaco, handleCloseLoading) {
    /**@description Third Party Settings Init*/
    const settings = new settingsClass();
    settings.settingsAllInit();
    /**
     * @description Style init
     */
    kit.addStyle(`
    .markdown-body p,
    .markdown-body ol,
    .markdown-body li,
    .markdown-body div {
        font-size: ${getSettings().basic.fontSize}px;
    }
      `, "fontSizeStyle");
    /**@description Input Area Init*/
    blankTextInit().then(async () => {
        /**
         * @description 这之后全部 md都解析完成到 html
         */
        await mdConverter();
        if (handleCloseLoading) {
            handleCloseLoading();
        }
        await kit.sleep(110);
        noteUseArco("已更新到最新版本", "当前版本:v2.2.1");
        await kit.sleep(680);
        noteUseArco("当前版本新增特性", `文件管理器`, {
            kind: "info",
        });
        noteUseArco("Bug修复情况", `修复增量渲染“<-”时会出现的问题`, {
            kind: "info",
        });
    });
    /**
     * @description 全局变量初始化
     */
    window._deco = editor.createDecorationsCollection();
    window._speechData = {
        processing: false,
        speechResult: "",
        speech: null,
    };
    /**
     * @description 全局事件初始化
     */
    preViewClickEvent(editor, monaco, window._deco);
}
// #region ********************config region***************************
const defaultConfig = {
    themeState: "light",
    fileManagerState: false,
    emojiPickerState: "off",
    contextMenuClickPosition: { posx: 20, posy: 20 },
    settingsConfig: {
        basic: {
            editorAutoWrap: true,
            fontSize: 16,
            syncScroll: false,
            speechLanguage: "zh-CN",
            fileEditLocal: true,
        },
        advanced: { mermaidTheme: "default" },
    },
};
const normalConfigArr = ["on", "off", "light", "dark"];
const normalSettingsKey = [
    ...Object.keys(defaultConfig.settingsConfig.basic),
    ...Object.keys(defaultConfig.settingsConfig.advanced),
];
// Object.keys(defaultConfig.settingsConfig.advanced)
export const normalMermaidTheme = ["default", "forest", "dark", "neutral"];
export const normalMermaidThemeMap = [
    `default (默认，才是最美的！)`,
    `forest (说真的，很绿)`,
    `dark (说真的，很黑)`,
    `neutral (清心寡欲，出家必选)`,
];
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
    let opLocalStorage = new OperateLocalStorage();
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
                        // 以下为settingConfig设置内容
                        const storedSettings = JSON.parse(opLocalStorage.getItem(key).toString());
                        for (let i in storedSettings) {
                            Object.keys(storedSettings[i]).forEach((e) => {
                                if (!normalSettingsKey.includes(e)) {
                                    console.warn("abnormal key");
                                    storeDefaultSettings(key);
                                    return _defaultConfig;
                                }
                            });
                        }
                        // 如果都是正常的key 融合即可
                        opLocalStorage.setItem(key, JSON.stringify(mergeObjects(defaultConfig[key], JSON.parse(opLocalStorage.getItem(key).toString()))));
                        _defaultConfig[key] = JSON.parse(opLocalStorage.getItem(key).toString());
                    }
                    else {
                        _defaultConfig[key] = opLocalStorage
                            .getItem(key)
                            .toString();
                    }
                }
                catch (err) {
                    console.warn("reset settings 1");
                    storeDefaultSettings(key);
                }
            }
            else {
                // 否则进行设置存储初始化
                // console.info("reset settings don't need to save")
                storeDefaultSettings(key);
            }
        }
        // 如果完全没存，则存储默认设置
        else {
            console.warn("reset settings 3");
            storeDefaultSettings(key);
        }
    }
    return _defaultConfig;
}
const configStore = new ConfigStore(configInit(defaultConfig));
export const useConfig = () => configStore;
// #endregion
