// declare module "@App/myPrint" {
//   const myPrint: any
//   export default myPrint
// }
// declare module "@App/save" {
//   const save: any
//   export default save
// }
// declare module "@App/text/insertTextAtCursor" {
//   const insertTextAtCursor: any
//   export default insertTextAtCursor
// }
// declare module "@App/text/replaceText" {
//   const insertTextAtCursor: any
//   export default insertTextAtCursor
// }
// declare module "@App/textMemory/memory" {
//   const fillInMemoryText: any
//   const readMemoryText: any
//   const readMemoryImg: any
//   const fillInMemoryImg: any
//   export { fillInMemoryText, readMemoryText, readMemoryImg, fillInMemoryImg }
// }

// declare module "@App/text/getMdText" {
//   /**
//    * @description get Markdown Text
//    * @property {string} [id="md-area"]
//    * @returns {string} mdText
//    */
//   const getMdText: (id = "md-area") => string
//   export default getMdText
// }
declare module "@App/db.js" {
  /**
   * 打开数据库
   * @param {object} dbName 数据库的名字
   * @param {string} storeName 仓库名称
   * @param {string} version 数据库的版本
   * @return {object} 该函数会返回一个数据库实例
   */
  const openDB: (name: string, version?: number) => Promise<any>
  const getDataByIndex: any
  const cursorGetDataByIndex: any
  const addData: any
  const getDataByKey: any
  /**
   * 通过游标读取数据
   * @param {object} db 数据库实例
   * @param {string} storeName 仓库名称
   * @returns {Array} 读取的列表
   */
  const cursorGetData: any
  /**
   * 更新数据
   * @param {db} db 数据库实例
   * @param {string} storeName 仓库名称
   * @param {object} data 数据
   */
  const updateDB: (db: Object, storeName: string, data: Object) => void
  export {
    openDB,
    getDataByIndex,
    cursorGetDataByIndex,
    addData,
    getDataByKey,
    cursorGetData,
    updateDB
  }
}
