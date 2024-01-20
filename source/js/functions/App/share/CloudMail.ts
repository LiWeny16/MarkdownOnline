import axios, { AxiosRequestConfig, Method } from "axios"
export default function CloudMail(
  url: string,
  method: Method | string,
  data: any
) {
  var element = document.getElementById("view-area")!

  // 获取计算后的样式对象
  var computedStyle = window.getComputedStyle(element)
  // console.log(computedStyle);
  // 遍历样式对象并输出为HTML代码
  for (var i = 0; i < computedStyle.length; i++) {
    var property = computedStyle[i]
    var value = computedStyle.getPropertyValue(property)
    var htmlCode = property + ": " + value + ";"
    // console.log(htmlCode)
  }
  let config: AxiosRequestConfig = {
    url: url,
    method: method,
    data: data,
    headers: {
      "Content-Type": "application/json", //如果写成contentType会报错,如果不写这条也报错
      //Content type 'application/x-www-form-urlencoded;charset=UTF-8'...
    },
  }
  // console.log(config)
  axios(config).then((e: any) => {
    console.log(e)
  })
}
