// import { cdnDomains, cdnDomainsNpm } from "@App/user/cdn"
export default async function importModule(url) {
    if (url.length === 0) {
        throw new Error("A non-empty array of URLs must be provided.");
    }
    let parsedUrl = new URL(url);
    try {
        parsedUrl.host = window._cdn.cdn[0];
        const module = await import(/* @vite-ignore */ parsedUrl.toString());
        return module;
        // for (let i = 0; i <= cdnDomains.length - 1; i++) {
        //   if (!window._cdn.failed.includes(cdnDomains[i])) {
        //     parsedUrl.host = cdnDomains[i]
        //     const module = await import(/* @vite-ignore */ parsedUrl.toString())
        //     return module
        //   }
        //   if (i === cdnDomains.length - 1) {
        //     console.error("GG")
        //   }
        // }
    }
    catch (error) {
        if (!window._cdn.failed.includes(parsedUrl.host)) {
            window._cdn.failed.push(parsedUrl.host);
            window._cdn.cdn = window._cdn.cdn.filter((char) => char !== parsedUrl.host);
        }
        return importModule(parsedUrl.toString());
    }
}
