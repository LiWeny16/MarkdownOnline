import prettier from "@cdn-prettier";
// import prettier from "prettier"
import parseMd from "@cdn-prettier-plugins-markdown";
import { replaceMonacoAll } from "@App/text/replaceText";
export default function monacoFormat(editor, monaco) {
    monaco.languages.registerDocumentFormattingEditProvider("markdown", {
        provideDocumentFormattingEdits(model) {
            let code = model.getValue();
            // 获取当前光标位置
            var currentPosition = editor.getPosition();
            prettier
                .format(code, {
                parser: "markdown", // 格式化md
                // jsxSingleQuote: true,
                plugins: [parseMd],
                // embeddedLanguageFormatting:"auto",
                // proseWrap:"always"
            })
                .then((parsedMd) => {
                //   这里不能用setValue会破坏所有历史，用applyEdits历史会乱码
                // model.applyEdits([
                //   {
                //     range: model.getFullModelRange(),
                //     text: parsedMd,
                //   },
                // ])
                replaceMonacoAll(model, editor, parsedMd);
                editor.setPosition(currentPosition);
            });
            return [];
        },
    });
}
