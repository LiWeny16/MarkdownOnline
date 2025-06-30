import hljs from "@cdn-hljs";
import { getMdTextFromMonaco } from "@App/text/getMdText";
import pageBreaker from "@Func/Parser/pageBreaker";
import "../css/index.less";
import { markdownParser } from "@Func/Init/allInit";
import prepareParser from "@Func/Parser/prepareParser/prepare";
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
    hljs.highlightAll();
}
