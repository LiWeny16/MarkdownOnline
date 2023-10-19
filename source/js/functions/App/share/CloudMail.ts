import axios, { AxiosResponse, AxiosRequestConfig, Method } from "axios"
export default function CloudMail(
  url: string,
  method: Method | string,
  data: any
) {
  let config: AxiosRequestConfig = {
    url: url,
    method: method,
    data: data,
    headers: {
      "Content-Type": "application/json", //如果写成contentType会报错,如果不写这条也报错
      //Content type 'application/x-www-form-urlencoded;charset=UTF-8'...
    },
  }
  console.log(config)
  axios(config).then((e) => {
    console.log(e)
  })
}
