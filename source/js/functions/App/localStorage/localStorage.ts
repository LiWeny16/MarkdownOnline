/**
 * @description 封装localStorage
 */
class operateLocalStorage {
  readonly version = "0.1"
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }
  getItem(key: string) :string{
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

export default operateLocalStorage
