import { mdConverter } from "@Root/js/index"
import allInit from "@Func/Init/allInit"
import blankTextInit from "../Init/blankTextInit"
import kit from "@cdn-kit"

export default function dragFileEvent() {
  let dragBox = (document.getElementById("md-area") as HTMLInputElement) || null
  let grayStyle = "#c4c4c482"
  let errRedStyle = "#cc0000"
  let originStyle = "#f5f5f5"
  dragBox.addEventListener(
    "dragenter",
    function () {
      // dragBox.value = "已读取到文件,请松手"
      dragBox.style.background = grayStyle
    },
    false
  )
  //拖拽离开
  dragBox.addEventListener(
    "dragleave",
    function () {
      // dragBox.innerHTML = "拖到这里上传"
      dragBox.style.background = originStyle
      allInit()
    },
    false
  )
  //悬停
  dragBox.addEventListener(
    "dragover",
    function (ev) {
      ev.preventDefault() //取消事件的默认动作,防止浏览器打开文件
      // dragBox.innerHTML = "拖到这里上传2"
    },
    false
  )
  //松手
  dragBox.addEventListener(
    "drop",
    (ev: DragEvent) => {
      ev.preventDefault() //取消事件的默认动作。
      dragBox.style.background = originStyle
      let fileReader = new FileReader()
      let file = ev.dataTransfer!.files[0]
      // debugger
      console.log(file)
      let nameArr: any = file.name.split(".")
      nameArr = nameArr[nameArr.length - 1]
      if (
        !(
          nameArr == "bat" ||
          nameArr == "txt" ||
          nameArr == "md" ||
          nameArr == "js" ||
          nameArr == "html" ||
          nameArr == "css"
        )
      ) {
        dragBox.style.color = errRedStyle
        if (nameArr == "lnk") {
          dragBox.value =
            "错误的文件格式: " + nameArr + " ,请不要直接拖拽快捷方式！"
        } else {
          dragBox.value =
            "错误的文件格式: " + nameArr + " ,仅支持txt/md/html/js/css/bat"
        }
        kit.sleep(2000).then(() => {
          dragBox.style.color = ""
          blankTextInit().then(() => {
            mdConverter()
          })
        })
      } else {
        fileReader.onload = function () {
          console.log("上传成功")
          dragBox.value = this.result!.toString()
          mdConverter(true) //保存
          // restoreText()
          // console.log(this)
        }
        fileReader.onerror = function () {
          console.log("上传失败")
        }
        fileReader.readAsText(file)
      }
    },
    false
  )
}
