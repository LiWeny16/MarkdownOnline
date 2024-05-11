// import "https://jsd.onmicrosoft.cn/pyodide/v0.24.1/full/pyodide.js"
// import { toJS } from "mobx"
import { type PyodideInterface, loadPyodide } from "pyodide"

class PythonInWeb {
  static pyodide: PyodideInterface | null = null
  constructor() {}

  // 异步函数用于加载 Pyodide 和 matplotlib
  static async loadPyodide(loadPyodide: any) {
    let pyodide = await loadPyodide
    PythonInWeb.pyodide = pyodide
    return pyodide
  }
  async loadPackage() {
    await PythonInWeb.pyodide!.loadPackage(["matplotlib", "micropip"])

    // 使用 micropip 安装其他 Python 包
    await PythonInWeb.pyodide!.runPythonAsync(`
        import micropip
        await micropip.install('matplotlib')
      `)
  }

  // 执行 Python 代码并生成图表
  async runPythonCode(code: string) {
    let pythonCode = `
    ${code}
      `

    // 执行 Python 代码并获取 Base64 图像字符串
    let plot_base64 = await PythonInWeb.pyodide!.runPythonAsync(pythonCode)

    // 将 Base64 编码的图像插入 HTML 中
    let img = document.createElement("img")
    img.src = "data:image/png;base64," + plot_base64
    console.log(img)
    console.log(plot_base64)
  }
}

export default PythonInWeb
