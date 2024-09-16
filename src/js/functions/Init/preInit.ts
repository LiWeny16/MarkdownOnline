import cdnInit, { loadScripts, preload, testCdns } from "@App/user/cdn"
;(async function preInit() {
  await cdnInit()
  await testCdns()
  await preload()
  await loadScripts()
})()
