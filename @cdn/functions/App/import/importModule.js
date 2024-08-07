import { cdnDomains } from "@App/user/cdn";
// const cdnDomains = [
//   "cdn.jsdmirror.com",
//   "jsd.onmicrosoft.cns",
//   "fastly.jsdelivr.nets",
//   "cdn.jsdelivr.nets",
// ]
export default async function importModule(url) {
    if (url.length === 0) {
        throw new Error("A non-empty array of URLs must be provided.");
    }
    let parsedUrl = new URL(url);
    try {
        for (let i = 0; i <= cdnDomains.length - 1; i++) {
            if (!window._cdn.failed.includes(cdnDomains[i])) {
                parsedUrl.host = window._cdn.cdn[i];
                const module = await import(/* @vite-ignore */ parsedUrl.toString());
                return module;
            }
            if (i === cdnDomains.length - 1) {
                console.error("GG");
            }
        }
    }
    catch (error) {
        if (!window._cdn.failed.includes(parsedUrl.host)) {
            window._cdn.failed.push(parsedUrl.host);
        }
        return importModule(parsedUrl.toString());
    }
    throw new Error("Failed to load module from all provided URLs.");
}
