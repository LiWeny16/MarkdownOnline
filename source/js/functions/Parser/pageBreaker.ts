/**
 * @description Replace the page breaker.
 * @param {MD} md the text
 */
export default function PageBreaker(md: MD) {
  let reg1 = /\|---\|/g
  md = md.replace(reg1, () => {
    let replacedDiv: string = `<div style="page-break-after: always;"></div>`
    return replacedDiv
  })
  return md
}
