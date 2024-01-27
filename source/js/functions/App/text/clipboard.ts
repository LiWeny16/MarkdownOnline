/**
 * @description 操作剪切板
 * @param text 要粘贴的文本
 */
export function writeClipboard(text: string) {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error("Failed to copy text: ", err)
  })
}
/**
 * @description 读取剪切板
 * @returns {Promise<string>}
 */
export async function readClipboard(): Promise<string> {
  let text = await navigator.clipboard.readText().catch((err) => {
    console.error("Failed to read clipboard contents: ", err)
  })
  if (text) {
    return text
  } else {
    return ""
  }
}
