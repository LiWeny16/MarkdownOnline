function getRememberText() {
    let text = kit.getCookie("contentText").replace(/\<\? br \?\>/g,"\n")
    return text
}
function restoreText() {
    let md = getMdText()
    md = md.replace(/\n/g, "<? br ?>")
    kit.setCookie("contentText", md, 30, "/", "md.bigonion.cn")
}
function fillInRemeText(){
    let text = getRememberText()
    writeMdText(text)
    return text
}