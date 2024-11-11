/**
 * @description 预解析，来处理异步信息，因为markdown-it天然不支持异步
 * @returns env
 */
export default function prepareParser(originalMd: string): Promise<{
    vfImgSrcArr: any[];
    vfImgSeq: number;
    mermaidParsedArr: string[];
    mermaidSeq: number;
    pdfParsedArr: any;
    pdfSeq: number;
}>;
