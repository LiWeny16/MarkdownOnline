// BigModel.ts
const token = "4f0f9e54e52e43faadbf24c9a7754b00" + "." + "Xon9PmRyJShYVVJ7";
const url = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
class BigModel {
    constructor() {
        Object.defineProperty(this, "abortController", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    /**
     * 中断当前的AI请求
     */
    abortCurrentRequest() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
    /**
     * 流式询问 AI，并通过回调实时接收数据
     * @param content 用户输入的内容
     * @param onMessage 接收每个数据块的回调函数
     * @param onComplete 接收完整响应的回调函数
     * @param onError 处理错误的回调函数
     */
    async askAI(content, promptText, onMessage, onComplete, onError, base64) {
        const getContent = () => {
            if (base64) {
                return [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": base64
                        }
                    },
                    {
                        "type": "text",
                        "text": content
                    }
                ];
            }
            else {
                return content;
            }
        };
        const data = {
            model: base64 ? "GLM-4V-Plus-0111" : "GLM-4.5",
            tool: "web-search-pro",
            stream: true, // 启用流式响应
            messages: [
                {
                    role: "system",
                    content: "你是专业的Markdown写作助手，提供简洁准确的内容，直接输出可用的Markdown格式文本，不用代码块包裹。"
                },
                {
                    role: "system",
                    content: "格式规范：数学公式用$包裹（行内）或$$包裹（块级）；图表用正确的mermaid语法；保持层次清晰。"
                },
                {
                    role: "system",
                    content: promptText ?
                        `用户选中文本："${promptText}"，请根据要求处理此文本（修改/扩写/优化等），未指明则默认优化。`
                        : "根据用户问题提供相应的Markdown内容。"
                },
                {
                    role: "user",
                    content: getContent(),
                },
            ],
        };
        try {
            // 创建新的 AbortController
            this.abortController = new AbortController();
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(data),
                signal: this.abortController.signal, // 添加信号以支持中断
            });
            if (!response.body) {
                throw new Error("ReadableStream not supported in this browser.");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
            let finalMessage = "";
            while (!done) {
                // 检查是否被中断
                if (this.abortController.signal.aborted) {
                    onComplete(finalMessage);
                    return;
                }
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    // 假设服务器以行（newline）分隔数据块
                    const lines = chunk.split("\n").filter((line) => line.trim() !== "");
                    for (const line of lines) {
                        if (line.startsWith("data:")) {
                            const jsonStr = line.replace("data:", "").trim();
                            if (jsonStr === "[DONE]") {
                                onComplete(finalMessage);
                                this.abortController = null; // 清理控制器
                                return;
                            }
                            try {
                                const json = JSON.parse(jsonStr);
                                const choice = json.choices[0];
                                const messageChunk = choice.delta?.content;
                                if (messageChunk) {
                                    finalMessage += messageChunk;
                                    onMessage(messageChunk);
                                }
                            }
                            catch (err) {
                                console.error("JSON parse error:", err);
                                onError(err);
                            }
                        }
                    }
                }
            }
            this.abortController = null; // 清理控制器
        }
        catch (error) {
            this.abortController = null; // 清理控制器
            if (error.name === 'AbortError') {
                // 请求被中断，这是正常情况
                onComplete("回答已中断");
                return;
            }
            console.error("Error:", error);
            onError(error);
        }
    }
}
Object.defineProperty(BigModel, "token", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: token
});
const bigModel = new BigModel();
export default bigModel;
