import { Monaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
export function monacoSnippets(
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) {
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
}
//
