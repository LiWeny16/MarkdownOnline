import { mdConverter } from "@Root/js"

// @notes :要在高频触发monaco editor 的时候触发消抖后的mdConverter，而且希望在低频率单个字符改变的时候直接触发没有消抖的mdConverter
/**
 * @description 我在这里设计了一个上锁机制，
 */


let lock = false
let triggerTime = 0
export function triggerConverterEvent(threshold: number = 2) {
  let timer_1
  let timer_2

  triggerTime++
  // console.log(triggerTime)
  if (!lock) {
    // console.log(lock,triggerTime,threshold);
    clearTimeout(timer_2)
    if (triggerTime >= threshold) {
      lock = true
      mdConverter()
      timer_2 = setTimeout(() => {
        lock = false
        triggerTime = 0
      }, 200)
    } else {
      mdConverter()
    }
  }
  else {
    clearTimeout(timer_1)
    timer_1 = setTimeout(function () {
      // 在这里执行你想要触发的代码
      mdConverter()
      triggerTime=0
    }, 300) // 设置延迟时间，单位为毫秒
  }
}
