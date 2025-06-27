// // markdown-it-incremental-dom-merged.js
// export default function incrementalDomPlugin(md, opts = {}) {
//     // --------------------------
//     //  1) 合并后的 rules.js
//     // --------------------------
//     function buildDefaultRules(incrementalDom) {
//         const { elementClose, elementOpen, elementVoid, text } = incrementalDom;
//         return {
//             code_inline(tokens, idx, options, env, slf) {
//                 return () => {
//                     elementOpen.apply(
//                         this,
//                         ['code', '', []].concat(slf.renderAttrsToArray(tokens[idx]))
//                     );
//                     text(tokens[idx].content);
//                     elementClose('code');
//                 };
//             },

//             code_block(tokens, idx, options, env, slf) {
//                 return () => {
//                     elementOpen.apply(
//                         this,
//                         ['pre', '', []].concat(slf.renderAttrsToArray(tokens[idx]))
//                     );
//                     elementOpen('code');
//                     text(tokens[idx].content);
//                     elementClose('code');
//                     elementClose('pre');
//                 };
//             },

//             hardbreak() {
//                 return () => elementVoid('br');
//             },

//             softbreak(tokens, idx, options) {
//                 return () => (options.breaks ? elementVoid('br') : text('\n'));
//             },

//             text(tokens, idx) {
//                 return () => text(tokens[idx].content);
//             },
//         };
//     }

//     // --------------------------
//     //  2) 合并后的 renderer.js
//     // --------------------------
//     function buildRenderer(incrementalDom) {
//         const Parser = require('htmlparser2').Parser;

//         // 用来暂存自动关闭的标签
//         const autoClosingStack = [];

//         const autoClosing = () => {
//             const stack = autoClosingStack.shift();
//             if (!stack) return;
//             stack.reverse().forEach(tag => incrementalDom.elementClose(tag));
//         };

//         const { attr, elementOpenEnd, elementVoid, text } = incrementalDom;

//         const elementOpen = (tag, ...args) => {
//             if (autoClosingStack.length > 0) autoClosingStack[0].push(tag);
//             incrementalDom.elementOpen(tag, ...args);
//         };

//         const elementOpenStart = tag => {
//             if (autoClosingStack.length > 0) autoClosingStack[0].push(tag);
//             incrementalDom.elementOpenStart(tag);
//         };

//         const elementClose = tag => {
//             if (autoClosingStack.length > 0) autoClosingStack[0].pop();
//             incrementalDom.elementClose(tag);
//         };

//         const sanitizeName = name => name.replace(/[^-:\w]/g, '');

//         const iDOMParser = new Parser(
//             {
//                 onopentag: name => elementOpenEnd(sanitizeName(name)),
//                 onopentagname: name => elementOpenStart(sanitizeName(name)),
//                 onattribute: (name, value) => {
//                     const sanitizedName = sanitizeName(name);
//                     if (sanitizedName !== '') attr(sanitizedName, value);
//                 },
//                 ontext: text,
//                 onclosetag: name => elementClose(sanitizeName(name)),
//             },
//             {
//                 decodeEntities: true,
//                 lowerCaseAttributeNames: false,
//                 lowerCaseTags: false,
//             }
//         );

//         // 若是函数则执行，否则调用 parser.write 进行解析
//         const wrapIncrementalDOM = html =>
//             typeof html === 'function' ? html() : iDOMParser.write(html);

//         return {
//             renderAttrsToArray(token) {
//                 if (!token.attrs) return [];
//                 // attrs 是二维数组，如 [["class","foo"], ["id","bar"]]
//                 return token.attrs.reduce((acc, attr) => acc.concat(attr), []);
//             },

//             renderInline(tokens, options, env) {
//                 return () => {
//                     autoClosingStack.unshift([]);
//                     tokens.forEach((current, i) => {
//                         const { type } = current;
//                         if (this.rules[type] !== undefined) {
//                             wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this));
//                         } else {
//                             this.renderToken(tokens, i, options)();
//                         }
//                     });
//                     autoClosing();
//                 };
//             },

//             renderToken(tokens, idx) {
//                 return () => {
//                     const token = tokens[idx];
//                     if (token.hidden) return;

//                     if (token.nesting === -1) {
//                         elementClose(token.tag);
//                     } else {
//                         const func = token.nesting === 0 ? elementVoid : elementOpen;
//                         func.apply(
//                             this,
//                             [token.tag, '', []].concat(this.renderAttrsToArray(token))
//                         );
//                     }
//                 };
//             },

//             render(tokens, options, env) {
//                 return () => {
//                     autoClosingStack.unshift([]);
//                     tokens.forEach((current, i) => {
//                         const { type } = current;
//                         if (type === 'inline') {
//                             this.renderInline(current.children, options, env)();
//                         } else if (this.rules[type] !== undefined) {
//                             wrapIncrementalDOM(this.rules[type](tokens, i, options, env, this));
//                         } else {
//                             this.renderToken(tokens, i, options, env)();
//                         }
//                     });
//                     autoClosing();
//                     iDOMParser.reset(); // 记得重置解析器
//                 };
//             },
//         };
//     }

//     // --------------------------
//     //  3) 合并后的主插件逻辑
//     // --------------------------
//     const {
//         target: userTarget,
//         incrementalizeDefaultRules = true,
//         ...restOptions
//     } = opts;

//     // 若未传入 target，则尝试使用 window.IncrementalDOM
//     const incrementalDOM =
//         !userTarget && typeof window !== 'undefined'
//             ? window.IncrementalDOM
//             : userTarget;

//     if (!incrementalDOM) {
//         throw new Error(
//             'incrementalDomPlugin: 未检测到可用的 IncrementalDOM，请检查参数或 window.IncrementalDOM 是否存在。'
//         );
//     }

//     // 构造 renderer（渲染器）
//     const mixin = buildRenderer(incrementalDOM);

//     // 给 markdown-it 实例扩展新的属性 (IncrementalDOMRenderer)
//     Object.defineProperty(md, 'IncrementalDOMRenderer', {
//         get() {
//             const extended = Object.assign(
//                 // 以 md.renderer 原型为原型创建一个空对象
//                 Object.create(Object.getPrototypeOf(md.renderer)),
//                 // 并将 md.renderer 拓展到其中
//                 md.renderer,
//                 // 最后再混入我们自定义的渲染逻辑
//                 mixin
//             );

//             // 如果需要替换默认规则，则混入我们基于 IncrementalDOM 的 rule 实现
//             if (incrementalizeDefaultRules) {
//                 extended.rules = {
//                     ...extended.rules,
//                     ...buildDefaultRules(incrementalDOM),
//                 };
//             }
//             return extended;
//         },
//     });

//     // 提供便捷渲染方法
//     md.renderToIncrementalDOM = (src:any, env = {}) =>
//         md.IncrementalDOMRenderer.render(md.parse(src, env), md.options, env);

//     md.renderInlineToIncrementalDOM = (src:any, env = {}) =>
//         md.IncrementalDOMRenderer.render(md.parseInline(src, env), md.options, env);

//     // 如果需要在 markdown-it 插件体系内执行一些额外的逻辑，可在此补充
//     // 比如 md.core.ruler.before(...) 或者 md.inline.ruler.after(...)

//     // 返回值非必须，markdown-it 官方插件多是返回 void
//     // 这里保留一个可选的返回值，防止有后续扩展需求
//     return {
//         ...restOptions,
//     };
// }
