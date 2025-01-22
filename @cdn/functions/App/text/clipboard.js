/**
 * @description 操作剪切板
 * @param text 要粘贴的文本
 */
export function writeClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        // 使用现代的 Clipboard API
        navigator.clipboard.writeText(text).catch((err) => {
            console.error("Failed to copy text using Clipboard API: ", err);
            fallbackCopyText(text);
        });
    }
    else {
        // 回退到使用 execCommand
        fallbackCopyText(text);
    }
}
function fallbackCopyText(text) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // 防止 textarea 出现在页面上
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "1px";
        textArea.style.height = "1px";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        if (successful) {
            console.log("Text copied to clipboard using execCommand.");
        }
        else {
            console.error("Fallback: Failed to copy text using execCommand.");
        }
        document.body.removeChild(textArea);
    }
    catch (err) {
        console.error("Fallback: Unable to copy text to clipboard: ", err);
    }
}
/**
 * @description 读取剪切板（兼容更多设备）
 * @returns {Promise<string>}
 */
export async function readClipboard() {
    // 检查是否支持 navigator.clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
        try {
            const text = await navigator.clipboard.readText();
            return text || "";
        }
        catch (err) {
            console.error("Failed to read clipboard contents via clipboard API: ", err);
        }
    }
    // 降级方案：尝试使用 document.execCommand
    try {
        const textArea = document.createElement("textarea");
        document.body.appendChild(textArea);
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px"; // 将文本区域移出屏幕
        textArea.focus();
        document.execCommand("paste"); // 触发粘贴命令
        const text = textArea.value;
        document.body.removeChild(textArea); // 清理 DOM
        return text || "";
    }
    catch (err) {
        console.error("Failed to read clipboard contents via execCommand: ", err);
    }
    // 如果都不支持，返回空字符串
    console.warn("Clipboard API and execCommand are not supported on this device.");
    return "";
}
