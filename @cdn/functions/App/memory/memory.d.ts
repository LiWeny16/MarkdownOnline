declare function checkIndexedDBSupport(): boolean;
export declare function fillInMemoryText(md: MD): Promise<void>;
export declare function readMemoryText(): Promise<any[]>;
export declare function fillInMemoryImg(base64: string, timeStamp: number): Promise<void>;
export declare function fillInMemoryImgs(base64Arr: string[], timeStamp: number): Promise<void>;
export declare function readMemoryImg(indexName: string, indexValue: any): Promise<any[]>;
export declare function readAllMemoryImg(): Promise<any[]>;
/**
 * @description 数据库初始化函数 - 在应用启动时调用
 * 执行一次健康检查和自动修复
 */
export declare function initMemoryDB(): Promise<void>;
/**
 * @description 手动触发数据库健康检查和修复
 */
export declare function checkAndRepairDatabase(): Promise<{
    isHealthy: boolean;
    issues: string[];
    repaired: boolean;
}>;
export { checkIndexedDBSupport };
