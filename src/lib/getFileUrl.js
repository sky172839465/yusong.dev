const getFileUrl = (relativeFile) => {
  if (import.meta.env.PROD) {
    return `https://raw.githubusercontent.com/sky172839465/yusong.tw/refs/heads/main${relativeFile}`
  }

  console.log(
    new URL(relativeFile, import.meta.url).href
  )
  return new URL(relativeFile, import.meta.url).href
}

export default getFileUrl
