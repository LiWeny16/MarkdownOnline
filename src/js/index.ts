import hljs from "@cdn-hljs"
import { getMdTextFromMonaco } from "@App/text/getMdText"
import pageBreaker from "@Func/Parser/pageBreaker"
import "../css/index.less"
import { markdownParser } from "@Func/Init/allInit"
import prepareParser from "@Func/Parser/prepareParser/prepare"
import { TableManager } from "./React/SubComponents/SubBody/SuperComs/ReactTable.tsx"
import { updateTableRegistryFromMarkdown, tableSyncManager } from "@App/text/tableEditor"
import { tableRegistry } from "@Func/Parser/mdItPlugin/table"

/**
 * @description 循环执行触发主解析事件流
 */
export async function mdConverter(fully = false) {
  let view: string = getMdTextFromMonaco()
  // 测试
  view = pageBreaker(view)
  /**
   * @description 处理需要异步的信息
   * */

  let env = await prepareParser(view)
  
  // 在渲染前，获取表格管理器实例
  const tableManager = TableManager.getInstance()
  
  if (fully || !window.IncrementalDOM) {
    document.getElementById("view-area")!.innerHTML = markdownParser().render(
      view,
      env
    )
  } else {
    // 使用IncrementalDOM进行差异渲染
    // React表格内容现在通过tablePlugin中的skip()自动保护
    window.IncrementalDOM.patch(
      document.getElementById("view-area") as HTMLElement,
      // @ts-ignore
      markdownParser().renderToIncrementalDOM(view, env)
    )
  }
  
  hljs.highlightAll()
  
  // 🚀 优化后的表格管理流程：
  // 只在fully渲染时或表格注册表为空时更新注册表
  const needsRegistryUpdate = fully || !tableSyncManager || tableRegistry.size === 0;
  
  if (needsRegistryUpdate) {
    console.log('需要更新表格注册表，执行完整更新流程');
    // 在DOM更新完成后，更新表格注册表信息并挂载React表格组件
    updateTableRegistryFromMarkdown();
  } else {
    console.log('跳过表格注册表更新，使用现有数据');
  }
  
  // 总是尝试挂载表格（智能检测是否需要实际更新）
  tableManager.mountTables()
}

