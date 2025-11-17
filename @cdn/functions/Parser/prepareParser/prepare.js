import { FileFolderManager } from "@App/fileSystem/file";
import { readMemoryImg } from "@App/memory/memory";
import { markdownParser } from "@Func/Init/allInit";
import kit from "bigonion-kit";
import mermaid from "mermaid";
// 🚀 Mermaid 缓存管理器
class MermaidCacheManager {
    constructor() {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // hash -> 渲染结果
        Object.defineProperty(this, "maxCacheSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        }); // 最大缓存数量
        Object.defineProperty(this, "hits", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 缓存命中次数
        Object.defineProperty(this, "misses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 缓存未命中次数
    }
    static getInstance() {
        if (!MermaidCacheManager.instance) {
            MermaidCacheManager.instance = new MermaidCacheManager();
        }
        return MermaidCacheManager.instance;
    }
    // 简单的哈希函数
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString(36);
    }
    // 获取缓存的渲染结果
    get(content) {
        const hash = this.simpleHash(content);
        const result = this.cache.get(hash) || null;
        // 🚀 记录命中情况
        if (result) {
            this.hits++;
        }
        else {
            this.misses++;
        }
        return result;
    }
    // 设置缓存
    set(content, rendered) {
        const hash = this.simpleHash(content);
        // 如果缓存已满，删除最早的条目
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(hash, rendered);
    }
    // 清空缓存
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }
    // 获取缓存统计信息
    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) : '0.0';
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize,
            hits: this.hits,
            misses: this.misses,
            hitRate: `${hitRate}%`
        };
    }
}
const mermaidCache = MermaidCacheManager.getInstance();
// 🚀 图片缓存管理器
class ImageCacheManager {
    constructor() {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // src路径 -> base64结果
        Object.defineProperty(this, "maxCacheSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        }); // 图片缓存可以更大一些
        Object.defineProperty(this, "hits", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 缓存命中次数
        Object.defineProperty(this, "misses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 缓存未命中次数
    }
    static getInstance() {
        if (!ImageCacheManager.instance) {
            ImageCacheManager.instance = new ImageCacheManager();
        }
        return ImageCacheManager.instance;
    }
    // 获取缓存的图片
    get(src) {
        const result = this.cache.get(src) || null;
        // 🚀 记录命中情况
        if (result) {
            this.hits++;
        }
        else {
            this.misses++;
        }
        return result;
    }
    // 设置缓存
    set(src, base64) {
        // 如果缓存已满，删除最早的条目
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(src, base64);
    }
    // 清空缓存
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }
    // 获取缓存统计信息
    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) : '0.0';
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize,
            hits: this.hits,
            misses: this.misses,
            hitRate: `${hitRate}%`
        };
    }
}
const imageCache = ImageCacheManager.getInstance();
/**
 * @description 预解析，来处理异步信息，因为markdown-it天然不支持异步
 * @returns env
 */
export default async function prepareParser(originalMd) {
    /**
     * @description 渲染mermaid，使用缓存优化性能
     */
    async function prepareMermaid(mermaidToken) {
        let src = mermaidToken.content;
        // 🚀 先检查缓存
        const cachedResult = mermaidCache.get(src);
        if (cachedResult) {
            return cachedResult;
        }
        // 🚀 缓存未命中，进行真正的渲染
        let parsedSrc;
        try {
            await mermaid.parse(src, { suppressErrors: false });
            if (await mermaid.parse(src, { suppressErrors: true })) {
                parsedSrc = await mermaid.render(`_mermaidSvg_${kit.getUUID().slice(0, 5)}`, src);
            }
            const result = parsedSrc.svg;
            // 🚀 存入缓存
            mermaidCache.set(src, result);
            return result;
        }
        catch (error) {
            const errorResult = `<pre class="ERR">Mermaid 渲染失败</pre>`;
            // 🚀 错误结果也缓存，避免重复尝试解析错误的内容
            mermaidCache.set(src, errorResult);
            return errorResult;
        }
    }
    /**
     * 处理 PDF 文件的导入并生成 Base64 URL
     * @param {string} filePath - 文件路径
     * @returns {Promise<string>} - Base64 编码的 PDF URL
     */
    async function preparePDF(pdfToken) {
        try {
            const filePath = decodeURIComponent(pdfToken.content.slice(2));
            const folderManager = new FileFolderManager();
            // 确保目录句柄存在，然后读取文件内容
            if (folderManager.getTopDirectoryHandle()) {
                const pdfContent = await folderManager.readFileContent(folderManager.getTopDirectoryHandle(), filePath, true);
                // 将 PDF 内容转换为 Base64 URL
                return `${pdfContent}`;
            }
            else {
                return `<div class="ERR">PDF 读取失败：请先打开本地文件夹</div>`;
            }
        }
        catch (error) {
            return `<div class="ERR">PDF 读取失败：文件不存在或路径错误</div>`;
        }
    }
    /**
     * @description 准备图片，使用缓存优化性能
     */
    async function prepareImage(imageToken) {
        let src = imageToken.attrGet("src");
        // 🚀 先检查缓存（除了 VF 图片，因为 VF 图片从数据库读取较快）
        if (!src.startsWith("/vf/")) {
            const cachedImage = imageCache.get(src);
            if (cachedImage) {
                return cachedImage;
            }
        }
        if (src.startsWith("/vf/")) {
            // VF 图片处理保持原样（不缓存，因为数据库查询已经够快）
            let imgId = src.match(/\d+/)?.[0];
            if (!imgId) {
                return undefined;
            }
            return await readMemoryImg("uuid", parseInt(imgId)).then((e) => {
                if (e && e.length > 0 && e[0] && e[0].imgBase64) {
                    return e[0].imgBase64;
                }
                else {
                    return undefined;
                }
            }).catch(() => {
                return undefined;
            });
        }
        else if (src.startsWith("./")) {
            // 相对路径图片处理
            try {
                const folderManager = new FileFolderManager();
                if (folderManager.getTopDirectoryHandle()) {
                    const result = await folderManager.readFileContent(folderManager.getTopDirectoryHandle(), decodeURIComponent(src).slice(2), true);
                    // 🚀 存入缓存
                    if (result) {
                        imageCache.set(src, result);
                    }
                    return result;
                }
                else {
                    // 未打开文件夹的提示 - 双语错误提示
                    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120">
            <rect width="400" height="120" fill="#f5f5f5" stroke="#d9d9d9" stroke-width="1" rx="4"/>
            <text x="200" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#d32f2f">Image Error</text>
            <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Please check if local folder is opened</text>
            <text x="200" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">or path is correct</text>
            <text x="200" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#999">请检查是否打开本地文件夹或路径是否正确</text>
          </svg>`;
                    // 手动编码为 base64，避免 btoa 中文问题
                    const base64 = btoa(unescape(encodeURIComponent(svgContent)));
                    const errorImage = `data:image/svg+xml;base64,${base64}`;
                    // 🚀 错误图片也缓存
                    imageCache.set(src, errorImage);
                    return errorImage;
                }
            }
            catch (error) {
                // 路径错误或文件不存在的提示 - 双语错误提示  
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120">
          <rect width="400" height="120" fill="#f5f5f5" stroke="#d9d9d9" stroke-width="1" rx="4"/>
          <text x="200" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#d32f2f">Image Error</text>
          <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Please check if local folder is opened</text>
          <text x="200" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">or path is correct</text>
          <text x="200" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#999">请检查是否打开本地文件夹或路径是否正确</text>
        </svg>`;
                // 手动编码为 base64，避免 btoa 中文问题
                const base64 = btoa(unescape(encodeURIComponent(svgContent)));
                const errorImage = `data:image/svg+xml;base64,${base64}`;
                // 🚀 错误图片也缓存
                imageCache.set(src, errorImage);
                return errorImage;
            }
        }
        else {
            // 其他类型的 src（网络图片等），返回原始值
            // 🚀 这些也可以缓存，避免重复处理
            imageCache.set(src, src);
            return src;
        }
    }
    /**
     * @description 预渲染设计思路，首先需要window._prepareData.envCache这个变量，并且是存储在indexedDB中的
     * 其次还需要window._prepareData.srcMap并且每次预渲染都要重建，在每次预渲染中比对srcMap的一致性，如果一致，
     * 那么直接沿用对应的上一次envCache对应的区域，如果不一致，那么更新为新的envCache。
     * python运行的结果则保存在envCache中，按钮逻辑里负责寻找是第几个python块就把他更新到对应位置envCache里就行。
     * 和mermaid不同，只有envCache被外部改变才会改变，也就是说python完全按照envCache当前值来渲染，预渲染并不会改变
     * 结果，因为**只有**按下运行按钮的时候，代码才会运行，与mermaid渲染逻辑略有区别，但总体结构设计基本一致。
     */
    let imageTokens = []; //用于保存提前解析出的图片token
    let mermaidTokens = [];
    let pdfTokens = [];
    let codeTokens = [];
    let vfImgSrcArr = [];
    let mermaidParsedArr = [];
    let pdfParsedArr = [];
    let md = markdownParser();
    md.renderer.rules.image = function (tokens, idx) {
        if (tokens[idx].attrGet("src")?.startsWith("/vf/")) {
            imageTokens.push(tokens[idx]); //存储图片token以供后续处理
        }
        else if (tokens[idx].attrGet("src")?.startsWith("./")) {
            imageTokens.push(tokens[idx]); //存储图片token以供后续处理
        }
        return "";
    };
    md.renderer.rules.fence = function (tokens, idx, option, env, slf) {
        const lang = tokens[idx].info;
        if (lang === "mermaid") {
            mermaidTokens.push(tokens[idx]);
            return "";
        }
        else if (lang === "py" || lang === "python") {
            codeTokens.push(tokens[idx]);
        }
        return "";
    };
    md.renderer.rules["import_inline"] = function (tokens, idx, options, env) {
        if (tokens[idx].meta.extension === "pdf") {
            pdfTokens.push(tokens[idx]);
        }
        return "";
    };
    md.render(originalMd, {}); //预先解析一次找出所有图片token
    // 处理图片 token
    for (const imageToken of imageTokens) {
        let temp = await prepareImage(imageToken); //异步获取图片链接并替换
        vfImgSrcArr.push(temp);
    }
    // 处理 mermaid token
    for (const mermaidToken of mermaidTokens) {
        let temp = await prepareMermaid(mermaidToken);
        mermaidParsedArr.push(temp);
    }
    // 处理 PDF token
    for (const pdfToken of pdfTokens) {
        let temp = await preparePDF(pdfToken);
        pdfParsedArr.push(temp);
    }
    let env = {
        vfImgSrcArr: vfImgSrcArr,
        vfImgSeq: 0,
        mermaidParsedArr: mermaidParsedArr,
        mermaidSeq: 0,
        pdfParsedArr: pdfParsedArr,
        pdfSeq: 0,
    };
    // 🚀 输出缓存统计信息（开发环境）
    if (process.env.NODE_ENV === 'development') {
        const mermaidStats = mermaidCache.getStats();
        const imageStats = imageCache.getStats();
        console.log(`📊 解析缓存统计:`, {
            mermaid: {
                size: `${mermaidStats.size}/${mermaidStats.maxSize}`,
                hitRate: mermaidStats.hitRate,
                hits: mermaidStats.hits,
                misses: mermaidStats.misses
            },
            images: {
                size: `${imageStats.size}/${imageStats.maxSize}`,
                hitRate: imageStats.hitRate,
                hits: imageStats.hits,
                misses: imageStats.misses
            },
            parsed: {
                images: imageTokens.length,
                mermaid: mermaidTokens.length,
                pdf: pdfTokens.length
            }
        });
    }
    return env;
}
// 🚀 导出缓存管理器，方便外部访问
export { mermaidCache, imageCache, MermaidCacheManager, ImageCacheManager };
// function importInline(state:any, silent:any) {
//   const max = state.posMax;
//   const start = state.pos;
//   // 检查开头是否为 "@["
//   if (state.src.charCodeAt(start) !== 0x40 /* @ */) {
//     return false;
//   }
//   if (state.src.charCodeAt(start + 1) !== 0x5b /* [ */) {
//     return false;
//   }
//   // 找到闭合的 ']' 和 '('
//   const endBracket = state.src.indexOf("]", start + 2);
//   if (endBracket === -1) {
//     return false;
//   }
//   if (state.src.charCodeAt(endBracket + 1) !== 0x28 /* ( */) {
//     return false;
//   }
//   const endParen = state.src.indexOf(")", endBracket + 2);
//   if (endParen === -1) {
//     return false;
//   }
//   // 提取 [import] 和 (path) 内的内容
//   const match = importRegex.exec(state.src.slice(start, endParen + 1));
//   if (!match) {
//     return false;
//   }
//   if (!silent) {
//     const token = state.push("import_plugin_pre", "", 0);
//     token.content = match[2].trim(); // 这是文件路径等内容
//     token.meta = { filePath: token.content };
//     const extensionMatch = token.content.match(/\.(md|xlsx|csv|pdf)$/);
//     if (!extensionMatch) {
//       // 不支持的文件扩展名，可以选择忽略或处理为默认情况
//       return false;
//     }
//     const extension = extensionMatch[1];
//   }
//   // 更新解析位置
//   state.pos = endParen + 1;
//   return true;
// }
