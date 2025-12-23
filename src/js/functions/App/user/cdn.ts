// import { getDataByKey, openDB, updateDB } from "@App/memory/db"

export const cdnDomains = [
  "cdn.mengze.vip",
  "fastly.jsdelivr.net",
  "cdn.jsdmirsror.com",
  "cdn.jsdelivr.net",
  // "jsd.onmicrosoft.cn",
]
export const cdnDomainsNpm = ["npm.elemecdn.com"]
export default async function cdnInit() {
  // 1. 优先读取本地缓存的最佳 CDN
  const preferredCDN = localStorage.getItem('preferred_cdn');
  if (preferredCDN && cdnDomains.includes(preferredCDN)) {
    // 将缓存的最佳 CDN 移到第一位
    const index = cdnDomains.indexOf(preferredCDN);
    if (index > -1) {
      cdnDomains.splice(index, 1);
      cdnDomains.unshift(preferredCDN);
    }
  }
  window._cdn = { failed: [], index: 0, cdn: [...cdnDomains] }
}

type CdnResult = { domain: string; latency: number } | null

export async function testCdns(): Promise<void> {
  return new Promise(async (resolve) => {
    // 检查 CDN 是否可访问的函数
    async function checkCDNConnectivity(
      domain: string,
      timeout: number = 2000
    ): Promise<CdnResult> {
      const controller = new AbortController()
      const signal = controller.signal
      // 使用一个极小的文件来测速（lodash 是 npm 下载量最大的包，CDN 缓存命中率极高）
      const url = `https://${domain}/npm/lodash@4.17.21/package.json`

      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)

      try {
        const startTime = performance.now()
        // 尝试使用 HEAD 请求以节省流量，如果不支持则回退到 GET
        const response = await fetch(url, {
          method: 'HEAD',
          signal,
          cache: "no-store",
        }).catch(() => fetch(url, { signal, cache: "no-store" })); // 回退

        const endTime = performance.now()
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const latency = endTime - startTime
        // console.log(`CDN ${domain} latency: ${Math.round(latency)}ms`)
        return { domain, latency }
      } catch (error) {
        return null
      }
    }

    // 竞速模式：只要有一个成功，就立即返回
    function raceToSuccess(domains: string[]): Promise<string> {
      return new Promise((resolveRace, rejectRace) => {
        let failureCount = 0;
        let resolved = false;

        domains.forEach(domain => {
          checkCDNConnectivity(domain, 1500).then(result => {
            if (resolved) return;
            
            if (result) {
              resolved = true;
              resolveRace(result.domain);
            } else {
              failureCount++;
              if (failureCount === domains.length) {
                rejectRace(new Error("All CDNs failed"));
              }
            }
          });
        });
      });
    }

    try {
      // 设置 1秒 的软超时。如果 1秒内没选出最快的，就直接 resolve 继续运行，
      // 但测速结果会在后台更新 localStorage，供下次使用。
      const racePromise = raceToSuccess(window._cdn.cdn);
      const timeoutPromise = new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 1000)
      );

      const fastestDomain = await Promise.race([racePromise, timeoutPromise]);

      // 如果竞速成功，更新当前列表和缓存
      if (fastestDomain) {
        console.log(`[CDN] Fastest detected: ${fastestDomain}`);
        const currentList = window._cdn.cdn;
        const index = currentList.indexOf(fastestDomain);
        if (index > -1) {
          currentList.splice(index, 1);
          currentList.unshift(fastestDomain);
        }
        localStorage.setItem('preferred_cdn', fastestDomain);
      }
    } catch (error) {
      // 超时或全失败，不做任何变更，沿用默认/缓存顺序
      // console.warn("[CDN] Race timed out or failed, using default order.");
    } finally {
      resolve();
    }
  })
}

/**
 * @description 动态加载指定的脚本标签，并替换指定的 CDN 域名。
 * @returns {Promise<void>} 在所有脚本加载成功后返回 Promise。
 */
export async function loadScripts(): Promise<void> {
  const loadOrFetch = async (
    tagType: string,
    tagId: string,
    tagUrl: string | URL | Request
  ): Promise<void> => {
    // 避免重复加载
    if (document.querySelector(`[data-id="${tagId}"]`)) return;

    // 直接通过 fetch 请求，Service Worker 会自动拦截并处理缓存
    const response = await fetch(tagUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${tagUrl}`);
    const tagContent = await response.text();

    // 检查是否有多个匿名 define 调用
    if (tagType === 'script') {
      const defineCount = (tagContent.match(/define$/g) || []).length;
      if (defineCount > 1) {
        throw new Error(
          `Script at ${tagUrl} has multiple anonymous define calls`
        );
      }
    }

    const tagElement = document.createElement(tagType);
    tagElement.textContent = tagContent;
    tagElement.setAttribute("data-id", tagId);
    document.head.appendChild(tagElement);
  };

  const usefulDomain = window._cdn.cdn[0]
  const scripts = [
    {
      id: "katex",
      cdnUrl: `https://${usefulDomain}/npm/katex@0.16.7/dist/katex.min.js`,
    },
    {
      id: "IncrementalDOM",
      cdnUrl: `https://${usefulDomain}/npm/incremental-dom@0.7.0/dist/incremental-dom-min.js`,
    },
    {
      id: "markdownitIncrementalDOM",
      cdnUrl: `https://${usefulDomain}/npm/markdown-it-incremental-dom/dist/markdown-it-incremental-dom.min.js`,
    },
  ]
  const styles = [
    {
      id: "githubMd",
      cdnUrl: `https://${usefulDomain}/npm/clue-parser@1.0.3/src/githubMd.min.css`,
    },
    {
      id: "clue-parser",
      cdnUrl: `https://${usefulDomain}/npm/clue-parser@1.0.4/index.min.css`,
    },
    // {
    //   id: "arco-design",
    //   cdnUrl: `https://${usefulDomain}/npm/@arco-design/web-react@2.58.3/dist/css/arco.min.css`,
    // },

  ]
  async function loadOrFetchResource(
    resource: any,
    loadFunction: any,
    type: any
  ) {
    try {
      await loadFunction(type, resource.id, resource.cdnUrl)
    } catch (_e) {
      let url = new URL(resource.cdnUrl)
      url.host = window._cdn.cdn[1] ? window._cdn.cdn[1] : url.host
      await loadFunction(type, resource.id, url.toString())
    }
  }

  for (const script of scripts) {
    await loadOrFetchResource(script, loadOrFetch, "script")
  }

  for (const style of styles) {
    await loadOrFetchResource(style, loadOrFetch, "style")
  }
}

export async function preload() {
  const scriptsToLoad = [
    {
      id: "katex",
      cdnUrl: "https://cdn.jsdmirror.com/npm/katex@0.16.7/dist/katex.min.js",
    },
    {
      id: "incremental-dom",
      cdnUrl:
        "https://cdn.jsdmirror.com/npm/incremental-dom@0.7.0/dist/incremental-dom-min.js",
    },
    {
      id: "markdown-it-incremental-dom",
      cdnUrl:
        "https://cdn.jsdmirror.com/npm/markdown-it-incremental-dom/dist/markdown-it-incremental-dom.min.js",
    },
  ]
  
  for (const { id, cdnUrl } of scriptsToLoad) {
      // 简单地创建 script 标签，让浏览器发起请求，SW 会拦截处理
      const script = document.createElement("script")
      script.src = cdnUrl
      script.crossOrigin = "anonymous"
      // script.setAttribute("data-id", id) // 可选
      document.head.appendChild(script)
  }
}
