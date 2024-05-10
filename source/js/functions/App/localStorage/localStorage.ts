/**
 * @description 封装localStorage
 */
class OperateLocalStorage {
  readonly version = "0.2"
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }
  getItem(key: string): string {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key)!
    } else {
      return ""
    }
  }
  removeItem(key: string) {
    localStorage.removeItem(key)
  }
}

export default OperateLocalStorage
