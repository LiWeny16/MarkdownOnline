declare class BigModel {
    protected static token: string;
    /**
     * 流式询问 AI，并通过回调实时接收数据
     * @param content 用户输入的内容
     * @param onMessage 接收每个数据块的回调函数
     * @param onComplete 接收完整响应的回调函数
     * @param onError 处理错误的回调函数
     */
    askAI(content: string, promptText: string, onMessage: (message: string) => void, onComplete: (finalMessage: string) => void, onError: (error: any) => void, base64: string): Promise<void>;
}
declare const bigModel: BigModel;
export default bigModel;
