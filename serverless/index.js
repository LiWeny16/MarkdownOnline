const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const https = require('https');

const app = express();

// 中间件配置
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// CORS中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const port = 9000;

// 百度翻译API配置
const BAIDU_APP_ID = "20240804002115880";
const BAIDU_APP_KEY = "Lo2EJYSPRJgF6dyVUOIJ";
const BAIDU_API_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";

/**
 * 生成MD5签名
 */
function generateSign(query, salt) {
  const signStr = BAIDU_APP_ID + query + salt + BAIDU_APP_KEY;
  return crypto.createHash('md5').update(signStr).digest('hex');
}

/**
 * 生成随机数
 */
function generateSalt() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 8);
}

/**
 * 发起HTTPS请求
 */
function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('解析响应失败: ' + error.message));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// GET根路径 - 健康检查
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '百度翻译API代理服务运行中',
    version: '1.0.0'
  });
});

// GET任意路径 - 返回服务信息
app.get('/*', (req, res) => {
  res.json({
    status: 'ok',
    message: '请使用POST方法调用翻译接口',
    endpoint: '/translate 或 /*',
    requiredParams: {
      text: '要翻译的文本',
      targetLang: '目标语言代码（如: en, zh, jp等）',
      sourceLang: '源语言代码（可选，默认auto自动检测）'
    }
  });
});

// POST翻译接口
app.post('/*', async (req, res) => {
  try {
    console.log('收到翻译请求:', req.body);

    // 获取请求参数
    const { text, targetLang, sourceLang = 'auto' } = req.body;

    // 验证必需参数
    if (!text) {
      return res.status(400).json({
        error: '缺少必需参数: text',
        success: false
      });
    }

    if (!targetLang) {
      return res.status(400).json({
        error: '缺少必需参数: targetLang',
        success: false
      });
    }

    // 生成签名
    const salt = generateSalt();
    const sign = generateSign(text, salt);

    // 构建请求URL
    const params = new URLSearchParams({
      q: text,
      from: sourceLang,
      to: targetLang,
      appid: BAIDU_APP_ID,
      salt: salt,
      sign: sign
    });

    const requestUrl = `${BAIDU_API_URL}?${params.toString()}`;
    console.log(`请求百度翻译API: ${text.substring(0, 30)}... -> ${targetLang}`);

    // 调用百度翻译API
    const result = await httpsRequest(requestUrl);

    // 检查是否有错误
    if (result.error_code) {
      console.error(`百度翻译API错误: ${result.error_code} - ${result.error_msg}`);
      return res.status(500).json({
        error: `百度翻译错误: ${result.error_code} - ${result.error_msg}`,
        errorCode: result.error_code,
        success: false
      });
    }

    // 提取翻译结果
    const translatedText = result.trans_result && result.trans_result.length > 0
      ? result.trans_result[0].dst
      : '';

    console.log(`翻译成功: ${text.substring(0, 20)}... -> ${translatedText.substring(0, 20)}...`);

    // 返回成功响应
    res.json({
      translatedText: translatedText,
      detectedLang: result.from,
      success: true
    });

  } catch (error) {
    console.error('翻译处理错误:', error);

    res.status(500).json({
      error: error.message || '服务器内部错误',
      success: false
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`百度翻译代理服务器运行在 http://localhost:${port}`);
  console.log(`测试命令: curl -X POST http://localhost:${port}/translate -H "Content-Type: application/json" -d "{\\"text\\":\\"你好\\",\\"targetLang\\":\\"en\\"}"`);
});

