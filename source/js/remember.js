// function getRememberText() {
//     let text = kit.getCookie("contentText").replace(/\<\? br \?\>/g,"\n")
//     text = text.replace(/\<\? semicolon \?\>/g,";")
//     return text
// }
// function restoreText() {
//     let md = getMdText()
//     md = md.replace(/\n/g, "<? br ?>")
//     md = md.replace(/\;/g,"<? semicolon ?>")
//     kit.setCookie("contentText", md, 30, "/", "md.bigonion.cn")
//     // kit.setCookie("contentText", md, 30, "/", "127.0.0.1")
// }
// function fillInRemeText(){
//     let text = getRememberText()
//     writeMdText(text)
//     return text
// }