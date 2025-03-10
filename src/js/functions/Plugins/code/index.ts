/**
 * @description 插件拓展类，代码拓展运行/复制
 */
export default class CodePlugin {
  constructor() {}

  /**
   * @name addButtonsToCodeBlocks
   * @description 为所有代码添加按钮
   */
  public addButtonsToCodeBlocks = () => {
    const codeBlocks = document.getElementsByClassName(
      "language-code"
    ) as HTMLCollectionOf<HTMLElement>
    // console.log(codeBlocks)
    for (let i = 0; i <= codeBlocks.length - 1; i++) {
      console.log(codeBlocks[i])
    }
    Array.from(codeBlocks).forEach((block) => {
      console.log(block)
      const button = document.createElement("button")
      button.textContent = "Copy"
      button.className = "MuiButton-root" // 使用 Material-UI 的样式
      button.style.position = "absolute"
      button.style.top = "5px"
      button.style.right = "5px"
      button.onclick = () => this.copyToClipboard(block)

      if (!block.style.position) {
        block.style.position = "relative" // 设置相对定位以便按钮定位
      }

      block.appendChild(button)
    })
  }
  private copyToClipboard = (block: HTMLElement) => {
    const code = block.getElementsByTagName("code")[0].textContent!
    navigator.clipboard.writeText(code).then(
      () => {
        alert("Code copied to clipboard!")
      },
      (err) => {
        console.log(err)
      }
    )
  }
}
