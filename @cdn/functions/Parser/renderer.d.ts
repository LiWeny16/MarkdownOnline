export declare const newRenderer: {
    paragraph(text: any): string;
    heading(text: string, level: any): string;
    code(code: string, lang: string, _escaped: boolean): string;
    /**
     * 拓展图片
     *
     * @param href   图片路径
     * @param _title null
     * @param text   图片的名称
     */
    image(href: string | null, _title: string | null, text: string): any;
};
export declare const headingRenderer: {
    /**
     * 标题解析为 TOC 集合, 增加锚点跳转
     *
     * @param text  标题内容
     * @param level 标题级别
     */
    heading(text: any, level: number): string;
};
export interface Toc {
    name: string;
    id: string;
    level: number;
}
export declare const initTocs: (id: string) => Toc[];
export declare const importUrlExtension: {
    extensions: {
        name: string;
        level: string;
        start(src: string | string[]): number;
        tokenizer(src: string): {
            type: string;
            raw: string;
            url: string;
            html: string;
        } | undefined;
        renderer(token: any): string;
    }[];
};
export declare const markItExtension: {
    extensions: {
        name: string;
        level: string;
        start(src: any): any;
        tokenizer(src: string, _tokens: any): {
            type: string;
            raw: string;
            text: string;
        } | undefined;
        renderer(token: any): string;
    }[];
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
export declare const imgExtension: {
    name: string;
    level: string;
    tokenizer: {
        heading(src: any): boolean;
        codespan(src: string): boolean;
    };
    renderer: {
        paragraph(text: any): string;
        heading(text: string, level: any): string;
        code(code: string, lang: string, _escaped: boolean): string;
        /**
         * 拓展图片
         *
         * @param href   图片路径
         * @param _title null
         * @param text   图片的名称
         */
        image(href: string | null, _title: string | null, text: string): any;
    };
    async: boolean;
    walkTokens(token: ImageToken): Promise<void>;
};
/**
 * @deprecated
 */
export declare const clueExtension: {
    extensions: {
        name: string;
        level: string;
        start(src: any): any;
        tokenizer(src: string, _tokens: any): false | {
            type: string;
            raw: string;
            text: string;
        };
        renderer(token: any): any;
    }[];
};
export declare const emojiExtension: {
    extensions: {
        name: string;
        level: string;
        start(src: any): any;
        tokenizer(src: string, _tokens: any): false | {
            type: string;
            raw: string;
            text: string;
        };
        renderer(token: any): any;
    }[];
};
