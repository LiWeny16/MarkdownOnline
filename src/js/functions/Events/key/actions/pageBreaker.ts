import { insertTextMonacoAtCursor } from "@App/text/insertTextAtCursor"

export default function exeInsertPageBreakerAction() {
  insertTextMonacoAtCursor("|---|\n", true)
}
