export function isCursorInHtmlBlock(model, position) {
    const fullContent = model.getValue();
    const lines = fullContent.split("\n");
    const cursorLine = position.lineNumber - 1;
    let openTag = "";
    let closeTag = "";
    let insideTag = false;
    let openTagLine = -1;
    let closeTagLine = -1;
    const selfClosingTags = new Set(["br", "img", "input", "hr", "meta", "link"]);
    // 向上查找最近的 HTML 块级开始标签
    for (let i = cursorLine; i >= 0; i--) {
        const matchOpen = lines[i].match(/<([a-zA-Z]+)(\s+[^>]*)?>/);
        if (matchOpen) {
            openTag = matchOpen[1];
            // 跳过自闭合标签
            if (selfClosingTags.has(openTag) || lines[i].includes("/>"))
                continue;
            openTagLine = i;
            insideTag = true;
            break;
        }
    }
    if (!insideTag)
        return false;
    // 向下查找最近的 HTML 结束标签
    for (let i = cursorLine; i < lines.length; i++) {
        const matchClose = lines[i].match(new RegExp(`</${openTag}>`));
        if (matchClose) {
            closeTag = matchClose[0];
            closeTagLine = i;
            break;
        }
    }
    return openTagLine !== -1 && closeTagLine !== -1 && openTagLine <= cursorLine && cursorLine <= closeTagLine;
}
