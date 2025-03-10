let myPlugin = function (md) {
    // 添加myrule规则
    // md.renderer.rules.text = function (tokens, idx, options, env, slf) {
    //   var token = tokens[idx]
    //   // console.log(tokens);
    //   // 这是一个示例，实际情况下一定要根据你的需求处理token
    //   return md.renderer.rules.code_block!(tokens, idx, options, env, slf)
    //   // return slf.renderToken(tokens, idx, options)
    // }
    // 然后需要在解析规则中对应处理 "myrule"
    md.core.ruler.before("inline", "myrule", function (state) {
        var tokens = state.tokens;
        // console.log(tokens)
        // 遍历所有的token，找出需要使用myrule渲染规则的token
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].content && tokens[i].content.indexOf("MYRULE") !== -1) {
            }
        }
    });
};
export { myPlugin };
