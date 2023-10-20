import { makeAutoObservable, observable } from "mobx"

// 对应用状态进行建模。
class ImageStore {
  displayState = false

  constructor(displayState: boolean) {
    makeAutoObservable(this, {
      displayState: observable,
    })
    this.displayState = displayState
  }

  display() {
    this.displayState = true
  }

  hidden() {
    this.displayState = false
  }
}
const imageStore = new ImageStore(false)
export const useImage = () => imageStore
