"use strict";
function scriptErrorEvent() {
    const cdnDomains = [
        "jsd.onmicrosoft.cn",
        "fastly.jsdelivr.net",
        "cdn.jsdelivr.net",
    ];
    // 最大的重试次数
    const maxRetry = 5;
    // 资源加载信息
    const retryInfo = {};
    window.addEventListener("error", (e) => {
        console.log(e);
        // console.log(e.target);
        const tag = e.target;
        // 只对 script 加载失败错误进行处理
        if (tag.tagName === "SCRIPT" && !(e instanceof ErrorEvent)) {
            console.log("tagError: ", e);
            const url = new URL(tag.src);
            console.log("url:", url);
            // 如果该文件没有加载失败信息，则初始化
            if (!retryInfo[url.pathname]) {
                retryInfo[url.pathname] = {
                    times: 0,
                    nextIndex: 0,
                };
            }
            const info = retryInfo[url.pathname];
            // console.log("info", retryInfo)
            // 加载失败次数小于最大重试次数
            if (info.times < maxRetry) {
                url.host = cdnDomains[info.nextIndex];
                // 阻塞页面后续的加载
                document.write(`<script src="${url.toString()}">\<\/script>`);
                // 下标循环
                info.nextIndex = (info.nextIndex + 1) % cdnDomains.length;
                info.times++;
            }
        }
        else {
            throw e;
        }
    }, true);
}
;
(() => {
    scriptErrorEvent();
})();
