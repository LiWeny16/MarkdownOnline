// BigModel.ts
const token = "409f1e38b0d8586919166aa6117243f7.AVQTIQqUbGI1g8B5";
const url = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
class BigModel {
    /**
     * 流式询问 AI，并通过回调实时接收数据
     * @param content 用户输入的内容
     * @param onMessage 接收每个数据块的回调函数
     * @param onComplete 接收完整响应的回调函数
     * @param onError 处理错误的回调函数
     */
    async askAI(content, onMessage, onComplete, onError) {
        const data = {
            model: "glm-4-plus",
            tool: "web-search-pro",
            stream: true, // 启用流式响应
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.body) {
                throw new Error("ReadableStream not supported in this browser.");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
            let finalMessage = "";
            while (!done) {
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
        }
        catch (error) {
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