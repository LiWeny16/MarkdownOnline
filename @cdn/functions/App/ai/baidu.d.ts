export declare const BaiduLanguages: {
    "zh-CN": string;
    "en-US": string;
    "ja-JP": string;
    "fr-FR": string;
    "de-DE": string;
    "es-ES": string;
    "it-IT": string;
    "ko-KR": string;
    "pt-PT": string;
    "ru-RU": string;
    "th-TH": string;
    "ar-SA": string;
};
export declare const LanguageNames: {
    zh: string;
    en: string;
    jp: string;
    fra: string;
    de: string;
    spa: string;
    it: string;
    kor: string;
    pt: string;
    ru: string;
    th: string;
    ara: string;
};
export interface BaiduTranslateOptions {
    text: string;
    sourceLang?: string;
    targetLang: string;
}
export interface BaiduTranslateResponse {
    translatedText: string;
    detectedLang: string;
    success: boolean;
    error?: string;
    errorCode?: string;
}
/**
 * 使用云函数调用百度翻译 API
 */
export declare function translateWithBaidu(options: BaiduTranslateOptions): Promise<string>;
/**
 * 快速翻译（简化版）
 * @param text 要翻译的文本
 * @param targetLang 目标语言
 * @param sourceLang 源语言（可选，默认自动检测）
 */
export declare function quickTranslate(text: string, targetLang: string, sourceLang?: string): Promise<string>;
/**
 * 批量翻译
 */
export declare function batchTranslate(texts: string[], targetLang: string, sourceLang?: string): Promise<string[]>;
/**
 * 自动检测语言并翻译
 */
export declare function autoTranslate(text: string, preferredTargetLang?: string): Promise<{
    translatedText: string;
    detectedLang: string;
}>;
declare const _default: {
    translateWithBaidu: typeof translateWithBaidu;
    quickTranslate: typeof quickTranslate;
    batchTranslate: typeof batchTranslate;
    autoTranslate: typeof autoTranslate;
    BaiduLanguages: {
        "zh-CN": string;
        "en-US": string;
        "ja-JP": string;
        "fr-FR": string;
        "de-DE": string;
        "es-ES": string;
        "it-IT": string;
        "ko-KR": string;
        "pt-PT": string;
        "ru-RU": string;
        "th-TH": string;
        "ar-SA": string;
    };
    LanguageNames: {
        zh: string;
        en: string;
        jp: string;
        fra: string;
        de: string;
        spa: string;
        it: string;
        kor: string;
        pt: string;
        ru: string;
        th: string;
        ara: string;
    };
};
export default _default;
