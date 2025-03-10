"use strict";
// import * as ort from "onnxruntime-web";
// import { AutoTokenizer } from "@xenova/transformers";
// // ========== 全局环境设置 ==========
// // 设置 WASM 运行时（多线程 + SIMD）
// ort.env.wasm.numThreads = 4;
// ort.env.wasm.simd = true;
// ort.env.wasm.wasmPaths = {
//     "ort-wasm.wasm": "/models/wasm/ort-wasm.wasm",
//     "ort-wasm-simd.wasm": "/models/wasm/ort-wasm-simd.wasm",
// };
// // ========== 全局变量 ==========
// let session: ort.InferenceSession | null = null;
// let tokenizer: AutoTokenizer | null = null;
// // ========== 加载 ONNX 模型 ==========
// async function loadModel() {
//     if (!session) {
//         console.log("加载 ONNX 模型...");
//         session = await ort.InferenceSession.create("/models/model.onnx", {
//             executionProviders: ["wasm"], // 强制使用 WASM 后端
//         });
//         console.log("ONNX 模型加载完成！");
//     }
//     return session;
// }
// // ========== 加载分词器 ==========
// async function loadTokenizer() {
//     if (!tokenizer) {
//         console.log("加载分词器...");
//         // 使用官方远程加载，并启用 fast tokenizer
//         tokenizer = await AutoTokenizer.from_pretrained("bert-base-chinese",);
//         console.log("Tokenizer loaded successfully.");
//         console.log("Tokenizer encode method exists:", typeof tokenizer.encode === "function");
//     }
//     return tokenizer;
// }
// // ========== 初始化 ==========
// async function init() {
//     await loadModel();
//     await loadTokenizer();
// }
// // ========== 测试分词器 ==========
// async function testTokenizer() {
//     try {
//         // 使用官方 fast tokenizer 加载（远程加载）
//         const tokenizer = await AutoTokenizer.from_pretrained("bert-base-chinese", { useFast: true });
//         console.log("Tokenizer loaded successfully.");
//         // 输入测试句子
//         const sentence = "这是一个测试句子。";
//         console.log("Input text:", sentence);
//         // 对文本进行分词编码（默认会添加特殊标记）
//         const encoded = await tokenizer.encode(sentence);
//         console.log("Encoded output:", encoded);
//         // 解码 token id 到文本（跳过特殊标记）
//         const decoded = await tokenizer.decode(encoded, { skip_special_tokens: true });
//         console.log("Decoded output:", decoded);
//     } catch (error) {
//         console.error("Tokenizer test failed:", error);
//     }
// }
// // 调用测试函数（可在调试时使用）
// // testTokenizer();
// // ========== 拼写检查主函数 ==========
// /**
//  * checkSpelling 接受字符串输入，并调用 ONNX 模型进行推理，
//  * 返回更正后的字符串。
//  */
// export async function checkSpelling(input: string): Promise<string> {
//     await init();
//     //   if (!session || !tokenizer) {
//     //     throw new Error("模型或分词器未正确加载！");
//     //   }
//     console.log("输入文本：", input);
//     // 确保 input 是字符串
//     if (typeof input !== "string") {
//         throw new Error("输入必须是字符串！");
//     }
//     // 1. 分词
//     console.log("对文本进行分词...");
//     let encoded;
//     try {
//         encoded = await tokenizer!.encode(input);
//         console.log("Encoded:", encoded);
//     } catch (error) {
//         console.error("分词器运行失败：", error);
//         throw new Error("分词器解析失败，请检查 tokenizer 是否正确加载！");
//     }
//     //   // 检查分词结果是否完整
//     //   if (!encoded || !encoded.input_ids || !encoded.attention_mask) {
//     //     throw new Error("分词器返回数据格式错误！");
//     //   }
//     console.log("编码完成！Tokenized:", encoded);
//     const inputIds = encoded;
//     const seqLen = inputIds.length;
//     const attentionMask = new Array(seqLen).fill(1);
//     const inputIdsBigInt = BigInt64Array.from(inputIds.map(id => BigInt(id)));
//     const attentionMaskBigInt = BigInt64Array.from(attentionMask.map(a => BigInt(a)));
//     const inputIdsTensor = new ort.Tensor("int64", inputIdsBigInt, [1, seqLen]);
//     const attentionMaskTensor = new ort.Tensor("int64", attentionMaskBigInt, [1, seqLen]);
//     // 运行 ONNX 推理
//     console.log("开始推理...");
//     let results: ort.InferenceSession.OnnxValueMapType;
//     try {
//         results = await session!.run({
//             input_ids: inputIdsTensor,
//             attention_mask: attentionMaskTensor,
//         });
//     } catch (error) {
//         console.error("推理失败：", error);
//         throw new Error("ONNX 推理失败");
//     }
//     console.log("推理完成！");
//     // 处理 logits（假设输出名称为 "logits"，且维度为 [1, seqLen, vocabSize]）
//     const logitsTensor = results["logits"];
//     const logitsData = logitsTensor.data as Float32Array;
//     const vocabSize = logitsTensor.dims[2];
//     const correctedIds: number[] = [];
//     for (let i = 0; i < seqLen; i++) {
//         const startIdx = i * vocabSize;
//         const tokenLogits = logitsData.slice(startIdx, startIdx + vocabSize);
//         correctedIds.push(tokenLogits.indexOf(Math.max(...tokenLogits)));
//     }
//     // 解码更正后的文本
//     const correctedText = await tokenizer.decode(correctedIds, { skip_special_tokens: true });
//     console.log("更正后的文本：", correctedText);
//     // 6. 释放内存（释放 Tensor 占用）
//     // inputIdsTensor.dispose();
//     // attentionMaskTensor.dispose();
//     // logitsTensor.dispose();
//     return correctedText;
// }
// // ========== 释放资源函数 ==========
// /**
//  * modelFree 手动释放全局 session 和 tokenizer 占用的引用，
//  * 以便等待浏览器自动回收 WASM 内存。
//  */
// export function modelFree() {
//     console.log("开始释放模型和分词器资源...");
//     session = null;
//     tokenizer = null;
//     console.log("释放完成！（等待浏览器自动回收 WASM 内存）");
// }
