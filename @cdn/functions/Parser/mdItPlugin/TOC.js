const defaultSlugify = (title) => title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
const tocPlugin = (md, options = {}) => {
    const opts = {
        tocMarker: "[TOC]",
        tocClass: "custom-toc",
        firstLevel: 1,
        lastLevel: 6,
        slugify: defaultSlugify,
        ...options,
    };
    let stateTokens = [];
    md.core.ruler.push("generate_toc", (state) => {
        stateTokens = state.tokens;
        let tocIndex = -1;
        const headings = [];
        // 遍历所有 token 查找 [TOC] 和标题信息
        stateTokens.forEach((token, idx) => {
            if (token.type === "inline" && token.content.trim() === opts.tocMarker) {
                tocIndex = idx;
            }
            if (token.type === "heading_open") {
                const level = parseInt(token.tag.slice(1), 10);
                if (level >= opts.firstLevel && level <= opts.lastLevel) {
                    const nextToken = stateTokens[idx + 1];
                    if (nextToken?.type === "inline") {
                        const title = nextToken.content;
                        const slug = opts.slugify(title);
                        headings.push({ level, title, slug });
                        token.attrSet("id", slug); // 为标题生成 ID
                    }
                }
            }
        });
        // 如果找到 [TOC] 标记，生成目录并替换
        if (tocIndex !== -1) {
            const tocHtml = renderNestedTOC(headings, opts);
            stateTokens[tocIndex] = createTOCToken(tocHtml);
        }
    });
    // 渲染 TOC HTML
    function renderNestedTOC(headings, opts) {
        let html = `<ul class="${opts.tocClass}">\n`;
        let lastLevel = opts.firstLevel;
        headings.forEach((heading, index) => {
            const levelDiff = heading.level - lastLevel;
            if (levelDiff > 0) {
                // 开始新的嵌套列表
                for (let i = 0; i < levelDiff; i++) {
                    html += '<ul>\n';
                }
            }
            else if (levelDiff < 0) {
                // 关闭嵌套列表
                for (let i = 0; i < -levelDiff; i++) {
                    html += '</li>\n</ul>\n';
                }
                html += '</li>\n';
            }
            else {
                // 同级别，关闭上一个列表项
                if (index !== 0) {
                    html += '</li>\n';
                }
            }
            html += `<li><a href="#${heading.slug}">${heading.title}</a>`;
            lastLevel = heading.level;
        });
        // 关闭所有未关闭的标签
        for (let i = lastLevel; i >= opts.firstLevel; i--) {
            html += '</li>\n</ul>\n';
        }
        return html;
    }
    // 创建一个 HTML block token 用于替换 [TOC]
    function createTOCToken(content) {
        return {
            type: "html_block",
            content,
            block: true,
            level: 0,
        };
    }
};
export default tocPlugin;
