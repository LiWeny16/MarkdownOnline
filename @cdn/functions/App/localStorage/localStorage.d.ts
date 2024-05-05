/**
 * @description 封装localStorage
 */
declare class operateLocalStorage {
    readonly version = "0.1";
    setItem(key: string, value: string): void;
    getItem(key: string): string;
    removeItem(key: string): void;
}
export default operateLocalStorage;
