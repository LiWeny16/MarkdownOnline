class PythonInWeb {
    constructor() { }
    // 异步函数用于加载 Pyodide 和 matplotlib
    static async loadPyodide(loadPyodide) {
        let pyodide = await loadPyodide();
        PythonInWeb.pyodide = pyodide;
        return pyodide;
    }
    async loadPackage() {
        await PythonInWeb.pyodide.loadPackage([
            "matplotlib",
            "micropip",
            "numpy",
            "pandas",
        ]);
        // 使用 micropip 安装其他 Python 包
        // await PythonInWeb.pyodide!.runPythonAsync(`
        //     import micropip
        //     await micropip.install('numpy')
        //     await micropip.install('pandas')
        //   `)
    }
    // 执行 Python 代码并生成图表
    async runPythonCode(code) {
        let pythonCode = `
import io
import base64
import sys
from io import StringIO

##################### 自定义print，使其支持输出到函数的返回结果，不然只有控制台有

# 重定向输出
output = StringIO()
sys.stdout = output

# 自定义 print 函数
def print(*args, **kwargs):
    output.write(" ".join(map(str, args)) + "\\n")

${code}


buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode('utf-8')


# 获取输出内容
result = output.getvalue()
sys.stdout = sys.__stdout__  # 恢复标准输出
result
########################
`;
        // 执行 Python 代码并获取 Base64 图像字符串
        let plot_base64 = await PythonInWeb.pyodide.runPythonAsync(pythonCode);
        console.log(plot_base64);
        const plotDiv = document.getElementById("plot");
        // 将 Base64 编码的图像插入 HTML 中
        let img = document.createElement("img");
        img.src = "data:image/png;base64," + plot_base64;
        plotDiv?.appendChild(img);
    }
}
Object.defineProperty(PythonInWeb, "pyodide", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
export default PythonInWeb;
