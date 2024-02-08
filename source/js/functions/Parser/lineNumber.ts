// @ts-nocheck
/**
 * @copyright 不是我反正
 * */ 
const initOption = {
  startLine: 'data-line',
  endLine: 'data-end-line',
  codeBlock: true,
  codeInline: true,
  htmlBlock: true,
  text: true,
};

 function markdownitLineNumber(md, option = {}) {
  option = Object.assign({}, initOption, option);

  const keys = Object.keys(md.renderer.rules);
  const rules = {};
  // console.log(option);
  // console.log(md);
  if (option.codeBlock) {
    md.renderer.rules.code_block = function codeBlockRenderer(tokens, idx, options, env, slf) {
      const token = tokens[idx];
      const escapeHtml = md.utils.escapeHtml;
      const startLine = token.map[0];
      const codeInner = escapeHtml(token.content)
        .split('\n')
        .map((lineContent, i) => {
          if (lineContent.length) {
            const startLineAttr = lineAttr(option.startLine, startLine + i);
            lineContent = `<span ${startLineAttr}>${lineContent}</span>`;
          }
          return lineContent;
        })
        .join('\n');

      return `<pre ${slf.renderAttrs(token)}><code>${codeInner}</code></pre>\n`;
    };
  }

  if (option.htmlBlock) {
    md.renderer.rules.html_block = function (tokens, idx, options, env, slf) {
      const token = tokens[idx];
      const startLine = token.map[0];
      const content = token.content
        .split('\n')
        .map((lineContent, i) => {
          if (!lineContent.length) {
            return lineContent;
          }

          const startLineAttr = lineAttr(option.startLine, startLine + i);
          // todo: Use AST parse
          if (/(<[^</]+?)(>)/.test(lineContent)) {
            // <div> -> <div data-line="0">
            lineContent = lineContent.replace(/(<[^</]+?)(>)/, `$1 ${startLineAttr}$2`);
          } else if (lineContent.length && !/<[^<]+?>/.test(lineContent)) {
            // abc -> <span data-line="0">abc</span>
            lineContent = `<span ${startLineAttr}>${lineContent}</span>`;
          } else if (/([^<]+?)(<[^<]+?>)/.test(lineContent)) {
            // abc</div> -> <span data-line="1">abc</span></div>
            lineContent = lineContent.replace(/([^<]+?)(<[^<]+?>)/, `<span ${startLineAttr}>$1</span>$2`);
          }
          return lineContent;
        })
        .join('\n');
      return `<div ${slf.renderAttrs(token)}>${content}</div>`;
    };
  }

  if (option.text) {
    md.renderer.rules.text = function (tokens, idx) {
      const token = tokens[idx];
      const escapeHtml = md.utils.escapeHtml;
      if (token.content) {
        return `<span ${lineAttr(option.startLine, token._line)}>${escapeHtml(token.content)}</span>`;
      } else {
        return token.content;
      }
    };
  }

  md.core.ruler.push('inline_number', function (state) {
    const { tokens } = state;
    if (!Array.isArray(tokens)) {
      return;
    }

    tokens.forEach((token) => {
      if (!Array.isArray(token.map) || token.map[0] == undefined) {
        return;
      }

      token.attrPush([option.startLine, token.map[0]]);
      // token.attrPush([option.endLine, token.map[1]]);

      const children = token.children;

      if (token.type === 'inline' && Array.isArray(children)) {
        let line = token.map[0];
        children.forEach((inlineToken, index) => {
          if (inlineToken.type && inlineToken.type.indexOf('break') > -1) {
            line += 1;
          }

          inlineToken._line = line;
          inlineToken.attrPush([option.startLine, line]);
        });
      }
    });
  });
};

function lineAttr(name, value) {
  return value != null ? `${name}="${value}"` : '';
}

export {markdownitLineNumber}