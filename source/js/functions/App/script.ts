export function isSyntaxValid(code: any) {
  try {
    eval(code)
    return true // 代码语法正确
  } catch (error) {
    // console.error("语法错误:", error)
    return false // 代码存在语法错误
  }
}
