export declare const cdnDomains: string[];
export declare const cdnDomainsNpm: string[];
export default function cdnInit(): Promise<void>;
export declare function testCdns(): Promise<void>;
/**
 * @description 动态加载指定的脚本标签，并替换指定的 CDN 域名。
 * @returns {Promise<void>} 在所有脚本加载成功后返回 Promise。
 */
export declare function loadScripts(): Promise<void>;
export declare function preload(): Promise<void>;
