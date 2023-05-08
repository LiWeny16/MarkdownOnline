/**
 * @license bigonion
 * 
 * umd-kit.min.js
 *
 * LICENSE MIT
 */

(function () {
    'use strict';
    (function (c, x) {
        "object" === typeof exports && "undefined" !== typeof module ? x(exports) : "function" === typeof define && define.amd ? define(["exports"], x) : (c = c || self,
            x(c))
    }
    )(this, function (c) {
        /** 
          * HTMLElement原型链补充
        */
        if (HTMLElement) {
            HTMLElement.prototype.move = function () {
                kit.moveIt(this, this)
            }
        }
        //如果检测到页面已经带有kit对象，那么对这个kit进行二次检验,二次检验通过则不再继续导入,否则认为原页面没有kit，继续导入
        if (typeof c.kit === 'object' ? (typeof c.kit.version === 'string' ? false : true) : true) {
            const kit = {
                moveIt: function (controlEle, movedEle) {
                    //var demo = document.getElementById(`${settings}`)
                    movedEle.style.position = 'absolute'
                    var canitmove = false
                    var x = 0
                        , y = 0
                    controlEle.onmousedown = function (e) {
                        e.preventDefault()
                        x = e.pageX - movedEle.offsetLeft
                        y = e.pageY - movedEle.offsetTop
                        canitmove = true
                        //  console.log(e.pageX)
                    }
                    controlEle.onmouseup = function (e) {
                        e.preventDefault()
                        x = e.pageX - movedEle.offsetLeft
                        y = e.pageY - movedEle.offsetTop
                        canitmove = false
                        //     console.log(e.pageX)
                    }
                    window.onmouseup = function () {
                        canitmove = false
                    }
                    window.onmousemove = function (e) {

                        if (canitmove) {
                            movedEle.style.left = e.pageX - x + 'px'
                            movedEle.style.top = e.pageY - y + 'px'
                        }
                    }
                },
                findId: function (id) {
                    return document.getElementById(id)
                },
                findClass: function (className) {
                    return document.getElementsByClassName(className)
                },
                setCookie: function (cname, cvalue, exdays = 0, cpath = '/', cdomain = window.location.host) {
                    var d = new Date()
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
                    var expires = "expires=" + d.toGMTString()
                    var path = "path=" + cpath
                    var domain = "domain=" + cdomain
                    document.cookie = cname + "=" + cvalue + "; " + expires + "; " + path + "; " + domain
                },
                getCookie: function (cname) {
                    var name = cname + "="
                    var ca = document.cookie.split(';')
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i].trim()
                        if (c.indexOf(name) == 0)
                            return c.substring(name.length, c.length)
                    }
                    return ""
                },
                log: function (a) {
                    console.log(a)
                },
                sleep: (time) => {
                    return new Promise(resolve => setTimeout(resolve, time))
                },
                setClipBoard: function (text = "") {
                    let inputTemp = document.createElement('input')
                    inputTemp.style.position = 'fixed'
                    inputTemp.style.top = '0px'
                    inputTemp.style.opacity = "0%"
                    inputTemp.style.zIndex = '-999'
                    document.body.appendChild(inputTemp)
                    inputTemp.value = text
                    inputTemp.focus()
                    inputTemp.select()
                    try {
                        let result = document.execCommand('copy')
                        document.body.removeChild(inputTemp)
                        if (!result || result === 'unsuccessful') {
                            console.log('复制失败')
                        } else {
                            console.log('复制成功')
                        }
                    } catch (e) {
                        document.body.removeChild(inputTemp)
                        alert('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作')
                    }
                },
                isFocus: function (element) {
                    if (element == document.activeElement) {
                        return 1
                    } else {
                        return 0
                    }
                },
                ajax: function (obj) {
                    obj.way = obj.way ? (obj.way) : "GET"
                    obj.async = obj.async ? (obj.async) : true
                    obj.header = obj.header ? obj.header : { "content-type": "json" }
                    obj.onload = obj.onload ? obj.onload : (e) => { console.log(e) }
                    var httpRequest = new XMLHttpRequest()
                    httpRequest.open(obj.way, obj.url, obj.async)
                    for (let i = 0; i <= Object.keys(obj.header).length - 1; i++) {
                        let headerKey = Object.keys(obj.header)[i]
                        let headerValue = Object.values(obj.header)[i]
                        httpRequest.setRequestHeader(headerKey, headerValue)
                    }
                    httpRequest.send(JSON.stringify(obj.body))
                    httpRequest.onreadystatechange = () => {
                        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                            obj.onload(httpRequest)
                        }
                    }
                },
                getUUID: function () { //uuid 产生
                    var s = []
                    var hexDigits = "0123456789abcdef"
                    for (var i = 0; i < 36; i++) {
                        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
                    }
                    s[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
                    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
                    s[8] = s[13] = s[18] = s[23] = "-"
                    var uuid = s.join("")
                    return uuid
                },
                sound2Word: function (language = "zh-CN", process = false) {
                    var recognition = new webkitSpeechRecognition()
                    recognition.lang = language
                    // recognition.continuous = true
                    recognition.interimResults = process
                    recognition.onresult = function (event) {
                        console.log(event.results[0][0].transcript)
                    }
                    recognition.start()
                    return recognition
                },
                addStyle: function (cssText, cssType = 'text/css') {
                    var style = document.createElement('style')
                    style.type = cssType
                    style.className = "CSSAddedByKit"
                    style.innerHTML = cssText
                    document.getElementsByTagName('HEAD')[0].appendChild(style)
                },
                removeAddedStyle: function () {
                    for (let i of findClass("CSSAddedByKit")) { i.remove() }
                },
                /**
                 * @time
                 */

                getMounth: function () {
                    let date = new Date()
                    return date.getMonth() + 1
                },
                getDay: function () {
                    let date = new Date()
                    return date.getDate()
                },
                getWeek: function () {
                    let weeks = new Array("7", "1", "2", "3", "4", "5", "6")
                    let date = new Date()
                    // kit.log(weeks[date.getDay()])
                    if (date.getDay() === 0) { return 7 }
                    else { return weeks[date.getDay()] }
                },
                getHours: function () {
                    let date = new Date()
                    return date.getHours()
                },
                getMinutes: function () {
                    let date = new Date()
                    return date.getMinutes()
                },
                getSeconds: function () {
                    let date = new Date()
                    return date.getSeconds()
                },
                getTime: function () {
                    return (kit.getMounth().toString() + "月" + kit.getDay() + "日 " + "星期" + kit.getWeek() + " " + kit.getHours() + "时 " + kit.getMinutes() + "分 " + kit.getSeconds() + "秒")
                },
                import: function (url) {
                    let script = document.createElement('script')
                    script.setAttribute('type', 'text/javascript')
                    script.src = url
                    document.documentElement.appendChild(script)
                    console.log("imported @"+url);
                },
                addScript:(scripts)=>{
                    let script = document.createElement('script')
                    script.setAttribute('type', 'text/javascript')
                    script.innerHTML=scripts
                    document.documentElement.appendChild(script)
                    console.log("scripts added");
                },
                version: "v0.10.13"

            }
            c.kit = kit
            c.moveIt = kit.moveIt
            c.findId = kit.findId
            c.findClass = kit.findClass
            c.setCookie = kit.setCookie
            c.getCookie = kit.getCookie
            c.log = kit.log
            c.sleep = kit.sleep
            c.setClipBoard = kit.setClipBoard
            c.isFocus = kit.isFocus
            c.ajax = kit.ajax
            kit.log(`
     _      _      _        _
    |_|   _|_|    |_|      |_|
   |_|  |_|      _     |_|_|_|_|
  |_|_|         |_|     | _|
 |_|  |_|      |_|     |_|  |_|
|_|    |_|    |_|        |_|     ${kit.version}
       
${kit.getTime()}
`)
            kit.log(`当前页面未检测到kit,成功导入,当前版本:${kit.version}`)
        } else {
            kit.log(`本页面已导入kit,无需再次导入,当前页面kit版本为:${kit.version}`)
        }
    })
}
)();

