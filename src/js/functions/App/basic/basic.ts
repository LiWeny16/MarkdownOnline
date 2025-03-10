/**
 * @description 合并对象
 * @param oldObj 旧对象
 * @param newObj 新对象
*/
export function mergeObjects(oldObj: any, newObj: any) {
  // 如果任何一个参数不是对象或者是null，直接返回旧对象
  if (
    typeof oldObj !== "object" ||
    oldObj === null ||
    typeof newObj !== "object" ||
    newObj === null
  ) {
    return oldObj
  }
  // 遍历新对象的所有键
  for (let key in newObj) {
    if (newObj.hasOwnProperty(key)) {
      // 如果新对象的键对应的值也是对象，递归处理
      if (typeof newObj[key] === "object" && newObj[key] !== null) {
        oldObj[key] = mergeObjects(oldObj[key], newObj[key])
      } else {
        // 否则直接覆盖旧对象的值
        oldObj[key] = newObj[key]
      }
    }
  }
  return oldObj
}

// 轮询检测函数，如果所有变量都存在则resolve
export function pollVariables(variableNames: string[]): Promise<void> {
  return new Promise<void>((resolve) => {
    let attempts = 0

    const doPoll = () => {
      let allExist = true
      for (const name of variableNames) {
        if (typeof (window as any)[name] === "undefined") {
          allExist = false
          break
        }
      }
      if (allExist) {
        resolve()
      } else {
        attempts++
        let timeout = 1000 // 默认间隔为1000ms

        if (attempts <= 5) {
          timeout = 30 // 前5次轮询，间隔30ms
        } else if (attempts <= 10) {
          timeout = 50 // 6-10次轮询，间隔50ms
        }

        setTimeout(doPoll, timeout)
      }
    }

    doPoll()
  })
}
