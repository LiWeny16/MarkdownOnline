import MarkdownIt from "markdown-it/lib";

let tablePlugin = function (md: MarkdownIt) {
    // 核心拦截器：移除所有表格相关的 token，防止 Markdown-it 解析表格
    md.core.ruler.after('block', 'table_to_div', (state) => {
        const tokens = state.tokens;
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            // 1. Intercept Markdown table tokens.
            if (token.type === 'table_open') {
                // Find the index of the matching table_close token.
                for (let j = i + 1; j < tokens.length; j++) {
                    if (tokens[j].type === 'table_close') {
                        // Remove the entire table token sequence and replace with a placeholder token.
                        const placeholderToken = new state.Token('html_block', '', 0);
                        placeholderToken.content = `<div data-line="${tokens[i].map![0]}" data-react-table class="react-table"></div>`;
                        tokens.splice(i, j - i + 1, placeholderToken);
                        break;
                    }
                }
            }


        }
    });
};

export { tablePlugin };


// // 2. Intercept raw HTML tables in the content.
// if ((token.type === 'html_block' || token.type === 'html_inline') && /<table\b/i.test(token.content)) {
//     // If a raw HTML <table> is detected, replace its content with the placeholder.
//     // (This covers cases where an HTML table might appear in the markdown source.)
//     const placeholderToken = new state.Token('html_block', '', 0);
//     placeholderToken.content = `<div class="react-table">test</div>`;
//     tokens.splice(i, 1, placeholderToken);
//     // Note: We replaced the current token with the placeholder. If the HTML table spanned
//     // multiple tokens, this simple approach covers the common case where the entire table
//     // is in one token. For multi-token HTML tables (split by blank lines), you could extend
//     // this to remove tokens until a closing </table> is found.
// }