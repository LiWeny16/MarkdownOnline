/**
 * @description Replace the page breaker and properly format math formulas.
 * @param {string} md - The markdown text.
 * @returns {string} The processed markdown text.
 */
export default function PageBreaker(md: string): string {
  // 替换分页符 |---| 为 HTML 的分页分隔符
  md = md.replace(/\|---\|/g, `<div style="page-break-after: always;"></div>`);

  // 处理行间公式 \[...\] => $$...$$
  md = md.replace(/\\\[(.*?)\\\]/gs, (_, formula) => `$$${formula}$$`);

  // 处理行内公式 \(...\) => $...$
  md = md.replace(/\\\((.*?)\\\)/gs, (_, formula) => {
    // 移除公式中的空白字符，确保没有空格
    const trimmedFormula = formula.replace(/\s+/g, '');
    return `$${trimmedFormula}$`;
  });

  return md;
}
