/**
 * @deprecated now
*/
import regs from "@App/regs/regs";
import { readMemoryImg } from "@App/textMemory/memory";
import hljs from "@cdn-hljs";
// import { marked } from "@cdn-marked"
import { emojify, has } from "@cdn-node-emoji";
import vconsole from "vconsole";
// import emojiJson from "https://npm.onmicrosoft.cn/@emoji-mart/data@1.1.2/sets/14/native.json"
const newTokenizer = {
    heading(src) {
        // console.log(heading);
        const match = src.match(/^#{1,6}\s.*/);
        // console.log(match)
        // if (match) {
        //   return {
        //     type: "heading",
        //     raw: match[0],
        //     // text: match[1].trim(),
        //   }
        // }
        return false;
    },
    codespan(src) {
        const match = src.match(/^\&+([^\&\n]+?)\&+/);
        // if (match) {
        //   return {
        //     type: "codespan",
        //     raw: match[0],
        //     text: match[1].trim(),
        //   }
        // }
        // return false to use original codespan tokenizer
        return false;
    },
}; // if (match) {
//   return {
//     type: 'codespan',
//     raw: match[0],
//     text: match[1].trim()
//   };
// }
//#region *********************renderer*********************
// console.log(emojiJson);
export const newRenderer = {
    paragraph(text) {
        return `<p class="line-hilight">${text}</p>`;
    },
    heading(text, level) {
        // console.log(text,level);
        return `
            <h${level}  class="line-hilight">
              <a href="#">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`;
    },
    code(code, lang, _escaped) {
        let finalCodeBlock;
        if (lang == "js-run") {
            let _vconsole = new vconsole();
            return `${eval(code)}`;
        }
        if (hljs.getLanguage(lang)) {
            finalCodeBlock = `<pre><code class="language-${lang} ">${code}</code></pre>`;
        }
        else if (lang == "mermaid") {
            finalCodeBlock = `<div class="language-mermaid language-plaintext">${code}</div>`;
        }
        else {
            finalCodeBlock = `<pre><code class="language-plaintext">${code}</code></pre>`;
        }
        return finalCodeBlock;
    },
    /**
     * 拓展图片
     *
     * @param href   图片路径
     * @param _title null
     * @param text   图片的名称
     */
    image(href, _title, text) {
        const grammar = "#";
        let randon = Math.random();
        let width = "auto"; // 宽度
        let style = ""; // 样式
        let position = "L";
        let tags = text.split(grammar);
        if (tags.length > 1) {
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (tag === "s") {
                    style += "box-shadow: rgb(199 199 199) 1vh 2vh 21px";
                }
                if (tag === "s1") {
                    style += "box-shadow: rgb(146 146 146) 1vh 2vh 21px;";
                }
                if (tag === "s2") {
                    style += "box-shadow: rgb(32 32 32 / 86%) 1vh 2vh 21px";
                }
                if (tag === "C" || tag == "c") {
                    position = "C";
                }
                if (tag === "R" || tag == "r") {
                    position = "R";
                }
                if (tag.startsWith("w")) {
                    width = tags[i].substring(1);
                    if (!width.endsWith("%")) {
                        width += "px";
                    }
                }
            }
        }
        // return text
        return `<div class="imgBox-r FLEX ${randon} ${position == "C" ? " JUS-CENTER" : position == "R" ? "JUS-RIGHT" : ""}" ><img class="img_resize_transition" width="${width}" style="${style}" src="${href}" alt="${text}"></div>`;
    },
};
export const headingRenderer = {
    /**
     * 标题解析为 TOC 集合, 增加锚点跳转
     *
     * @param text  标题内容
     * @param level 标题级别
     */
    heading(text, level) {
        const realLevel = level;
        return `<h${realLevel} id="${realLevel}-${text}">${text}</h${realLevel}>`;
    },
};
export const initTocs = (id) => {
    // 获取指定ID，渲染后的html都在该标签内
    let ele = document.getElementById(id);
    if (ele == null || undefined) {
        return [];
    }
    let heads = document
        .getElementById(id)
        .querySelectorAll("h1, h2, h3, h4, h5, h6");
    let tocs = [];
    for (let i = 0; i < heads.length; i++) {
        let head = heads[i];
        let level = 1;
        let name = head.innerText;
        let id = head.id;
        switch (head.localName) {
            case "h2":
                level = 2;
                break;
            case "h3":
                level = 3;
                break;
            case "h4":
                level = 4;
                break;
        }
        let toc = {
            name: name,
            id: id,
            level: level,
        };
        tocs.push(toc);
    }
    return tocs;
};
//#endregion
//#region *********************extensions*********************
export const importUrlExtension = {
    extensions: [
        {
            name: "importUrl",
            level: "block",
            start(src) {
                return src.indexOf("\n:");
            },
            tokenizer(src) {
                const rule = /^:(https?:\/\/.+?):/;
                const match = rule.exec(src);
                if (match) {
                    return {
                        type: "importUrl",
                        raw: match[0],
                        url: match[1],
                        html: "", // will be replaced in walkTokens
                    };
                }
            },
            renderer(token) {
                return `<iframe style="border:none" src="${token.url}" width="100%" height="100%"></iframe>`;
            },
        },
    ],
};
export const markItExtension = {
    extensions: [
        {
            name: "markIt",
            level: "inline", // Signal that this extension should be run inline
            start(src) {
                return src.match(/@@/)?.index;
            },
            tokenizer(src, _tokens) {
                const match = src.match(regs.markHighlight);
                const text = match ? match[1] : "";
                if (match) {
                    return {
                        type: "markIt",
                        raw: src,
                        text: text,
                    };
                }
            },
            renderer(token) {
                let renderText = token.raw.replace(regs.markHighlight, `<mark>${token.text}</mark>`);
                return `${renderText}`;
            },
        },
    ],
};
/**
 * @description 注意！在这里如果不加extension进去，表示使用的是内在tokenizer或者renderer，那么就要放在extension里面
 *  示例：
 *   marked.use(
      {
        extensions: [customExtension],
      }
    )
 * 但如果加入了extension 例如：markItExtension 就可以直接放进去，表示自定义tokenizer或者renderer
 *
 *
*/
export const imgExtension = {
    name: "newRenderer",
    level: "block", // Signal that this extension should be run inline
    tokenizer: newTokenizer,
    renderer: newRenderer,
    async: true, // needed to tell marked to return a promise
    async walkTokens(token) {
        if (token.type === "heading") {
            // console.log({token:token})
        }
        if (token.type === "image") {
            const href = token.href;
            // const title = token.title
            if (href?.match(/vf/)) {
                let imgId = (href.match(/vf\/(\d+)/) ? href.match(/vf\/(\d+)/)[1] : 0).toString();
                let imgBase64_ = await readMemoryImg("uuid", parseInt(imgId)).then((e) => {
                    return e[0] ? e[0].imgBase64 : 0;
                });
                token.href = imgBase64_;
            }
        }
        else if (token.type === "code") {
            // eval
            // console.log(token)
        }
        else if (token.type === "importUrl") {
            // console.log(token);
        }
    },
};
/**
 * @deprecated
 */
export const clueExtension = {
    extensions: [
        {
            name: "clue",
            level: "inline", // Signal that this extension should be run inline
            start(src) {
                return src.match(/:/)?.index;
            },
            tokenizer(src, _tokens) {
                const match = src.match(regs.emoji);
                if (match) {
                    return {
                        type: "clue",
                        raw: match[0],
                        text: match[1],
                    };
                }
                return false;
            },
            renderer(token) {
                if (has(token.raw)) {
                    return emojify(token.raw);
                }
                return token.raw;
            },
        },
    ],
};
export const emojiExtension = {
    extensions: [
        {
            name: "emoji",
            level: "inline", // Signal that this extension should be run inline
            start(src) {
                return src.match(/:/)?.index;
            },
            tokenizer(src, _tokens) {
                const match = src.match(regs.emoji);
                if (match) {
                    return {
                        type: "emoji",
                        raw: match[0],
                        text: match[1],
                    };
                }
                return false;
            },
            renderer(token) {
                if (has(token.raw)) {
                    return emojify(token.raw);
                }
                return token.raw;
            },
        },
    ],
};
// #endregion
