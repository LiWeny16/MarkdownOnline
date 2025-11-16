/**
 * Express服务器测试脚本
 * 运行: node test-express.js
 */

const http = require('http');

const SERVER_URL = 'http://localhost:9000';

/**
 * 发送POST请求
 */
function sendRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 9000,
      path: '/translate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(responseData)
          });
        } catch (error) {
          reject(new Error('解析响应失败: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 运行测试
 */
async function runTests() {
  console.log('开始测试百度翻译Express服务器...\n');
  console.log('请确保服务器已经启动: npm start\n');

  // 等待一下确保用户看到提示
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // 测试1: 中文翻译成英文
    console.log('【测试1】中文 -> 英文');
    const test1 = await sendRequest({
      text: '你好世界',
      targetLang: 'en',
      sourceLang: 'zh'
    });
    console.log('状态码:', test1.statusCode);
    console.log('原文: 你好世界');
    console.log('译文:', test1.data.translatedText);
    console.log('检测语言:', test1.data.detectedLang);
    console.log('成功:', test1.data.success);
    console.log('---\n');

    // 测试2: 英文翻译成日文
    console.log('【测试2】英文 -> 日文');
    const test2 = await sendRequest({
      text: 'Hello, how are you?',
      targetLang: 'jp',
      sourceLang: 'en'
    });
    console.log('状态码:', test2.statusCode);
    console.log('原文: Hello, how are you?');
    console.log('译文:', test2.data.translatedText);
    console.log('检测语言:', test2.data.detectedLang);
    console.log('成功:', test2.data.success);
    console.log('---\n');

    // 测试3: 自动检测语言
    console.log('【测试3】自动检测 -> 中文');
    const test3 = await sendRequest({
      text: 'Good morning',
      targetLang: 'zh'
    });
    console.log('状态码:', test3.statusCode);
    console.log('原文: Good morning');
    console.log('译文:', test3.data.translatedText);
    console.log('检测语言:', test3.data.detectedLang);
    console.log('成功:', test3.data.success);
    console.log('---\n');

    // 测试4: 错误情况 - 缺少参数
    console.log('【测试4】错误处理测试 - 缺少text参数');
    const test4 = await sendRequest({
      targetLang: 'en'
    });
    console.log('状态码:', test4.statusCode);
    console.log('错误信息:', test4.data.error);
    console.log('---\n');

    console.log('✅ 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n提示: 请确保服务器正在运行 (npm start)');
  }
}

// 运行测试
runTests();

