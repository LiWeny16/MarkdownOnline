/**
 * monacoScroll.ts
 * created by 2024/5/7
 * @file monaco编辑器滚动同步
 * @author  Bigonion
 * */
// import { debounce } from "@mui/material"
import { getSettings } from "@App/config/change";
import { debounce } from "@mui/material";
/**
 * 监听页面高度变化, 自适应设置编辑器高度
 * */
export default function monacoScrollEvent(editor, monaco) {
    const debouncedScrollHandler = debounce(() => {
        syncScrollOnce(editor, monaco);
    }, 20);
    editor.onDidScrollChange(debouncedScrollHandler);
}
/**
 * @description 同步滚动主函数，负责传递editor的line
 */
function syncScrollOnce(editor, monaco) {
    /**
     * @description 检查同步滚动是否开启
     */
    if (getSettings().basic.syncScroll) {
        // 获取当前可见的行号范围
        const visibleRanges = editor.getVisibleRanges();
        // 检查是否返回了可见范围
        if (visibleRanges.length > 0) {
            const firstVisibleRange = visibleRanges[0];
            const startLine = firstVisibleRange.startLineNumber;
            // console.log("首行:", startLine)
            syncScroll(startLine - 1);
        }
    }
}
/**
 * @description 负责同步滚动到最近的Element上
 */
function syncScroll(lineNumber) {
    const viewArea = document.getElementById("view-area");
    if (!viewArea)
        return;
    if (lineNumber === 0) {
        viewArea.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }
    const elements = document.querySelectorAll("#view-area [data-line]");
    let closestPrevElement = null;
    let closestNextElement = null;
    let closestPrevDistance = Infinity;
    let closestNextDistance = Infinity;
    let exactlyElement = null;
    elements.forEach((element) => {
        const line = parseInt(element.getAttribute("data-line") || "0", 10);
        const distance = line - lineNumber;
        if (distance == 0) {
            exactlyElement = element;
        }
        else {
            if (distance < 0 && Math.abs(distance) < closestPrevDistance) {
                closestPrevDistance = Math.abs(distance);
                closestPrevElement = element;
            }
            if (distance > 0 && distance < closestNextDistance) {
                closestNextDistance = distance;
                closestNextElement = element;
            }
        }
    });
    if (exactlyElement) {
        viewArea.scrollTo({
            top: exactlyElement.offsetTop,
            behavior: "smooth",
        });
        return;
    }
    if (!closestNextElement) {
        viewArea.scrollTo({
            top: closestPrevElement.offsetTop,
            behavior: "smooth",
        });
        return;
    }
    if (closestPrevElement && closestNextElement) {
        const offsetPre = closestPrevElement.offsetTop;
        const offsetNext = closestNextElement.offsetTop;
        closestPrevDistance;
        closestNextDistance;
        const ratio = (lineNumber - (lineNumber - closestPrevDistance)) /
            (closestNextDistance + closestPrevDistance);
        const ratioDistance = (offsetNext - offsetPre) * ratio + offsetPre;
        viewArea.scrollTo({
            top: ratioDistance,
            behavior: "smooth",
        });
    }
}
export { syncScrollOnce };
