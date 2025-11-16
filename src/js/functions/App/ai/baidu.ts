// 百度翻译 API 封装（通过Express服务器代理）

// Express服务器URL - 请替换为你的实际服务器地址
// 本地开发: http://localhost:9000/translate
// 生产环境: https://trans-mpcjmvtlut.cn-hangzhou.fcapp.run
const CLOUD_FUNCTION_URL_local = "http://localhost:9000/translate"
const CLOUD_FUNCTION_URL = "https://trans-mpcjmvtlut.cn-hangzhou.fcapp.run"

// 百度翻译支持的语言映射
export const BaiduLanguages = {
  "zh-CN": "zh", // 中文
  "en-US": "en", // 英文
  "ja-JP": "jp", // 日语
  "fr-FR": "fra", // 法语
  "de-DE": "de", // 德语
  "es-ES": "spa", // 西班牙语
  "it-IT": "it", // 意大利语
  "ko-KR": "kor", // 韩语
  "pt-PT": "pt", // 葡萄牙语
  "ru-RU": "ru", // 俄语
  "th-TH": "th", // 泰语
  "ar-SA": "ara", // 阿拉伯语
}

// 语言名称映射（用于显示）
export const LanguageNames = {
  "zh": "中文",
  "en": "English",
  "jp": "日本語",
  "fra": "Français",
  "de": "Deutsch",
  "spa": "Español",
  "it": "Italiano",
  "kor": "한국어",
  "pt": "Português",
  "ru": "Русский",
  "th": "ไทย",
  "ara": "العربية",
}

export interface BaiduTranslateOptions {
  text: string
  sourceLang?: string // 源语言，如果不指定会自动检测 (auto)
  targetLang: string // 目标语言（必需）
}

export interface BaiduTranslateResponse {
  translatedText: string
  detectedLang: string
  success: boolean
  error?: string
  errorCode?: string
}

/**
 * 使用云函数调用百度翻译 API
 */
export async function translateWithBaidu(
  options: BaiduTranslateOptions
): Promise<string> {
  try {
    const { text, sourceLang = "auto", targetLang } = options

    if (!text || text.trim().length === 0) {
      return ""
    }

    // 调用云函数
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang,
      }),
    })

    if (!response.ok) {
      throw new Error(`云函数请求失败: ${response.status} ${response.statusText}`)
    }

    const result: BaiduTranslateResponse = await response.json()

    // 检查是否有错误
    if (!result.success || result.error) {
      throw new Error(result.error || "翻译失败")
    }

    return result.translatedText || ""
  } catch (error) {
    console.error("百度翻译错误:", error)
    throw error
  }
}

/**
 * 快速翻译（简化版）
 * @param text 要翻译的文本
 * @param targetLang 目标语言
 * @param sourceLang 源语言（可选，默认自动检测）
 */
export async function quickTranslate(
  text: string,
  targetLang: string,
  sourceLang: string = "auto"
): Promise<string> {
  return translateWithBaidu({
    text,
    targetLang,
    sourceLang,
  })
}

/**
 * 批量翻译
 */
export async function batchTranslate(
  texts: string[],
  targetLang: string,
  sourceLang: string = "auto"
): Promise<string[]> {
  try {
    // 云函数每次只能翻译一段文本，所以需要逐个翻译
    const promises = texts.map(text =>
      translateWithBaidu({
        text,
        targetLang,
        sourceLang,
      })
    )
    return await Promise.all(promises)
  } catch (error) {
    console.error("批量翻译错误:", error)
    throw error
  }
}

/**
 * 自动检测语言并翻译
 */
export async function autoTranslate(
  text: string,
  preferredTargetLang: string = "en"
): Promise<{ translatedText: string; detectedLang: string }> {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLang: "auto",
        targetLang: preferredTargetLang,
      }),
    })

    if (!response.ok) {
      throw new Error(`云函数请求失败: ${response.status}`)
    }

    const result: BaiduTranslateResponse = await response.json()

    if (!result.success || result.error) {
      throw new Error(result.error || "翻译失败")
    }

    return {
      translatedText: result.translatedText || "",
      detectedLang: result.detectedLang,
    }
  } catch (error) {
    console.error("自动翻译错误:", error)
    throw error
  }
}

export default {
  translateWithBaidu,
  quickTranslate,
  batchTranslate,
  autoTranslate,
  BaiduLanguages,
  LanguageNames,
}

