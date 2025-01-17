import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import map from "./map";
import getLang from "@App/user/langugae";
import { changeSettings } from "@App/config/change";
const initI18N = () => {
    const preferredLanguage = localStorage.getItem("i18nextLng") || getLang();
    changeSettings({ basic: { language: preferredLanguage } });
    i18n
        // 检测用户当前使用的语言
        // 文档: https://github.com/i18next/i18next-browser-languageDetector
        .use(LanguageDetector)
        // 注入 react-i18next 实例
        .use(initReactI18next)
        // 初始化 i18next
        // 配置参数的文档: https://www.i18next.com/overview/configuration-options
        .init({
        debug: false,
        lng: preferredLanguage,
        fallbackLng: "zh",
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: true, // 启用 Suspense 支持
        },
        resources: map,
    });
};
export default initI18N;
