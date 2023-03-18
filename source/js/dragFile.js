let dragBox = document.getElementById("md-area")

dragBox.addEventListener("dragenter", function () {
    dragBox.value = "已读取到文件，请松手"
    dragBox.style.background = "#c4c4c482"
}, false)
//拖拽离开
dragBox.addEventListener("dragleave", function () {
    // dragBox.innerHTML = "拖到这里上传"
    dragBox.style.background = "#f5f5f5"
    allInit()
}, false)
//悬停
dragBox.addEventListener("dragover", function (ev) {
    ev.preventDefault()//取消事件的默认动作，防止浏览器打开文件
    // dragBox.innerHTML = "拖到这里上传2"
}, false)
//松手
dragBox.addEventListener("drop", function (ev) {
    ev.preventDefault()//取消事件的默认动作。
    dragBox.style.background = "#f5f5f5"
    try {
        let fileReader = new FileReader()
        let file = ev.dataTransfer.files[0]
        // debugger
        console.log(file);
        let nameArr = file.name.split(".")
        nameArr = nameArr[nameArr.length - 1]
        if (!(nameArr == "txt" || nameArr == "md")) {
            dragBox.value = "错误的文件格式，仅支持txt/md"
        } else {
            fileReader.onload = function () {
                console.log("上传成功")
                dragBox.value = this.result
                mdConverter()
                restoreText()
                // console.log(this)
            }
            fileReader.onerror = function () {
                console.log("上传失败")
            }
            fileReader.readAsText(file)
        }
    } catch (err) {
        console.log(err)
    }

}, false)
