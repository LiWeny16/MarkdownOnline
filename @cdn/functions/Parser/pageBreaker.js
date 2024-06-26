/**
 * @description Replace the page breaker.
 * @param {MD} md the text
 */
export default function PageBreaker(md) {
    let reg1 = /\|---\|/g;
    md = md.replace(reg1, () => {
        let replacedDiv = `<div style="page-break-after: always;"></div>`;
        return replacedDiv;
    });
    return md;
}
