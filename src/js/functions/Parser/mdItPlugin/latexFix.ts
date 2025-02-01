import MarkdownIt from "markdown-it";

export default function latexFix(md: MarkdownIt) {
    function inlineMath(state: any, silent: any) {
        let start = state.pos;

        // 检查当前字符是否是 '\' 且下一个字符是 '('
        if (state.src[start] !== '\\' || state.src[start + 1] !== '(') {
            return false;
        }

        // 查找匹配的结束标记 "\)"
        let end = state.src.indexOf('\\)', start + 2);
        if (end === -1) {
            return false;
        }

        if (!silent) {
            // 获取公式内容，并移除空白字符（如果你确实希望这么做）
            const formula = state.src.slice(start + 2, end).replace(/\s+/g, '');

            // 正确创建一个 Token
            let token = state.push('math_inline', '', 0);
            // 这里直接将公式用 $ 包裹，可根据需要自定义
            token.content = `${formula}`;
        }

        // 更新状态位置，跳过已处理的部分
        state.pos = end + 2;
        return true;
    }
    function blockMath(state:any, startLine:any, endLine:any, silent:any) {
        let pos = state.bMarks[startLine] + state.tShift[startLine];
        let max = state.eMarks[startLine];

        if (state.src.slice(pos, pos + 2) !== '\\[') return false;

        let line = state.src.slice(pos + 2, max);
        let content = [];
        let found = false;
        let nextLine = startLine;
        let closePos = line.indexOf('\\]');

        if (closePos !== -1) {
            content.push(line.slice(0, closePos));
            found = true;
        } else {
            content.push(line);
            for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
                pos = state.bMarks[nextLine] + state.tShift[nextLine];
                max = state.eMarks[nextLine];
                let currLine = state.src.slice(pos, max);
                closePos = currLine.indexOf('\\]');
                if (closePos !== -1) {
                    content.push(currLine.slice(0, closePos));
                    found = true;
                    break;
                }
                content.push(currLine);
            }
        }

        if (!found) return false;

        if (!silent) {
            let token = state.push('math_block', '', 0);
            token.block = true;
            token.content = content.join('\n').trim();
            token.map = [startLine, nextLine + 1];
        }
        state.line = nextLine + 1;
        return true;
    }
    md.block.ruler.before('paragraph', 'math_block', blockMath, { alt: ['paragraph'] });
    md.inline.ruler.before('escape', 'math_inline2', inlineMath);
};
