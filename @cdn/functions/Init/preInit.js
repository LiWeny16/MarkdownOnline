import cdnInit, { loadScripts, testCdns } from "@App/user/cdn";
(async function preInit() {
    await cdnInit();
    await testCdns();
    await loadScripts();
})();
