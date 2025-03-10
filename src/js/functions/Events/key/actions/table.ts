import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"
import getCommandPaletteText from "@App/text/palette"

export default function exeTableAction() {
  console.log(getCommandPaletteText().split("#"));
  const row = getCommandPaletteText().split("#")[1]
  const col = getCommandPaletteText().split("#")[2]
  insertTextMonacoAtCursor(generateMarkdownTable(row, col), true)
}
/**
 * @description 生成行列markdown
 */
function generateMarkdownTable(rows: any, columns: any) {
  if (!rows || !columns) {
    return ""
  }
  let markdownTable = "| "

  // Generate table headers
  for (let c = 0; c < columns; c++) {
    markdownTable += `Header  ${c + 1} | `
  }
  // Generate table dividers
  markdownTable += "\n|"
  for (let c = 0; c < columns; c++) {
    markdownTable += "--- | "
  }
  // Generate table rows
  for (let r = 0; r < rows; r++) {
    markdownTable += "\n| "
    for (let c = 0; c < columns; c++) {
      markdownTable += ` Cell ${r + 1}-${c + 1} | `
    }
  }
  return markdownTable
}
