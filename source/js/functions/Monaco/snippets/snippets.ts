import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import {
  accents1,
  delimiters0,
  delimeterSizing0,
  greekLetters0,
  otherLetters0,
  annotation1,
  verticalLayout0,
  verticalLayout1,
  verticalLayout2,
  overlap1,
  spacing0,
  spacing1,
  logicAndSetTheory0,
  logicAndSetTheory1,
  macros0,
  bigOperators0,
  binaryOperators0,
  fractions0,
  fractions2,
  binomialCoefficients0,
  binomialCoefficients2,
  mathOperators0,
  mathOperators1,
  sqrt1,
  relations0,
  negatedRelations0,
  arrows0,
  extensibleArrows1,
  braketNotation1,
  classAssignment1,
  color2,
  font0,
  font1,
  size0,
  style0,
  symbolsAndPunctuation0,
  debugging0,
  envs,
} from "@cdn-latex-map"

// import emojilib from "@cdn-emojilib"
export function monacoSnippets(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  /**
   * @补全普通提示，采用“/”触发提示
   *
   */
  monaco.languages.registerCompletionItemProvider("markdown", {
    triggerCharacters: ["/"],
    //@ts-ignore
    provideCompletionItems: (model, position, context) => {
      const textUntilPosition: string = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      const rangeWithFirstLetter = {
        startLineNumber: position.lineNumber,
        startColumn: position.column - 1, // 包括"/"字符
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      }
      if (!isInLatexBlock(textUntilPosition) && position.column === 2) {
        let _suggestions = [
          {
            label: "/code (代码块)",
            detail: "插入一段代码块",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `
\`\`\`\${1:js}
\${2:}
\`\`\`
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: "0",
            range: rangeWithFirstLetter,
          },
          {
            label: "/image (图片)",
            detail: "插入图片",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `![\${1:}](\${2:})`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: "1",
            range: rangeWithFirstLetter,
          },
          {
            label: "/table-2x2 (表格)",
            detail: "插入一个2行2列的表格",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `
|\${1:}    |\${1:}     |
|--- |---  |
|\${1:}    |\${1:}     |
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: "2",
            range: rangeWithFirstLetter,
          },
          {
            label: "/table-2x4 (表格)",
            detail: "插入一个2行4列的表格",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `
|\${1:}    |\${1:}    |\${1:}    |\${1:}    |
|--- |--- |--- |--- |
|\${1:}    |\${1:}    |\${1:}    |\${1:}    |
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: "3",
            range: rangeWithFirstLetter,
          },
          {
            label: "/latex-block (公式块)",
            detail: "创建一个LaTex公式块",
            kind: monaco.languages.CompletionItemKind.Field,
            sortText: "4",
            range: rangeWithFirstLetter,
            insertText: `\$\$
\${1:}
\$\$
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/list-in-order (有序列表)",
            detail: "创建有序列表",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "5",
            range: rangeWithFirstLetter,
            insertText: `
1. \${1:}
2. \${2:}
3. \${3:}
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/page-breaker (分页符)",
            detail: "插入一个分页符",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "6",
            range: rangeWithFirstLetter,
            insertText: `
|---|
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/mermaid-flowChart (流程图)",
            detail: "插入mermaid流程图",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "7",
            range: rangeWithFirstLetter,
            insertText: `
\`\`\`mermaid
flowchart TB
Start --> Stop
\`\`\`
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/mermaid-pie-chart (饼图)",
            detail: "插入mermaid饼图",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "8",
            range: rangeWithFirstLetter,
            insertText: `
\`\`\`mermaid
pie title \${1:Pets adopted by volunteers}
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
\`\`\`
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/mermaid-mind-map (思维导图)",
            detail: "插入mermaid思维导图",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "9",
            range: rangeWithFirstLetter,
            insertText: `
\`\`\`mermaid
mindmap
Root
    A
      B
      C
\`\`\`
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/mermaid-time-line (时间线图)",
            detail: "插入mermaid时间线图",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "a1",
            range: rangeWithFirstLetter,
            insertText: `
\`\`\`mermaid
timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter
\`\`\`
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/mermaid-sequence (序列图)",
            detail: "插入mermaid序列图",
            kind: monaco.languages.CompletionItemKind.Function,
            sortText: "a2",
            range: rangeWithFirstLetter,
            insertText: `
\`\`\`mermaid
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!
\`\`\`
`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "/prettier-ignore (忽略格式化行)",
            detail: "下一行不进行prettier格式化",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `<!-- prettier-ignore -->`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: rangeWithFirstLetter,
            sortText: "b1",
          },
          {
            label: "/prettier-ignore-block (忽略格式化块)",
            detail: "忽略prettier格式化块",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `<!-- prettier-ignore-start -->
\${1:}
<!-- prettier-ignore-end -->`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: rangeWithFirstLetter,
            sortText: "b2",
          },
        ]
        return { suggestions: _suggestions }
      }
    },
  })
  /**
   * @补全Latex
   */
  monaco.languages.registerCompletionItemProvider("markdown", {
    triggerCharacters: ["\\"],
    //@ts-ignore
    provideCompletionItems: (model, position, context) => {
      // console.log(context)
      const textUntilPosition: string = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      // 类似的，如果是在一个 LaTeX 代码块中，返回 LaTeX 的提示。
      if (isNeedToUseLatexIntellisense(textUntilPosition)) {
        const suggestions = Array.from(
          [
            ...delimiters0,
            ...delimeterSizing0,
            ...greekLetters0,
            ...otherLetters0,
            ...spacing0,
            ...verticalLayout0,
            ...logicAndSetTheory0,
            ...macros0,
            ...bigOperators0,
            ...binaryOperators0,
            ...binomialCoefficients0,
            ...fractions0,
            ...mathOperators0,
            ...relations0,
            ...negatedRelations0,
            ...arrows0,
            ...font0,
            ...size0,
            ...style0,
            ...symbolsAndPunctuation0,
            ...debugging0,
          ],
          (e, index) => {
            return {
              label: `\\${e}`,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: e,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              sortText: /[A-Z]/.test(e[0]) ? "1" : "0",
            }
          }
        )
        const suggestions2 = Array.from(
          [
            ...accents1,
            ...annotation1,
            ...verticalLayout1,
            ...overlap1,
            ...spacing1,
            ...logicAndSetTheory1,
            ...mathOperators1,
            ...sqrt1,
            ...extensibleArrows1,
            ...font1,
            ...braketNotation1,
            ...classAssignment1,
          ],
          (e, index) => {
            return {
              label: `\\${e}`,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `${e}\{$1\}`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              sortText: /[A-Z]/.test(e[0]) ? "1" : "0",
            }
          }
        )
        const suggestions3 = Array.from(
          [
            ...verticalLayout2,
            ...binomialCoefficients2,
            ...fractions2,
            ...color2,
          ],
          (e, index) => {
            return {
              label: `\\${e}`,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `${e}\{$1\}\{$2\}`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              sortText: /[A-Z]/.test(e[0]) ? "1" : "0",
            }
          }
        )
        const suggestions4 = [
          {
            label: `\\begin`,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "begin{${1|" + envs.join(",") + "|}}\n\t$2\n\\end{$1}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
        ]
        return {
          suggestions: [
            ...suggestions,
            ...suggestions2,
            ...suggestions3,
            ...suggestions4,
          ],
        }
      }
    },
  })

  /**
   * @补全clue
   */
  monaco.languages.registerCompletionItemProvider("markdown", {
    triggerCharacters: ["^"],
    //@ts-ignore
    provideCompletionItems: (model, position, context) => {
      const textUntilPosition: string = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      if (isNeedToUseClueIntellisense(textUntilPosition)) {
        let _suggestions = [
          {
            label: "RED",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "RED",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "RED...",
          },
          {
            label: "PINK",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "PINK",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "PINK...",
          },
        ]
        return { suggestions: _suggestions }
      }
    },
  })
}
//

/**
 * @description 判断是否需要启用LaTex提示
 * @param textUntilPosition string
 */
export function isNeedToUseLatexIntellisense(
  textUntilPosition: string
): boolean {
  // console.log(textUntilPosition[textUntilPosition.length - 1]);
  if (
    textUntilPosition[textUntilPosition.length - 1] === "\\" &&
    isInLatexBlock(textUntilPosition)
  ) {
    return true
  } else {
    return false
  }
}

export function isInLatexBlock(textUntilPosition: string): boolean {
  return (
    (textUntilPosition.match(/\$\$/g)
      ? textUntilPosition.match(/\$\$/g)!.length % 2 === 1
      : false) ||
    (textUntilPosition.match(/\$/g)
      ? textUntilPosition.match(/\$/g)!.length % 2 === 1
      : false)
  )
}

export function isNeedToUseClueIntellisense(textUntilPosition: string) {
  // console.log(textUntilPosition[textUntilPosition.length-1]);
  if (textUntilPosition[textUntilPosition.length - 1] === "^") {
    return true
  } else {
    return false
  }
}
