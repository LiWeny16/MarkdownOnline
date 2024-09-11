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
