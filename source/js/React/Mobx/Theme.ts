// import { makeAutoObservable, observable } from "mobx"

// // 对应用状态进行建模。
// class ThemeStore {
//   themeState = "light"

//   constructor(themeState: string) {
//     makeAutoObservable(this, {
//       themeState: observable,
//     })
//     this.themeState = themeState
//   }

//   light() {
//     this.themeState = "light"
//   }

//   dark() {
//     this.themeState = "dark"
//   }
// }
// const themeStore = new ThemeStore("light")
// export const useTheme = () => themeStore
