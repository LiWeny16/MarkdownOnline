// markdown-it-import-plugin.js
const importFilePlugin = function importPlugin(md) {
    // 定义匹配 @[import](path/to/file.ext) 的正则表达式
    const importRegex = /^@\[(import)\]\(([^)]+)\)$/;
    function importInline(state, silent) {
        const max = state.posMax;
        const start = state.pos;
        // 检查开头是否为 "@["
        if (state.src.charCodeAt(start) !== 0x40 /* @ */) {
            return false;
        }
        if (state.src.charCodeAt(start + 1) !== 0x5b /* [ */) {
            return false;
        }
        // 找到闭合的 ']' 和 '('
        const endBracket = state.src.indexOf("]", start + 2);
        if (endBracket === -1) {
            return false;
        }
        if (state.src.charCodeAt(endBracket + 1) !== 0x28 /* ( */) {
            return false;
        }
        const endParen = state.src.indexOf(")", endBracket + 2);
        if (endParen === -1) {
            return false;
        }
        // 提取 [import] 和 (path) 内的内容
        const match = importRegex.exec(state.src.slice(start, endParen + 1));
        if (!match) {
            return false;
        }
        if (!silent) {
            const filePath = match[2].trim();
            const extensionMatch = filePath.match(/\.(md|xlsx|csv|pdf)$/);
            if (!extensionMatch) {
                // 不支持的文件扩展名，可以选择忽略或处理为默认情况
                return false;
            }
            const extension = extensionMatch[1];
            // 根据扩展名定义 class 名
            let className = "";
            switch (extension) {
                case "md":
                    className = "import-md";
                    break;
                case "xlsx":
                    className = "import-xlsx";
                    break;
                case "csv":
                    className = "import-csv";
                    break;
                case "pdf":
                    className = "import-pdf";
                    break;
                default:
                    className = "import-unknown";
            }
            // 创建包含 class 名的 div
            const tokenOpen = state.push("html_inline", "", 0);
            tokenOpen.content = `<div class="${className}">`;
            // 这里可以选择在 div 中包含文件路径或其他信息
            tokenOpen.content = `<div class="${className}" data-path="${filePath}">`;
            if (extension === "pdf") {
                // 创建 PDF <embed> 元素
                const embedToken = state.push("html_inline", "", 0);
                embedToken.content = `<embed src="${filePath}" type="application/pdf" width="100%" height="600px">`;
            }
            const tokenClose = state.push("html_inline", "", 0);
            tokenClose.content = `</div>`;
        }
        // 更新解析位置
        state.pos = endParen + 1;
        return true;
    }
    // 在内联规则中注册插件，确保在其他内联规则之前处理
    md.inline.ruler.before("emphasis", "import_plugin", importInline);
};
export default importFilePlugin;
