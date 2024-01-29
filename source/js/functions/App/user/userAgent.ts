export function getDeviceType() {
  var ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet"
  }
  if (
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Silk|Kindle|Blazer|Opera Mini/i.test(
      ua
    )
  ) {
    return "mobile"
  }
  return "PC"
}

export function getDeviceTyByProportion() {
  const cW = document.documentElement.clientWidth
  const cH = document.documentElement.clientHeight
  if (cW / cH >= 1) {
    return "PC"
  } else {
    return "mobile"
  }
}
