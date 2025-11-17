declare class MermaidCacheManager {
    private static instance;
    private cache;
    private maxCacheSize;
    private hits;
    private misses;
    static getInstance(): MermaidCacheManager;
    private simpleHash;
    get(content: string): string | null;
    set(content: string, rendered: string): void;
    clear(): void;
    getStats(): {
        size: number;
        maxSize: number;
        hits: number;
        misses: number;
        hitRate: string;
    };
}
declare const mermaidCache: MermaidCacheManager;
declare class ImageCacheManager {
    private static instance;
    private cache;
    private maxCacheSize;
    private hits;
    private misses;
    static getInstance(): ImageCacheManager;
    get(src: string): string | null;
    set(src: string, base64: string): void;
    clear(): void;
    getStats(): {
        size: number;
        maxSize: number;
        hits: number;
        misses: number;
        hitRate: string;
    };
}
declare const imageCache: ImageCacheManager;
/**
 * @description 预解析，来处理异步信息，因为markdown-it天然不支持异步
 * @returns env
 */
export default function prepareParser(originalMd: string): Promise<{
    vfImgSrcArr: any[];
    vfImgSeq: number;
    mermaidParsedArr: string[];
    mermaidSeq: number;
    pdfParsedArr: any;
    pdfSeq: number;
}>;
export { mermaidCache, imageCache, MermaidCacheManager, ImageCacheManager };
