import { changeSettings, getSettings } from "@App/config/change";
import alertUseArco from "@App/message/alert";
export default function exeSyncScrollAction(editor, monaco) {
    if (getSettings().basic.syncScroll) {
        /**
         * @description 关闭同步滚动
         */
        alertUseArco("同步滚动已关闭 🧐 ", 2000);
        changeSettings({ basic: { syncScroll: false } });
    }
    else {
        /**
         * @description 开启同步滚动
         */
        alertUseArco("同步滚动已开启 😍 ", 2000);
        const currentScrollTop = editor.getScrollTop();
        // 设置新的滚动位置，向下移动 offset 的量
        editor.setScrollTop(currentScrollTop + 0.3);
        editor.setScrollTop(currentScrollTop - 0.3);
        const visibleRanges = editor.getVisibleRanges();
        if (visibleRanges.length > 0) {
            const firstVisibleRange = visibleRanges[0];
            const startLine = firstVisibleRange.startLineNumber;
            const viewArea = document.getElementById("view-area");
            if (startLine == 1) {
                viewArea.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        }
        changeSettings({ basic: { syncScroll: true } });
    }
}
