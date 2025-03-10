import cdnInit, { loadScripts, preload, testCdns } from "@App/user/cdn"
const languageInit = () => {
  const preferredLanguage = localStorage.getItem("i18nextLng") || "zh-CN"
  document.documentElement.lang = preferredLanguage
}
;(async function preInit() {
  languageInit()
  await cdnInit()
  await testCdns()
  await loadScripts()
  await preload()
})()
