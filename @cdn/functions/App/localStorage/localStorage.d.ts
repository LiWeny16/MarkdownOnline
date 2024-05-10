/**
 * @description 封装localStorage
 */
declare class OperateLocalStorage {
    readonly version = "0.2";
    setItem(key: string, value: string): void;
    getItem(key: string): string;
    removeItem(key: string): void;
}
export default OperateLocalStorage;
