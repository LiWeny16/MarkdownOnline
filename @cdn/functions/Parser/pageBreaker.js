/**
 * @description Replace the page breaker and properly format math formulas.
 * @param {string} md - The markdown text.
 * @returns {string} The processed markdown text.
 */
export default function PageBreaker(md) {
    // 替换分页符 |---| 为 HTML 的分页分隔符
    md = md.replace(/\|---\|/g, `<div style="page-break-after: always;"></div>`);
    return md;
}
