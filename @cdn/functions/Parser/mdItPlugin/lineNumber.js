function markdownitLineNumber(md, option) {
    const injectLineNumbers = function (tokens, idx, options, env, slf) {
        // console.log({ tokens1: tokens })
        let line;
        if (tokens[idx].map && tokens[idx].level === 0) {
            line = tokens[idx].map[0];
            // tokens[idx].attrJoin("class", "line")
            tokens[idx].attrSet("data-line", String(line));
        }
        // console.log(slf)
        return slf.renderToken(tokens, idx, options);
    };
    md.renderer.rules.paragraph_open =
        md.renderer.rules.heading_open =
            md.renderer.rules.table_open =
                injectLineNumbers;
}
export { markdownitLineNumber };
