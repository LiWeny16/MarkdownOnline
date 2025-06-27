import hljs from "@cdn-hljs";
import { createRoot } from "react-dom/client";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import pageBreaker from "@Func/Parser/pageBreaker";
import "../css/index.less";
import { markdownParser } from "@Func/Init/allInit";
import prepareParser from "@Func/Parser/prepareParser/prepare";
import EditableTable from "@Com/Mui/table";
import React from "react";
import diff from "fast-diff";
let lastMarkdown = ""; // 记录上次渲染的 Markdown 内容
function updateMarkdown(newMarkdown) {
    const patches = diff(lastMarkdown, newMarkdown);
    const viewArea = document.getElementById("view-area");
    patches.forEach(([operation, text]) => {
        if (operation === 1) {
            // 新增内容 -> 解析 Markdown 片段并渲染
            const ast = markdownParser().parse(text, {});
            window.IncrementalDOM.patch(viewArea, 
            // Access the renderer through the proper plugin or extension
            () => markdownParser().renderToIncrementalDOM(text, {}));
        }
        else if (operation === -1) {
            // 删除内容 -> 找到对应 DOM 节点并移除
            removeMarkdownContent(text);
        }
    });
    lastMarkdown = newMarkdown; // 更新已渲染 Markdown 内容
}
// 移除 Markdown 变化的部分
function removeMarkdownContent(text) {
    const viewArea = document.getElementById("view-area");
    if (!viewArea)
        return;
    Array.from(viewArea.childNodes).forEach((node) => {
        if (node.textContent.includes(text)) {
            viewArea.removeChild(node);
        }
    });
}
// checkSpelling(`目前全世界最好用的onion写的Web端Markdown免费编辑器`)
reactTableCustom();
/**
 * @description 循环执行触发主解析事件流
 */
export async function mdConverter(fully = false) {
    let view = getMdTextFromMonaco();
    // 测试
    view = pageBreaker(view);
    /**
     * @description 处理需要异步的信息
     * */
    let env = await prepareParser(view);
    if (fully || !window.IncrementalDOM) {
        document.getElementById("view-area").innerHTML = markdownParser().render(view, env);
    }
    else {
        window.IncrementalDOM.patch(document.getElementById("view-area"), 
        // @ts-ignore
        markdownParser().renderToIncrementalDOM(view, env));
    }
    // await renderTables()
    hljs.highlightAll();
}
// 在全局保存原始elementOpen和根实例
let originalElementOpen = null;
export async function reactTableCustom() {
    if (!originalElementOpen) {
        originalElementOpen = window.IncrementalDOM.elementOpen;
    }
    window.IncrementalDOM.elementOpen = function (tagName, key, statics, ...attrs) {
        // 将属性数组转换为对象格式
        const attributes = attrs.reduce((acc, _, index, arr) => {
            if (index % 2 === 0) {
                const value = arr[index + 1];
                if (typeof arr[index] === 'string') {
                    acc[arr[index]] = value;
                }
            }
            return acc;
        }, {});
        // 增强class检测逻辑
        const classValue = attributes['class'] || attributes['className'] || '';
        if (classValue.includes('react-table')) {
            // 创建纯净的DOM元素
            const element = originalElementOpen.call(this, tagName, key, statics, 'class', // 强制保留class属性
            classValue);
            // 跳过后续处理
            window.IncrementalDOM.skip();
            window.IncrementalDOM.elementClose(tagName);
            return element;
        }
        return originalElementOpen.apply(this, arguments);
    };
}
const reactRoots = new Map(); // 存储已经挂载的 React 组件
const renderTables = async () => {
    const elements = document.querySelectorAll(".react-table");
    // 清理已卸载的元素对应的React根
    reactRoots.forEach((root, element) => {
        if (!document.body.contains(element)) {
            root.unmount();
            reactRoots.delete(element);
        }
    });
    elements.forEach((element) => {
        // 如果元素已经挂载过React根，跳过
        if (reactRoots.has(element))
            return;
        const mockData = [
            { id: 1, name: "John Doe", age: 28 },
            { id: 2, name: "Jane Smith", age: 32 },
        ];
        // 创建新的React根并渲染
        const root = createRoot(element);
        root.render(React.createElement(EditableTable, { initialData: mockData }));
        reactRoots.set(element, root);
    });
};
