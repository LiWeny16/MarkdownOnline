// import { cdnDomains, cdnDomainsNpm } from "@App/user/cdn"
const cdnImportArr: any = [
  // "/npm/gsap@3.12/+esm",
]
export default async function importModule(url: string) {
  if (!url) {
    throw new Error("A non-empty URL must be provided.")
  }
  let parsedUrl = new URL(url)
  async function fetchStreamData(url: string | URL | Request) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let receivedLength = 0
      let result = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        result += decoder.decode(value, { stream: true })
        receivedLength += value.length
      }

      return result
    } catch (error) {
      console.error("Error:", error)
      throw error
    }
  }
  if (cdnImportArr.includes(parsedUrl.pathname)) {
    try {
      const data = await fetchStreamData(url)
      // console.log(data);
      const blob = new Blob([data], { type: "application/javascript" })
      const url2 = URL.createObjectURL(blob)
      const module = await import(/* @vite-ignore */ url2)
      return module
    } catch (error) {
      console.error("Failed to load module:", error)
    }
  } else {
    try {
      parsedUrl.host = window._cdn.cdn[0]
      // 由于脚本源码只写了相对路径，而这里的blob是绝对路径，所以一旦有外部引入会失败
      const module = await import(/* @vite-ignore */ parsedUrl.toString())
      // console.log(module);
      return module
    } catch (error) {
      if (!window._cdn.failed.includes(parsedUrl.host)) {
        window._cdn.failed.push(parsedUrl.host)
        window._cdn.cdn = window._cdn.cdn.filter(
          (host) => host !== parsedUrl.host
        )
      }
      return importModule(url)
    }
  }
}
