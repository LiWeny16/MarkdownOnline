// import words from "an-array-of-english-words";
import { accents1, delimiters0, delimeterSizing0, greekLetters0, otherLetters0, annotation1, verticalLayout0, verticalLayout1, verticalLayout2, overlap1, spacing0, spacing1, logicAndSetTheory0, logicAndSetTheory1, macros0, bigOperators0, binaryOperators0, fractions0, fractions2, binomialCoefficients0, binomialCoefficients2, mathOperators0, mathOperators1, sqrt1, relations0, negatedRelations0, arrows0, extensibleArrows1, braketNotation1, classAssignment1, color2, font0, font1, size0, style0, symbolsAndPunctuation0, debugging0, envs, } from "@cdn-latex-map";
import { FileFolderManager } from "@App/fileSystem/file";
import { getSettings } from "@App/config/change";
import { getFormattedDate } from "@App/user/date";
import { fetchStoredJSON } from "@App/db";
// let words: any[] = []
export async function monacoSnippets(editor, monaco) {
    /**
     * @补全普通提示，采用"/"触发提示
     *
     */
    monaco.languages.registerCompletionItemProvider("markdown", {
        triggerCharacters: ["/"],
        provideCompletionItems: (model, position, context) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            // 获取当前行光标前的文本
            const currentLineText = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            const rangeWithFirstLetter = {
                startLineNumber: position.lineNumber,
                startColumn: position.column - 1, // 包括"/"字符
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            };
            // 检查是否是动态表格模式 (支持多种输入状态)
            const tablePatterns = [
                { pattern: /\/table(\d+)x(\d+)$/i, type: 'complete' }, // /table5x8
                { pattern: /\/table(\d+)x$/i, type: 'partial' }, // /table5x
                { pattern: /\/table(\d+)$/i, type: 'square' }, // /table5 (默认正方形)
                { pattern: /\/table$/i, type: 'basic' } // /table
            ];
            for (const tablePattern of tablePatterns) {
                const match = currentLineText.match(tablePattern.pattern);
                if (match && !isInLatexBlock(textUntilPosition)) {
                    const dynamicRange = {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column - currentLineText.length + currentLineText.lastIndexOf('/'),
                        endLineNumber: position.lineNumber,
                        endColumn: position.column,
                    };
                    let suggestions = [];
                    if (tablePattern.type === 'complete') {
                        // /table5x8 - 完整格式
                        const rows = parseInt(match[1]);
                        const cols = parseInt(match[2]);
                        if (rows > 0 && cols > 0 && rows <= 20 && cols <= 20) {
                            suggestions.push({
                                label: `/table${rows}x${cols} (${rows}行${cols}列表格)`,
                                detail: `插入一个${rows}行${cols}列的表格`,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: generateDynamicTable(rows, cols),
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                sortText: "0",
                                range: dynamicRange,
                            });
                        }
                    }
                    else if (tablePattern.type === 'partial') {
                        // /table5x - 等待列数
                        const rows = parseInt(match[1]);
                        if (rows > 0 && rows <= 20) {
                            suggestions.push({
                                label: `/table${rows}x... (${rows}行表格)`,
                                detail: `继续输入列数，如 /table${rows}x3`,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: `table${rows}x`,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                sortText: "0",
                                range: dynamicRange,
                            });
                        }
                    }
                    else if (tablePattern.type === 'square') {
                        // /table5 - 默认正方形表格
                        const size = parseInt(match[1]);
                        if (size > 0 && size <= 20) {
                            suggestions.push({
                                label: `/table${size} (${size}x${size}正方形表格)`,
                                detail: `插入一个${size}行${size}列的正方形表格`,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: generateDynamicTable(size, size),
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                sortText: "0",
                                range: dynamicRange,
                            });
                            // 同时提供继续输入x的选项
                            suggestions.push({
                                label: `/table${size}x... (自定义${size}行表格)`,
                                detail: `输入x后继续指定列数`,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: `table${size}x`,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                sortText: "1",
                                range: dynamicRange,
                            });
                        }
                    }
                    else if (tablePattern.type === 'basic') {
                        // /table - 基础提示
                        suggestions.push({
                            label: "/table (n行m列表格)",
                            detail: "如 /table3 或 /table3x5",
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: "table",
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            sortText: "2",
                            range: dynamicRange,
                        });
                    }
                    if (suggestions.length > 0) {
                        return { suggestions };
                    }
                }
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: "0",
                        range: rangeWithFirstLetter,
                    },
                    {
                        label: "/image (图片)",
                        detail: "插入图片",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: `![${getSettings().advanced.imageSettings.basicStyle}\${1:}](\${2:})`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: "1",
                        range: rangeWithFirstLetter,
                    },
                    {
                        label: "/table (n行m列表格)",
                        detail: "如 /table3 或 /table3x5",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "table",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: "2",
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/any-font-size-text (任意大小文字)",
                        detail: "你能任意掌控大小的文字",
                        kind: monaco.languages.CompletionItemKind.Function,
                        sortText: "a3",
                        range: rangeWithFirstLetter,
                        insertText: `
<p style="font-size:\${1:16}px">\${2:}</p>
`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/any-center-text (居中文本)",
                        detail: "你能任意掌控位置的文字",
                        kind: monaco.languages.CompletionItemKind.Function,
                        sortText: "a4",
                        range: rangeWithFirstLetter,
                        insertText: `
<p style="text-align:center">\${1:}</p>
`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/any-color-text (任意颜色文本)",
                        detail: "你能任意掌控颜色的文字",
                        kind: monaco.languages.CompletionItemKind.Function,
                        sortText: "a5",
                        range: rangeWithFirstLetter,
                        insertText: `
<p style="color:red">\${1:}</p>
`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/any-text (任意文本)",
                        detail: "你能任意掌控的文字",
                        kind: monaco.languages.CompletionItemKind.Function,
                        sortText: "a6",
                        range: rangeWithFirstLetter,
                        insertText: `
<p style="font-size:16px;text-align:center;color:black;font-weight:bold;font-style:italic;">
\${1:}
</p>
`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/title-text (图表题注释文本)",
                        detail: "图片、表格下的小字",
                        kind: monaco.languages.CompletionItemKind.Function,
                        sortText: "a6",
                        range: rangeWithFirstLetter,
                        insertText: `
<p style="font-size:16px;text-align:center;font-style:italic;">
\${1:}
</p>
`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/cover (封面，秒了)",
                        detail: "图片、表格下的小字",
                        kind: monaco.languages.CompletionItemKind.Function,
                        sortText: "a7",
                        range: rangeWithFirstLetter,
                        insertText: `
<br>
<br>
<br>

![#w70%#c](https://www.nus.edu.sg/images/default-source/identity-images/NUS_logo_full-horizontal.jpg)
<br>
<div>
 <center>
      <h1>\${1:Title}</h1><br><br><br><br><br><br><br><br>
      <p style="font-size:17px;">
        <b>
        \${2:Name}<br>
        \${3:[INFO]}<br>
        \${4:${getFormattedDate()}}
        </b>
      </p>
 </center>
</div>

|---|
`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                    {
                        label: "/prettier-ignore (忽略格式化行)",
                        detail: "下一行不进行prettier格式化",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: `<!-- prettier-ignore -->`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: rangeWithFirstLetter,
                        sortText: "b2",
                    },
                ];
                return { suggestions: _suggestions };
            }
        },
    });
    /**
     * @description 补全单词
    */ class TrieNode {
        constructor() {
            Object.defineProperty(this, "children", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "isEndOfWord", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.children = {};
            this.isEndOfWord = false;
        }
    }
    class Trie {
        constructor() {
            Object.defineProperty(this, "root", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.root = new TrieNode(); // ✅ 定义 this.root
        }
        insert(word) {
            let node = this.root;
            for (let char of word) {
                if (!node.children[char]) {
                    node.children[char] = new TrieNode();
                }
                node = node.children[char];
            }
            node.isEndOfWord = true;
        }
        search(prefix) {
            let node = this.root;
            for (let char of prefix) {
                if (!node.children[char]) {
                    return [];
                }
                node = node.children[char];
            }
            return this._findAllWords(node, prefix);
        }
        _findAllWords(node, prefix) {
            let words = [];
            if (node.isEndOfWord) {
                words.push(prefix);
            }
            for (let char in node.children) {
                words = words.concat(this._findAllWords(node.children[char], prefix + char));
            }
            return words;
        }
    }
    // 示例：构建字典树并搜索前缀
    const trie = new Trie();
    /**
     * @description 字典补全
    */
    monaco.languages.registerCompletionItemProvider("markdown", {
        triggerCharacters: "abcdefghijklmnopqrstuvwxyz".split(""),
        // @ts-ignore
        provideCompletionItems: async (model, position) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            let words = await fetchStoredJSON("spelling_data_json");
            if (words) {
                words.forEach((word) => trie.insert(word));
            }
            // console.log(words);
            const lastWord = words ? textUntilPosition.split(/\s+/).pop() : "";
            let suggestions;
            if (words) {
                suggestions = trie.search(lastWord.toLowerCase()).map(word => ({
                    label: word,
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: word,
                    detail: `Suggested word: ${word}`
                }));
            }
            else {
                suggestions = [];
            }
            return { suggestions };
        }
    });
    /**
     * @补全Latex
     */
    monaco.languages.registerCompletionItemProvider("markdown", {
        triggerCharacters: ["\\"],
        //@ts-ignore
        provideCompletionItems: (model, position, context) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            // 类似的，如果是在一个 LaTeX 代码块中，返回 LaTeX 的提示。
            if (isNeedToUseLatexIntellisense(monaco, model, textUntilPosition, position)) {
                const suggestions = Array.from([
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
                ], (e, index) => {
                    return {
                        label: `\\${e}`,
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: e,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: /[A-Z]/.test(e[0]) ? "1" : "0",
                    };
                });
                const suggestions2 = Array.from([
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
                ], (e, index) => {
                    return {
                        label: `\\${e}`,
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: `${e}\{$1\}`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: /[A-Z]/.test(e[0]) ? "1" : "0",
                    };
                });
                const suggestions3 = Array.from([
                    ...verticalLayout2,
                    ...binomialCoefficients2,
                    ...fractions2,
                    ...color2,
                ], (e, index) => {
                    return {
                        label: `\\${e}`,
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: `${e}\{$1\}\{$2\}`,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: /[A-Z]/.test(e[0]) ? "1" : "0",
                    };
                });
                const suggestions4 = [
                    {
                        label: `\\begin`,
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "begin{${1|" + envs.join(",") + "|}}\n\t$2\n\\end{$1}",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    },
                ];
                return {
                    suggestions: [
                        ...suggestions,
                        ...suggestions2,
                        ...suggestions3,
                        ...suggestions4,
                    ],
                };
            }
        },
    });
    /**
     * @补全clue
     */
    monaco.languages.registerCompletionItemProvider("markdown", {
        triggerCharacters: ["^"],
        //@ts-ignore
        provideCompletionItems: (model, position, context) => {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            if (isNeedToUseClueIntellisense(textUntilPosition)) {
                let _suggestions = [
                    {
                        label: "RED",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "RED",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: "RED...",
                    },
                    {
                        label: "PINK",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "PINK",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: "PINK...",
                    },
                ];
                return { suggestions: _suggestions };
            }
        },
    });
    /**
     * @description 补全文件路径
     */
    monaco.languages.registerCompletionItemProvider("markdown", {
        triggerCharacters: ["/"],
        //@ts-ignore
        provideCompletionItems: async (model, position, context) => {
            // 获取到光标前的一行
            const textUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            const fileManager = new FileFolderManager(); // 假设这是你用来管理文件和文件夹的类
            let folderStructure = fileManager.topDirectoryArray; // 获取文件夹结构
            // console.log(folderStructure)
            // 检查是否需要建议图片路径
            if (isNeedToSuggestImagePath(monaco, model, textUntilPosition, position)) {
                // 匹配Markdown中的图片路径
                const pathMatch = textUntilPosition.match(/!\[.*?\]\(\.\/([^\/)]+(?:\/[^\/)]+)*)\/?$/);
                // 如果用户刚输入 "./" 并且没有路径匹配，建议顶级文件夹和文件
                if (textUntilPosition.slice(-2) === "./" && !pathMatch) {
                    let suggestions = generateSuggestions(folderStructure, monaco);
                    return { suggestions };
                }
                console.log(pathMatch);
                if (pathMatch) {
                    const currentPath = pathMatch[1]; // 当前路径片段
                    const currentPathArr = currentPath.split("/"); // 当前路径片段数组
                    console.log(currentPathArr);
                    // 使用递归查找当前路径对应的文件夹
                    const currentFolder = findFolderRecursively(folderStructure, currentPathArr);
                    if (currentFolder &&
                        currentFolder.fileType === "folder" &&
                        currentFolder.children) {
                        let suggestions = generateSuggestions(currentFolder.children, monaco);
                        return { suggestions };
                    }
                    else {
                        // 当前路径指向一个文件或不存在的文件夹，建议当前层级的文件和文件夹
                        const parentPathArr = currentPathArr.slice(0, -1);
                        const lastPart = currentPathArr[currentPathArr.length - 1];
                        const parentFolder = findFolderRecursively(folderStructure, parentPathArr);
                        if (parentFolder &&
                            parentFolder.fileType === "folder" &&
                            parentFolder.children) {
                            let suggestions = parentFolder.children
                                .filter((item) => item.label.startsWith(lastPart))
                                .map((item) => ({
                                label: item.label,
                                kind: item.fileType === "folder"
                                    ? monaco.languages.CompletionItemKind.Folder
                                    : monaco.languages.CompletionItemKind.File,
                                insertText: item.label,
                                detail: item.fileType === "folder" ? "Folder" : "File",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule
                                    .InsertAsSnippet,
                            }));
                            return { suggestions };
                        }
                    }
                }
            }
            // 默认情况下返回空的建议
            return { suggestions: [] };
        },
    });
    /**
     * @description 递归查找文件夹
     * @param {Array} structure 文件夹结构
     * @param {Array} pathParts 路径片段数组
     * @returns {Object|null} 找到的文件夹对象或null
     */
    function findFolderRecursively(structure, pathParts) {
        if (pathParts.length === 0) {
            return { children: structure };
        }
        let current = null;
        let remainingParts = [...pathParts];
        current = structure.find((item) => item.label === remainingParts[0] && item.fileType === "folder");
        if (!current) {
            return null;
        }
        remainingParts.shift();
        if (remainingParts.length === 0) {
            return current;
        }
        if (current.children) {
            return findFolderRecursively(current.children, remainingParts);
        }
        return null;
    }
    /**
     * @description 生成建议项
     * @param {Array} items 文件或文件夹数组
     * @param {Object} monaco Monaco编辑器实例
     * @returns {Array} 建议项数组
     */
    function generateSuggestions(items, monaco) {
        return items.map((item) => ({
            label: item.label,
            kind: item.fileType === "folder"
                ? monaco.languages.CompletionItemKind.Folder
                : monaco.languages.CompletionItemKind.File,
            insertText: item.label,
            detail: item.fileType === "folder" ? "Folder" : "File",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        }));
    }
}
//
/**
 * @description 判断是否需要启用LaTex提示
 * @param textUntilPosition string
 */
export function isNeedToUseLatexIntellisense(monaco, model, textUntilPosition, position) {
    if (textUntilPosition[textUntilPosition.length - 1] === "\\" &&
        (isInLatexBlock(textUntilPosition) ||
            isInLatexInline(model, position, textUntilPosition))) {
        return true;
    }
    else {
        return false;
    }
}
export function isNeedToSuggestImagePath(monaco, model, textUntilPosition, position) {
    // 匹配 Markdown 中图片路径语法的正则表达式，允许继续补全子文件夹和文件
    const imagePathPattern = /!\[.*?\]\((\.\/[^)]*)$/;
    const match = textUntilPosition.match(imagePathPattern);
    // 当路径中有 "./" 开头或以 "/" 结束时，继续触发补全
    if (match) {
        return true;
    }
    return false;
}
export function isInLatexBlock(textUntilPosition) {
    return textUntilPosition.match(/\$\$/g)
        ? textUntilPosition.match(/\$\$/g).length % 2 === 1
        : false;
}
export function isInLatexInline(model, position, textUntilPosition) {
    const lineContent = model.getLineContent(position.lineNumber);
    const regex = /\$(?!\s)((\\\$|[^\$\n])*?)(?<!\s)\$/g;
    if (lineContent.match(regex)) {
        const line = lineContent;
        const position = window.editor.getPosition();
        const cursorOffset = position.column - 1;
        const matches = [];
        let match;
        while ((match = regex.exec(line)) !== null) {
            const startIndex = match.index + 1;
            const endIndex = regex.lastIndex - 1;
            matches.push({ startIndex, endIndex });
        }
        const isInRange = matches.some((match) => {
            return cursorOffset > match.startIndex && cursorOffset <= match.endIndex;
        });
        // console.log(matches,cursorOffset)
        return isInRange;
    }
    else
        return false;
}
export function isNeedToUseClueIntellisense(textUntilPosition) {
    // console.log(textUntilPosition[textUntilPosition.length-1]);
    if (textUntilPosition[textUntilPosition.length - 1] === "^") {
        return true;
    }
    else {
        return false;
    }
}
export function isNeedToUseCodeIntellisense(textUntilPosition) {
    // console.log(textUntilPosition[textUntilPosition.length-1]);
    if (textUntilPosition.match(/\`\`\`js/g)) {
        window.monaco.editor.setModelLanguage(window.editor.getModel(), "javascript");
        return true;
    }
    else {
        window.monaco.editor.setModelLanguage(window.editor.getModel(), "markdown");
        return false;
    }
}
/**
 * @description 生成动态表格文本
 * @param rows 行数
 * @param cols 列数
 * @returns 表格的markdown文本
 */
export function generateDynamicTable(rows, cols) {
    if (rows <= 0 || cols <= 0)
        return "";
    let tableText = "\n";
    // 生成表头
    let headerRow = "|";
    for (let col = 0; col < cols; col++) {
        headerRow += `\${${col + 1}:}    |`;
    }
    tableText += headerRow + "\n";
    // 生成分隔行
    let separatorRow = "|";
    for (let col = 0; col < cols; col++) {
        separatorRow += "--- |";
    }
    tableText += separatorRow + "\n";
    // 生成数据行
    for (let row = 1; row < rows; row++) {
        let dataRow = "|";
        for (let col = 0; col < cols; col++) {
            dataRow += `\${${cols + row * cols + col + 1}:}    |`;
        }
        tableText += dataRow + "\n";
    }
    return tableText;
}
