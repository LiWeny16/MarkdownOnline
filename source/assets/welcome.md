# "新一代的$“Markdown^+”$编辑器".RED 


# 你好，我是标题

## 你好，我是二级标题

你好，我是正文  
"你好,我是markdown扩展语法".RIGHT 

`正文换行需要结尾打两个空格
如果不打空格，就不换行`

你好,我是LATEX  

$$
\begin{bmatrix}
1&2&3\\
4&5&6\\
7&8&9
\end{bmatrix}
*
\begin{bmatrix}
1&2&3\\
4&5&6\\
7&8&9
\end{bmatrix}=?
$$

<br>



我下面是分割线

---

| 我      | 是    | 
| -        |  -     |
| 表      |   格  |

我是 **强调语句**

[我是链接](https://bigonion.cn)

### 我是扩展语法

"![我是图片](http://bigonion.cn/background/wallheaven.jfif)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)
![我是图片](http://bigonion.cn/background/wallheaven.jfif)".GRID4 



```js
// 我是代码
// 创建模型  
const model = tf.sequential();  
model.add(tf.layers.dense({units: 1, inputShape: [1]}));  
  
// 编译模型  
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});  
  
// 准备训练数据  
const xs = tf.tensor2d([[0], [1], [2], [3], [4], [5]], [6, 1]);  
const ys = tf.tensor2d([[1], [3], [5], [7], [9], [11]], [6, 1]);  
  
// 训练模型  
model.fit(xs, ys, {epochs: 100}).then(() => {  
  // 使用模型进行预测  
  const prediction = model.predict(tf.tensor2d([6], [1, 1]));  
    
  // 打印预测结果  
  prediction.data().then((result) => {  
    console.log(result); // 输出 12.002  
  });  
});  
```
     
                

我是mermaid**流程图表** 


"sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!".mermaid 