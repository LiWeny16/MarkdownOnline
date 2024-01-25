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
} from "./latexRules"
export function monacoSnippets(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
  /**
   * @补全table等
   *
   */
  monaco.languages.registerCompletionItemProvider("markdown", {
    //@ts-ignore
    provideCompletionItems: (model, position, context) => {
      var suggestions = [
        {
          label: "clg",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "console.log(${1:val})",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "调试...",
        },
        {
          label: "code",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `
\`\`\`\${1:language}
\${2:value}
\`\`\`
`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "code",
        },
        {
          label: "table 2x2",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `
|\${1:}    |\${1:}     |
|--- |---  |
|\${1:}    |\${1:}     |
`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "table 2x2",
        },
        {
          label: "table 2x4",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `
|\${1:}    |\${1:}    |\${1:}    |\${1:}    |
|--- |--- |--- |--- |
|\${1:}    |\${1:}    |\${1:}    |\${1:}    |
`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "table 2x4",
        },
        {
          label: "ignore",
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: `<!-- prettier-ignore -->`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "ignore prettier",
        },
        {
          label: "ignore-block",
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: `<!-- prettier-ignore-start -->
\${1:}
<!-- prettier-ignore-end -->`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "ignore block",
        },
      ]
      return { suggestions: suggestions }
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
      if (
        textUntilPosition.match(/\$\$/g)
          ? textUntilPosition.match(/\$\$/g)!.length % 2 === 1
          : false
      ) {
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
            ...verticalLayout2,
            ...binomialCoefficients2,
            ...fractions2,
            ...color2,
            ...envs,
          ],
          (e) => {
            return {
              label: `\\${e}`,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: e,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            }
          }
        )
        return {
          suggestions: suggestions,
        }
      }
    },
  })
}
//
