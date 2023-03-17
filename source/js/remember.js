function getRememberText() {
    let text = kit.getCookie("contentText").replace(/\<\? br \?\>/g,"\n")
    text = text.replace(/\<\? \; \?\>/g,";")
    return text
}
function restoreText() {
    let md = getMdText()
    md = md.replace(/\n/g, "<? br ?>")
    md = md.replace(/\;/g,"<? ; ?>")
    kit.setCookie("contentText", md, 30, "/", "md.bigonion.cn")
}
function fillInRemeText(){
    let text = getRememberText()
    writeMdText(text)
    return text
}