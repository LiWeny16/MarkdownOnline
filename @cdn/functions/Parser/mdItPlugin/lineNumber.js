function markdownitLineNumber(md, option) {
    const injectLineNumbers = function (tokens, idx, options, env, slf) {
        // console.log({ tokens1: tokens })
        let line;
        if (tokens[idx].map && tokens[idx].level === 0) {
            line = tokens[idx].map[0];
            // tokens[idx].attrJoin("class", "line")
            tokens[idx].attrSet("data-line", String(line));
        }
        else {
            if (tokens[idx].type === "list_item_open") {
                line = tokens[idx].map[0];
                tokens[idx].attrSet("data-line", String(line));
            }
            // if (tokens[idx].type === "tr_open") {
            //   line = tokens[idx].map![0]
            //   tokens[idx].attrSet("data-line", String(line))
            // }
        }
        return slf.renderToken(tokens, idx, options);
    };
    md.renderer.rules.paragraph_open =
        md.renderer.rules.heading_open =
            md.renderer.rules.table_open =
                md.renderer.rules.tr_open =
                    md.renderer.rules.th_open =
                        md.renderer.rules.bullet_list_open =
                            md.renderer.rules.list_item_open =
                                md.renderer.rules.import_plugin =
                                    injectLineNumbers;
}
export { markdownitLineNumber };
