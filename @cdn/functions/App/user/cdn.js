export const cdnDomains = [
    "fastly.jsdelivr.net",
    "cdn.jsdelivr.net",
    // "jsd.onmicrosoft.cn",
    "cdn.jsdmirror.com",
];
export const cdnDomainsNpm = ["npm.elemecdn.com"];
export default async function cdnInit() {
    window._cdn = { failed: [], index: 0, cdn: cdnDomains };
}
export async function testCdns() {
    // 检查 CDN 是否可访问的函数，并返回响应时间
    async function checkCDNConnectivity(domain, timeout = 5000) {
        const controller = new AbortController();
        const signal = controller.signal;
        const url = `https://${domain}/npm/bigonion-kit@0.12.6/.vscode/settings.json`;
        // 设置一个定时器在指定的超时时间后中止请求
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);
        try {
            const startTime = performance.now();
            const response = await fetch(url, {
                signal,
                cache: "no-store",
            });
            const endTime = performance.now();
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const latency = endTime - startTime;
            console.log(`CDN ${domain} is reachable. Response time: ${latency} ms`);
            return { domain, latency };
        }
        catch (error) {
            if (error.name === "AbortError") {
                console.error(`CDN ${domain} test failed: Timeout exceeded.`);
            }
            else {
                console.error(`CDN ${domain} test failed: ${error.message}`);
            }
            return null;
        }
    }
    // 主函数，测试所有 CDN 域名，挑选并排序
    async function testAndSortCDNs(cdnDomains, timeout = 3000) {
        const results = await Promise.all(cdnDomains.map((domain) => checkCDNConnectivity(domain, timeout)));
        // 过滤掉 CDN，
        const sortedResults = results
            .filter((result) => result !== null)
            .sort((a, b) => a.latency - b.latency);
        const sortedCDNDomains = sortedResults.map((result) => result.domain);
        window._cdn.cdn = sortedCDNDomains;
        // console.log("排序", sortedCDNDomains)
    }
    try {
        await testAndSortCDNs(cdnDomains);
    }
    catch (error) {
        console.error("Failed to test and sort CDNs:", error.message);
    }
}
/**
 * @description 动态加载指定的脚本标签，并替换指定的 CDN 域名。
 * @returns {Promise<void>} 在所有脚本加载成功后返回 Promise。
 */
export async function loadScripts() {
    async function loadScript(scriptTags, cdnDomain) {
        return Promise.all(scriptTags.map((tag) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = tag.src.replace("fastly.jsdelivr.net", cdnDomain);
                script.crossOrigin = tag.crossorigin || "";
                script.onload = () => resolve();
                script.className = "scriptScript";
                script.async = false; //ensure the scripts are loaded in sequence
                script.defer = true;
                script.onerror = () => reject(new Error(`Failed to load script: ${tag.src}`));
                document.head.appendChild(script);
            });
        }));
    }
    const scriptTags = [
        {
            src: "https://fastly.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js",
            crossorigin: "anonymous",
        },
        {
            src: "https://fastly.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js",
            crossorigin: "anonymous",
        },
        {
            src: "https://fastly.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.js",
        },
        {
            src: "https://fastly.jsdelivr.net/npm/incremental-dom@0.7.0/dist/incremental-dom-min.js",
        },
        {
            src: "https://fastly.jsdelivr.net/npm/markdown-it-incremental-dom/dist/markdown-it-incremental-dom.min.js",
        },
    ];
    try {
        await loadScript(scriptTags, window._cdn.cdn[0] || cdnDomains[0]);
        console.log("All scripts loaded successfully.");
    }
    catch (error) {
        await loadScript(scriptTags, window._cdn.cdn[1] || cdnDomains[1]);
        console.error("Script loading failed:", error);
    }
}
