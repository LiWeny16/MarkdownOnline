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
            model: base64 ? "glm-4v-plus-0111" : "glm-4-plus",
            tool: "web-search-pro",
            stream: true, // 启用流式响应
            messages: [
                {
                    role: "system",
                    content: "你是一个专门为markdown写作输出内容的AI助手，严禁废话，若用户问换行符号怎么写，你的回答只需要：<br>"
                },
                {
                    role: "system",
                    content: "你作为一个markdownAI助手，只需要回答markdown格式纯文本即可，不要用markdown代码包裹回答，除非用户主动要求"
                },
                {
                    role: "system",
                    content: "所有数学/公式/定律/方程必须遵循:行内公式用单$包裹，公式块用两个$$包裹！严谨直接打印出来"
                },
                {
                    role: "system",
                    content: "用户问你思维导图/饼图等mermaid的语法图怎么写，你需要回答正确语法的mermaid内容，如```mermaid \n graph TD;\nA[人工智能学习思维导图] --> B[基础知识];\nB --> B1[数学基础];```"
                },
                {
                    role: "system",
                    content: promptText ?? `用户鼠标选中了这一段文本：${promptText}可能需要修改，扩写等对这段文本操作，你只需要回答修改后的文本即可`
                },
                {
                    role: "user",
                    content: getContent(),
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
