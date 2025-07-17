import { replaceMonacoAll } from "@App/text/replaceText";
export default function monacoFormat(editor, monaco) {
    monaco.languages.registerDocumentFormattingEditProvider("markdown", {
        async provideDocumentFormattingEdits(model) {
            let code = model.getValue();
            // 获取当前光标位置
            var currentPosition = editor.getPosition();
            try {
                const prettier = await import("prettier");
                const parseMd = await import("prettier/plugins/markdown");
                const parsedMd = await prettier.format(code, {
                    parser: "markdown", // 格式化md
                    // jsxSingleQuote: true,
                    plugins: [parseMd.default],
                    // embeddedLanguageFormatting:"auto",
                    // proseWrap:"always"
                });
                //   这里不能用setValue会破坏所有历史，用applyEdits历史会乱码
                // model.applyEdits([
                //   {
                //     range: model.getFullModelRange(),
                //     text: parsedMd,
                //   },
                // ])
                replaceMonacoAll(window.monaco, editor, parsedMd);
                editor.setPosition(currentPosition);
            }
            catch (error) {
                console.error("Prettier formatting failed:", error);
            }
            return [];
        },
    });
}
