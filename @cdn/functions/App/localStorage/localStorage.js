/**
 * @description 封装localStorage
 */
class OperateLocalStorage {
    constructor() {
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "0.2"
        });
    }
    setItem(key, value) {
        localStorage.setItem(key, value);
    }
    getItem(key) {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        }
        else {
            return "";
        }
    }
    removeItem(key) {
        localStorage.removeItem(key);
    }
}
export default OperateLocalStorage;
