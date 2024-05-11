/**
 * @description 插件拓展类，代码拓展运行/复制
 */
export default class CodePlugin {
    constructor();
    /**
     * @name addButtonsToCodeBlocks
     * @description 为所有代码添加按钮
     */
    addButtonsToCodeBlocks: () => void;
    private copyToClipboard;
}
