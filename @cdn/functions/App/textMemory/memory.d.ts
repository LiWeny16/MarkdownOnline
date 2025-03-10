export declare function fillInMemoryText(md: MD): void;
export declare function readMemoryText(): Promise<any>;
/**
 * @description 单次存储图片
 */
export declare function fillInMemoryImg(base64: string, timeStamp: number): void;
/**
 * @description 批量存储图片
 */
export declare function fillInMemoryImgs(base64Arr: Array<string>, timeStamp: number): void;
/**
 * @description 读取image base64
 * @param indexName 索引名
 * @param indexValue 索引值
 */
export declare function readMemoryImg(indexName: any, indexValue: any): Promise<any>;
export declare function readAllMemoryImg(): Promise<any>;
