import { getDataByKey, openDB, updateDB } from "@App/db"

export const cdnDomains = [
  "fastly.jsdelivr.net",
  "cdn.jsdelivr.net",
  // "jsd.onmicrosoft.cn",
  "cdn.jsdmirror.com",
]
export const cdnDomainsNpm = ["npm.elemecdn.com"]
export default async function cdnInit() {
  window._cdn = { failed: [], index: 0, cdn: cdnDomains }
}

type CdnResult = { domain: string; latency: number } | null

export async function testCdns(): Promise<void> {
  return new Promise(async (resolve) => {
    // 检查 CDN 是否可访问的函数，并返回响应时间
    async function checkCDNConnectivity(
      domain: string,
      timeout: number = 1300
    ): Promise<CdnResult> {
      const controller = new AbortController()
      const signal = controller.signal
      let url = `https://${domain}/npm/bigonion-kit@0.12.6/.vscode/settings.json`
      if (domain === "cdn.jsdmirror.com") {
        url = `https://${domain}/npm/bigonion-kit@0.12.6/.vscode/settings.jso`

      }


      // 设置一个定时器在指定的超时时间后中止请求
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)

      try {
        const startTime = performance.now()
        const response = await fetch(url, {
          signal,
          cache: "no-store",
        })
        const endTime = performance.now()
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const latency = endTime - startTime
        console.log(`CDN ${domain} is reachable. Response time: ${latency} ms`)
        return { domain, latency }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.error(`CDN ${domain} test failed: Timeout exceeded.`)
        } else {
          console.error(`CDN ${domain} test failed: ${error.message}`)
        }
        return null
      }
    }

    // 主函数，测试所有 CDN 域名，挑选并排序
    async function testAndSortCDNs(
      cdnDomains: string[],
      timeout: number = 3000
    ): Promise<string[]> {
      const results: CdnResult[] = await Promise.all(
        cdnDomains.map((domain) => {
          try {
            return checkCDNConnectivity(domain, timeout)
          } catch (error) {
            console.log(error);
            return null
          }

        })
      )
      // 过滤掉 CDN，
      const sortedResults: CdnResult[] = results
        .filter(
          (result): result is { domain: string; latency: number } =>
            result !== null
        )
        .sort((a, b) => a.latency - b.latency)
      const sortedCDNDomains = sortedResults.map((result) => result!.domain)
      window._cdn.cdn = sortedCDNDomains
      return sortedCDNDomains
    }
    try {
      // await testAndSortCDNs(cdnDomains)
      resolve()
    } catch (error) {
      console.log("hifuck", error);
      resolve()
    }
    
  })
}

/**
 * @description 动态加载指定的脚本标签，并替换指定的 CDN 域名。
 * @returns {Promise<void>} 在所有脚本加载成功后返回 Promise。
 */
export async function loadScripts(): Promise<void> {
  const openIndexedDB = (): Promise<IDBDatabase> => {
    const onUpgradeNeeded = (db: IDBDatabase) => {
      db.createObjectStore("scripts", { keyPath: "id" })
      db.createObjectStore("styles", { keyPath: "id" })
    }
    return openDB("cache_DB", 1, onUpgradeNeeded)
  }

  const getDataFromIndexedDB = (
    db: IDBDatabase,
    table: string,
    id: string
  ): Promise<any> => {
    return getDataByKey(db, table, id)
  }

  const saveDataToIndexedDB = (
    db: IDBDatabase,
    table: string,
    id: string,
    content: string
  ): Promise<void> => {
    return updateDB(db, table, { id, content })
  }
  const loadOrFetch = async (
    tagType: string,
    tagId: string,
    tagUrl: string | URL | Request
  ): Promise<void> => {
    const db = await openIndexedDB();
    const tableName = tagType + "s";
    let tagData = await getDataFromIndexedDB(db, tableName, tagId);

    if (!tagData) {
      const response = await fetch(tagUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${tagUrl}`);
      const tagContent = await response.text();

      // 检查是否有多个匿名 define 调用
      const defineCount = (tagContent.match(/define$/g) || []).length;
      if (defineCount > 1) {
        throw new Error(
          `Script at ${tagUrl} has multiple anonymous define calls`
        );
      }

      await saveDataToIndexedDB(db, tableName, tagId, tagContent);
      tagData = { content: tagContent };
    }

    // 避免重复加载
    if (!document.querySelector(`script[data-id="${tagId}"]`)) {
      const tagElement = document.createElement(tagType);
      tagElement.textContent = tagData.content;
      tagElement.setAttribute("data-id", tagId);
      document.head.appendChild(tagElement);
    }
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
    {
      id: "arco-design",
      cdnUrl: `https://${usefulDomain}/npm/@arco-design/web-react@2.58.3/dist/css/arco.min.css`,
    },

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
      await loadFunction(resource.id, url.toString())
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
  const dbPromise = indexedDB.open("cache_DB", 1)
  dbPromise.onupgradeneeded = (event: any) => {
    event.target.result.createObjectStore("scripts", { keyPath: "id" })
    event.target.result.createObjectStore("styles", { keyPath: "id" })
  }
  const getScriptFromDB = (db: any, id: any) =>
    new Promise((resolve, reject) => {
      const transaction = db
        .transaction("scripts")
        .objectStore("scripts")
        .get(id)
      transaction.onsuccess = () => resolve(transaction.result)
      transaction.onerror = () => reject(transaction.error)
    })
  const loadScripts = async (scripts: any) => {
    const db: any = await new Promise((resolve, reject) => {
      dbPromise.onsuccess = () => resolve(dbPromise.result)
    })
    let storeNames: any = db.objectStoreNames
    if (!storeNames.contains("scripts") || !storeNames.contains("styles")) {
      let deleteRequest = window.indexedDB.deleteDatabase("cache_DB")
      deleteRequest.onsuccess = function (event) {
        window.location.reload()
      }
    }
    for (const { id, cdnUrl } of scripts) {
      try {
        const scriptData: any = await getScriptFromDB(db, id)
        if (scriptData) {
          const script = document.createElement("script")
          script.textContent = scriptData.content
          document.head.appendChild(script)
        } else {
          const script = document.createElement("script")
          script.src = cdnUrl
          document.head.appendChild(script)
        }
      } catch (error) {
        console.error(`Error loading script ${id}:`, error)
      }
    }
  }
  const scriptsToLoad = [
    {
      id: "katex",
      cdnUrl: "https://fastly.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.js",
    },
    {
      id: "incremental-dom",
      cdnUrl:
        "https://fastly.jsdelivr.net/npm/incremental-dom@0.7.0/dist/incremental-dom-min.js",
    },
    {
      id: "markdown-it-incremental-dom",
      cdnUrl:
        "https://fastly.jsdelivr.net/npm/markdown-it-incremental-dom/dist/markdown-it-incremental-dom.min.js",
    },
  ]
  await loadScripts(scriptsToLoad)
}
