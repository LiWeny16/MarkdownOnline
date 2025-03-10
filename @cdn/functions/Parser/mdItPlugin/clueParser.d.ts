import MarkdownIt from "markdown-it/lib";
declare let cluePlugin: (md: MarkdownIt) => void;
declare function customAlignPlugin(md: MarkdownIt): void;
declare function customAlignPluginHeading(md: MarkdownIt): void;
export { cluePlugin, customAlignPlugin, customAlignPluginHeading };
