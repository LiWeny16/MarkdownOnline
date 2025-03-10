const getLang = () => {
  const lang = navigator.language
  if (lang === "zh-CN") {
    return "zh"
  } else if (lang === "en-US") {
    return "en"
  } else {
    return "en"
  }
}

export default getLang
